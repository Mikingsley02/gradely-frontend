// ✅ admin-login.js
const API_BASE = "https://gradely-backend-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("adminLoginForm");
  const loader = document.getElementById("loadingSpinner");

  if (!loginForm) {
    console.error("⚠️ Login form not found in HTML.");
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const admin_id = document.getElementById("admin_id").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!admin_id || !password) {
      alert("Please enter both Admin ID and Password.");
      return;
    }

    loader.style.display = "block"; // show spinner

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_id, password }),
      });

      const data = await res.json();
      console.log("🧪 Login response:", data);

      if (data.success) {
        alert("✅ Login successful!");
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("adminId", admin_id);
        sessionStorage.setItem("school_id", data.admin.school_id);
        sessionStorage.setItem("gradely_token", data.token);
        window.location.href = "dashboard.html";
      } else {
        alert(`❌ ${data.message || "Login failed"}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("⚠️ Network error. Please try again later.");
    } finally {
      loader.style.display = "none"; // hide spinner
    }
  });
});
