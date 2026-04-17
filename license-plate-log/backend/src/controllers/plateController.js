const { PrismaClientKnownRequestError } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
const prisma = require("../prisma");

const SORT_FIELDS = ["createdAt", "plateText", "id", "cameraId"];

function buildListWhere(query) {
  const where = {};

  if (query.cameraId) {
    where.cameraId = String(query.cameraId);
  }

  if (query.plateText) {
    where.plateText = {
      contains: String(query.plateText),
      mode: "insensitive",
    };
  }

  if (query.dateFrom || query.dateTo) {
    where.createdAt = {};
    if (query.dateFrom) {
      where.createdAt.gte = new Date(query.dateFrom);
    }
    if (query.dateTo) {
      where.createdAt.lte = new Date(query.dateTo);
    }
  }

  return where;
}

async function listPlates(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    let sortBy = req.query.sortBy || "createdAt";
    if (!SORT_FIELDS.includes(sortBy)) sortBy = "createdAt";
    const order =
      String(req.query.sortOrder || "desc").toLowerCase() === "asc" ? "asc" : "desc";

    const where = buildListWhere(req.query);

    const [items, total] = await prisma.$transaction([
      prisma.plate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.plate.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 0,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getPlate(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid plate id" });
    }

    const plate = await prisma.plate.findUnique({ where: { id } });
    if (!plate) {
      return res.status(404).json({ success: false, error: "Plate not found" });
    }

    return res.json({ success: true, data: plate });
  } catch (err) {
    next(err);
  }
}

async function createPlate(req, res, next) {
  try {
    await body("plateText").trim().notEmpty().withMessage("plateText is required").run(req);
    await body("confidence").optional().isFloat().run(req);
    await body("cameraId").optional().isString().run(req);
    await body("imagePath").optional().isString().run(req);
    await body("notes").optional().isString().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
      });
    }

    const { plateText, confidence, cameraId, imagePath, notes } = req.body;

    const plate = await prisma.plate.create({
      data: {
        plateText: String(plateText).trim(),
        confidence:
          confidence === undefined || confidence === null || confidence === ""
            ? null
            : Number(confidence),
        cameraId: cameraId || null,
        imagePath: imagePath || null,
        notes: notes || null,
        userId: req.user ? req.user.id : null,
      },
    });

    return res.status(201).json({ success: true, data: plate });
  } catch (err) {
    next(err);
  }
}

async function updatePlate(req, res, next) {
  try {
    await body("plateText").optional().trim().notEmpty().withMessage("plateText cannot be empty").run(req);
    await body("confidence").optional().isFloat().run(req);
    await body("cameraId").optional().isString().run(req);
    await body("imagePath").optional().isString().run(req);
    await body("notes").optional().isString().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
      });
    }

    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid plate id" });
    }

    const existing = await prisma.plate.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Plate not found" });
    }

    const payload = {};
    if (req.body.plateText !== undefined) payload.plateText = String(req.body.plateText).trim();
    if (req.body.confidence !== undefined) {
      payload.confidence =
        req.body.confidence === null || req.body.confidence === ""
          ? null
          : Number(req.body.confidence);
    }
    if (req.body.cameraId !== undefined) payload.cameraId = req.body.cameraId || null;
    if (req.body.imagePath !== undefined) payload.imagePath = req.body.imagePath || null;
    if (req.body.notes !== undefined) payload.notes = req.body.notes || null;

    const plate = await prisma.plate.update({
      where: { id },
      data: payload,
    });

    return res.json({ success: true, data: plate });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ success: false, error: "Plate not found" });
    }
    next(err);
  }
}

async function deletePlate(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid plate id" });
    }

    const existing = await prisma.plate.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Plate not found" });
    }

    await prisma.plate.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ success: false, error: "Plate not found" });
    }
    next(err);
  }
}

async function searchPlates(req, res, next) {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required',
      });
    }

    const items = await prisma.plate.findMany({
      where: {
        plateText: {
          contains: q,
          mode: "insensitive",
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listPlates,
  getPlate,
  createPlate,
  updatePlate,
  deletePlate,
  searchPlates,
};
