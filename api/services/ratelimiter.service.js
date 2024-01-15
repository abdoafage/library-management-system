import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100,
});

export { limiter };
