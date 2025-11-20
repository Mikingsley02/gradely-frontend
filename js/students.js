// routes/students.js — Fixed for plan-based registration and school validation
const express = require("express");
const pool = require("../db");
const router = express.Router();

/**
 * ✅ REGISTER A SINGLE STUDENT (Manual) — Available to BOTH Basic and Pro
 */
router.post("/register", async (req, res) => {
  const {
    school_id,
    student_id,
    first_name,
    middle_name,
    last_name,
    class: student_class,
    section,
    phone,
    parent_email
  } = req.body;

  if (!school_id || !student_id || !first_name || !last_name || !student_class) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields."
    });
  }

  try {
    // ✅ Validate school exists
    const schoolCheck = await pool.query(
      "SELECT subscription_plan FROM schools WHERE school_id = $1",
      [school_id]
    );
    if (schoolCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "School not found."
      });
    }

    const result = await pool.query(
      `INSERT INTO students 
        (school_id, student_id, first_name, middle_name, last_name, class, section, phone, parent_email)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (student_id) DO NOTHING
       RETURNING *`,
      [school_id, student_id, first_name, middle_name, last_name, student_class, section, phone, parent_email]
    );

    if (result.rowCount === 0) {
      return res.status(409).json({
        success: false,
        message: "Student ID already exists."
      });
    }

    res.status(201).json({
      success: true,
      message: "Student registered successfully!",
      student: result.rows[0]
    });
  } catch (err) {
    console.error("❌ Error registering student:", err);
    res.status(500).json({
      success: false,
      message: "Failed to register student."
    });
  }
});

/**
 * ✅ BULK UPLOAD STUDENTS — PRO PLAN ONLY
 */
router.post("/bulk-upload", async (req, res) => {
  const { school_id, students } = req.body;

  if (!school_id || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      success: false,
      message: "School ID and students array are required."
    });
  }

  try {
    // ✅ Validate school and plan
    const schoolCheck = await pool.query(
      "SELECT subscription_plan FROM schools WHERE school_id = $1",
      [school_id]
    );

    if (schoolCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "School not found." });
    }

    const userPlan = schoolCheck.rows[0].subscription_plan;
    if (userPlan !== 'pro') {
      return res.status(403).json({
        success: false,
        message: "Bulk student upload is only available on Pro plan."
      });
    }

    let inserted = 0;
    for (const student of students) {
      const {
        student_id, first_name, middle_name, last_name,
        class: student_class, section, phone, parent_email
      } = student;

      if (!student_id || !first_name || !last_name || !student_class) continue;

      try {
        await pool.query(
          `INSERT INTO students 
            (school_id, student_id, first_name, middle_name, last_name, class, section, phone, parent_email)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (student_id) DO UPDATE SET
             first_name = EXCLUDED.first_name,
             last_name = EXCLUDED.last_name,
             class = EXCLUDED.class`,
          [school_id, student_id, first_name, middle_name, last_name, student_class, section, phone, parent_email]
        );
        inserted++;
      } catch (e) {
        console.warn("Skipping student due to error:", student_id, e.message);
      }
    }

    res.json({
      success: true,
      message: `Successfully uploaded ${inserted} student(s).`,
      count: inserted
    });
  } catch (err) {
    console.error("❌ Bulk upload error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to bulk upload students."
    });
  }
});

/**
 * ✅ GET all students for a specific school
 */
router.get('/:school_id', async (req, res) => {
  const { school_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE school_id = $1 ORDER BY student_id ASC",
      [school_id]
    );

    res.json({
      success: true,
      students: result.rows,
    });
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students.",
    });
  }
});

/**
 * ✅ SEARCH student by Student ID (within a school)
 */
router.get("/:school_id/search/:student_id", async (req, res) => {
  const { school_id, student_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE school_id = $1 AND student_id = $2",
      [school_id, student_id]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "Student not found.",
      });
    }

    res.json({
      success: true,
      students: result.rows,
    });
  } catch (err) {
    console.error("❌ Error searching student:", err);
    res.status(500).json({
      success: false,
      message: "Failed to search for student.",
    });
  }
});

/**
 * ✅ DELETE student by Student ID
 */
router.delete("/:student_id", async (req, res) => {
  const { student_id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM students WHERE student_id = $1 RETURNING *",
      [student_id]
    );

    if (result.rowCount === 0) {
      return res.json({
        success: false,
        message: "Student not found or already deleted.",
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Error deleting student:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete student.",
    });
  }
});

/**
 * ✅ UPDATE student info
 */
router.put("/:student_id", async (req, res) => {
  const { student_id } = req.params;
  const { first_name, middle_name, last_name, class: student_class, section, phone, parent_email } = req.body;

  try {
    const result = await pool.query(
      `UPDATE students 
       SET first_name = $1, 
           middle_name = $2, 
           last_name = $3, 
           class = $4, 
           section = $5, 
           phone = $6, 
           parent_email = $7
       WHERE student_id = $8
       RETURNING *`,
      [first_name, middle_name, last_name, student_class, section, phone, parent_email, student_id]
    );

    if (result.rowCount === 0) {
      return res.json({
        success: false,
        message: "Student not found or update failed.",
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully!",
      student: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error updating student:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update student.",
    });
  }
});

/**
 * ✅ TEST route
 */
router.get("/test", (req, res) => {
  res.json({ message: "Students route active ✅" });
});

module.exports = router;