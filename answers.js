/* =====================================================================
   answers.js  –  the chatbot's brain (questions and answers only)

   HOW TO EDIT
   - Every item in "qa" is one topic.
   - keys : words/phrases that, when found in the visitor's message, pick this
            answer. Add English, Bengali and "Banglish" spellings.
            Longer, more specific keys win over short ones.
   - q    : the question as it appears on the suggestion buttons.
   - a    : the answer. Use \n for a new line. {site} becomes the website name.
   - Add { en: "...", bn: "..." }. Other languages fall back to English.
   ===================================================================== */

window.AI_DATA = {

    greeting: {
        en: "Ask me anything about {site}: logging in, contact, settings and more.",
        bn: "{site} নিয়ে যেকোনো প্রশ্ন করুন: লগইন, যোগাযোগ, সেটিংস আরও অনেক কিছু।"
    },

    fallback: {
        en: "Sorry, I only know about {site}. Try one of these:",
        bn: "দুঃখিত, আমি শুধু {site} সম্পর্কে জানি। এগুলো থেকে একটা বেছে নিন:"
    },

    /* the line that types itself, erases, then types the next one */
    helpLine: {
        en: "Help me",
        bn: "আমাকে হেল্প করুন"
    },

    /* the question suggestions that keep rotating (indexes into qa) */
    suggest: [0, 1, 4, 5, 6, 8, 9, 10, 19, 20, 21, 22, 23, 26],

    qa: [
        /* 0 */
        {
            keys: ["how to login", "how to log in", "login", "log in", "sign in", "signin", "enter the site", "লগ ইন", "লগইন", "সাইন ইন", "ঢুকবো", "ঢুকব", "প্রবেশ", "login korbo", "login kivabe", "login kibhabe"],
            q: { en: "How do I log in?", bn: "লগইন কীভাবে করবো?" },
            a: {
                en: "1. Open the site and wait for the welcome text.\n2. On the login page tap the Admin Password button.\n3. Type your password and press Sign in.\nGitHub login is coming soon.",
                bn: "১. সাইট খুলুন, ওয়েলকাম লেখা শেষ হওয়ার অপেক্ষা করুন।\n২. লগইন পেজে Admin Password বাটনে চাপ দিন।\n৩. পাসওয়ার্ড লিখে Sign in চাপ দিন।\nGitHub লগইন শিগগির আসছে।"
            }
        },
        /* 1 */
        {
            keys: ["first time", "create password", "new password", "set password", "setup password", "make password", "create admin", "প্রথমবার", "পাসওয়ার্ড তৈরি", "পাসওয়ার্ড বানাবো", "পাসওয়ার্ড দিবো", "নতুন পাসওয়ার্ড", "password banabo", "password create"],
            q: { en: "How do I create my password?", bn: "পাসওয়ার্ড কীভাবে তৈরি করবো?" },
            a: {
                en: "The first time you press Admin Password, the site asks you to create one. Type it in both boxes (use the eye icon to check it) and press Create password. From then on, use that same password to sign in.",
                bn: "প্রথমবার Admin Password চাপলে সাইট নিজেই পাসওয়ার্ড তৈরি করতে বলবে। দুটো বক্সে একই পাসওয়ার্ড লিখুন (চোখের আইকনে চাপলে দেখা যায়), তারপর Create password চাপুন। এরপর থেকে ওই পাসওয়ার্ড দিয়েই লগইন করবেন।"
            }
        },
        /* 2 */
        {
            keys: ["forgot", "forget", "lost password", "reset password", "recover", "ভুলে গেছি", "ভুলে গেলাম", "ভুলে গিয়েছি", "পাসওয়ার্ড মনে নেই", "রিসেট", "password bhule", "password vule"],
            q: { en: "I forgot my password", bn: "পাসওয়ার্ড ভুলে গেছি" },
            a: {
                en: "Your password is saved only inside this browser and cannot be recovered or reset from the site. If you remember it later, just sign in. Otherwise please contact the owner using the contact buttons.",
                bn: "আপনার পাসওয়ার্ড শুধু এই ব্রাউজারেই সেভ থাকে, সাইট থেকে ফেরত আনা বা রিসেট করা যায় না। পরে মনে পড়লে সরাসরি লগইন করুন। না হলে যোগাযোগ বাটন দিয়ে মালিকের সাথে কথা বলুন।"
            }
        },
        /* 3 */
        {
            keys: ["change password", "change admin", "update password", "old password", "পাসওয়ার্ড পরিবর্তন", "পাসওয়ার্ড বদল", "পাসওয়ার্ড চেঞ্জ", "পাসওয়ার্ড পাল্টা", "password change", "password bodlabo", "password badlabo"],
            q: { en: "How do I change my password?", bn: "পাসওয়ার্ড কীভাবে বদলাবো?" },
            a: {
                en: "Tap the gear icon, open Admin Password, then type your old password and the new one twice. Press save and the new password works from the next sign in.",
                bn: "গিয়ার আইকনে চাপুন, Admin Password খুলুন, তারপর পুরনো পাসওয়ার্ড আর নতুন পাসওয়ার্ড দুইবার লিখুন। সেভ করলে পরের লগইন থেকে নতুনটা চলবে।"
            }
        },
        /* 4 */
        {
            keys: ["contact", "reach you", "talk to", "message", "whatsapp", "facebook", "phone", "call", "যোগাযোগ", "কথা বলবো", "কল", "ফোন", "ফেসবুক", "হোয়াটসঅ্যাপ", "যোগাযোগ করবো", "jogajog", "contact korbo"],
            q: { en: "How can I contact you?", bn: "যোগাযোগ কীভাবে করবো?" },
            a: {
                en: "After you sign in, the contact page shows Facebook, WhatsApp and Phone buttons. Tap the one you like and it opens straight away.",
                bn: "লগইন করার পর কন্টাক্ট পেজে Facebook, WhatsApp আর Phone বাটন দেখতে পাবেন। যেটা পছন্দ সেটায় চাপলেই সরাসরি খুলে যাবে।"
            }
        },
        /* 5 */
        {
            keys: ["settings", "setting", "gear", "where is settings", "open settings", "সেটিংস", "সেটিং", "গিয়ার", "সেটিংস কোথায়", "setting kothay", "settings kothay"],
            q: { en: "Where are the settings?", bn: "সেটিংস কোথায়?" },
            a: {
                en: "After you sign in, a gear icon appears in the top corner. Tap it to open Social Links, Sound, Language, Admin Password and Log out.",
                bn: "লগইন করার পর উপরের কোণায় একটা গিয়ার আইকন আসে। চাপলে Social Links, Sound, Language, Admin Password আর Log out পাবেন।"
            }
        },
        /* 6 */
        {
            keys: ["add social", "social link", "social media", "messenger", "add button", "add link", "instagram", "telegram", "সোশ্যাল", "সোশ্যাল লিংক", "বাটন যোগ", "লিংক যোগ", "মেসেঞ্জার", "ইনস্টাগ্রাম", "টেলিগ্রাম", "social add"],
            q: { en: "How do I add a social link?", bn: "সোশ্যাল লিংক কীভাবে যোগ করবো?" },
            a: {
                en: "Open Settings > Social Links, choose the platform (like Messenger), type the username or link and press Add. A new round button then appears on the contact page next to Facebook and WhatsApp.",
                bn: "Settings > Social Links খুলুন, প্ল্যাটফর্ম বেছে নিন (যেমন Messenger), ইউজারনেম বা লিংক লিখে Add চাপুন। এরপর কন্টাক্ট পেজে Facebook আর WhatsApp এর পাশে নতুন গোল বাটন চলে আসবে।"
            }
        },
        /* 7 */
        {
            keys: ["remove social", "delete social", "remove button", "delete button", "social remove", "বাটন মুছ", "লিংক মুছ", "সোশ্যাল মুছ", "বাটন সরা", "ডিলিট বাটন"],
            q: { en: "How do I remove a social button?", bn: "সোশ্যাল বাটন কীভাবে মুছবো?" },
            a: {
                en: "Go to Settings > Social Links. Your added buttons are listed there; remove the one you do not want and it disappears from the contact page.",
                bn: "Settings > Social Links এ যান। আপনার যোগ করা বাটনগুলো সেখানে লিস্ট করা আছে; যেটা চান না সেটা সরালে কন্টাক্ট পেজ থেকেও চলে যাবে।"
            }
        },
        /* 8 */
        {
            keys: ["code", "vault", "save code", "upload file", "my files", "saved file", "কোড", "ফাইল", "কোড সেভ", "ফাইল আপলোড", "ভল্ট", "code save", "code rakhbo", "file upload"],
            q: { en: "What is the Code page?", bn: "কোড পেজ কী?" },
            a: {
                en: "Code is a private place for the admin. Tap the Code button (it has a small lock) and enter the admin password. There you can paste code, upload files, search them, copy them and open any code in a viewer with lock, zoom and typing sound.",
                bn: "কোড হলো অ্যাডমিনের জন্য একটা প্রাইভেট জায়গা। ছোট তালা থাকা Code বাটনে চাপুন, অ্যাডমিন পাসওয়ার্ড দিন। সেখানে কোড পেস্ট করা, ফাইল আপলোড, সার্চ, কপি করা যায়, আর যেকোনো কোড লক, জুম ও টাইপিং সাউন্ড সহ ভিউয়ারে খোলা যায়।"
            }
        },
        /* 9 */
        {
            keys: ["backup", "restore", "download backup", "lost files", "data safe", "ব্যাকআপ", "রিস্টোর", "ডাটা হারিয়ে", "ডেটা হারিয়ে", "ফাইল হারিয়ে", "backup nibo", "backup kibhabe"],
            q: { en: "How do I back up my code and files?", bn: "কোড আর ফাইলের ব্যাকআপ কীভাবে নেবো?" },
            a: {
                en: "Your code and files live only in this browser. On the Code page use the backup button to download a backup file, and the restore button to bring everything back. The backup is not encrypted, so keep it private. The site reminds you about once a week.",
                bn: "আপনার কোড আর ফাইল শুধু এই ব্রাউজারেই থাকে। Code পেজে ব্যাকআপ বাটন দিয়ে ব্যাকআপ ফাইল নামান, আর রিস্টোর বাটন দিয়ে সব ফিরিয়ে আনুন। ব্যাকআপ এনক্রিপ্টেড নয়, তাই গোপন রাখুন। সাইট প্রায় সপ্তাহে একবার মনে করিয়ে দেয়।"
            }
        },
        /* 10 */
        {
            keys: ["language", "change language", "bangla", "bengali", "hindi", "spanish", "french", "translate", "ভাষা", "ল্যাঙ্গুয়েজ", "বাংলা", "ভাষা বদল", "ভাষা পরিবর্তন", "vasa", "bhasha"],
            q: { en: "How do I change the language?", bn: "ভাষা কীভাবে বদলাবো?" },
            a: {
                en: "Tap the language button at the top (or open Settings > Language) and pick English, বাংলা, हिन्दी, Español or Français. The whole site switches at once.",
                bn: "উপরের ভাষা বাটনে চাপুন (অথবা Settings > Language), তারপর English, বাংলা, हिन्दी, Español বা Français বেছে নিন। পুরো সাইট সাথে সাথে বদলে যাবে।"
            }
        },
        /* 11 */
        {
            keys: ["sound", "volume", "click sound", "mute", "typing sound", "সাউন্ড", "শব্দ", "আওয়াজ", "ভলিউম", "মিউট", "sound off", "sound bondho"],
            q: { en: "How do I change the sound?", bn: "সাউন্ড কীভাবে বদলাবো?" },
            a: {
                en: "Open Settings > Sound and choose the tap sound you like. Inside the code viewer there is also a separate typing sound button.",
                bn: "Settings > Sound খুলে পছন্দের ট্যাপ সাউন্ড বেছে নিন। কোড ভিউয়ারের ভেতরে আলাদা টাইপিং সাউন্ড বাটনও আছে।"
            }
        },
        /* 12 */
        {
            keys: ["logout", "log out", "sign out", "signout", "exit account", "লগ আউট", "লগআউট", "সাইন আউট", "বের হবো", "বের হব", "logout korbo"],
            q: { en: "How do I log out?", bn: "লগআউট কীভাবে করবো?" },
            a: {
                en: "Tap the gear icon and choose Log out at the bottom of the list.",
                bn: "গিয়ার আইকনে চাপুন, লিস্টের একদম নিচে Log out আছে, ওটায় চাপুন।"
            }
        },
        /* 13 */
        {
            keys: ["github", "git hub", "gh login", "গিটহাব", "গিটহাব লগইন"],
            q: { en: "Does GitHub login work?", bn: "GitHub লগইন কি কাজ করে?" },
            a: {
                en: "Not yet. The GitHub button is there, but the service is still under development and shows a coming soon message. For now use Admin Password.",
                bn: "এখনো না। GitHub বাটন আছে, কিন্তু সার্ভিসটা এখনো তৈরির কাজ চলছে, তাই কামিং সুন বার্তা দেখায়। আপাতত Admin Password ব্যবহার করুন।"
            }
        },
        /* 14 */
        {
            keys: ["background", "wallpaper", "change background", "video background", "ব্যাকগ্রাউন্ড", "ওয়ালপেপার", "পেছনের ছবি", "পিছনের ছবি", "background change"],
            q: { en: "Can I change the background?", bn: "ব্যাকগ্রাউন্ড কি বদলানো যায়?" },
            a: {
                en: "Yes, for the admin. Open Settings > Background, enter the admin password, then pick a photo or a video (under 200 MB). Videos play without sound. You can remove it to go back to the normal black theme.",
                bn: "হ্যাঁ, অ্যাডমিনের জন্য। Settings > Background খুলুন, অ্যাডমিন পাসওয়ার্ড দিন, তারপর একটা ছবি বা ভিডিও বেছে নিন (২০০ MB এর কম)। ভিডিও শব্দ ছাড়া চলে। সরিয়ে দিলে আগের কালো থিমে ফিরে যাবে।"
            }
        },
        /* 15 */
        {
            keys: ["what is", "about", "who are you", "what can you do", "this site", "this website", "ওয়েবসাইট কী", "এটা কী", "সাইট কী", "তুমি কে", "আপনি কে", "কী করতে পারো", "কি করতে পারো", "সম্পর্কে", "website ki", "tumi ke"],
            q: { en: "What is this website?", bn: "এই ওয়েবসাইট কী?" },
            a: {
                en: "{site} is an official website for contact and private tools. After signing in you can reach the owner on Facebook, WhatsApp or phone, and the admin can keep code and files safe on the Code page. I'm {ai}, and I can guide you through any of it.",
                bn: "{site} একটা অফিসিয়াল ওয়েবসাইট, যেখানে যোগাযোগ আর প্রাইভেট টুল আছে। লগইনের পর Facebook, WhatsApp বা ফোনে মালিকের সাথে কথা বলা যায়, আর অ্যাডমিন Code পেজে কোড ও ফাইল নিরাপদে রাখতে পারে। আমি {ai}, এসব নিয়ে আপনাকে গাইড করতে পারি।"
            }
        },
        /* 16 */
        {
            keys: ["not working", "problem", "error", "bug", "wrong password", "can't login", "cannot login", "সমস্যা", "কাজ করছে না", "কাজ করে না", "এরর", "ভুল পাসওয়ার্ড", "লগইন হচ্ছে না", "হচ্ছে না", "kaj korche na", "hocche na"],
            q: { en: "Something is not working", bn: "কিছু কাজ করছে না" },
            a: {
                en: "Try these: 1) Check the password and the eye icon to see what you typed. 2) Open the site over https (the GitHub link). 3) Refresh the page. 4) Do not use private/incognito mode, because data is saved in the browser. Still stuck? Contact the owner from the contact page.",
                bn: "এগুলো চেষ্টা করুন: ১) চোখের আইকনে চেপে দেখুন পাসওয়ার্ড ঠিক লিখেছেন কিনা। ২) সাইটটা https লিংকে খুলুন। ৩) পেজ রিফ্রেশ করুন। ৪) প্রাইভেট/ইনকগনিটো মোডে খুলবেন না, কারণ ডাটা ব্রাউজারে সেভ হয়। তবুও না হলে কন্টাক্ট পেজ থেকে মালিকের সাথে কথা বলুন।"
            }
        },
        /* 17 */
        {
            keys: ["hello", "hi", "hey", "good morning", "good evening", "salam", "assalamu", "হ্যালো", "হাই", "হেই", "সালাম", "আসসালামু", "নমস্কার", "কেমন আছ", "kemon achen", "kemon acho"],
            q: { en: "Hello", bn: "হ্যালো" },
            hidden: true,
            a: {
                en: "Hello! How can I help you today?",
                bn: "হ্যালো! আজ আপনাকে কীভাবে সাহায্য করতে পারি?"
            }
        },
        /* 18 */
        {
            keys: ["thanks", "thank you", "thx", "ধন্যবাদ", "থ্যাংকস", "থ্যাঙ্ক", "শুকরিয়া", "dhonnobad"],
            q: { en: "Thanks", bn: "ধন্যবাদ" },
            hidden: true,
            a: {
                en: "You're welcome! Ask me anything else about {site} any time.",
                bn: "আপনাকেও ধন্যবাদ! {site} নিয়ে আর কিছু জানতে চাইলে যেকোনো সময় জিজ্ঞেস করুন।"
            }
        }

        ,
        /* 19 */
        {
            keys: ["eye icon", "show password", "hide password", "see password", "eye button", "চোখের আইকন", "পাসওয়ার্ড দেখ", "পাসওয়ার্ড লুকা", "চোখ", "পাসওয়ার্ড দেখা"],
            q: { en: "What is the eye icon in the password box?", bn: "পাসওয়ার্ড বক্সের চোখের আইকন কী?" },
            a: {
                en: "The eye icon shows or hides what you typed. Tap it once to see your password, tap again to hide it. Use it to be sure you typed it right.",
                bn: "চোখের আইকন দিয়ে আপনি যা লিখেছেন তা দেখা বা লুকানো যায়। একবার চাপলে পাসওয়ার্ড দেখা যাবে, আবার চাপলে লুকিয়ে যাবে। ঠিক লিখেছেন কিনা নিশ্চিত হতে এটা ব্যবহার করুন।"
            }
        },
        /* 20 */
        {
            keys: ["safe", "secure", "security", "privacy", "private", "where is my data", "where saved", "stored", "server", "নিরাপদ", "সিকিউরিটি", "সুরক্ষিত", "প্রাইভেসি", "ডাটা কোথায়", "ডেটা কোথায়", "কোথায় সেভ", "সার্ভারে", "নিরাপত্তা"],
            q: { en: "Is my data safe? Where is it saved?", bn: "আমার ডাটা কি নিরাপদ? কোথায় সেভ থাকে?" },
            a: {
                en: "Your password, code and files are saved only inside your own browser. They are not sent to any server. The password is stored in a scrambled form, never as plain text. Because of this, a backup is important.",
                bn: "আপনার পাসওয়ার্ড, কোড আর ফাইল শুধু আপনার নিজের ব্রাউজারেই সেভ থাকে, কোনো সার্ভারে পাঠানো হয় না। পাসওয়ার্ড এলোমেলো (হ্যাশ) করা অবস্থায় থাকে, সরাসরি লেখা অবস্থায় নয়। তাই ব্যাকআপ রাখা খুব জরুরি।"
            }
        },
        /* 21 */
        {
            keys: ["another device", "other device", "new phone", "new computer", "different browser", "sync", "move data", "অন্য ডিভাইস", "অন্য ফোন", "নতুন ফোন", "অন্য ব্রাউজার", "অন্য কম্পিউটার", "সিঙ্ক", "ডাটা নিয়ে যাবো", "অন্য মোবাইল"],
            q: { en: "Can I use it on another phone or browser?", bn: "অন্য ফোন বা ব্রাউজারে কি ব্যবহার করা যায়?" },
            a: {
                en: "Yes, the site opens anywhere, but your data does not sync automatically because it is saved per browser. On the old device make a backup on the Code page, then on the new one press restore. You will also need to create the password again there.",
                bn: "হ্যাঁ, সাইট যেকোনো জায়গায় খোলা যায়, কিন্তু ডাটা নিজে নিজে সিঙ্ক হয় না, কারণ সেটা প্রতিটি ব্রাউজারে আলাদা সেভ থাকে। পুরনো ডিভাইসে Code পেজে ব্যাকআপ নিন, নতুনটায় রিস্টোর চাপুন। ওখানে পাসওয়ার্ডও নতুন করে তৈরি করতে হবে।"
            }
        },
        /* 22 */
        {
            keys: ["viewer", "lock", "unlock", "zoom", "typing speed", "faster", "slower", "open code", "view code", "edit code", "লক", "আনলক", "জুম", "ভিউয়ার", "স্পিড", "কোড খুল", "কোড এডিট", "কোড দেখ", "টাইপিং স্পিড"],
            q: { en: "How does the code viewer work?", bn: "কোড ভিউয়ার কীভাবে কাজ করে?" },
            a: {
                en: "Tap any saved code to open it. It starts locked so a touch cannot change it; press the lock to edit and Save to keep changes. Zoom shows a draggable magnifier over the text, the sound button turns typing sound on or off, and the faster/slower buttons change the typing speed.",
                bn: "যেকোনো সেভ করা কোডে চাপলে খুলবে। শুরুতে লক করা থাকে যাতে ভুলে ছুঁয়ে বদলে না যায়; এডিট করতে লকে চাপুন, আর পরিবর্তন রাখতে Save চাপুন। Zoom লেখার ওপর টেনে সরানো যায় এমন ম্যাগনিফায়ার দেখায়, সাউন্ড বাটনে টাইপিং সাউন্ড অন বা অফ হয়, আর faster/slower বাটনে টাইপিং স্পিড বদলায়।"
            }
        },
        /* 23 */
        {
            keys: ["search code", "search file", "copy code", "delete code", "delete file", "remove code", "title", "কোড সার্চ", "ফাইল সার্চ", "কোড কপি", "কোড মুছ", "ফাইল মুছ", "কোড ডিলিট", "ফাইল ডিলিট", "কপি করবো", "সার্চ"],
            q: { en: "How do I search, copy or delete saved code?", bn: "সেভ করা কোড কীভাবে সার্চ, কপি বা ডিলিট করবো?" },
            a: {
                en: "On the Code page type in the search box to find any saved code or file by name. Each item has buttons to copy it and delete it. To save new code, give it a title, paste it in the big box and press Save.",
                bn: "Code পেজের সার্চ বক্সে লিখলে নাম ধরে যেকোনো সেভ করা কোড বা ফাইল খুঁজে পাবেন। প্রতিটি আইটেমে কপি আর ডিলিট বাটন আছে। নতুন কোড সেভ করতে একটা টাইটেল দিন, বড় বক্সে পেস্ট করুন আর Save চাপুন।"
            }
        },
        /* 24 */
        {
            keys: ["file size", "too large", "size limit", "max size", "how big", "limit", "সাইজ", "বড় ফাইল", "কত বড়", "সীমা", "লিমিট", "কত এমবি", "কত MB"],
            q: { en: "How big can an uploaded file be?", bn: "আপলোড করা ফাইল কত বড় হতে পারে?" },
            a: {
                en: "Files on the Code page can be up to 100 MB each. A background photo or video can be up to 200 MB. If a file is too big, the site tells you.",
                bn: "Code পেজে প্রতিটি ফাইল ১০০ MB পর্যন্ত হতে পারে। ব্যাকগ্রাউন্ডের ছবি বা ভিডিও ২০০ MB পর্যন্ত। ফাইল বেশি বড় হলে সাইট নিজেই জানিয়ে দেবে।"
            }
        },
        /* 25 */
        {
            keys: ["not saved", "can't save", "cannot save", "save failed", "private mode", "incognito", "private window", "disappeared", "gone", "সেভ হচ্ছে না", "সেভ হয় না", "ইনকগনিটো", "প্রাইভেট মোড", "হারিয়ে গেছে", "নেই কেন", "মুছে গেছে"],
            q: { en: "Why is my data not saving or missing?", bn: "আমার ডাটা সেভ হচ্ছে না বা হারিয়ে গেছে কেন?" },
            a: {
                en: "Data is saved in the browser, so it can be lost if you use private/incognito mode, clear the browser data, or open the site in a different browser. Use a normal window, do not clear site data, and keep a backup from the Code page.",
                bn: "ডাটা ব্রাউজারে সেভ থাকে, তাই প্রাইভেট/ইনকগনিটো মোড ব্যবহার করলে, ব্রাউজারের ডাটা মুছলে বা অন্য ব্রাউজারে খুললে হারিয়ে যেতে পারে। সাধারণ উইন্ডো ব্যবহার করুন, সাইট ডাটা মুছবেন না, আর Code পেজ থেকে ব্যাকআপ রাখুন।"
            }
        },
        /* 26 */
        {
            keys: ["bangla", "bengali", "which language", "speak", "can you talk", "বাংলায়", "বাংলা পারো", "বাংলা বলো", "বাংলা বলতে", "কোন ভাষা", "ইংরেজি", "english", "বাংলা পারেন", "বাংলায় কথা"],
            q: { en: "Can you talk in Bengali?", bn: "তুমি কি বাংলায় কথা বলতে পারো?" },
            a: {
                en: "Yes! I understand and answer in both English and Bengali (বাংলা). Just write in the language you like and I will reply in it.",
                bn: "হ্যাঁ! আমি ইংরেজি আর বাংলা দুটো ভাষাই বুঝি এবং উত্তর দিতে পারি। আপনি যে ভাষায় লিখবেন, আমি সেই ভাষাতেই উত্তর দেব।"
            }
        },
        /* 27 */
        {
            keys: ["delete chat", "clear chat", "new chat", "start over", "clean chat", "চ্যাট ডিলিট", "চ্যাট মুছ", "নতুন চ্যাট", "চ্যাট পরিষ্কার", "চ্যাট ক্লিয়ার", "নতুন করে শুরু"],
            q: { en: "How do I start a new chat?", bn: "নতুন চ্যাট কীভাবে শুরু করবো?" },
            a: {
                en: "Tap the trash icon at the top right of this page. All messages are deleted and a fresh chat starts.",
                bn: "এই পেজের উপরে ডানদিকের ট্র্যাশ আইকনে চাপুন। সব মেসেজ মুছে যাবে আর নতুন চ্যাট শুরু হবে।"
            }
        },
        /* 28 */
        {
            keys: ["call button", "dial", "phone button", "make a call", "call you", "ফোন বাটন", "ফোন করবো", "কল করবো", "কল দিবো", "ডায়াল"],
            q: { en: "How do I call the owner?", bn: "মালিককে কীভাবে কল করবো?" },
            a: {
                en: "On the contact page tap the Phone button. On a phone it opens the dialer with the number ready, so you only need to press call. For chatting, WhatsApp is also there.",
                bn: "কন্টাক্ট পেজে Phone বাটনে চাপুন। মোবাইলে নম্বরসহ ডায়ালার খুলে যাবে, শুধু কল চাপলেই হবে। চ্যাট করতে চাইলে WhatsApp বাটনও আছে।"
            }
        },
        /* 29 */
        {
            keys: ["welcome", "welcome page", "first page", "typing text", "opening", "ওয়েলকাম", "স্বাগতম", "প্রথম পেজ", "শুরুতে লেখা", "অটো লেখা"],
            q: { en: "What is the welcome text at the start?", bn: "শুরুর ওয়েলকাম লেখাটা কী?" },
            a: {
                en: "When you open the site, \"Welcome to {site}\" types itself out and then the site moves to the login page by itself. You do not need to press anything.",
                bn: "সাইট খুললে \"Welcome to {site}\" নিজে নিজে লেখা হয়, তারপর সাইট নিজেই লগইন পেজে চলে যায়। আপনাকে কিছু চাপতে হয় না।"
            }
        },
        /* 30 */
        {
            keys: ["admin", "admin icon", "small lock", "lock icon", "who is admin", "অ্যাডমিন", "এডমিন", "অ্যাডমিন কী", "তালা", "ছোট তালা", "অ্যাডমিন আইকন"],
            q: { en: "What does the admin icon with a lock mean?", bn: "তালা সহ অ্যাডমিন আইকনের মানে কী?" },
            a: {
                en: "A small lock on a button means it is for the admin only. You must enter the admin password to open it, like the Code page and the Background setting.",
                bn: "বাটনে ছোট তালা মানে এটা শুধু অ্যাডমিনের জন্য। খুলতে অ্যাডমিন পাসওয়ার্ড দিতে হয়, যেমন Code পেজ আর Background সেটিং।"
            }
        },
        /* 31 */
        {
            keys: ["wrong password", "incorrect password", "password not working", "password wrong", "invalid password", "ভুল পাসওয়ার্ড", "পাসওয়ার্ড কাজ করছে না", "পাসওয়ার্ড মিলছে না", "পাসওয়ার্ড ভুল"],
            q: { en: "It says wrong password", bn: "ভুল পাসওয়ার্ড দেখাচ্ছে" },
            a: {
                en: "Check the eye icon to see what you typed, watch for capital letters and extra spaces, and make sure you are in the same browser where you created the password. If you still cannot get in, contact the owner.",
                bn: "চোখের আইকনে চেপে দেখুন কী লিখেছেন, বড় হাতের অক্ষর আর বাড়তি স্পেস খেয়াল করুন, আর যে ব্রাউজারে পাসওয়ার্ড তৈরি করেছিলেন সেখানেই আছেন কিনা দেখুন। তবুও না হলে মালিকের সাথে যোগাযোগ করুন।"
            }
        }
    ]
};
