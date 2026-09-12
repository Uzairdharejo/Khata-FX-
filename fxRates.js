const express = require('express');
const router = express.Router();

// In-memory cache so we don't hit the FX API on every request.
// For production, replace with a proper cache (Redis) or a daily cron job
// that writes rates into a Postgres table, since traders need last-known
// rates even when this server or their connection is down.
let cachedRates = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

router.get('/', async (req, res) => {
  const now = Date.now();
  if (cachedRates && now - cachedAt < CACHE_TTL_MS) {
    return res.json({ rates: cachedRates, cached: true });
  }

  try {
    // Replace with your actual FX_API_KEY provider, e.g.:
    // https://openexchangerates.org/api/latest.json?app_id=YOUR_KEY&base=PKR
    const response = await fetch(
      `https://api.exchangerate.host/latest?base=PKR&access_key=${process.env.FX_API_KEY}`
    );
    const data = await response.json();

    // Convert PKR-based rates to "1 unit of foreign currency = X PKR"
    cachedRates = {
      USD: 1 / data.rates.USD,
      AED: 1 / data.rates.AED,
      CNY: 1 / data.rates.CNY,
      PKR: 1,
    };
    cachedAt = now;
    res.json({ rates: cachedRates, cached: false });
  } catch (err) {
    console.error('FX rate fetch failed:', err.message);
    if (cachedRates) {
      // Serve stale rates rather than failing outright
      return res.json({ rates: cachedRates, cached: true, stale: true });
    }
    res.status(503).json({ error: 'FX rates unavailable and no cache exists yet' });
  }
});

module.exports = router;
