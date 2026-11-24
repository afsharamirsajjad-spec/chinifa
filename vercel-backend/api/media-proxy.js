const https = require("https");
const http = require("http");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Range, Accept, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  let targetUrl = req.query.url;
  if (!targetUrl && req.query.path) {
    targetUrl = "https://media.kanchinese.app/" + String(req.query.path).replace(/^\/+/, "");
  }

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const parsed = new URL(targetUrl);
    if (!parsed.hostname.endsWith("kanchinese.app")) {
      return res.status(403).json({ error: "Disallowed domain" });
    }

    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://kanchinese.app/"
      }
    };

    if (req.headers.range) {
      options.headers.range = req.headers.range;
    }

    const client = parsed.protocol === "https:" ? https : http;
    const proxyReq = client.get(targetUrl, options, (proxyRes) => {
      res.status(proxyRes.statusCode);
      const headersToForward = [
        "content-type",
        "content-length",
        "content-range",
        "accept-ranges",
        "last-modified",
        "etag"
      ];
      for (const h of headersToForward) {
        if (proxyRes.headers[h]) {
          res.setHeader(h, proxyRes.headers[h]);
        }
      }
      res.setHeader("Cache-Control", "public, max-age=604800, immutable");

      proxyRes.pipe(res);
    });

    proxyReq.on("error", (err) => {
      if (!res.headersSent) {
        res.status(502).json({ error: "Proxy upstream error", message: err.message });
      }
    });
  } catch (err) {
    return res.status(400).json({ error: "Invalid URL", message: err.message });
  }
};
