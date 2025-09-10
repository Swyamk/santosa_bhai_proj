const express = require('express');
const router = express.Router();
const admin = require('../lib/firebaseAdmin');
const { validateAdmin } = require('../middleware/auth');

// Get all materials
router.get('/materials', validateAdmin, async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('materials').get();
    const materials = [];
    
    snapshot.forEach((doc) => {
      materials.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      materials
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch materials'
    });
  }
});

// Add new material
router.post('/materials', validateAdmin, async (req, res) => {
  try {
    const { title, course, description, type, size, studentIds, fileUrl } = req.body;

    if (!title || !course || !type || !fileUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const materialData = {
      title,
      course,
      description: description || '',
      type,
      size: size || 'Unknown',
      fileUrl,
      studentIds: studentIds || [],
      uploadDate: new Date().toISOString(),
      downloads: 0,
      status: 'active',
      createdBy: req.adminEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await admin.firestore().collection('materials').add(materialData);

    res.json({
      success: true,
      materialId: docRef.id,
      message: 'Material added successfully'
    });
  } catch (error) {
    console.error('Error adding material:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add material'
    });
  }
});

// Update material
router.put('/materials/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    updateData.updatedBy = req.adminEmail;

    await admin.firestore().collection('materials').doc(id).update(updateData);

    res.json({
      success: true,
      message: 'Material updated successfully'
    });
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update material'
    });
  }
});

// Delete material
router.delete('/materials/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await admin.firestore().collection('materials').doc(id).delete();

    res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete material'
    });
  }
});

// Get all students
router.get('/students', validateAdmin, async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('students').get();
    const students = [];
    
    snapshot.forEach((doc) => {
      students.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch students'
    });
  }
});

// Add new student
router.post('/students', validateAdmin, async (req, res) => {
  try {
    const { studentId, name, email, course, phone, materialIds } = req.body;

    if (!studentId || !name || !email || !course) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check if student ID already exists
    const existingStudent = await admin.firestore().collection('students').doc(studentId).get();
    if (existingStudent.exists) {
      return res.status(400).json({
        success: false,
        error: 'Student ID already exists'
      });
    }

    const studentData = {
      studentId,
      name,
      email,
      course,
      phone: phone || '',
      materialIds: materialIds || [],
      registrationDate: new Date().toISOString(),
      lastAccess: null,
      materialsCount: materialIds ? materialIds.length : 0,
      status: 'active',
      createdBy: req.adminEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await admin.firestore().collection('students').doc(studentId).set(studentData);

    res.json({
      success: true,
      studentId,
      message: 'Student added successfully'
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add student'
    });
  }
});

// Update student
router.put('/students/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    updateData.updatedBy = req.adminEmail;

    await admin.firestore().collection('students').doc(id).update(updateData);

    res.json({
      success: true,
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update student'
    });
  }
});

// Delete student
router.delete('/students/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await admin.firestore().collection('students').doc(id).delete();

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete student'
    });
  }
});

// Get admin dashboard stats
router.get('/stats', validateAdmin, async (req, res) => {
  try {
    const [materialsSnapshot, studentsSnapshot] = await Promise.all([
      admin.firestore().collection('materials').get(),
      admin.firestore().collection('students').get()
    ]);

    const materials = materialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const students = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const totalDownloads = materials.reduce((sum, material) => sum + (material.downloads || 0), 0);
    const activeMaterials = materials.filter(m => m.status === 'active').length;
    const activeStudents = students.filter(s => s.status === 'active').length;

    res.json({
      success: true,
      stats: {
        totalMaterials: materials.length,
        activeMaterials,
        totalStudents: students.length,
        activeStudents,
        totalDownloads,
        successRate: 98.5 // This could be calculated based on successful vs failed deliveries
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
});

// Bulk upload materials
router.post('/materials/bulk', validateAdmin, async (req, res) => {
  try {
    const { materials } = req.body;

    if (!materials || !Array.isArray(materials)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid materials data'
      });
    }

    const batch = admin.firestore().batch();
    const results = [];

    materials.forEach((material) => {
      const docRef = admin.firestore().collection('materials').doc();
      const materialData = {
        ...material,
        uploadDate: new Date().toISOString(),
        downloads: 0,
        status: 'active',
        createdBy: req.adminEmail,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      batch.set(docRef, materialData);
      results.push({ id: docRef.id, ...materialData });
    });

    await batch.commit();

    res.json({
      success: true,
      materialsAdded: results.length,
      materials: results,
      message: `${results.length} materials added successfully`
    });
  } catch (error) {
    console.error('Error bulk uploading materials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk upload materials'
    });
  }
});

module.exports = router;
