const express = require('express');
const app = express();
const port = 3100;

app.use(express.json());

app.listen(port, () => {
    console.log("Express server listening at localhost: " + port);
});

app.get("/", (req, res) => {
    res.send("This is the API! :)");
});

// +==================================+
// |           Login API              |
// +==================================+
// Incoming: { username, pass }
// Outgoing: { status, message }
app.post("/api/login", (req, res) => {
    const { username, pass } = req.body;

    if (!username || !pass) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    return res.status(200).json({ message: "Login successful!" });
});

// +==================================+
// |            Signup API            |
// +==================================+
// Incoming: { username, pass }
// Outgoing: { status, message }
app.post("/api/signup", (req, res) => {
    const { username, pass } = req.body;

    if (!username || !pass) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    return res.status(200).json({ message: "Signup successful!" });
});

// +==================================+
// |           Question API           |
// +==================================+
// Incoming: { }
// Outgoing: { status, question }
app.post("/api/question", (req, res) => {
   return res.status(200).json({ question: "What is the capital of France?" });
});

// +==================================+
// |           Answer API             |
// +==================================+
// Incoming: { question, answer }
// Outgoing: { status, correct }
app.post("/api/answer", (req, res) => {
    const { question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).json({ message: "Invalid question or answer" });
    }

    return res.status(200).json({ correct: answer.toLowerCase() === "paris" });
});

// +==================================+
// |        Leaderboard API           |
// +==================================+
// Incoming: { }
// Outgoing: { status, leaderboard }
app.post("/api/leaderboard", (req, res) => {
    return res.status(200).json({ leaderboard: [
        { username: "user1", score: 100 },
        { username: "user2", score: 90 },
        { username: "user3", score: 80 },
        { username: "user4", score: 70 },
        { username: "user5", score: 60 },
    ] });
});