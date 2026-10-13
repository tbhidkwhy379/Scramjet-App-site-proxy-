# Scramjet Wisp backend only

This service exposes the Wisp WebSocket endpoint at `/wisp/` and does not serve the Scramjet demo frontend.

## Render setup
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- The service listens on `0.0.0.0` using Render's `PORT` environment variable.

After deployment, configure your frontend transport to use your Render URL, for example:
`wss://YOUR-RENDER-SERVICE.onrender.com/wisp/`

Do not use the GitHub Pages host as the Wisp endpoint. GitHub Pages cannot host the Wisp server.

## Important about MessagePort errors
This package removes static-file serving from the backend, but cannot guarantee a client-side `MessagePort` error is fixed by itself. That error can also result from a frontend/service-worker version mismatch, an incorrect Wisp URL, or the browser/network blocking the WebSocket. Confirm that the deployed endpoint is reachable and that the frontend's Scramjet/BareMux versions match the installed package versions.

This backend-only setup does not disguise traffic or bypass network restrictions.
