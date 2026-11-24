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
        const tgData = await tgRes.json();
        return new Response(JSON.stringify(tgData), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 });
      }
    }
    return env.ASSETS.fetch(request);
  }
};

