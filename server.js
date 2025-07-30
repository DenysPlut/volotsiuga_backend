import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "API is working!" });
});

app.post("/api/contact", (req, res) => {
  console.log(req.body);
  res.json({ success: true });
});

// ✅ Додаємо webhook endpoint
app.post("/webhook", (req, res) => {
  console.log("Webhook отримав дані:", req.body);
  res.sendStatus(200);
});

app.listen(8881, () => console.log("Backend running on port 8881"));
