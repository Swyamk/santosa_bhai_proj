'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Plus, 
  Users, 
  FileText, 
  Upload, 
  Trash2, 
  Edit, 
  Search,
  Download,
  Mail,
  BookOpen,
  LogOut,
  Settings,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Material {
  id: string;
  title: string;
  course: string;
  type: string;
  uploadDate: string;
  size: string;
  downloads: number;
  status: 'active' | 'pending' | 'archived';
}

interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  lastAccess: string;
  materialsCount: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userEmail, setUserEmail] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated as admin
    const userType = localStorage.getItem('userType');
    const email = localStorage.getItem('userEmail');
    
    if (userType !== 'admin' || !email) {
      router.push('/auth/admin');
      return;
    }
    
    setUserEmail(email);
    loadData();
  }, [router]);

  const loadData = async () => {
    setIsLoading(true);
    
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setMaterials([
        {
          id: 'M001',
          title: 'Introduction to Computer Science',
          course: 'CS101',
          type: 'PDF',
          uploadDate: '2025-01-15',
          size: '2.5 MB',
          downloads: 145,
          status: 'active'
        },
        {
          id: 'M002',
          title: 'Advanced Mathematics Notes',
          course: 'MATH201',
          type: 'PDF',
          uploadDate: '2025-01-10',
          size: '4.2 MB',
          downloads: 89,
          status: 'active'
        },
        {
          id: 'M003',
          title: 'Physics Lab Manual',
          course: 'PHY101',
          type: 'PDF',
          uploadDate: '2025-01-08',
          size: '1.8 MB',
          downloads: 67,
          status: 'pending'
        }
      ]);

      setStudents([
        {
          id: 'S101',
          name: 'John Doe',
          email: 'john.doe@student.edu',
          course: 'Computer Science',
          lastAccess: '2025-01-20',
          materialsCount: 12
        },
        {
          id: 'S102',
          name: 'Jane Smith',
          email: 'jane.smith@student.edu',
          course: 'Mathematics',
          lastAccess: '2025-01-19',
          materialsCount: 8
        },
        {
          id: 'S103',
          name: 'Mike Johnson',
          email: 'mike.johnson@student.edu',
          course: 'Physics',
          lastAccess: '2025-01-18',
          materialsCount: 15
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const stats = [
    { title: 'Total Materials', value: '156', icon: <FileText className="h-6 w-6" />, color: 'from-blue-500 to-blue-600' },
    { title: 'Active Students', value: '1,247', icon: <Users className="h-6 w-6" />, color: 'from-green-500 to-green-600' },
    { title: 'Downloads Today', value: '89', icon: <Download className="h-6 w-6" />, color: 'from-purple-500 to-purple-600' },
    { title: 'Success Rate', value: '98.5%', icon: <CheckCircle className="h-6 w-6" />, color: 'from-orange-500 to-orange-600' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">EduAccess Pro Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {userEmail}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-5 w-5" /> },
              { id: 'materials', label: 'Materials', icon: <FileText className="h-5 w-5" /> },
              { id: 'students', label: 'Students', icon: <Users className="h-5 w-5" /> },
              { id: 'upload', label: 'Upload', icon: <Upload className="h-5 w-5" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex items-center">
                    <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                      <div className="text-white">{stat.icon}</div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
                <div className="space-y-3">
                  {materials.slice(0, 3).map((material) => (
                    <div key={material.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900">{material.title}</p>
                        <p className="text-sm text-gray-500">{material.course} • {material.uploadDate}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        material.status === 'active' ? 'bg-green-100 text-green-800' :
                        material.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {material.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Student Activity</h3>
                <div className="space-y-3">
                  {students.slice(0, 3).map((student) => (
                    <div key={student.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">Last access: {student.lastAccess}</p>
                      </div>
                      <span className="text-sm text-gray-600">{student.materialsCount} materials</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Study Materials</h3>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Material</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {materials.map((material) => (
                      <tr key={material.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{material.title}</p>
                            <p className="text-sm text-gray-500">{material.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.course}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.size}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.downloads}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            material.status === 'active' ? 'bg-green-100 text-green-800' :
                            material.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {material.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Students</h3>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Student</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Access</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materials</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.course}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.lastAccess}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.materialsCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Mail className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload New Material</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Material Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter material title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., CS101"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter material description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop your file here, or click to browse</p>
                    <p className="text-sm text-gray-500">Supports PDF, DOC, PPT files up to 50MB</p>
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx" />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Upload Material
                  </button>
                  <button
                    type="button"
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Save as Draft
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Send email notifications for new uploads</p>
                    </div>
                    <button className="bg-purple-600 rounded-full w-12 h-6 flex items-center px-1">
                      <div className="bg-white w-4 h-4 rounded-full ml-auto"></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Auto-Archive</p>
                      <p className="text-sm text-gray-500">Automatically archive old materials</p>
                    </div>
                    <button className="bg-gray-300 rounded-full w-12 h-6 flex items-center px-1">
                      <div className="bg-white w-4 h-4 rounded-full"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">156</p>
                    <p className="text-sm text-gray-600">Total Materials</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">1,247</p>
                    <p className="text-sm text-gray-600">Total Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">12,456</p>
                    <p className="text-sm text-gray-600">Total Downloads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">98.5%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
