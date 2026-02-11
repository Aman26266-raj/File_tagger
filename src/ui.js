const http = require("http");
const { listAllTags } = require("./store");

function renderHtml(tagsByFile) {
  const data = JSON.stringify(tagsByFile);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>File Tagger UI</title>
    <style>
      :root {
        color-scheme: light;
        font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
        background: #f5f1e6;
        color: #1f1b16;
      }
      body {
        margin: 0;
        padding: 24px;
        background: radial-gradient(circle at top, #fdf7e8, #efe4cc);
      }
      header {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
      }
      h1 {
        margin: 0;
        font-size: 2.2rem;
        letter-spacing: 0.5px;
      }
      input {
        padding: 10px 12px;
        border: 2px solid #1f1b16;
        border-radius: 10px;
        font-size: 1rem;
        background: #fffaf0;
      }
      .grid {
        display: grid;
        gap: 16px;
      }
      .card {
        background: #fffaf0;
        border: 2px solid #1f1b16;
        border-radius: 16px;
        padding: 16px;
        box-shadow: 6px 6px 0 #1f1b16;
      }
      .file {
        font-weight: 700;
        margin-bottom: 8px;
        word-break: break-all;
      }
      .tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin: 4px 6px 0 0;
        padding: 4px 8px;
        border-radius: 999px;
        background: #1f1b16;
        color: #fffaf0;
        font-size: 0.85rem;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>File Tagger</h1>
      <div>Search tags using key or value keywords.</div>
      <input id="filter" placeholder="Filter tags..." />
    </header>
    <main class="grid" id="cards"></main>
    <script>
      const data = ${data};
      const cards = document.getElementById("cards");
      const filter = document.getElementById("filter");

      function render(query) {
        const q = query.trim().toLowerCase();
        cards.innerHTML = "";
        const entries = Object.entries(data);
        if (!entries.length) {
          cards.innerHTML = "<div>No tags yet. Add tags with the CLI.</div>";
          return;
        }

        for (const [file, tags] of entries) {
          const tagPairs = Object.entries(tags).map(([k, v]) => `${k}=${v}`);
          const searchable = `${file} ${tagPairs.join(" ")}`.toLowerCase();
          if (q && !searchable.includes(q)) {
            continue;
          }

          const card = document.createElement("section");
          card.className = "card";
          const fileEl = document.createElement("div");
          fileEl.className = "file";
          fileEl.textContent = file;
          card.appendChild(fileEl);

          for (const pair of tagPairs) {
            const tagEl = document.createElement("span");
            tagEl.className = "tag";
            tagEl.textContent = pair;
            card.appendChild(tagEl);
          }

          cards.appendChild(card);
        }
      }

      filter.addEventListener("input", (event) => {
        render(event.target.value);
      });

      render("");
    </script>
  </body>
</html>`;
}

function startUi({ port }) {
  const server = http.createServer((req, res) => {
    if (req.url !== "/") {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const html = renderHtml(listAllTags());
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });

  server.listen(port, () => {
    console.log(`File Tagger UI running at http://localhost:${port}`);
  });
}

module.exports = { startUi };
