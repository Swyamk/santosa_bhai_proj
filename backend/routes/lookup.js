const express = require('express');
const { getFirestore } = require('../lib/firebaseAdmin');
const seedData = require('../seed/seed.json');

const router = express.Router();

/**
 * POST /api/lookup
 * Accepts: { id: string }
 * Returns: { student: object, materials: array }
 */
router.post('/lookup', async (req, res) => {
  try {
    const { id } = req.body;

    // Validate input
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Student ID is required and must be a string'
      });
    }

    // Validate ID format (assuming format like S101, S102, etc.)
    const idPattern = /^S\d+$/;
    if (!idPattern.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Student ID format. Expected format: S followed by numbers (e.g., S101)'
      });
    }

    let student = null;
    let materials = [];

    // Try to get data from Firestore first
    try {
      const db = getFirestore();
      
      // Get student data
      const studentDoc = await db.collection('students').doc(id).get();
      
      if (studentDoc.exists) {
        student = { id: studentDoc.id, ...studentDoc.data() };
        
        // Get materials for student's courses
        if (student.courses && student.courses.length > 0) {
          const materialsSnapshot = await db.collection('materials')
            .where('course', 'in', student.courses)
            .where('visibility', '==', 'active')
            .get();
          
          materials = materialsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }
      }
    } catch (firebaseError) {
      console.log('Firestore not available, falling back to seed data:', firebaseError.message);
    }

    // Fallback to seed data if Firestore is not available or student not found
    if (!student) {
      student = seedData.students.find(s => s.id === id);
      
      if (student) {
        // Get materials for student's courses from seed data
        materials = seedData.materials.filter(material => 
          student.courses.includes(material.course) && 
          material.visibility === 'active'
        );
      }
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Sort materials by upload date (newest first)
    materials.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.json({
      success: true,
      student,
      materials
    });

  } catch (error) {
    console.error('Error in lookup route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/student/:id
 * Get student details by ID
 */
router.get('/student/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let student = null;

    // Try Firestore first
    try {
      const db = getFirestore();
      const studentDoc = await db.collection('students').doc(id).get();
      
      if (studentDoc.exists) {
        student = { id: studentDoc.id, ...studentDoc.data() };
      }
    } catch (firebaseError) {
      console.log('Firestore not available, falling back to seed data');
    }

    // Fallback to seed data
    if (!student) {
      student = seedData.students.find(s => s.id === id);
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.json({
      success: true,
      student
    });

  } catch (error) {
    console.error('Error getting student:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
