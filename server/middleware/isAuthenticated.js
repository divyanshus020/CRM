import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Store decoded token in req.user
    req.user = decoded;
    req.id = decoded.id; // Also store id directly
    
    console.log('Token verified, user:', decoded);
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'User not authenticated', 
      error: error.message 
    });
  }
};

export default isAuthenticated;