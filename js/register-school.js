// ✅ js/register-school.js — Stable Version
const API_BASE = "https://gradely-backend-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("schoolForm");
  const skipBtn = document.getElementById("skipPaymentBtn");
  const submitBtn = document.getElementById("submitBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleRegistration(false);
  });

  if (skipBtn) {
    skipBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleRegistration(true);
    });
  }

  async function handleRegistration(skipPayment = false) {
    const schoolName = document.getElementById("schoolName").value.trim();
    const adminNumber = document.getElementById("adminNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const plan = document.getElementById("plan").value;

    if (!schoolName || !adminNumber || !email || !phone || !password || !confirmPassword || !plan) {
      alert("⚠️ Please fill all fields before proceeding.");
      return;
    }

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    submitBtn.textContent = skipPayment ? "🚀 Registering (Test Mode)..." : "⏳ Registering...";
    submitBtn.disabled = true;
    if (skipBtn) skipBtn.disabled = true;

    const payload = {
      schoolName,
      adminNumber,
      email,
      phone,
      password,
      plan,
      test_mode: skipPayment
    };

    console.log("📤 Sending registration request:", payload);

    try {
      const response = await fetch(`${API_BASE}/register-school`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      let result;
      try {
        result = await response.json();
      } catch {
        const text = await response.text();
        console.error("❌ Non-JSON response:", text);
        throw new Error("Server returned an invalid response.");
      }

      console.log("✅ Server response:", result);

      if (result.success) {
        alert(skipPayment
          ? `✅ Test Mode: Registered successfully as ${schoolName}!`
          : "✅ Registration successful! Redirecting to payment..."
        );

        // ✅ Save school_id to sessionStorage
        sessionStorage.setItem("school_id", result.school_id);

        const redirectUrl = skipPayment
          ? `dashboard.html?school_id=${encodeURIComponent(result.school_id)}`
          : `pay.html?school_id=${encodeURIComponent(result.school_id)}&plan=${encodeURIComponent(plan)}`;

        window.location.href = redirectUrl;
      } else {
        alert("⚠️ " + (result.message || "Registration failed."));
      }
    } catch (err) {
      console.error("📛 Critical error:", err.message);
      alert("⚠️ Could not connect to the server. Please try again.");
    } finally {
      submitBtn.textContent = "✅ Proceed to Payment";
      submitBtn.disabled = false;
      if (skipBtn) skipBtn.disabled = false;
    }
  }
});