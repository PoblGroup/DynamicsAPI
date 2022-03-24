import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";

import occupancyRoutes from "./routes/occupancyRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import hsRoutes from "./routes/hsRoutes.js";

const router = express.Router();

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", router);

router.get("/", function (req, res) {
  const __dirname = path.resolve();
  res.sendFile(path.join(__dirname + "/index.html"));
});

// ROUTES
// app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/occupancies", occupancyRoutes);
app.use("/api/properties", propertyRoutes);

app.use("/api/hs", hsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
