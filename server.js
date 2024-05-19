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
            console.log(`SQL database error ${err}`);
            return res.status(500).json({ message: "Server error" });
        }

        const response = result[0][0];

        console.log(response);

        if (response.RESPONSE_STATUS === "ERROR") {
            return res.status(400).json({ message: response.RESPONSE_MESSAGE });
        }

        return res.status(200).json({ message: "Login successful!", token: response.RESPONSE_MESSAGE });
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
            console.log(`SQL database error ${err}`);
            return res.status(500).json({ message: "Server error" });
        }

        const response = result[0][0];

        if (response.RESPONSE_STATUS === "ERROR") {
            return res.status(400).json({ message: response.RESPONSE_MESSAGE });
        }

        return res.status(200).json({ message: "Signup successful!", token: response.RESPONSE_MESSAGE });
    });
});

app.get("/api/users", (req, res) => {
    const sql = "SELECT * FROM USER_LOGIN";

    db.query(sql, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({ message: "Server error" });
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
            console.log(`SQL database error ${err}`);
            return res.status(500).json({ message: "Server error" });
        }

        return res.status(200).json({ leaderboard: result[0] });
    });
});

// +==================================+
// |            Score API             |
// +==================================+
// Incoming: { token, locationCorrect, sourceCorrect, topicCorrect }
// Outgoing: { status }
app.post("/api/update_scores", (req, res) => {
    const { token, locationCorrect, sourceCorrect, topicCorrect } = req.body;

    if (!token || locationCorrect === undefined || sourceCorrect === undefined || topicCorrect === undefined) {
        return res.status(400).json({ message: "MISSING_INPUT" });
    }

    if (typeof locationCorrect !== "boolean" || typeof sourceCorrect !== "boolean" || typeof topicCorrect !== "boolean")
        return res.status(400).json({ message: "INVALID_ANSWER_FORMAT" });

    const data = sanitizeData({ token, locationCorrect, sourceCorrect, topicCorrect });

    data.locationCorrect = data.locationCorrect ? 1 : 0;
    data.sourceCorrect = data.sourceCorrect ? 1 : 0;
    data.topicCorrect = data.topicCorrect ? 1 : 0;

    const sql = "CALL update_scores(?, ?, ?, ?)";
    const params = [data.token, data.locationCorrect, data.sourceCorrect, data.topicCorrect];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({ message: "Server error" });
        }

        const response = result[0][0];

        if (response.RESPONSE_STATUS === "ERROR") {
            return res.status(400).json({ message: response.RESPONSE_MESSAGE });
        }

        return res.status(200).json({ message: response.RESPONSE_MESSAGE });
    });
});

// +==================================+
// |          Get User API            |
// +==================================+
// Incoming: { username }
// Outgoing: { status, username, dateJoined, overallLevel, streaks, accuracy, totalPlayed, levelInfo }
app.get("/api/get_user", (req, res) => {
    let id = req.query.user;
    
    const sql = "CALL get_user(?)";
    const params = [id];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({ message: "Server error" });
        }

        const response = result[0][0];

        if (response.RESPONSE_STATUS === "ERROR") {
            return res.status(400).json({ message: response.RESPONSE_MESSAGE });
        }

        const streakInfo = {
            location: response.LOCATION_STREAK,
            locationHigh: response.LOCATION_STREAK_HIGH,
            source: response.SOURCE_STREAK,
            sourceHigh: response.SOURCE_STREAK_HIGH,
            topic: response.TOPIC_STREAK,
            topicHigh: response.TOPIC_STREAK_HIGH
        };

        const accuracyInfo = {
            location: response.TOTAL_PLAYED == 0 ? 0 : parseFloat(response.LOCATION_TOTAL_CORRECT / response.TOTAL_PLAYED),
            source: response.TOTAL_PLAYED == 0 ? 0 : parseFloat(response.SOURCE_TOTAL_CORRECT / response.TOTAL_PLAYED),
            topic: response.TOTAL_PLAYED == 0 ? 0 : parseFloat(response.TOPIC_TOTAL_CORRECT / response.TOTAL_PLAYED)
        };

        const levelInfo = {
            location: response.LOCATION_LEVEL,
            source: response.SOURCE_LEVEL,
            topic: response.TOPIC_LEVEL
        };

        return res.status(200).json({ username: response.USERNAME, dateJoined: response.JOINDATE, overallLevel: response.OVERALL_LEVEL, streaks: streakInfo, accuracy: accuracyInfo, totalPlayed: response.TOTAL_PLAYED, levels: levelInfo });
    });
});

// +==================================+
// |         Get Friends API          |
// +==================================+
// Incoming: { username }
// Outgoing: { status, username, dateJoined, score, friends }
app.get("/api/get_friends", (req, res) => {
    let id = req.query.user;
    
    const sql = "CALL get_friends(?)";
    const params = [id];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({ message: "Server error" });
        }

        const response = result[0][0];

        if (response.RESPONSE_STATUS === "ERROR") {
            return res.status(400).json({ message: response.RESPONSE_MESSAGE });
        }

        if (result[0].length === 1)
            return res.status(200).json({ friends: [] });

        let friendsList = [];

        for (let i = 1; i < result[0].length; i++) {
            friendsList.push(result[0][i].FRIEND_USERNAME);
        }

        return res.status(200).json({ friends: friendsList });
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