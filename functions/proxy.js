export async function onRequestGet({ request }) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) return new Response("Missing ?url=", { status: 400 });
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    return new Response(await r.text(), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return new Response(e.message, { status: 502 });
  }
}
