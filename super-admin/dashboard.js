const API = "https://api.gradely.info/api/super-admin";

// Load stats and display in cards
async function loadStats() {
  try {
    const res = await fetch(`${API}/stats`, { credentials: "include" });
    const data = await res.json();

    if (!data.success) throw new Error("Failed to load stats");

    document.getElementById("stats").innerHTML = `
      <div class="kpi-card">
        <div class="kpi-value">${data.data.total_schools}</div>
        <div class="kpi-label">Total Schools</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${data.data.active_subscriptions}</div>
        <div class="kpi-label">Active Subs</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${data.data.inactive_subscriptions}</div>
        <div class="kpi-label">Inactive Subs</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${data.data.suspended_schools}</div>
        <div class="kpi-label">Suspended</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${data.data.deleted_schools}</div>
        <div class="kpi-label">Deleted</div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("stats").innerHTML = `<div class="error">Failed to load stats</div>`;
  }
}

// Search schools by name or ID
async function searchSchool() {
  const q = document.getElementById("searchInput").value.trim();
  if (!q) return alert("Enter a school ID or name");

  try {
    const res = await fetch(`${API}/schools/search?q=${encodeURIComponent(q)}`, {
      credentials: "include"
    });
    const data = await res.json();
    if (!data.success) throw new Error("Search failed");

    const table = document.getElementById("schoolTable");
    if (!data.data.length) {
      table.innerHTML = `<tr><td colspan="5">No schools found</td></tr>`;
      return;
    }

    table.innerHTML = data.data.map(s => `
      <tr>
        <td>${s.school_id}</td>
        <td>${s.school_name}</td>
        <td>${s.account_status}</td>
        <td>${s.subscription_plan}</td>
        <td>
          ${
            s.account_status === "suspended"
              ? `<button onclick="unsuspend('${s.school_id}')">Unsuspend</button>`
              : `<button onclick="suspend('${s.school_id}')">Suspend</button>`
          }
          <button onclick="deleteSchool('${s.school_id}')">Delete</button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    console.error(err);
    document.getElementById("schoolTable").innerHTML = `<tr><td colspan="5">Error fetching schools</td></tr>`;
  }
}

// Suspend school
async function suspend(id) {
  try {
    await fetch(`${API}/schools/suspend`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ school_id: id })
    });
    searchSchool();
  } catch (err) {
    console.error(err);
    alert("Failed to suspend school");
  }
}

// Unsuspend school
async function unsuspend(id) {
  try {
    await fetch(`${API}/schools/unsuspend`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ school_id: id })
    });
    searchSchool();
  } catch (err) {
    console.error(err);
    alert("Failed to unsuspend school");
  }
}

// Delete school
async function deleteSchool(id) {
  if (!confirm("Are you sure you want to delete this school? This will cancel their subscription.")) return;

  try {
    await fetch(`${API}/schools/delete`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ school_id: id })
    });
    searchSchool();
  } catch (err) {
    console.error(err);
    alert("Failed to delete school");
  }
}

// Initial load
loadStats();
searchSchool();
