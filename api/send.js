export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  const { name, contact, service, message } = req.body || {};
  try {
    if (process.env.CF_ACCOUNT_ID && process.env.CF_API_TOKEN) {
      await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/d1/database/6e57df76-4a0a-4f7f-b6d4-cbf88077d0f5/query`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.CF_API_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ sql: "INSERT INTO mesajlar (name, contact, service, message) VALUES (?, ?, ?, ?)", params: [name || "", contact || "", service || "", message || ""] })
      });
    }
    const base = `https://api.telegram.org./bot${process.env.TELEGRAM_BOT_TOKEN}`;
    let chatId = (process.env.TELEGRAM_CHAT_ID || "").trim();
    const upd = await fetch(`${base}/getUpdates`).then(r => r.json()).catch(() => null);
    if (upd?.result?.length) chatId = upd.result[upd.result.length - 1].message?.chat?.id || chatId;
    const text = `🚀 Yeni Sipariş/Mesaj!\n👤 İsim: ${name}\n📱 İletişim: ${contact}\n🛠️ Hizmet: ${service}\n💬 Mesaj: ${message}`;
    const tg = await fetch(`${base}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    const tgData = await tg.json();
    if (!tg.ok) console.error("TG_HATA:", tgData);
    return res.status(200).json({ ok: tg.ok });
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
}
