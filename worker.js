export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/send" && request.method === "POST") {
      try {
        const { name, contact, service, message } = await request.json();
        if (env.DB) {
          await env.DB.prepare("INSERT INTO mesajlar (name, contact, service, message) VALUES (?, ?, ?, ?)")
            .bind(name || "", contact || "", service || "", message || "").run();
        }
        const text = `🚀 Yeni Sipariş/Mesaj!\n👤 İsim: ${name}\n📱 İletişim: ${contact}\n🛠️ Hizmet: ${service}\n💬 Mesaj: ${message}`;
        const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {)
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text })
        });
        return new Response(JSON.stringify({ ok: tg.ok }), { headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false }), { status: 500 });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
