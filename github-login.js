/* GitHub sign-in through Supabase for Goyame.
   Only the public project URL and publishable key are here (safe in browser code).
   The GitHub Client Secret lives only in the Supabase dashboard, never in this file.

   GitHub login: once GitHub verifies the allowed account, the person goes straight to the home page
   (no password). Code, Background and Admin Password are back on the home page and in Settings, exactly
   where they were, still locked by the admin password.

   Safety: the allowed account is checked with the Supabase server (getUser), not only with data saved in
   the browser. For full protection also keep "Allow new users to sign up" switched OFF in the Supabase
   dashboard (Authentication) once your own account has signed in once. */
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

    // Wait until the login page is showing, then continue into the site.
    function enterWhenLoginShows() {
        var tries = 0;
        var timer = setInterval(function () {
            var page = document.getElementById("login");
            tries++;
            if (page && !page.classList.contains("hidden")) {
                clearInterval(timer);
                enterSite();
            } else if (tries > 100) {
                clearInterval(timer);
            }
        }, 300);
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

    // After GitHub sends the person back, OR when the page is refreshed while still signed in with GitHub:
    // check the account with the server, then continue straight into the site.
    if (returningFromGithub || hasStoredAuth()) {
        loadClient().then(function () {
            return currentVerifiedSession();
        }).then(function (s) {
            if (returningFromGithub && window.history && history.replaceState) history.replaceState(null, "", window.location.pathname);
            if (!s) return;
            enterWhenLoginShows();
        }).catch(function () {});
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

    // The Code / Background password gate is the site's own. After a GitHub sign-in the saved code has no
    // key yet, so when the right admin password is typed here the key is made too, and the code opens.
    window.codeGateSubmit = async function () {
        var i = document.getElementById("gatePass"), pw = i.value;
        if (!pw) { toast("Enter Password", "Please enter your password."); return; }
        try {
            var rec = pwLoad();
            if (!rec || (await pwHash(pw, rec.salt)) !== rec.hash) { toast("Wrong Password", "Check it and try again."); return; }
            if (!vaultKey) {
                vaultKey = await vaultDeriveKey("pwlogin|" + pw);
                sessionSave(vaultKey);
                vaultMigrate().catch(function (e) { console.error(e); });
            }
            codeGateClose();
            var go = gateAction || openCodePage;
            gateAction = null;
            go();
        } catch (e) { authFail(e); }
    };
})();
