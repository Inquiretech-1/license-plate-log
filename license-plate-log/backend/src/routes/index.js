const plateRoutes = require("./plateRoutes");
const authRoutes = require("./authRoutes");

/** Mount API route modules on the Express app. */
function mountRoutes(app) {
  app.use("/api/plates", plateRoutes);
  app.use("/api/auth", authRoutes);
}

module.exports = mountRoutes;
