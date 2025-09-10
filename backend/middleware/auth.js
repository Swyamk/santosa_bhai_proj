// Middleware for authentication
const validateAdmin = (req, res, next) => {
  // In a real application, you would validate JWT tokens or session tokens
  // For demo purposes, we'll do basic header validation
  
  const authHeader = req.headers.authorization;
  const adminCode = req.headers['x-admin-code'];
  
  if (!authHeader || !adminCode) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Missing authentication headers'
    });
  }

  // For demo: accept any bearer token with the correct admin code
  if (adminCode !== 'ADMIN2025') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid admin code'
    });
  }

  // Extract email from auth header (in real app, decode JWT)
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid token format'
    });
  }

  // For demo: assume token is base64 encoded email
  try {
    req.adminEmail = Buffer.from(token, 'base64').toString();
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid token'
    });
  }
};

const validateStudent = (req, res, next) => {
  // In a real application, you would validate JWT tokens or session tokens
  // For demo purposes, we'll do basic header validation
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Missing authentication header'
    });
  }

  // Extract email from auth header (in real app, decode JWT)
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid token format'
    });
  }

  // For demo: assume token is base64 encoded email
  try {
    req.studentEmail = Buffer.from(token, 'base64').toString();
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid token'
    });
  }
};

module.exports = {
  validateAdmin,
  validateStudent
};
