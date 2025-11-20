// ========== SESSION TIMEOUT WITH SMART REDIRECT ==========
(function () {
  const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  const WARNING_DURATION = 60 * 1000;      // 1 minute warning

  let timeout, warningTimer, countdownInterval;
  let countdown = 60;

  // Save current URL before timeout
  function saveCurrentPage() {
    try {
      sessionStorage.setItem('redirectAfterLogin', window.location.href);
    } catch (e) {
      console.warn("Could not save redirect URL:", e);
    }
  }

  // Create popup
  const popup = document.createElement("div");
  popup.innerHTML = `
    <div id="sessionWarning" style="
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    ">
      <div style="
        background: #fff;
        color: #333;
        padding: 25px 30px;
        border-radius: 12px;
        text-align: center;
        max-width: 350px;
        width: 90%;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        font-family: 'Segoe UI', sans-serif;
      ">
        <h3 style="margin-bottom: 10px; color:#0c2461;">Session Expiring Soon</h3>
        <p style="font-size: 0.95rem;">Your session will expire in <span id="countdownNum">60</span> seconds due to inactivity.</p>
        <div style="margin-top:15px;">
          <button id="stayLoggedIn" style="
            background:#2575fc; 
            color:white; 
            border:none; 
            padding:10px 16px; 
            border-radius:6px; 
            font-weight:600; 
            cursor:pointer;
          ">Stay Logged In</button>
          <button id="logoutNow" style="
            background:#999; 
            color:white; 
            border:none; 
            padding:10px 16px; 
            border-radius:6px; 
            margin-left:8px; 
            cursor:pointer;
          ">Logout Now</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  const sessionWarning = document.getElementById("sessionWarning");
  const countdownNum = document.getElementById("countdownNum");
  const stayLoggedInBtn = document.getElementById("stayLoggedIn");
  const logoutNowBtn = document.getElementById("logoutNow");

  function startTimers() {
    clearTimeout(timeout);
    clearTimeout(warningTimer);
    clearInterval(countdownInterval);

    warningTimer = setTimeout(showWarning, TIMEOUT_DURATION - WARNING_DURATION);
    timeout = setTimeout(logoutUser, TIMEOUT_DURATION);
  }

  function showWarning() {
    saveCurrentPage(); // ✅ Save where user is
    sessionWarning.style.display = "flex";
    countdown = 60;
    countdownNum.textContent = countdown;

    countdownInterval = setInterval(() => {
      countdown--;
      countdownNum.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
  }

  function hideWarning() {
    sessionWarning.style.display = "none";
    clearInterval(countdownInterval);
  }

  function stayLoggedIn() {
    hideWarning();
    // ✅ Ping backend to refresh session (if you have auth)
    fetch('/api/refresh-session', { method: 'POST' }).catch(() => {});
    startTimers();
  }

  function logoutUser() {
    hideWarning();
    saveCurrentPage(); // ✅ Save even on auto-logout
    localStorage.clear();
    sessionStorage.clear();
    alert("⚠️ Session expired due to inactivity. Please log in again.");

    // ✅ Redirect to correct login
    if (window.location.pathname.includes("admin")) {
      window.location.href = "admin-login.html";
    } else if (window.location.pathname.includes("student")) {
      window.location.href = "parent-login.html"; // or student.html
    } else {
      window.location.href = "index.html";
    }
  }

  stayLoggedInBtn.addEventListener("click", stayLoggedIn);
  logoutNowBtn.addEventListener("click", logoutUser);

  // ✅ Track activity
  ["click", "mousemove", "keypress", "scroll", "touchstart"].forEach(event => {
    document.addEventListener(event, startTimers, true);
  });

  // ✅ On login pages, restore redirect
  if (window.location.pathname.endsWith('admin-login.html') || 
      window.location.pathname.endsWith('parent-login.html')) {
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      const loginForm = document.querySelector('form');
      if (loginForm) {
        loginForm.addEventListener('submit', () => {
          sessionStorage.setItem('postLoginRedirect', redirectUrl);
        });
      }
    }
  }

  startTimers();
  console.log("✅ Session timeout active (15 mins)");
})();