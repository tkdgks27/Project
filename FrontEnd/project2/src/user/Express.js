const express = require("express");
const oracledb = require("oracledb");
const app = express();
const PORT = 3001;

app.use(express.json());

const dbConfig = {
  user: "sdedu",
  password: "sdedu",
  connectString: "sdgn-djvemfu.tplinkdns.com:19195/xe", // e.g., 'localhost:1521/your_sid'
};

app.post("/api/signup", async (req, res) => {
  const { username, password, email } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // 데이터베이스에 새 회원 추가
    await connection.execute(
      `INSERT INTO members (username, password, email) VALUES (:username, :password, :email)`,
      { username, password, email },
      { autoCommit: true }
    );

    res.json({ success: true, message: "Sign up successful" });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
