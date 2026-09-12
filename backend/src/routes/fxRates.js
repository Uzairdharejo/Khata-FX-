const express = require('express');
const router = express.Router();

let cachedRates = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60 * 60 * 1000;

router.get('/', async (req, res) => {
  const now = Date.now();
  if (cachedRates && now - cachedAt < CACHE_TTL_MS) {
    return res.json({ rates: cachedRates, cached: true });
  }

  try {
    const response = await fetch(
      `https://api.exchangerate.host/latest?base=PKR&access_key=${process.env.FX_API_KEY}`
    );
    const data = await response.json();

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
      return res.json({ rates: cachedRates, cached: true, stale: true });
    }
    res.status(503).json({ error: 'FX rates unavailable and no cache exists yet' });
  }
});

module.exports = router;
