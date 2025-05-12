import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2";

const pool = mysql.createPool({
  host: "mysql",
  user: "root",
  password: "mysql123",
  database: "bank",
  port: 3306,
});

const app = express();
const port = 3001;

// Middleware
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(bodyParser.json());

// Sessions/OTP lagras i minnet (kan flyttas till databas om du vill)
let sessions = [];

// OTP-generator
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Testroute
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Hämta alla användare (GET /users)
app.get("/users", (req, res) => {
  pool.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Databasfel vid hämtning av användare:", err);
      return res.status(500).json({ error: "Databasfel." });
    }
    res.json(results);
  });
});

// Skapa användare och konto
app.post("/users", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Användarnamn och lösenord krävs." });
  }

  // Kontrollera om användarnamnet redan finns
  pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Databasfel vid kontroll av användarnamn:", err);
        return res.status(500).json({ error: "Databasfel." });
      }
      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Användarnamnet är redan taget." });
      }

      // Skapa användaren
      pool.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (err, result) => {
          if (err) {
            console.error("Databasfel vid skapande av användare:", err);
            return res.status(500).json({ error: "Databasfel vid skapande." });
          }

          const userId = result.insertId;

          // Skapa konto
          pool.query(
            "INSERT INTO accounts (userId, amount) VALUES (?, ?)",
            [userId, 0],
            (err2) => {
              if (err2) {
                console.error("Databasfel vid skapande av konto:", err2);
                return res
                  .status(500)
                  .json({ error: "Databasfel vid kontoskapande." });
              }
              res.status(201).json({
                message: "Användare skapad!",
                user: { id: userId, username },
              });
            }
          );
        }
      );
    }
  );
});

// Logga in och skapa session/OTP
app.post("/sessions", (req, res) => {
  const { username, password } = req.body;
  pool.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        console.error("Databasfel vid inloggning:", err);
        return res.status(500).send();
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ error: "Felaktigt användarnamn eller lösenord." });
      }

      const user = results[0];
      const token = generateOTP();
      sessions.push({ userId: user.id, token });
      console.log("Engångslösenord/token skickas till frontend:", token);
      res.json({ token });
    }
  );
});

// Hämta konto för inloggad användare
app.post("/me/accounts", (req, res) => {
  const { token } = req.body;
  const session = sessions.find((s) => s.token === token);
  if (!session) return res.status(401).json({ error: "Ogiltig token." });

  pool.query(
    "SELECT * FROM accounts WHERE userId = ?",
    [session.userId],
    (err, results) => {
      if (err) {
        console.error("Databasfel vid hämtning av konto:", err);
        return res.status(500).send();
      }
      if (results.length === 0) return res.status(404).send();
      res.json(results[0]);
    }
  );
});

// Gör en transaktion (ändra saldo)
app.post("/me/accounts/transactions", (req, res) => {
  const { token, amount } = req.body;
  const session = sessions.find((s) => s.token === token);
  if (!session) return res.status(401).json({ error: "Ogiltig token." });

  pool.query(
    "SELECT * FROM accounts WHERE userId = ?",
    [session.userId],
    (err, results) => {
      if (err) {
        console.error("Databasfel vid hämtning av saldo:", err);
        return res.status(500).send();
      }
      if (results.length === 0) return res.status(404).send();

      const account = results[0];
      const newAmount = account.amount + amount;

      pool.query(
        "UPDATE accounts SET amount = ? WHERE id = ?",
        [newAmount, account.id],
        (err2) => {
          if (err2) {
            console.error("Databasfel vid uppdatering av saldo:", err2);
            return res.status(500).send();
          }
          res.json({ ...account, amount: newAmount });
        }
      );
    }
  );
});

// Starta servern
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});