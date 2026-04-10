import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import healthRoutes from "./routes/health.routes";
import { errorHandler } from "./middleware/errorHandler.middleware";

const app = express();

// When behind a reverse proxy (typical in production), req.ip must reflect the client
// (X-Forwarded-For). Otherwise express-rate-limit keys every request as the proxy IP and
// all users share one bucket → 429 Too Many Requests on normal browsing.
const trustProxyHops = process.env.TRUST_PROXY_HOPS;
if (trustProxyHops !== undefined && trustProxyHops !== "") {
  app.set("trust proxy", Number(trustProxyHops));
} else if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security middleware
app.use(helmet());

// CORS: set CORS_ORIGIN in production to your frontend URL(s), comma-separated (no trailing slashes)
const corsOriginRaw = process.env.CORS_ORIGIN ?? "http://localhost:3000";
const corsOrigins = corsOriginRaw
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);
const allowedOrigins = corsOrigins.length > 0 ? corsOrigins : ["http://localhost:3000"];

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin) return callback(null, true);
      const origin = requestOrigin.replace(/\/+$/, "");
      if (allowedOrigins.includes(origin)) return callback(null, origin);
      callback(new Error("Not allowed by CORS"));
    },
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
