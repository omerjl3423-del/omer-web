export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/api/send") {
      try {
        const data = await request.json();
        const token = "9065128822:AAECKfppUqa1bO6zjiQmRM3PUhmWs52DtTo";
        const chatId = "8963684508";
        const text = "🚀 YENİ SİTE SİPARİŞİ\n\n👤 Gönderen: " + data.name + "\n📞 İletişim: " + data.contact + "\n🛠 Hizmet: " + data.service + "\n📝 Mesaj: " + data.message;
        const tgUrl = ["https://", "api.", "telegram.org/", "bot", token, "/sendMessage"].join("");
        const tgRes = await fetch(tgUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: text })
        });
        return new Response(JSON.stringify(await tgRes.json()), { headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 });
      }
    }
    if (request.method === "POST" && url.pathname === "/api/scan") {
      try {
        let { target } = await request.json();
        target = target.replace(/^https?:\/\//i, "").split("/")[0].trim();
        const res = await fetch("https://" + target, { method: "HEAD", redirect: "follow" });
        const srv = (res.headers.get("server") || "").toLowerCase();
        const isCf = res.headers.has("cf-ray") || srv.includes("cloudflare");
        const isBig = srv.includes("gws") || srv.includes("sffe") || target.endsWith("google.com");
        const hasHsts = res.headers.has("strict-transport-security");
        return new Response(JSON.stringify({ ok: true, target, isCf, isBig, hasHsts, srv: res.headers.get("server") || "Gizli" }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false }), { headers: { "Content-Type": "application/json" } });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
