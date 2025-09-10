'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  X, 
  Mail, 
  MessageCircle, 
  Send, 
  CheckCircle, 
  AlertCircle,
  FileText
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

interface DeliverModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: Material[];
  student: Student;
}

// Form validation schema
const deliverySchema = z.object({
  method: z.enum(['email', 'whatsapp']),
  contact: z.string()
    .min(1, 'Contact information is required')
    .refine((val) => {
      // Basic email validation for email method
      if (val.includes('@')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }
      // Basic phone validation for WhatsApp method
      return /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/\s/g, ''));
    }, 'Please enter a valid email or phone number')
});

type DeliveryForm = z.infer<typeof deliverySchema>;

export default function DeliverModal({ isOpen, onClose, materials, student }: DeliverModalProps) {
  const [isDelivering, setIsDelivering] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deliveryMessage, setDeliveryMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<DeliveryForm>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      method: 'email',
      contact: student?.email || ''
    }
  });

  const selectedMethod = watch('method');

  // Update contact when method changes
  const handleMethodChange = (method: 'email' | 'whatsapp') => {
    setValue('method', method);
    if (method === 'email') {
      setValue('contact', student?.email || '');
    } else {
      setValue('contact', student?.phone || '');
    }
  };

  const onSubmit = async (data: DeliveryForm) => {
    setIsDelivering(true);
    setDeliveryStatus('idle');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/deliver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: student.id,
          materialIds: materials.map(m => m.id),
          method: data.method,
          contact: data.contact
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to deliver materials');
      }

      if (result.success) {
        setDeliveryStatus('success');
        setDeliveryMessage(result.details?.message || 'Materials delivered successfully!');
        
        // Auto close after 3 seconds
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        throw new Error(result.error || 'Delivery failed');
      }
    } catch (error) {
      setDeliveryStatus('error');
      setDeliveryMessage(error instanceof Error ? error.message : 'An error occurred during delivery');
    } finally {
      setIsDelivering(false);
    }
  };

  const handleClose = () => {
    setDeliveryStatus('idle');
    setDeliveryMessage('');
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black bg-opacity-50"
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Deliver Materials
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {deliveryStatus === 'idle' && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Materials List */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Materials to deliver ({materials.length})
                    </h4>
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {materials.map((material) => (
                        <div key={material.id} className="flex items-center space-x-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{material.title}</span>
                          <span className="text-gray-500">({material.type})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Delivery Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMethodChange('email')}
                        className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors
                                  ${selectedMethod === 'email' 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                    : 'border-gray-300 hover:border-gray-400'}`}
                      >
                        <Mail className="h-8 w-8 mb-2" />
                        <span className="text-sm font-medium">Email</span>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMethodChange('whatsapp')}
                        className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors
                                  ${selectedMethod === 'whatsapp' 
                                    ? 'border-green-500 bg-green-50 text-green-700' 
                                    : 'border-gray-300 hover:border-gray-400'}`}
                      >
                        <MessageCircle className="h-8 w-8 mb-2" />
                        <span className="text-sm font-medium">WhatsApp</span>
                      </motion.button>
                    </div>
                    {errors.method && (
                      <p className="text-red-600 text-sm mt-1">{errors.method.message}</p>
                    )}
                  </div>

                  {/* Contact Input */}
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedMethod === 'email' ? 'Email Address' : 'WhatsApp Number'}
                    </label>
                    <input
                      {...register('contact')}
                      type={selectedMethod === 'email' ? 'email' : 'tel'}
                      id="contact"
                      placeholder={selectedMethod === 'email' ? 'Enter email address' : 'Enter phone number'}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                ${errors.contact ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors.contact && (
                      <p className="text-red-600 text-sm mt-1">{errors.contact.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isDelivering}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                             text-white font-semibold py-3 px-4 rounded-lg transition-colors
                             flex items-center justify-center space-x-2"
                  >
                    {isDelivering ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Delivering...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Deliver Materials</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}

              {/* Success State */}
              {deliveryStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Materials Delivered!
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {deliveryMessage}
                  </p>
                  <p className="text-sm text-gray-500">
                    This dialog will close automatically in a few seconds...
                  </p>
                </motion.div>
              )}

              {/* Error State */}
              {deliveryStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Delivery Failed
                  </h4>
                  <p className="text-gray-600 mb-6">
                    {deliveryMessage}
                  </p>
                  <button
                    onClick={() => setDeliveryStatus('idle')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                             py-2 px-4 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
