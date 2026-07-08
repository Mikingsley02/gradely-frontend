const savedConsent = localStorage.getItem("gradely_cookie_consent");

function loadNonEssentialScripts() {
  if (localStorage.getItem("gradely_cookie_consent") !== "accepted") {
    console.log("⚠️ Non-essential cookies rejected - analytics blocked");
    return;
  }

  if (!window.gradelyGALoaded) {
    window.gradelyGALoaded = true;

    const gaScript = document.createElement("script");
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-8G4E0GYWT1";
    gaScript.async = true;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };

    gtag("js", new Date());
    gtag("config", "G-8G4E0GYWT1", {
      user_type: sessionStorage.getItem("adminId")
        ? "admin"
        : sessionStorage.getItem("school_id")
          ? "school"
          : "visitor"
    });

    console.log("✅ Google Analytics loaded (G-8G4E0GYWT1)");
  }

  if (!window.gradelyMetaPixelLoaded) {
    window.gradelyMetaPixelLoaded = true;

    !function(f,b,e,v,n,t,s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    fbq("init", "229177753419897");
    fbq("track", "PageView");

    console.log("✅ Meta Pixel loaded");
  }
}

loadNonEssentialScripts();