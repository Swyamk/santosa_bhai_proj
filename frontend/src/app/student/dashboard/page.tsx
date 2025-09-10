'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Download, 
  Clock, 
  FileText,
  Search,
  LogOut,
  Star,
  Calendar,
  Mail,
  ArrowRight,
  QrCode
} from 'lucide-react';

interface RecentMaterial {
  id: string;
  title: string;
  course: string;
  downloadDate: string;
  type: string;
  size: string;
}

interface AvailableMaterial {
  id: string;
  title: string;
  course: string;
  uploadDate: string;
  type: string;
  size: string;
  isNew: boolean;
}

export default function StudentDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [recentMaterials, setRecentMaterials] = useState<RecentMaterial[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<AvailableMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated as student
    const userType = localStorage.getItem('userType');
    const email = localStorage.getItem('userEmail');
    
    if (userType !== 'student' || !email) {
      router.push('/auth/student');
      return;
    }
    
    setUserEmail(email);
    loadData();
  }, [router]);

  const loadData = async () => {
    setIsLoading(true);
    
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setRecentMaterials([
        {
          id: 'M001',
          title: 'Introduction to Computer Science',
          course: 'CS101',
          downloadDate: '2025-01-20',
          type: 'PDF',
          size: '2.5 MB'
        },
        {
          id: 'M002',
          title: 'Advanced Mathematics Notes',
          course: 'MATH201',
          downloadDate: '2025-01-18',
          type: 'PDF',
          size: '4.2 MB'
        },
        {
          id: 'M003',
          title: 'Physics Lab Manual',
          course: 'PHY101',
          downloadDate: '2025-01-15',
          type: 'PDF',
          size: '1.8 MB'
        }
      ]);

      setAvailableMaterials([
        {
          id: 'M004',
          title: 'Database Design Principles',
          course: 'CS201',
          uploadDate: '2025-01-22',
          type: 'PDF',
          size: '3.1 MB',
          isNew: true
        },
        {
          id: 'M005',
          title: 'Calculus Practice Problems',
          course: 'MATH201',
          uploadDate: '2025-01-21',
          type: 'PDF',
          size: '2.8 MB',
          isNew: true
        },
        {
          id: 'M006',
          title: 'Programming Assignment 3',
          course: 'CS101',
          uploadDate: '2025-01-19',
          type: 'PDF',
          size: '1.2 MB',
          isNew: false
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
    { title: 'Downloaded Materials', value: '24', icon: <Download className="h-6 w-6" />, color: 'from-blue-500 to-blue-600' },
    { title: 'Available Courses', value: '6', icon: <BookOpen className="h-6 w-6" />, color: 'from-green-500 to-green-600' },
    { title: 'This Month', value: '12', icon: <Calendar className="h-6 w-6" />, color: 'from-purple-500 to-purple-600' },
    { title: 'Success Rate', value: '100%', icon: <Star className="h-6 w-6" />, color: 'from-orange-500 to-orange-600' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
              >
                Quick Access
              </button>
              <span className="text-sm text-gray-600">Hello, {userEmail}</span>
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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Hub</h2>
          <p className="text-gray-600">Access your study materials and track your progress</p>
        </motion.div>

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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Need Materials?</h3>
              <p className="text-blue-100">Access your study materials instantly with your Student ID</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/')}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Quick Access</span>
              </button>
              <button
                onClick={() => router.push('/')}
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center space-x-2"
              >
                <QrCode className="h-5 w-5" />
                <span>Scan QR</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Downloads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Downloads</h3>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recentMaterials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{material.title}</p>
                        <p className="text-sm text-gray-500">{material.course} • {material.size}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{material.downloadDate}</p>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Download Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {recentMaterials.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No downloads yet</p>
                  <p className="text-sm text-gray-400">Your downloaded materials will appear here</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Available Materials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">New Materials</h3>
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {availableMaterials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{material.title}</p>
                          {material.isNew && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{material.course} • {material.size}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{material.uploadDate}</p>
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1">
                        <span>Access</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {availableMaterials.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No new materials</p>
                  <p className="text-sm text-gray-400">Check back later for updates</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8 bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mx-auto mb-3">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Find Materials</h4>
              <p className="text-sm text-gray-600">Use your Student ID to search for course materials</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg w-fit mx-auto mb-3">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Email Delivery</h4>
              <p className="text-sm text-gray-600">Materials are delivered directly to your email</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mx-auto mb-3">
                <QrCode className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">QR Code</h4>
              <p className="text-sm text-gray-600">Scan QR codes for instant access to materials</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
