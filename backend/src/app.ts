import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import healthRoutes from "./routes/health.routes";
import { errorHandler } from "./middleware/errorHandler.middleware";

const app = express();

// Security middleware
app.use(helmet());

// CORS: allow single origin or comma-separated list (e.g. CORS_ORIGIN=http://localhost:3000,https://app.example.com)
const corsOriginRaw = process.env.CORS_ORIGIN ?? "http://localhost:3000";
const corsOrigins = corsOriginRaw
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const corsOrigin =
  corsOrigins.length <= 1
    ? corsOrigins[0] || "http://localhost:3000"
    : corsOrigins;

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (no rate limit so probes stay reliable)
app.use("/api", healthRoutes);

// Rate limiting for the rest of /api
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api", limiter);

// Routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

export default app;
