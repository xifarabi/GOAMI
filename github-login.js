/* GitHub sign-in through Supabase for Goyame.
   Only the public project URL and publishable key are here (safe in browser code).
   The GitHub Client Secret lives only in the Supabase dashboard, never in this file. */
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

    // Replaces the "Coming Soon" stub in index.html
    window.loginGithub = async function () {
        try {
            var session = await currentVerifiedSession();
            if (session) {
                toast("GitHub Verified", "Now enter your password to continue.", "ok");
                if (typeof authOpenAdmin === "function") authOpenAdmin();
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

    // After GitHub sends the person back, check the account right away.
    if (/[?#&](code|access_token|error)=/.test(window.location.search + window.location.hash)) {
        loadClient().then(function () {
            return currentVerifiedSession();
        }).then(function (s) {
            if (s) toast("GitHub Verified", "Open Login and tap Continue with GitHub to go on.", "ok");
            if (window.history && history.replaceState) history.replaceState(null, "", window.location.pathname);
        }).catch(function () {});
    }
})();
