'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, QrCode, BookOpen, Users, FileText } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Study Platform</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="h-5 w-5" />
                <span className="text-sm">Student Access</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
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
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                         text-white font-semibold py-3 px-6 rounded-lg transition-colors
                         flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Find My Materials</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Instant Access
            </h3>
            <p className="text-gray-600 text-sm">
              Get immediate access to your course materials with just your Student ID
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <QrCode className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              QR Code Support
            </h3>
            <p className="text-gray-600 text-sm">
              Scan QR codes for quick access without typing your Student ID
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multiple Delivery
            </h3>
            <p className="text-gray-600 text-sm">
              Receive materials via email or WhatsApp for easy access anywhere
            </p>
          </div>
        </motion.div>

        {/* Demo Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            🎯 Demo Instructions
          </h3>
          <p className="text-yellow-700 mb-3">
            Try these sample Student IDs to explore the platform:
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
            {['S101', 'S102', 'S103', 'S104'].map((id) => (
              <button
                key={id}
                onClick={() => setValue('studentId', id)}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 
                           rounded text-sm font-medium transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
