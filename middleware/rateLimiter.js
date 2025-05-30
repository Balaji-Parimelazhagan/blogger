const rateLimit = {};
const WINDOW_SIZE = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

module.exports = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  if (!rateLimit[ip]) {
    rateLimit[ip] = [];
  }
  // Remove old timestamps
  rateLimit[ip] = rateLimit[ip].filter(ts => now - ts < WINDOW_SIZE);
  if (rateLimit[ip].length >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many registration attempts. Please try again later.' });
  }
  rateLimit[ip].push(now);
  next();
}; 