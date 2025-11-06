import  { createClient } from "redis";

export const redisClient = createClient({
  // eslint-disable-next-line no-undef
  url: process.env.REDIS_URL
});

redisClient.on("connect", () => {
  console.log("✅ Redis Client connected");
});

redisClient.on("ready", () => {
  console.log("🚀 Redis ready to use");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

// ✅ Connect once at startup
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
  }
})();
