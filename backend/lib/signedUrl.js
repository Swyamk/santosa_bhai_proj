const { getStorage } = require('./firebaseAdmin');

/**
 * Generate signed URL for Firebase Storage file
 * @param {string} filePath - Path to file in Firebase Storage
 * @param {number} expiresInMinutes - URL expiration time in minutes (default: 10)
 * @returns {Promise<string>} - Signed URL
 */
const generateSignedUrl = async (filePath, expiresInMinutes = 10) => {
  try {
    // In development mode, return a local file URL if DEVELOPMENT_MODE is true
    if (process.env.NODE_ENV === 'development' && process.env.DEVELOPMENT_MODE === 'true') {
      const encodedPath = encodeURIComponent(filePath.replace(/\//g, '_'));
      return `http://localhost:3001/api/files/${encodedPath}`;
    }

    const storage = getStorage();
    const bucket = storage.bucket();
    const file = bucket.file(filePath);

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + (expiresInMinutes * 60 * 1000), // Convert minutes to milliseconds
    });

    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    
    // Fallback to a development URL
    if (process.env.NODE_ENV === 'development') {
      const encodedPath = encodeURIComponent(filePath.replace(/\//g, '_'));
      return `http://localhost:3001/api/files/${encodedPath}`;
    }
    
    throw new Error('Failed to generate signed URL');
  }
};

/**
 * Generate multiple signed URLs
 * @param {string[]} filePaths - Array of file paths
 * @param {number} expiresInMinutes - URL expiration time in minutes
 * @returns {Promise<Object>} - Object with filePath as key and signed URL as value
 */
const generateMultipleSignedUrls = async (filePaths, expiresInMinutes = 10) => {
  const urls = {};
  
  for (const filePath of filePaths) {
    try {
      urls[filePath] = await generateSignedUrl(filePath, expiresInMinutes);
    } catch (error) {
      console.error(`Failed to generate URL for ${filePath}:`, error);
      urls[filePath] = null;
    }
  }
  
  return urls;
};

/**
 * Upload file to Firebase Storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name with path
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} - File path in storage
 */
const uploadFile = async (fileBuffer, fileName, contentType) => {
  try {
    const storage = getStorage();
    const bucket = storage.bucket();
    const file = bucket.file(fileName);

    await file.save(fileBuffer, {
      metadata: {
        contentType: contentType,
      },
    });

    return fileName;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file to storage');
  }
};

module.exports = {
  generateSignedUrl,
  generateMultipleSignedUrls,
  uploadFile
};
