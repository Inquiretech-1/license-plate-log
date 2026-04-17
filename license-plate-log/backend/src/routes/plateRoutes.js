const express = require("express");
const plateController = require("../controllers/plateController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/search", protect, plateController.searchPlates);
router.get("/", protect, plateController.listPlates);
router.get("/:id", protect, plateController.getPlate);
router.post("/", protect, authorize("admin", "operator"), plateController.createPlate);
router.put("/:id", protect, authorize("admin", "operator"), plateController.updatePlate);
router.delete("/:id", protect, authorize("admin", "operator"), plateController.deletePlate);

module.exports = router;
