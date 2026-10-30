'use strict';
const http = require('node:http');
const os = require('node:os');
const { URL } = require('node:url');

const PORT = Number(process.env.PORT || 3000);
const APP_NAME = process.env.APP_NAME || 'CloudOps Control Center';
const startedAt = Date.now();
let requestCount = 0;
let ready = true;
let shuttingDown = false;

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, {
    'Content-Type': `${type}; charset=utf-8`,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  });
  res.end(type === 'application/json' ? JSON.stringify(body, null, 2) : body);
}
function snapshot() {
  const mem = process.memoryUsage();
  return {
    name: APP_NAME,
    status: shuttingDown ? 'shutting-down' : 'operational',
    hostname: os.hostname(),
    platform: `${os.type()} ${os.release()}`,
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
    appUptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    requestsServed: requestCount,
    memory: {
      rssMB: +(mem.rss / 1024 / 1024).toFixed(1),
      heapUsedMB: +(mem.heapUsed / 1024 / 1024).toFixed(1),
      heapTotalMB: +(mem.heapTotal / 1024 / 1024).toFixed(1)
    },
    cpuCoresVisible: os.cpus().length,
    timestamp: new Date().toISOString()
  };
}
const server = http.createServer((req, res) => {
  requestCount += 1;
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { status: 'healthy' });
  if (req.method === 'GET' && url.pathname === '/ready') return send(res, ready && !shuttingDown ? 200 : 503, { ready: ready && !shuttingDown });
  if (req.method === 'GET' && url.pathname === '/api/status') return send(res, 200, snapshot());
  if (req.method === 'GET' && url.pathname === '/api/metrics') {
    const s = snapshot();
    return send(res, 200, { requestsServed: s.requestsServed, uptimeSeconds: s.uptimeSeconds, memory: s.memory, hostname: s.hostname });
  }
  if (req.method === 'GET' && url.pathname === '/api/info') return send(res, 200, { app: APP_NAME, endpoints: ['/health', '/ready', '/api/status', '/api/metrics', '/api/info'] });
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    const fs = require('node:fs');
    return send(res, 200, fs.readFileSync(require('node:path').join(__dirname, 'public', 'index.html'), 'utf8'), 'text/html');
  }
  return send(res, 404, { error: 'Not found', path: url.pathname });
});
server.listen(PORT, '0.0.0.0', () => console.log(`${APP_NAME} listening on 0.0.0.0:${PORT}; hostname=${os.hostname()}`));
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  ready = false;
  console.log(`${signal} received; stopping gracefully`);
  server.close(() => { console.log('HTTP server closed'); process.exit(0); });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
