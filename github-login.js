/* GitHub sign-in through Supabase for Goyame.
   Only the public project URL and publishable key are here (safe in browser code).
   The GitHub Client Secret lives only in the Supabase dashboard, never in this file.

   After GitHub verifies the allowed account, the person goes straight in (no password step).
   The password login stays exactly as it was. The first time after this update (or after the password
   is changed) the password is asked once so the two logins can share the same saved data. */
(function () {
    var SUPABASE_URL = "https://vgqeystxgtllkyqcnper.supabase.co";
    var SUPABASE_KEY = "sb_publishable_VBSHCNzOk9eBW1sSlNgHTA_1maHSou3";
    var ALLOWED_GITHUB_USER = "xifarabi";   // only this GitHub account may continue
    var ALLOWED_GITHUB_ID = "349310937";
    var LINK_KEY = "goyame_ghlink";

    var client = null;
    var ready = null;

    function loadClient() {
        if (ready) return ready;
        ready = new Promise(function (resolve, reject) {
            var s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js";
            s.onload = function () {
                try {
                    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                    resolve(client);
                } catch (e) { reject(e); }
            };
            s.onerror = function () { reject(new Error("Could not load the sign-in service.")); };
            document.head.appendChild(s);
        });
        return ready;
    }

    function isAllowed(user) {
        if (!user) return false;
        var m = user.user_metadata || {};
        var name = String(m.user_name || m.preferred_username || "").toLowerCase();
        var id = String(m.provider_id || m.sub || "");
        return name === ALLOWED_GITHUB_USER && id === ALLOWED_GITHUB_ID;
    }

    function toast(title, msg, kind) {
        try { showToast(title, msg, kind); } catch (e) { alert(title + ": " + msg); }
    }

    async function currentVerifiedSession() {
        var c = await loadClient();
        var r = await c.auth.getSession();
        var session = r && r.data && r.data.session;
        if (!session) return null;
        if (!isAllowed(session.user)) {
            await c.auth.signOut();
            toast("Access Denied", "This GitHub account is not allowed to sign in.");
            return null;
        }
        return session;
    }

    /* ---- link between the password login and the GitHub login ---- */
    function toHex(buf) {
        return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    }
    function fromHex(h) {
        return new Uint8Array(h.match(/../g).map(function (x) { return parseInt(x, 16); }));
    }
    function linkKey() { return vaultDeriveKey("ghlink|" + ALLOWED_GITHUB_ID); }

    // Called after a normal password sign-in: remember the saved-data key so GitHub login can open it.
    async function linkSave(pwKey) {
        try {
            var rec = pwLoad();
            if (!rec) return;
            var raw = await crypto.subtle.exportKey("raw", pwKey);
            var sealed = await vEnc(await linkKey(), new Uint8Array(raw));
            localStorage.setItem(LINK_KEY, JSON.stringify({ h: rec.hash, w: toHex(sealed) }));
        } catch (e) {}
    }

    // Returns the saved-data key, or null if the password has to be entered once.
    async function linkOpen() {
        try {
            var rec = pwLoad();
            if (!rec) return null;
            var o = JSON.parse(localStorage.getItem(LINK_KEY) || "null");
            if (!o || o.h !== rec.hash) return null;
            var raw = await vDec(await linkKey(), fromHex(o.w));
            var key = await crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
            if (!(await vaultCanOpen(key))) return null;
            return key;
        } catch (e) { return null; }
    }

    var origSignedIn = window.onSignedIn;
    if (typeof origSignedIn === "function") {
        window.onSignedIn = function (pwKey, viaGithub) {
            if (!viaGithub) linkSave(pwKey);
            return origSignedIn(pwKey);
        };
    }

    // GitHub account is verified: go in directly, or ask the password just once to link the two logins.
    async function proceedAfterGithub() {
        var key = await linkOpen();
        if (key && typeof origSignedIn === "function") {
            window.onSignedIn(key, true);
            return;
        }
        toast("GitHub Verified", "Enter your password once. After that, GitHub login goes straight in.", "ok");
        if (typeof authOpenAdmin === "function") authOpenAdmin();
    }

    // Replaces the "Coming Soon" stub in index.html
    window.loginGithub = async function () {
        try {
            var session = await currentVerifiedSession();
            if (session) {
                await proceedAfterGithub();
                return;
            }
            var c = await loadClient();
            var res = await c.auth.signInWithOAuth({
                provider: "github",
                options: { redirectTo: window.location.origin + window.location.pathname }
            });
            if (res && res.error) throw res.error;
        } catch (e) {
            toast("Something Went Wrong", (e && e.message) || "Please try again.");
        }
    };

    // After GitHub sends the person back: check the account, wait for the login page, then continue.
    if (/[?#&](code|access_token|error)=/.test(window.location.search + window.location.hash)) {
        loadClient().then(function () {
            return currentVerifiedSession();
        }).then(function (s) {
            if (window.history && history.replaceState) history.replaceState(null, "", window.location.pathname);
            if (!s) return;
            var tries = 0;
            var timer = setInterval(function () {
                var page = document.getElementById("login");
                tries++;
                if (page && !page.classList.contains("hidden")) {
                    clearInterval(timer);
                    proceedAfterGithub();
                } else if (tries > 50) {
                    clearInterval(timer);
                }
            }, 300);
        }).catch(function () {});
    }
})();
