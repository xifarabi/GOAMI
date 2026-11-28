/* GitHub sign-in through Supabase for Goyame.
   Only the public project URL and publishable key are here (safe in browser code).
   The GitHub Client Secret lives only in the Supabase dashboard, never in this file.

   GitHub login: once GitHub verifies the allowed account, the person goes straight to the home page
   (no password). Code and Background open straight away with no password. Saved code is locked with a
   built-in key, so it opens by itself. If this browser still has an old password with saved code, it is
   asked for ONE time only, to move that saved code over; after that nothing asks for a password.

   Safety: the allowed account is checked with the Supabase server (getUser), not only with data saved in
   the browser. For full protection also keep "Allow new users to sign up" switched OFF in the Supabase
   dashboard (Authentication) once your own account has signed in once. */
(function () {
    var SUPABASE_URL = "https://vgqeystxgtllkyqcnper.supabase.co";
    var SUPABASE_KEY = "sb_publishable_VBSHCNzOk9eBW1sSlNgHTA_1maHSou3";
    var ALLOWED_GITHUB_USER = "xifarabi";   // only this GitHub account may continue
    var ALLOWED_GITHUB_ID = "349310937";
    var NOPW_FLAG = "alle_vault_nopw";      // "1" once saved code uses the built-in key

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

    // Is there a saved Supabase sign-in in this browser? (cheap check, loads nothing)
    function hasStoredAuth() {
        try {
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k && k.indexOf("sb-") === 0 && k.indexOf("-auth-token") > 0) return true;
            }
        } catch (e) {}
        return false;
    }

    // Remove every saved Supabase sign-in from this browser (works even without internet).
    function clearLocalAuth() {
        try {
            var keys = [];
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k && k.indexOf("sb-") === 0) keys.push(k);
            }
            keys.forEach(function (k) { localStorage.removeItem(k); });
        } catch (e) {}
        try {
            var skeys = [];
            for (var j = 0; j < sessionStorage.length; j++) {
                var sk = sessionStorage.key(j);
                if (sk && sk.indexOf("sb-") === 0) skeys.push(sk);
            }
            skeys.forEach(function (k) { sessionStorage.removeItem(k); });
        } catch (e) {}
    }

    async function rejectSession(c, message) {
        try { await c.auth.signOut({ scope: "local" }); } catch (e) {}
        clearLocalAuth();
        if (message) toast("Access Denied", message);
        return null;
    }

    // Returns the session only if the Supabase server confirms it AND it belongs to the allowed account.
    async function currentVerifiedSession() {
        var c = await loadClient();
        var r = await c.auth.getSession();
        var session = r && r.data && r.data.session;
        if (!session) return null;
        // Ask the Supabase server (not just the browser's saved copy) who this really is.
        var u = await c.auth.getUser();
        if (u && u.error) {
            var st = u.error.status;
            if (st === 401 || st === 403 || st === 404) return rejectSession(c, null);   // session is no longer valid
            return null;                                                                  // offline / temporary problem: do not sign in
        }
        var user = u && u.data && u.data.user;
        if (!user) return rejectSession(c, null);
        if (!isAllowed(user)) return rejectSession(c, "This GitHub account is not allowed to sign in.");
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
                options: {
                    redirectTo: window.location.origin + window.location.pathname,
                    // Make GitHub show its account chooser instead of silently re-using the last account.
                    queryParams: { prompt: "select_account" }
                }
            });
            if (res && res.error) throw res.error;
        } catch (e) {
            toast("Something Went Wrong", (e && e.message) || "Please try again.");
        }
    };

    var returningFromGithub = /[?#&](code|access_token|error)=/.test(window.location.search + window.location.hash);

    // If GitHub sent back an error (for example "Signups not allowed"), say so instead of looping silently.
    function githubReturnError() {
        try {
            var q = new URLSearchParams(window.location.search + "&" + window.location.hash.replace(/^#/, ""));
            return q.get("error_description") || (q.get("error") ? "GitHub sign-in did not finish." : "");
        } catch (e) { return ""; }
    }
    var returnError = returningFromGithub ? githubReturnError() : "";

    // Opening the site (after GitHub sends the person back, or on a refresh while still signed in):
    // the site's own start-up asks "is someone already signed in?". For a verified GitHub account the answer
    // is yes, so the person goes straight to the home page, with no welcome text and no login page flash.
    var origRestore = window.sessionRestore;
    if (typeof origRestore === "function" && (returningFromGithub || hasStoredAuth())) {
        window.sessionRestore = async function () {
            try {
                if (await origRestore()) return true;
                var s = await currentVerifiedSession();
                if (returningFromGithub && window.history && history.replaceState) history.replaceState(null, "", window.location.pathname);
                if (s) {
                    if (fixedKey && flagOn()) vaultKey = fixedKey;
                    return true;
                }
                if (returnError) toast("GitHub Sign-in Failed", String(returnError).replace(/\+/g, " "));
            } catch (e) { console.error(e); }
            return false;
        };
    }

    // Log out ends the saved GitHub sign-in in this browser first (local scope needs no network),
    // so the next GitHub tap really starts a fresh sign-in.
    var origLogout = window.logout;
    if (typeof origLogout === "function") {
        window.logout = function () {
            var done = false;
            function go() { if (done) return; done = true; clearLocalAuth(); origLogout(); }
            clearLocalAuth();
            setTimeout(go, 1500);
            loadClient().then(function (c) { return c.auth.signOut({ scope: "local" }); }).then(go, go);
        };
    }

    /* ---- No password for Code and Background ---- */
    var fixedKey = null;
    var fixedKeyP = null;
    try {
        fixedKeyP = vaultDeriveKey("nopassword|alle|v1").then(function (k) { fixedKey = k; return k; });
    } catch (e) {}

    function flagOn() {
        try { return localStorage.getItem(NOPW_FLAG) === "1"; } catch (e) { return false; }
    }
    function flagSet() {
        try { localStorage.setItem(NOPW_FLAG, "1"); } catch (e) {}
    }

    // true = saved code now opens with the built-in key; false = the old password is needed one time
    async function useBuiltInKey() {
        if (!fixedKeyP) return true;
        var fixed = await fixedKeyP;
        if (flagOn()) { vaultKey = fixed; return true; }
        if (!pwLoad()) { flagSet(); vaultKey = fixed; return true; }   // no old password in this browser
        return false;
    }

    // After any sign-in, saved code uses the built-in key once this browser has been moved over.
    var origSignedIn = window.onSignedIn;
    if (typeof origSignedIn === "function") {
        window.onSignedIn = function (k) { return origSignedIn((fixedKey && flagOn()) ? fixedKey : k); };
    }

    window.codeGateOpen = async function (cb) {
        var go = typeof cb === "function" ? cb : openCodePage;
        try {
            if (await useBuiltInKey()) { go(); return; }
        } catch (e) { console.error(e); }
        // One time only: the old password moves the saved code to the built-in key.
        gateAction = go;
        var b = document.getElementById("gateBox"), i = document.getElementById("gatePass");
        var note = document.querySelector("#gateBox p");
        if (note) note.textContent = "One time only: enter your old password to move your saved code. After this, nothing will ask for a password.";
        i.value = ""; b.classList.remove("hidden");
        setTimeout(function () { i.focus(); }, 50);
    };

    window.codeGateSubmit = async function () {
        var i = document.getElementById("gatePass"), pw = i.value;
        if (!pw) { toast("Enter Password", "Please enter your password."); return; }
        try {
            var rec = pwLoad();
            if (!rec || (await pwHash(pw, rec.salt)) !== rec.hash) { toast("Wrong Password", "Check it and try again."); return; }
            var oldKey = await vaultDeriveKey("pwlogin|" + pw);
            var newKey = await fixedKeyP;
            // open everything with the old key and lock it with the built-in key, all or nothing
            var out = { codes: [], files: [] };
            var any = false;
            var stores = ["codes", "files"];
            for (var s = 0; s < stores.length; s++) {
                var st = stores[s];
                var rows = await cvRawDb(st, "readonly", function (x) { return x.getAll(); });
                for (var r = 0; r < rows.length; r++) {
                    var item;
                    try { item = await vOpenRec(st, rows[r], oldKey, true); } catch (e) { continue; }   // could not open: leave it as it is
                    out[st].push(await vSeal(st, item, newKey));
                    any = true;
                }
            }
            if (any) await cvRawBatch(out);
            flagSet();
            vaultKey = newKey;
            sessionSave(newKey);
            codeGateClose();
            var go = gateAction || openCodePage;
            gateAction = null;
            go();
        } catch (e) {
            console.error(e);
            toast("Not Done", "Your saved code could not be moved. Nothing was changed.");
        }
    };

    // The Admin Password setting is not needed any more.
    try {
        var tile = document.querySelector('#viewMain .set-tile[data-view="admin"]');
        if (tile) tile.parentNode.removeChild(tile);
    } catch (e) {}
})();
