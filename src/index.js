import { createServer } from "node:http";
import { hostname } from "node:os";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";

logging.set_level(logging.NONE);

Object.assign(wisp.options, {
  allow_udp_streams: false,
  hostname_blacklist: [/example\\.com/],
  dns_servers: ["1.1.1.3", "1.0.0.3"],
});

const server = createServer((req, res) => {
  // This service is intentionally backend-only: it does not serve the demo frontend.
  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("Wisp backend is running. WebSocket clients connect at /wisp/.");
});

server.on("upgrade", (req, socket, head) => {
  if (req.url?.split("?")[0] === "/wisp/") {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end("HTTP/1.1 404 Not Found\\r\\nConnection: close\\r\\n\\r\\n");
  }
});

const port = Number.parseInt(process.env.PORT || "8080", 10);
server.listen(port, "0.0.0.0", () => {
  const address = server.address();
  console.log(`Wisp backend listening on port ${address.port}`);
  console.log(`WebSocket endpoint: ws(s)://<your-render-host>/wisp/`);
});

function shutdown() {
  console.log("Closing Wisp backend...");
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
