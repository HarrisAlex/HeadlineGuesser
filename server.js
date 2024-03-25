const express = require('express');
const app = express();
const port = 3100;

const questionBank = require("./questionBank.json");
const languages = require("./languages.json").languages;

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
app.post("/api/languages", (req, res) => {
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
// Outgoing: { status, question, answer choices }
app.post("/api/question", (req, res) => {
    const { language } = req.body;

    if (!language) {
        return res.status(400).json({ message: "Invalid language" });
    }

    if (!isValidLanguage(language)) {
        return res.status(400).json({ message: "Invalid language" });
    }

    let question = getRandomQuestion(language);

    if (!question) {
        return res.status(500).json({ message: "Error getting question" });
    }

   return res.status(200).json({ question: question.question, choices: question.answers });
});

// +==================================+
// |           Answer API             |
// +==================================+
// Incoming: { question, answer }
// Outgoing: { status, correct }
app.post("/api/answer", (req, res) => {
    const { language, question, answer } = req.body;

    if (!language) {
        return res.status(400).json({ message: "Invalid language" });
    }

    if (!isValidLanguage(language)) {
        return res.status(400).json({ message: "Invalid language" });
    }

    if (!question || !answer) {
        return res.status(400).json({ message: "Invalid question or answer" });
    }

    return res.status(200).json({ correct: isCorrectAnswer(language, question, answer) });
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

function isValidLanguage(language) {
    return languages.includes(language);
}

function getRandomQuestion(language) {
    if (!isValidLanguage(language)) {
        return null;
    }
    
    let questionSet = getQuestionSet(language);

    if (!questionSet)
        return null;

    return questionSet.questions[Math.floor(Math.random() * questionSet.questions.length)];
}

function isCorrectAnswer(language, question, chosenAnswer) {
    if (!isValidLanguage(language)) {
        return false;
    }

    let correct = false;
    let selectedQuestion;

    getQuestionSet(language).questions.some((q) => {
        if (q.question === question) {
            selectedQuestion = q;
            return true;
        }
    });

    return selectedQuestion.correct === chosenAnswer.toLowerCase();
}

function getQuestionSet(language) {
    let questionSet;
    questionBank.languageQuestionSets.some((set) => {
        if (set.language === language) {
            questionSet = set;
            return true;
        }
    });

    return questionSet;
}