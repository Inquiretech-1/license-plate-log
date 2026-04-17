const jwt = require("jsonwebtoken");
const config = require("../config");
const prisma = require("../prisma");

/**
 * Verify JWT from Authorization: Bearer <token>, load user, set req.user.
 */
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const userId = decoded.userId ?? decoded.sub;
    if (userId == null) {
      return res.status(401).json({ success: false, error: "Invalid token payload" });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Require req.user.role to be one of the allowed roles.
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: "Forbidden: insufficient role" });
    }
    next();
  };
}

module.exports = { protect, authorize };
