const express = require("express");
const oracledb = require("oracledb");
const app = express();
const PORT = 3000;

app.use(express.json());

// Oracle 데이터베이스 연결 설정
const dbConfig = {
  user: "sdedu",
  password: "sdedu",
  connectString: "sdgn-djvemfu.tplinkdns.com:19195/xe", // e.g., 'localhost:1521/your_sid'
};

// 회원 정보 조회 API
app.get("/api/members", async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute("SELECT * FROM members");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
