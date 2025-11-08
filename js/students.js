// ✅ FRONTEND SCRIPT for manage-students.html
// Handles: fetching, searching, editing (modal), deleting

const backendUrl = "https://gradely-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const studentTableBody = document.getElementById("studentTableBody");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const addStudentBtn = document.getElementById("addStudentBtn");
  const messageBox = document.getElementById("messageBox");

  const modal = document.getElementById("editModal");
  const closeModalBtn = document.getElementById("closeModal");
  const saveChangesBtn = document.getElementById("saveChanges");

  const form = document.getElementById("editForm");
  const school_id = localStorage.getItem("school_id") || "SCH001"; // fallback

  let editingStudentId = null;

  // ✅ Load all students initially
  async function loadStudents() {
    try {
      const res = await fetch(`${backendUrl}/api/students/${school_id}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      renderStudents(data.students);
    } catch (err) {
      console.error(err);
      showMessage("⚠️ Failed to load students.", "error");
    }
  }

  // ✅ Render students in table
  function renderStudents(students) {
    studentTableBody.innerHTML = "";

    if (!students || students.length === 0) {
      studentTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#888;">No students found</td></tr>`;
      return;
    }

    students.forEach((s) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.student_id}</td>
        <td>${s.first_name} ${s.middle_name || ""} ${s.last_name}</td>
        <td>${s.class}</td>
        <td>${s.section || "-"}</td>
        <td>${s.phone || "-"}</td>
        <td>${s.parent_email || "-"}</td>
        <td>
          <button class="edit-btn" data-id="${s.student_id}">✏️ Edit</button>
          <button class="delete-btn" data-id="${s.student_id}">🗑️ Delete</button>
        </td>
      `;
      studentTableBody.appendChild(tr);
    });

    // Attach events after rendering
    document.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", (e) => deleteStudent(e.target.dataset.id))
    );

    document.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", (e) => openEditModal(e.target.dataset.id))
    );
  }

  // ✅ Search by Student ID or name
  searchBtn.addEventListener("click", async () => {
    const searchValue = searchInput.value.trim();
    if (!searchValue) return loadStudents();

    try {
      const res = await fetch(`${backendUrl}/api/students/${school_id}/search/${searchValue}`);
      const data = await res.json();

      if (!data.success || !data.students?.length)
        throw new Error("No student found");

      renderStudents(data.students);
    } catch (err) {
      console.error(err);
      showMessage("❌ Student not found.", "error");
    }
  });

  // ✅ Delete student
  async function deleteStudent(student_id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`${backendUrl}/api/students/${student_id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        showMessage("🗑️ Student deleted successfully!", "success");
        loadStudents();
      } else {
        showMessage("❌ " + data.message, "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("⚠️ Error deleting student.", "error");
    }
  }

  // ✅ Open Edit Modal
  async function openEditModal(student_id) {
    editingStudentId = student_id;
    try {
      const res = await fetch(`${backendUrl}/api/student/${student_id}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      const s = data.student;

      form.first_name.value = s.first_name;
      form.middle_name.value = s.middle_name || "";
      form.last_name.value = s.last_name;
      form.class.value = s.class;
      form.section.value = s.section || "";
      form.phone.value = s.phone || "";
      form.parent_email.value = s.parent_email || "";

      modal.style.display = "flex";
    } catch (err) {
      console.error(err);
      showMessage("⚠️ Failed to load student info.", "error");
    }
  }

  // ✅ Save Changes
  saveChangesBtn.addEventListener("click", async () => {
    if (!editingStudentId) return;

    const updatedData = {
      first_name: form.first_name.value.trim(),
      middle_name: form.middle_name.value.trim(),
      last_name: form.last_name.value.trim(),
      class: form.class.value.trim(),
      section: form.section.value.trim(),
      phone: form.phone.value.trim(),
      parent_email: form.parent_email.value.trim(),
    };

    try {
      const res = await fetch(`${backendUrl}/api/students/${editingStudentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (data.success) {
        showMessage("✅ Student updated successfully!", "success");
        modal.style.display = "none";
        loadStudents();
      } else {
        showMessage("❌ " + data.message, "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("⚠️ Update failed.", "error");
    }
  });

  // ✅ Close Modal
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // ✅ Add Student Button
  addStudentBtn.addEventListener("click", () => {
    window.location.href = "create-student.html";
  });

  // ✅ Helper: Message display
  function showMessage(msg, type) {
    messageBox.textContent = msg;
    messageBox.className = `message ${type}`;
    setTimeout(() => (messageBox.textContent = ""), 4000);
  }

  // ✅ Initial load
  loadStudents();
});
