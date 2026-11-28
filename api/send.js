export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  const { name, contact, service, message } = req.body || {};
  try {
    const workerUrl = ["https:", "", "omer-web.omerjl3423.workers.dev", "api", "send"].join("/");
    await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact, service, message })
    });
    const base = ["https:", "", "api.telegram.org", "bot" + process.env.TELEGRAM_BOT_TOKEN].join("/");
    let chatId = (process.env.TELEGRAM_CHAT_ID || "").trim();
    const upd = await fetch(`${base}/getUpdates`).then(r => r.json()).catch(() => null);
    if (upd?.result?.length) chatId = upd.result[upd.result.length - 1].message?.chat?.id || chatId;
    const text = `🚀 Yeni Sipariş/Mesaj!\n👤 İsim: ${name}\n📱 İletişim: ${contact}\n🛠️ Hizmet: ${service}\n💬 Mesaj: ${message}`;
    const tg = await fetch(`${base}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    return res.status(200).json({ ok: tg.ok });
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
}
