// server/middleware/auth.js
import jwt from 'jsonwebtoken';
import ENV from '../config.js';

/** 🔐 Authentication Middleware */
export default async function Auth(req, res, next) {
  try {
    // Log authorization header for debugging
    console.log("Auth Header:", req.headers.authorization);

    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ error: "Access Denied: No token provided" });
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, ENV.JWT_SECRET);

    // Attach user info to request object
    req.user = decodedToken;

    // Continue to next middleware or route
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid Token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token Expired" });
    } else {
      return res.status(401).json({ error: "Authorization Failed!" });
    }
  }
}

/** 🧩 Local Variables Middleware */
export function localVariables(req, res, next) {
  req.app.locals.OTP = null;
  req.app.locals.resetSession = false;
  next();
}
