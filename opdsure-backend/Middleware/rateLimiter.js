const { StatusCodes } = require("http-status-codes");
const config = require("../Config");

let redisClient = null;

const getRedisClient = () => {
  if (redisClient) return redisClient;

  try {
    const Redis = require("ioredis");
    redisClient = new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      lazyConnect: true,
    });

    redisClient.on("error", (err) => {
      console.error("Redis connection error:", err.message);
    });

    redisClient.connect().catch((err) => {
      console.error("Redis connect failed:", err.message);
      redisClient = null;
    });

    return redisClient;
  } catch (err) {
    console.error("Redis init failed:", err.message);
    return null;
  }
};

const rateLimiter = async (req, res, next) => {
  try {
    const client = getRedisClient();

    if (!client || client.status !== "ready") {
      // FAIL CLOSED: if Redis is unavailable, reject requests
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        data: [],
        success: false,
        message: "Rate limiting service unavailable. Please try again later.",
      });
    }

    const keyId = req.apiKey.key_id;
    const limit = req.apiKey.rate_limit || 60;
    const windowSeconds = parseInt(config.RATE_LIMIT_WINDOW_SECONDS) || 60;
    const windowKey = Math.floor(Date.now() / (windowSeconds * 1000));
    const redisKey = `rate:${keyId}:${windowKey}`;

    const current = await client.incr(redisKey);

    if (current === 1) {
      await client.expire(redisKey, windowSeconds);
    }

    const remaining = Math.max(0, limit - current);
    const resetAt = (windowKey + 1) * windowSeconds;

    res.set("X-RateLimit-Limit", String(limit));
    res.set("X-RateLimit-Remaining", String(remaining));
    res.set("X-RateLimit-Reset", String(resetAt));

    if (current > limit) {
      return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        data: [],
        success: false,
        message: "Rate limit exceeded. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error.message);
    // FAIL CLOSED
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      data: [],
      success: false,
      message: "Rate limiting service error. Please try again later.",
    });
  }
};

module.exports = rateLimiter;
