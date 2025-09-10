'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, Upload, User } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';

interface IDInputProps {
  register: UseFormRegister<{studentId: string}>;
  error?: string;
  onQRScan?: (scannedId: string) => void;
  isLoading?: boolean;
}

export default function IDInput({ register, error, onQRScan, isLoading }: IDInputProps) {
  const [showQROptions, setShowQROptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would use a QR code library to parse the image
      // For demo purposes, we'll simulate QR scanning
      console.log('QR file uploaded:', file.name);
      
      // Simulate QR code reading (in real implementation, use qr-scanner or similar)
      setTimeout(() => {
        const mockScannedId = 'S101'; // This would be the actual scanned result
        onQRScan?.(mockScannedId);
        setShowQROptions(false);
      }, 1000);
    }
  };

  const handleCameraScan = () => {
    // In a real implementation, you would use getUserMedia and a QR scanner
    // For demo purposes, we'll simulate camera scanning
    console.log('Camera scan initiated');
    
    // Check if camera is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          // Simulate QR scanning from camera
          setTimeout(() => {
            const mockScannedId = 'S102'; // This would be the actual scanned result
            onQRScan?.(mockScannedId);
            setShowQROptions(false);
          }, 2000);
        })
        .catch((err) => {
          console.error('Camera access denied:', err);
          alert('Camera access is required for QR scanning. Please allow camera access or upload a QR image instead.');
        });
    } else {
      alert('Camera not available. Please upload a QR code image instead.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-2">
        <User className="h-5 w-5 text-gray-500" />
        <label htmlFor="studentId" className="text-lg font-medium text-gray-700">
          Student ID
        </label>
      </div>

      <div className="relative">
        <input
          {...register('studentId')}
          type="text"
          id="studentId"
          placeholder="Enter your Student ID (e.g., S101)"
          disabled={isLoading}
          className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-mono
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed
                     ${error ? 'border-red-300' : 'border-gray-300'}`}
        />
        
        <button
          type="button"
          onClick={() => setShowQROptions(!showQROptions)}
          disabled={isLoading}
          className="absolute right-3 top-1/2 transform -translate-y-1/2
                     text-gray-400 hover:text-blue-600 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          title="Scan QR Code"
        >
          <QrCode className="h-6 w-6" />
        </button>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-sm"
        >
          {error}
        </motion.p>
      )}

      {/* QR Code Options */}
      {showQROptions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
        >
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Scan QR Code
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCameraScan}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed 
                         border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Use Camera</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed 
                         border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Upload Image</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <p className="text-xs text-gray-500 mt-3 text-center">
            📱 Point your camera at a QR code or upload an image containing a QR code
          </p>
        </motion.div>
      )}

      <div className="text-sm text-gray-500">
        <p>💡 <strong>Format:</strong> Student ID should start with &apos;S&apos; followed by numbers (e.g., S101, S102)</p>
      </div>
    </div>
  );
}
