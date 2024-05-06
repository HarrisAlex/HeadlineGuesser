const express = require('express');
const app = express();
const port = 3100;

const questionBank = require("./questionBank.json");
const languages = require("./languages.json").languages;

// Database
const db = require('./database.js');
const { ok } = require('assert');

app.use(express.json());

app.listen(port, () => {
    console.log("Express server listening at localhost: " + port);
});

app.get("/", (req, res) => {
    res.send("This is the API! :)");
});

// +==================================+
// |          Language API            |
// +==================================+
// Incoming: { }
// Outgoing: { status, langauge }
app.get("/api/languages", (req, res) => {
    return res.status(200).json({ languages: [
        { language: "english", display: "English" },
        { language: "spanish", display: "Español" },
        { language: "french", display: "Français" },
    ] });
});

// +==================================+
// |           Login API              |
// +==================================+
// Incoming: { username, pass }
// Outgoing: { status, message }
app.post("/api/login", (req, res) => {
    const { email, pass } = req.body;

    if (!email || !pass) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    const data = sanitizeData({ email, pass });

    const sql = "CALL validate_user(?, ?)";
    const params = [data.email, data.pass];

    db.query(sql, params, function(err, result) {
        if (err) {
            return res.status(400).json({ message: `SQL database error ${err}` });
        }

        const response = result[0][0];

        console.log(response);

        if (response.RESPONSE_STATUS === "ERROR") {
            return res.status(400).json({ message: response.RESPONSE_MESSAGE });
        }

        return res.status(200).json({ message: "Login successful!" });
    }); 
});

// +==================================+
// |            Signup API            |
// +==================================+
// Incoming: { username, pass }
// Outgoing: { status, message }
app.post("/api/signup", (req, res) => {
    const { email, username, pass } = req.body;

    if (!email || !username || !pass) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    const data = sanitizeData({ email, username, pass});

    const sql = "CALL insert_user_login(?, ?, ?)";
    const params = [data.email, data.username, data.pass];

    db.query(sql, params, function(err, result) {
        if (err) {
            return res.status(400).json({message: `SQL database error ${err}`});
        }

        const response = result[0][0];

        if (response.RESPONSE_STATUS === "ERROR") {
            return res.status(400).json({ message: response.RESPONSE_MESSAGE });
        }

        return res.status(200).json({ message: "Signup successful!" });
    });
});

app.get("/api/users", (req, res) => {
    const sql = "SELECT * FROM USER_LOGIN";

    db.query(sql, function(err, result) {
        if (err) {
            return res.status(400).json({ message: `SQL database error ${err}` });
        }

        return res.status(200).json({ message: "success", users: result });
    });
});

// +==================================+
// |           Question API           |
// +==================================+
// Incoming: { language }
// Outgoing: { status, question, question index, answer choices }
app.post("/api/question", (req, res) => {
    const { language } = req.body;

    if (!isValidLanguage(language)) {
        return res.status(400).json({ message: "Invalid language" });
    }

    let randomQuestion = getRandomQuestion(language);

    if (!randomQuestion) {
        return res.status(500).json({ message: "Error getting question" });
    }

   return res.status(200).json({ questionString: randomQuestion.question.question, question: randomQuestion.index, choices: randomQuestion.question.answers });
});

// +==================================+
// |           Answer API             |
// +==================================+
// Incoming: { language, question, answer }
// Outgoing: { status, correct }
app.post("/api/answer", (req, res) => {
    const { language, question, answer } = req.body;

    if (!isValidLanguage(language)) {
        return res.status(400).json({ message: "Invalid language" });
    }

    if (question < 0 || answer < 0) {
        return res.status(400).json({ message: "Invalid question or answer" });
    }

    return res.status(200).json({ correct: isCorrectAnswer(language, question, answer) });
});

// +==================================+
// |        Leaderboard API           |
// +==================================+
// Incoming: { }
// Outgoing: { status, leaderboard }
app.get("/api/leaderboard", (req, res) => {
    const sql = "CALL get_leaderboard()";

    db.query(sql, function(err, result) {
        if (err) {
            return res.status(400).json({ message: `SQL database error ${err}` });
        }

        return res.status(200).json({ leaderboard: result[0] });
    });
});

// +==================================+
// |            Score API             |
// +==================================+
// Incoming: { }
// Outgoing: { status, leaderboard }
app.post("/api/update_score", (req, res) => {
    const { token, score } = req.body;

    if (!token || !score) {
        return res.status(400).json({ message: "Invalid token or score" });
    }

    const data = sanitizeData({ token, score });

    const sql = "CALL update_score(?, ?)";
    const params = [data.token, data.score];

    db.query(sql, params, function(err, result) {
        if (err) {
            return res.status(400).json({ message: `SQL database error ${err}` });
        }

        const response = result[0][0];

        if (response.RESPONSE_STATUS === "ERROR") {
            return res.status(400).json({ message: response.RESPONSE_MESSAGE });
        }

        return res.status(200).json({ message: response.RESPONSE_MESSAGE });
    });
});

function sanitizeData(data) {
    if (typeof(data) === "string") {
        return data
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/'/g, "&''");
    } else if (Array.isArray(data)) {
        return data.map((item) => sanitizeData(item));
    } else if (typeof(data) === "object" && data != null) {
        const sanitizedObject = {};
        for (const key in data) {
            sanitizedObject[key] = sanitizeData(data[key]);
        }

        return sanitizedObject;
    }

    return data;
}

function getRandomQuestion(language) {
    let questionSet = getQuestionSet(language);

    if (!questionSet)
        return null;

    let index = Math.floor(Math.random() * questionSet.questions.length);

    return {
        question: questionSet.questions[index],
        index: index
    };
}

function isValidLanguage(language) {
    return language >= 0 && language < languages.length;
}

function isCorrectAnswer(language, question, answer) {
    let questionSet = getQuestionSet(language);

    if (!questionSet || question > questionSet.questions.length || answer > questionSet.questions[question].answers.length)
        return false;

    return questionSet.questions[question].correct === answer;
}

function getQuestionSet(language) {
    return questionBank.languageQuestionSets[language];
}