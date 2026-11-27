/* Admin mode for Goyame. admin.html loads the site's own code and this file turns it into the admin
   area: password first, then Code, Background and Admin Password. Everything is stored in the same
   place as the main site, so the saved code and the admin password are shared. */
(function () {
    var $ = function (id) { return document.getElementById(id); };
    var unlocked = false;

    // Keep the public pages out of the way.
    ["home", "login", "success"].forEach(function (id) { if ($(id)) $(id).classList.add("hidden"); });
    window.startTyping = function () {};
    window.sessionRestore = function () { return Promise.resolve(false); };
    document.title = "Admin";

    // Settings panel shows only the admin items here.
    var st = document.createElement("style");
    st.textContent =
        '#viewMain .set-tile[data-view="social"], #viewMain .set-tile[data-view="sound"], #viewMain .set-tile[data-view="language"],' +
        '#viewMain .set-tile:not([data-view]) { display: none !important; }' +
        '#gateBox input.hidden { display: none; }';
    document.head.appendChild(st);

    // The Admin page (three locked tools).
    function tile(view, onclick, icon, label) {
        return '<div class="set-tile" data-admin="' + view + '" onclick="' + onclick + '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + icon + '</svg>' +
            '<span>' + label + '</span><span class="chev">›</span></div>';
    }
    var page = document.createElement("section");
    page.className = "page hidden";
    page.id = "adminPage";
    page.innerHTML =
        '<div class="panel">' +
        '<div class="cv-top"><span class="cv-wrap"><button class="cv-b" id="adminBack" title="Back" aria-label="Back"></button><small class="cv-cap">Back</small></span><h1>Admin</h1></div>' +
        '<div class="set-list">' +
        tile("code", "openCodePage()", '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>', "Code") +
        tile("background", "adminOpenView('background')", '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>', "Background") +
        tile("admin", "adminOpenView('admin')", '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>', "Admin Password") +
        '</div></div>';
    $("codePage").parentNode.insertBefore(page, $("codePage"));
    try { $("adminBack").innerHTML = cvIcon("back"); } catch (e) {}
    $("adminBack").onclick = function () { location.href = "index.html"; };

    window.adminOpenView = function (name) { openSettings(); showView(name); };
    window.openAdminPage = function () { switchPage("success", "adminPage"); };

    // Code page: opens from, and goes back to, the Admin page.
    window.openCodePage = function () {
        try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {}); } catch (e) {}
        switchPage("adminPage", "codePage");
        cvRender();
        cvBackupReminder();
    };
    window.closeCodePage = function () { switchPage("codePage", "adminPage"); };

    // Password gate: works the first time too (creates the admin password).
    var pass2 = document.createElement("input");
    pass2.type = "password"; pass2.id = "gatePass2"; pass2.className = "hidden";
    pass2.setAttribute("autocomplete", "off"); pass2.setAttribute("data-lpignore", "true"); pass2.setAttribute("data-1p-ignore", "");
    pass2.placeholder = "Confirm admin password";
    $("gatePass").parentNode.insertBefore(pass2, $("gatePass").nextSibling);
    pass2.addEventListener("keydown", function (e) { if (e.key === "Enter") window.codeGateSubmit(); });
    var cancel = document.querySelector("#gateBox .gate-row button");
    if (cancel) cancel.onclick = function () { location.href = "index.html"; };

    window.codeGateOpen = function (cb) {
        if (unlocked) { (typeof cb === "function" ? cb : window.openAdminPage)(); return; }
        window.__gateAction = typeof cb === "function" ? cb : window.openAdminPage;
        var first = !pwLoad();
        var note = document.querySelector("#gateBox p");
        if (note) note.textContent = tr(first ? "Create your admin password. You will use it every time." : "Enter the admin password to continue.");
        pass2.classList.toggle("hidden", !first);
        pass2.value = "";
        $("gatePass").value = "";
        $("gateBox").classList.remove("hidden");
        setTimeout(function () { $("gatePass").focus(); }, 50);
    };

    window.codeGateSubmit = async function () {
        var pw = $("gatePass").value;
        if (!pw) { showToast("Enter Password", "Please enter your password."); return; }
        if (!(window.crypto && window.crypto.subtle)) { showToast("Login Unavailable", "Open this page over https and try again."); return; }
        try {
            var rec = pwLoad();
            if (!rec) {
                if (pw !== pass2.value) { showToast("Passwords Do Not Match", "Type the same password in both boxes."); return; }
                var salt = pwNewSalt();
                if (!pwSave(salt, await pwHash(pw, salt))) { showToast("Not Saved", "This browser could not save the password."); return; }
            } else if ((await pwHash(pw, rec.salt)) !== rec.hash) {
                showToast("Wrong Password", "Check it and try again.");
                return;
            }
            // Password is right: open the saved code and files.
            vaultKey = await vaultDeriveKey("pwlogin|" + pw);
            sessionSave(vaultKey);   // so the home page opens without asking again
            vaultMigrate().catch(function (e) { console.error(e); });
            unlocked = true;
            $("gateBox").classList.add("hidden");
            $("gatePass").value = ""; pass2.value = "";
            var go = window.__gateAction || window.openAdminPage;
            window.__gateAction = null;
            go();
        } catch (e) { authFail(e); }
    };

    // Ask for the password straight away.
    window.codeGateOpen(window.openAdminPage);
})();
