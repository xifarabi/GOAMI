/* GitHub sign-in through Supabase for Goyame.
   Only the public project URL and publishable key are here (safe in browser code).
   The GitHub Client Secret lives only in the Supabase dashboard, never in this file.

   GitHub login: once GitHub verifies the allowed account, the person goes straight to the home page
   (no password). The locked admin tools live in their own file, admin.html. */
(function () {
    var SUPABASE_URL = "https://vgqeystxgtllkyqcnper.supabase.co";
    var SUPABASE_KEY = "sb_publishable_VBSHCNzOk9eBW1sSlNgHTA_1maHSou3";
    var ALLOWED_GITHUB_USER = "xifarabi";   // only this GitHub account may continue
    var ALLOWED_GITHUB_ID = "349310937";

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

    // GitHub account is verified: go straight to the home page.
    function enterSite() {
        if (typeof onSignedIn === "function") onSignedIn(null);
    }

    // Replaces the "Coming Soon" stub in index.html
    window.loginGithub = async function () {
        try {
            var session = await currentVerifiedSession();
            if (session) {
                enterSite();
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
                    enterSite();
                } else if (tries > 50) {
                    clearInterval(timer);
                }
            }, 300);
        }).catch(function () {});
    }

    // Log out also ends the GitHub session, so the next visit has to sign in again.
    var origLogout = window.logout;
    if (typeof origLogout === "function") {
        window.logout = function () {
            var done = false;
            function go() { if (done) return; done = true; origLogout(); }
            setTimeout(go, 2000);
            loadClient().then(function (c) { return c.auth.signOut(); }).then(go, go);
        };
    }

    /* ---- Admin tools live in admin.html: the home page only links to them ---- */
    if (!window.__ADMIN_PAGE) {
        // Every locked item (Code button, Background) now opens the admin file.
        window.codeGateOpen = function () { location.href = "admin.html"; };

        try {
            // The Code button becomes the Admin button.
            var btn = document.querySelector(".circle-btn.s-code");
            if (btn) {
                btn.setAttribute("aria-label", "Admin (password required)");
                var ic = btn.querySelector("svg");
                if (ic) ic.innerHTML = '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>';
                var lbl = btn.parentNode.querySelector("span:not(.admin-badge)");
                if (lbl) lbl.textContent = "Admin";
            }
            // Background and Admin Password are admin-only, so they leave Settings.
            ["background", "admin"].forEach(function (v) {
                var tile = document.querySelector('#viewMain .set-tile[data-view="' + v + '"]');
                if (tile) tile.parentNode.removeChild(tile);
            });
        } catch (e) {}
    }
})();
