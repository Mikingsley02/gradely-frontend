// ========== SESSION TIMEOUT WITH COUNTDOWN POPUP ==========
// Works for Admin, and Parent dashboards

(function () {
  const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  const WARNING_DURATION = 60 * 1000; // 1 minute before logout

  let timeout, warningTimer, countdownInterval;
  let countdown = 60;

  // Create popup dynamically
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

    // Warning popup timer (14 min)
    warningTimer = setTimeout(showWarning, TIMEOUT_DURATION - WARNING_DURATION);
    // Auto logout after full 15 min
    timeout = setTimeout(logoutUser, TIMEOUT_DURATION);
  }

  function showWarning() {
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
    startTimers();
  }

  function logoutUser() {
    hideWarning();
    alert("⚠️ Session expired due to inactivity. Please log in again.");
    localStorage.clear();
    sessionStorage.clear();

    if (window.location.href.includes("admin")) {
      window.location.href = "admin-login.html";
    } else if (window.location.href.includes("teacher")) {
      window.location.href = "teacher-login.html";
    } else if (window.location.href.includes("parent")) {
      window.location.href = "parents-login.html";
    } else {
      window.location.href = "index.html";
    }
  }

  stayLoggedInBtn.addEventListener("click", stayLoggedIn);
  logoutNowBtn.addEventListener("click", logoutUser);

  ["click", "mousemove", "keypress", "scroll", "touchstart"].forEach(event => {
    document.addEventListener(event, startTimers);
  });

  startTimers();
  console.log("✅ Session timeout active (15 mins, 1-minute warning).");
})();
