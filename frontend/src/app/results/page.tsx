'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  BookOpen, 
  User, 
  Mail, 
  Phone,
  X,
  ChevronDown
} from 'lucide-react';
import MaterialCard from '@/components/MaterialCard';
import DeliverModal from '@/components/DeliverModal';
import { searchMaterials, getUniqueCourses, getUniqueTypes } from '@/lib/fuse';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  courses: string[];
}

interface Material {
  id: string;
  course: string;
  title: string;
  type: string;
  filePath: string;
  uploadedAt: string;
  size: string;
  expiryDays: number;
  visibility: string;
}

interface SearchResults {
  success: boolean;
  student: Student;
  materials: Material[];
}

export default function ResultsPage() {
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [deliverModalOpen, setDeliverModalOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Get search results from sessionStorage
    const storedResults = sessionStorage.getItem('searchResults');
    if (storedResults) {
      setSearchResults(JSON.parse(storedResults));
    } else {
      // If no results, redirect back to home
      router.push('/');
    }
  }, [router]);

  // Filter and search materials
  const filteredMaterials = useMemo(() => {
    if (!searchResults) return [];

    let materials = searchResults.materials;

    // Filter by course
    if (selectedCourse !== 'all') {
      materials = materials.filter(material => material.course === selectedCourse);
    }

    // Filter by type
    if (selectedType !== 'all') {
      materials = materials.filter(material => material.type === selectedType);
    }

    // Search by query
    if (searchQuery.trim()) {
      const searchResult = searchMaterials(materials, searchQuery);
      return searchResult.map(result => result.item);
    }

    return materials;
  }, [searchResults, searchQuery, selectedCourse, selectedType]);

  const uniqueCourses = searchResults ? getUniqueCourses(searchResults.materials) : [];
  const uniqueTypes = searchResults ? getUniqueTypes(searchResults.materials) : [];

  const handleDeliver = (materials: Material[]) => {
    setSelectedMaterials(materials);
    setDeliverModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCourse('all');
    setSelectedType('all');
  };

  if (!searchResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Study Platform</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full p-3">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchResults.student.name}
                </h2>
                <p className="text-gray-600">Student ID: {searchResults.student.id}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{searchResults.student.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{searchResults.student.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Enrolled Courses</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {searchResults.student.courses.map((course) => (
                  <span
                    key={course}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 
                           rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {(selectedCourse !== 'all' || selectedType !== 'all' || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 
                           rounded-lg hover:bg-red-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course
                    </label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Courses</option>
                      {uniqueCourses.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Types</option>
                      {uniqueTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Study Materials ({filteredMaterials.length} found)
          </h3>
          {searchQuery && (
            <p className="text-gray-600 text-sm mt-1">
              Showing results for &quot;{searchQuery}&quot;
            </p>
          )}
        </motion.div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMaterials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <MaterialCard
                  material={material}
                  student={searchResults.student}
                  onDeliver={(materials) => handleDeliver(materials)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredMaterials.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No materials found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </div>

      {/* Deliver Modal */}
      <DeliverModal
        isOpen={deliverModalOpen}
        onClose={() => setDeliverModalOpen(false)}
        materials={selectedMaterials}
        student={searchResults.student}
      />
    </div>
  );
}
