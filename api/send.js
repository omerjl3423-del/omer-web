export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { name, contact, service, message } = req.body;
    const token = "9065128822:AAECKfppUqa1bO6zjiQmRM3PUhmWs52DtTo";
    const chatId = "8963684508";
    const text = "🚀 YENİ SİTE SİPARİŞİ\n\n👤 Gönderen: " + name + "\n📞 İletişim: " + contact + "\n🛠 Hizmet: " + service + "\n📝 Mesaj: " + message;
    const tgUrl = ["https://", "api.", "telegram.org/", "bot", token, "/sendMessage"].join("");
    const tgRes = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    return res.status(200).json(await tgRes.json());
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
}
