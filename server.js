const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const PORT = 8881;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Підключення до PostgreSQL
const pool = new Pool({
  user: "testuser",       // твій юзер PostgreSQL
  host: "localhost",
  database: "testdb",     // твоя база
  password: "your_password", // заміни на свій пароль
  port: 5432,
});

// ✅ Тестове API
app.get("/api", (req, res) => {
  res.json({ message: "API is working!" });
});

// ✅ POST: Зберегти дані з форми
app.post("/api/contact", async (req, res) => {
  try {
    const { firstName, lastName, birthDate, email } = req.body;

    // Перевірка обов'язкових полів
    if (!firstName || !lastName || !birthDate || !email) {
      return res.status(400).json({ error: "Усі поля є обов’язковими" });
    }

    // Запис у таблицю users
    await pool.query(
      "INSERT INTO users (first_name, last_name, birth_date, email) VALUES ($1, $2, $3, $4)",
      [firstName, lastName, birthDate, email]
    );

    res.json({ success: true, message: "Дані збережені!" });
  } catch (error) {
    console.error("Помилка при збереженні:", error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "Email вже існує" });
    }
    res.status(500).json({ success: false, error: "Помилка сервера" });
  }
});

// ✅ GET: Отримати список користувачів
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Помилка при отриманні користувачів:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// ✅ Webhook (опційно)
app.post("/webhook", (req, res) => {
  console.log("Webhook отримав дані:", req.body);
  res.sendStatus(200);
});

// ✅ Запуск сервера
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

