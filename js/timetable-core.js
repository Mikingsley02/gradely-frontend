// timetable-core.js — browser-friendly version

window.addSlot = async function () {
  const payload = {
    school_id: window.school_id,
    class: document.getElementById("className").value.trim(),
    day: document.getElementById("day").value,
    time_slot: document.getElementById("timeSlot").value,
    subject_id: document.getElementById("subject").value,
    teacher: document.getElementById("teacher").value || null
  };

  await fetch(`${BACKEND_URL}/api/timetable`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  loadTimetable();
};

window.deleteSlot = async function(id) {
  await fetch(
    `${BACKEND_URL}/api/timetable/${id}?school_id=${window.school_id}`,
    { method: "DELETE", credentials: "include" }
  );
  loadTimetable();
};

window.loadTimetable = async function () {
  const className = document.getElementById("className").value.trim();
  if (!className) return;

  const res = await fetch(
    `${BACKEND_URL}/api/timetable?school_id=${window.school_id}&class=${encodeURIComponent(className)}`,
    { credentials: "include" }
  );

  const data = await res.json();
  const tbody = document.getElementById("timetable");

  tbody.innerHTML = data.timetable?.length
    ? data.timetable.map(row => `
        <tr>
          <td>${row.day}</td>
          <td>${row.time_slot}</td>
          <td>${row.subject || "-"}</td>
          <td>${row.teacher || "-"}</td>
          <td>
            <button class="danger" onclick="deleteSlot(${row.id})">Delete</button>
          </td>
        </tr>
      `).join("")
    : `<tr><td colspan="5" style="text-align:center;">No timetable yet</td></tr>`;
};
