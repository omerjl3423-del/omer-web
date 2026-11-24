export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    let target = (req.body.target || "").replace(/^https?:\/\//i, "").split("/")[0].trim();
    const r = await fetch("https://" + target, { method: "HEAD", redirect: "follow" });
    const srv = (r.headers.get("server") || "").toLowerCase();
    const isCf = r.headers.has("cf-ray") || srv.includes("cloudflare");
    const isBig = srv.includes("gws") || srv.includes("sffe") || target.endsWith("google.com");
    return res.status(200).json({ ok: true, target, isCf, isBig, srv: r.headers.get("server") || "Gizli" });
  } catch (e) {
    return res.status(200).json({ ok: false });
  }
}
