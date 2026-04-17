const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const config = require("./config");
const prisma = require("./prisma");
const errorHandler = require("./middleware/errorHandler");
const mountRoutes = require("./routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

mountRoutes(app);

const frontendDir = path.join(__dirname, "../../frontend");
app.use(express.static(frontendDir));

app.use(errorHandler);

async function start() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

start();
