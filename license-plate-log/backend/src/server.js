const express = require("express");
const path = require("path");
const apiRoutes = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.disable("x-powered-by");
app.use(express.json({ limit: "512kb" }));
app.use("/api", apiRoutes);

const frontendDir = path.join(__dirname, "../../frontend");
app.use(express.static(frontendDir));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`License plate log server at http://localhost:${PORT}`);
});
