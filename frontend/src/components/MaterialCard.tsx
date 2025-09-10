'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  File, 
  Video, 
  Image as ImageIcon,
  Download, 
  Send, 
  Eye, 
  Calendar,
  HardDrive,
  BookOpen
} from 'lucide-react';

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

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  courses: string[];
}

interface MaterialCardProps {
  material: Material;
  student: Student;
  onDeliver: (materials: Material[]) => void;
}

export default function MaterialCard({ material, onDeliver }: MaterialCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Get icon based on file type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'ppt':
      case 'pptx':
        return <File className="h-8 w-8 text-orange-500" />;
      case 'video':
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="h-8 w-8 text-purple-500" />;
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'ppt':
      case 'pptx':
        return 'bg-orange-100 text-orange-800';
      case 'video':
      case 'mp4':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // In a real implementation, this would call the API to get a signed URL
      // For demo purposes, we'll simulate the download
      console.log('Downloading:', material.title);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, you would:
      // 1. Call API to get signed URL
      // 2. Open the URL in a new tab or trigger download
      alert(`Download started for: ${material.title}\\n\\nIn a real implementation, this would download the actual file.`);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = () => {
    // In a real implementation, this would open a preview modal or new tab
    console.log('Preview:', material.title);
    alert(`Preview for: ${material.title}\\n\\nIn a real implementation, this would show a preview of the file.`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getFileIcon(material.type)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {material.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{material.course}</span>
              </div>
            </div>
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
            {material.type.toUpperCase()}
          </span>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Uploaded {formatDate(material.uploadedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <HardDrive className="h-4 w-4" />
              <span>{material.size}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePreview}
            className="flex items-center justify-center space-x-1 px-3 py-2 
                       bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                       transition-colors text-sm font-medium"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDeliver([material])}
            className="flex items-center justify-center space-x-1 px-3 py-2 
                       bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 
                       transition-colors text-sm font-medium"
          >
            <Send className="h-4 w-4" />
            <span>Deliver</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center justify-center space-x-1 px-3 py-2 
                       bg-green-100 text-green-700 rounded-lg hover:bg-green-200 
                       transition-colors text-sm font-medium disabled:opacity-50 
                       disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{isDownloading ? 'Loading...' : 'Download'}</span>
          </motion.button>
        </div>
      </div>

      {/* Progress bar for download */}
      {isDownloading && (
        <div className="h-1 bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
            className="h-full bg-green-500"
          />
        </div>
      )}
    </motion.div>
  );
}
