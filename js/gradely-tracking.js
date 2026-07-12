function getVisitorId() {
  let id = sessionStorage.getItem("gradely_visitor_id");
  if (!id) {
    id = "v-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("gradely_visitor_id", id);
  }
  return id;
}

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
    window.gtag = function () {
      dataLayer.push(arguments);
    };

    gtag("js", new Date());

gtag("config", "G-8G4E0GYWT1");
gtag("config", "AW-18317919428");

console.log("✅ Google Analytics and Google Ads tag loaded");
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

      t.onload = function () {
        console.log("✅ Meta Pixel script actually loaded");
        fbq("init", "229177753419897");
        fbq("track", "PageView");
        console.log("✅ Meta Pixel PageView fired");
      };

      t.onerror = function () {
        console.error("❌ Meta Pixel failed to load. Check CSP, ad blocker, or browser privacy settings.");
      };

      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  }
}

function acceptCookies() {
  localStorage.setItem("gradely_cookie_consent", "accepted");

  const overlay = document.getElementById("cookieOverlay");
  if (overlay) overlay.style.display = "none";

  loadNonEssentialScripts();
}

function rejectCookies() {
  localStorage.setItem("gradely_cookie_consent", "rejected");

  const overlay = document.getElementById("cookieOverlay");
  if (overlay) overlay.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("cookieOverlay");
  const consent = localStorage.getItem("gradely_cookie_consent");

  if (!consent) {
    if (overlay) overlay.style.display = "flex";
  } else if (consent === "accepted") {
    loadNonEssentialScripts();
  } else {
    console.log("⚠️ Non-essential cookies rejected - analytics blocked");
  }
});