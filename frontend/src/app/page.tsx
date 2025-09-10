'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, QrCode, BookOpen, Users, FileText, Shield, Zap, Download, Mail, MessageCircle, Globe, Star, ArrowRight } from 'lucide-react';
import IDInput from '@/components/IDInput';

// Schema for form validation
const searchSchema = z.object({
  studentId: z.string()
    .min(1, 'Student ID is required')
    .regex(/^S\d+$/, 'Student ID must start with S followed by numbers (e.g., S101)')
});

type SearchForm = z.infer<typeof searchSchema>;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema)
  });

  const onSubmit = async (data: SearchForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: data.studentId.toUpperCase() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to lookup student');
      }

      if (result.success) {
        // Store the results in sessionStorage for the results page
        sessionStorage.setItem('searchResults', JSON.stringify(result));
        router.push('/results');
      } else {
        setError(result.error || 'No materials found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = (scannedId: string) => {
    setValue('studentId', scannedId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduAccess Pro
                </h1>
                <p className="text-xs text-gray-500">Smart Study Material Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/auth/student')}
                className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Users className="h-5 w-5" />
                <span className="text-sm">Student Login</span>
              </button>
              <button 
                onClick={() => router.push('/auth/admin')}
                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all"
              >
                <Shield className="h-4 w-4" />
                <span className="text-sm">Admin Portal</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Smart Study Material
                </span>
                <br />
                <span className="text-gray-800">Access Platform</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Revolutionary digital platform connecting students with their study materials instantly. 
                Access course content, assignments, and resources with just your Student ID.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>Access Materials Now</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose EduAccess Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of educational resource management with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Instant Access",
                description: "Get your study materials in seconds. No more waiting, no more searching through multiple platforms.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: <QrCode className="h-8 w-8" />,
                title: "QR Code Integration",
                description: "Scan QR codes for lightning-fast access. Perfect for classroom environments and mobile users.",
                color: "from-green-400 to-emerald-500"
              },
              {
                icon: <Mail className="h-8 w-8" />,
                title: "Multi-Channel Delivery",
                description: "Receive materials via email or WhatsApp. Access your content anywhere, anytime.",
                color: "from-blue-400 to-cyan-500"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Secure & Private",
                description: "Bank-level security ensures your academic data remains protected and confidential.",
                color: "from-purple-400 to-pink-500"
              },
              {
                icon: <Download className="h-8 w-8" />,
                title: "Offline Access",
                description: "Download materials for offline study. Perfect for areas with limited internet connectivity.",
                color: "from-indigo-400 to-blue-500"
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Cross-Platform",
                description: "Works seamlessly on desktop, tablet, and mobile devices. Study anywhere you go.",
                color: "from-teal-400 to-green-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Access Your Study Materials
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enter your Student ID to instantly access your assigned course materials, 
              lecture notes, and assignments.
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <IDInput
                register={register}
                error={errors.studentId?.message}
                onQRScan={handleQRScan}
                isLoading={isLoading}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 
                           text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl
                           flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-6 w-6" />
                    <span>Find My Materials</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Demo Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-800">
                Try Our Demo
              </h3>
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-yellow-700 mb-4 text-center">
              Experience the platform with these sample Student IDs:
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {['S101', 'S102', 'S103', 'S104'].map((id) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setValue('studentId', id)}
                  className="bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 text-yellow-800 px-4 py-3 
                             rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {id}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Students Served" },
              { number: "500+", label: "Courses Available" },
              { number: "99.9%", label: "Uptime Guarantee" },
              { number: "24/7", label: "Access Available" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold">EduAccess Pro</h3>
            </div>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Empowering education through technology. Making study materials accessible to every student, everywhere.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2025 EduAccess Pro. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
