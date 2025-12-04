import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

redis.on("connect", () => console.log("✅ Redis Connected"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));

export default redis;