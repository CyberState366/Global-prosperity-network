const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const dataDir = path.join(root, "data");
const dataFile = path.join(dataDir, "analytics.json");
const port = Number(process.env.PORT || 3000);
const adminUser = process.env.ADMIN_USER || "Admin";
const adminPass = process.env.ADMIN_PASS || "change-this-password";
const sessions = new Set();

function ensureData() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({ visits: [] }, null, 2));
}

function readData() {
  ensureData();
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeData(data) {
  ensureData();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1000000) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function isAuthorized(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return sessions.has(token);
}

function visitorStats(visits) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const stats = { today: 0, lastWeek: 0, oneMonth: 0, twoMonths: 0, threeMonths: 0, oneYear: 0 };

  for (const visit of visits) {
    const time = visit.date;
    if (!time) continue;
    if (time >= today.getTime()) stats.today += 1;
    if (time >= now - 7 * day) stats.lastWeek += 1;
    if (time >= now - 30 * day) stats.oneMonth += 1;
    if (time >= now - 60 * day) stats.twoMonths += 1;
    if (time >= now - 90 * day) stats.threeMonths += 1;
    if (time >= now - 365 * day) stats.oneYear += 1;
  }

  return stats;
}

async function handleApi(req, res) {
  if (req.url === "/api/admin/login" && req.method === "POST") {
    const body = await readBody(req);
    if (body.user === adminUser && body.pass === adminPass) {
      const token = crypto.randomBytes(32).toString("hex");
      sessions.add(token);
      return sendJson(res, 200, { token });
    }
    return sendJson(res, 401, { error: "Invalid credentials" });
  }

  if (req.url === "/api/visitors/record" && req.method === "POST") {
    const body = await readBody(req).catch(() => ({}));
    const data = readData();
    data.visits.push({ date: Date.now(), path: String(body.path || "/"), ip: req.socket.remoteAddress });
    writeData(data);
    return sendJson(res, 200, { ok: true });
  }

  if (req.url === "/api/admin/visitors" && req.method === "GET") {
    if (!isAuthorized(req)) return sendJson(res, 401, { error: "Unauthorized" });
    const data = readData();
    return sendJson(res, 200, { stats: visitorStats(data.visits) });
  }

  return sendJson(res, 404, { error: "Not found" });
}

function serveStatic(req, res) {
  const requested = decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.normalize(path.join(root, requested === "/" ? "index.html" : requested));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      return res.end("Not found");
    }
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml"
    };
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    res.end(content);
  });
}

http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    handleApi(req, res).catch(() => sendJson(res, 500, { error: "Server error" }));
  } else {
    serveStatic(req, res);
  }
}).listen(port, () => {
  console.log(`Global Prosperity Network running at http://localhost:${port}`);
  console.log("Set ADMIN_USER and ADMIN_PASS environment variables before production use.");
});