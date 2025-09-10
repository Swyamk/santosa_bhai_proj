import Fuse from 'fuse.js';

// Configuration for fuzzy search
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'course', weight: 0.3 },
    { name: 'type', weight: 0.1 }
  ],
  threshold: 0.3,
  distance: 100,
  includeScore: true,
  includeMatches: true
};

/**
 * Create a Fuse instance for searching materials
 * @param {Array} materials - Array of material objects
 * @returns {Fuse} Configured Fuse instance
 */
export const createMaterialSearch = (materials) => {
  return new Fuse(materials, fuseOptions);
};

/**
 * Search materials using fuzzy search
 * @param {Array} materials - Array of material objects
 * @param {string} query - Search query
 * @returns {Array} Filtered materials with search scores
 */
export const searchMaterials = (materials, query) => {
  if (!query.trim()) {
    return materials.map(item => ({ item, score: 0 }));
  }

  const fuse = createMaterialSearch(materials);
  const results = fuse.search(query);
  
  return results;
};

/**
 * Filter materials by course
 * @param {Array} materials - Array of material objects
 * @param {string} course - Course code to filter by
 * @returns {Array} Filtered materials
 */
export const filterByCourse = (materials, course) => {
  if (!course || course === 'all') {
    return materials;
  }
  return materials.filter(material => material.course === course);
};

/**
 * Filter materials by type
 * @param {Array} materials - Array of material objects
 * @param {string} type - Material type to filter by
 * @returns {Array} Filtered materials
 */
export const filterByType = (materials, type) => {
  if (!type || type === 'all') {
    return materials;
  }
  return materials.filter(material => material.type === type);
};

/**
 * Get unique courses from materials
 * @param {Array} materials - Array of material objects
 * @returns {Array} Array of unique course codes
 */
export const getUniqueCourses = (materials) => {
  return [...new Set(materials.map(material => material.course))];
};

/**
 * Get unique types from materials
 * @param {Array} materials - Array of material objects
 * @returns {Array} Array of unique material types
 */
export const getUniqueTypes = (materials) => {
  return [...new Set(materials.map(material => material.type))];
};
