import { createReadStream, stat } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "out");
const port = Number(process.env.PORT || 3000);
const types = {
  ".css": "text/css;charset=utf-8",
  ".html": "text/html;charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript;charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function send(filePath, response) {
  response.writeHead(200, {
    "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}

createServer((request, response) => {
  let urlPath = decodeURIComponent(request.url.split("?")[0]);
  if (urlPath === "/" || urlPath.endsWith("/")) {
    urlPath += "index.html";
  }

  const filePath = path.join(root, urlPath);
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  stat(filePath, (error, fileStat) => {
    if (!error && fileStat.isFile()) {
      send(filePath, response);
      return;
    }

    const htmlPath = path.join(root, `${urlPath.replace(/^\/+/, "")}.html`);
    stat(htmlPath, (htmlError, htmlStat) => {
      if (!htmlError && htmlStat.isFile()) {
        send(htmlPath, response);
        return;
      }

    const indexPath = path.join(root, urlPath, "index.html");
    stat(indexPath, (indexError, indexStat) => {
      if (!indexError && indexStat.isFile()) {
        send(indexPath, response);
        return;
      }

      response.writeHead(404);
      response.end("Not found");
    });
    });
  });
}).listen(port, "127.0.0.1");
