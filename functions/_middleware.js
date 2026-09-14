// Pre-launch gate for HorseBreeding.ai
//
// Public hostnames (apex + www) get a construction page on every path.
// Every other hostname serving this Pages project -- horsebreeding-ai.pages.dev,
// and any preview/demo subdomain added later -- serves the real site untouched.
//
// Crawling is deliberately left ALLOWED. The construction responses carry
// X-Robots-Tag: noindex, which is what lets Google recrawl the 38 previously
// indexed URLs, see the noindex, and drop them. Blocking crawlers in robots.txt
// instead would leave the old entries stranded in the index.
//
// To lift the gate: delete this file (and restore sitemap.xml).

const GATED_HOSTS = ["horsebreeding.ai", "www.horsebreeding.ai"];

// Paths that must stay reachable on the gated hostnames.
// Search Console verification and .well-known must not be swallowed, or we lose
// the ability to manage the property and request removals.
const PASSTHROUGH = [
  "/google6c73ac9707a26184.html",
  "/google6c73ac9707a26184"
];

const ROBOTS = "User-agent: *\nAllow: /\n";

const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>HorseBreeding.ai &mdash; Coming Soon</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap">
<style>
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{
    min-height:100vh;min-height:100dvh;
    display:flex;align-items:center;justify-content:center;
    padding:32px 24px;
    background:#12100e;color:#f2ede6;
    font-family:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
    text-align:center;line-height:1.5;
  }
  main{max-width:34rem}
  .mark{
    font-size:11px;letter-spacing:.18em;text-transform:uppercase;
    color:#c9a227;font-weight:600;margin-bottom:18px;
  }
  h1{font-size:clamp(28px,7vw,46px);font-weight:800;margin:0 0 16px;letter-spacing:-.01em}
  .rule{width:56px;height:2px;background:#c9a227;margin:0 auto 20px}
  p{font-size:clamp(15px,4vw,17px);margin:0 0 14px;color:#cdc5ba}
  a{color:#c9a227;text-decoration:none;font-weight:600}
  a:hover,a:focus{text-decoration:underline}
  footer{margin-top:28px;font-size:13px;color:#8c857c}
</style>
</head>
<body>
<main>
  <div class="mark">Coming Soon</div>
  <h1>HorseBreeding.ai</h1>
  <div class="rule"></div>
  <p>This site is under construction and will launch shortly.</p>
  <p>For inquiries, contact <a href="https://www.bridleandbit.com">Bridle &amp; Bit Magazine</a>.</p>
  <footer>&copy; 2026 Bridle &amp; Bit Magazine</footer>
</main>
</body>
</html>`;

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (GATED_HOSTS.includes(url.hostname) && !PASSTHROUGH.includes(url.pathname) && !url.pathname.startsWith("/.well-known/")) {
    if (url.pathname === "/robots.txt") {
      return new Response(ROBOTS, {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=300"
        }
      });
    }

    return new Response(PAGE, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
        "cache-control": "no-store"
      }
    });
  }

  // Non-gated hostnames: serve the real site, but keep it out of the index so
  // the preview URL never competes with or duplicates horsebreeding.ai.
  const res = await context.next();
  const out = new Response(res.body, res);
  out.headers.set("x-robots-tag", "noindex, nofollow");
  return out;
}
