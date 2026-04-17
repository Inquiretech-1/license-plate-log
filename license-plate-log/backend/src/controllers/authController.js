const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const prisma = require("../prisma");
const config = require("../config");

function signToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

function userPublic(user) {
  if (!user) return null;
  const { password: _p, ...rest } = user;
  return rest;
}

async function register(req, res, next) {
  try {
    await body("email").isEmail().withMessage("Valid email is required").run(req);
    await body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .run(req);
    await body("name").optional().isString().trim().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
      });
    }

    const { email, password, name } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hash,
        name: name || null,
        role: "viewer",
      },
    });

    const token = signToken(user);
    return res.status(201).json({
      success: true,
      data: {
        user: userPublic(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    await body("email").isEmail().withMessage("Valid email is required").run(req);
    await body("password").notEmpty().withMessage("Password is required").run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
      });
    }

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const token = signToken(user);
    return res.json({
      success: true,
      data: {
        user: userPublic(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

function getMe(req, res) {
  return res.json({
    success: true,
    data: { user: req.user },
  });
}

async function refreshToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const oldToken = authHeader.slice(7).trim();
    const decoded = jwt.verify(oldToken, config.jwtSecret);
    const userId = decoded.userId ?? decoded.sub;

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    const token = signToken(user);
    return res.json({
      success: true,
      data: {
        user: userPublic(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe,
  refreshToken,
};
