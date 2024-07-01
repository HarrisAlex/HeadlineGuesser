const express = require('express');
const app = express();
const port = 3100;

const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
    host: "server166.web-hosting.com",
    port: 465,
    secure: true,
    auth: {
        user: "admin@minervacg.com.alexharris.design",
        pass: "e,dh{xQI40?~"
    }
});

const questionBank = require("./questionBank.json");
const languages = require("./languages.json").languages;

// Response codes
const responseCodes = {
    missingInput: "MISSING_INPUT",
    invalidAnswerFormat: "INVALID_ANSWER_FORMAT",
    serverError: "SERVER_ERROR",
    loginSuccess: "LOGIN_SUCCESS",
    signupSuccess: "SIGNUP_SUCCESS",
    invalidLanguage: "INVALID_LANGUAGE",
    invalidQuestion: "INVALID_QUESTION",
    invalidAnswer: "INVALID_ANSWER",
};

// Database
const db = require('./database.js');
const { ok } = require('assert');
const { sign } = require('crypto');

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
        return res.status(430).json({});
    }

    const data = sanitizeData({ email, pass });

    const sql = "CALL validate_user(?, ?)";
    const params = [data.email, data.pass];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        const response = result[0][0];

        if (isErrorStatus(response.RESPONSE_STATUS)) {
            return res.status(response.RESPONSE_STATUS).json({});
        }

        return res.status(response.RESPONSE_STATUS).json({ token: response.TOKEN, username: response.USERNAME});
    }); 
});

// +==================================+
// |            Signup API            |
// +==================================+
// Incoming: { username, pass }
// Outgoing: { status, message, username, token }
app.post("/api/signup", (req, res) => {
    const { email, username, pass } = req.body;

    if (!email || !username || !pass) {
        return res.status(430).json({});
    }

    const data = sanitizeData({ email, username, pass});

    const sql = "CALL insert_user_login(?, ?, ?)";
    const params = [data.email, data.username, data.pass];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        const response = result[0][0];

        if (isErrorStatus(response.RESPONSE_STATUS)) {
            return res.status(response.RESPONSE_STATUS).json({});
        }

        return res.status(response.RESPONSE_STATUS).json({ token: response.TOKEN, username: response.USERNAME });
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
        return res.status(400).json({ message: responseCodes.invalidLanguage });
    }

    let randomQuestion = getRandomQuestion(language);

    if (!randomQuestion) {
        console.log("Error getting random question");
        return res.status(500).json({});
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
        return res.status(400).json({ message: responseCodes.invalidLanguage });
    }

    if (question < 0) 
        return res.status(400).json({ message: responseCodes.invalidQuestion });
    else if (answer < 0)
        return res.status(400).json({ message: responseCodes.invalidAnswer });

    return res.status(200).json({ correct: isCorrectAnswer(language, question, answer) });
});

// +==================================+
// |        Leaderboard API           |
// +==================================+
// Incoming: { }
// Outgoing: { status, leaderboard }
app.get("/api/leaderboard", (req, res) => {
    const id = req.query.leaderboard;

    const data = sanitizeData({ id });

    const sql = "SELECT * FROM " + data.id;

    db.query(sql, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        return res.status(200).json({ leaderboard: result });
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
        return res.status(430).json({});
    }

    // Check if the answers are in the correct format
    if (typeof locationCorrect !== "boolean" || typeof sourceCorrect !== "boolean" || typeof topicCorrect !== "boolean")
        return res.status(406).json({ message: responseCodes.invalidAnswerFormat });

    const data = sanitizeData({ token, locationCorrect, sourceCorrect, topicCorrect });

    data.locationCorrect = data.locationCorrect ? 1 : 0;
    data.sourceCorrect = data.sourceCorrect ? 1 : 0;
    data.topicCorrect = data.topicCorrect ? 1 : 0;

    const sql = "CALL update_scores(?, ?, ?, ?)";
    const params = [data.token, data.locationCorrect, data.sourceCorrect, data.topicCorrect];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        const response = result[0][0];

        return res.status(response.RESPONSE_STATUS).json({});
    });
});

// +==================================+
// |          Get User API            |
// +==================================+
// Incoming: { username }
// Outgoing: { status, username, dateJoined, overallLevel, streaks, accuracy, totalPlayed, levelInfo }
app.get("/api/get_user", (req, res) => {
    const id = req.query.user;
    
    const sql = "CALL get_user(?)";
    const params = [id];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        const response = result[0][0];

        if (isErrorStatus(response.RESPONSE_STATUS)) {
            return res.status(response.RESPONSE_STATUS).json({});
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
            location: response.TOTAL_PLAYED === 0 ? 0 : parseFloat(response.LOCATION_TOTAL_CORRECT / response.TOTAL_PLAYED),
            source: response.TOTAL_PLAYED === 0 ? 0 : parseFloat(response.SOURCE_TOTAL_CORRECT / response.TOTAL_PLAYED),
            topic: response.TOTAL_PLAYED === 0 ? 0 : parseFloat(response.TOPIC_TOTAL_CORRECT / response.TOTAL_PLAYED)
        };

        const levelInfo = {
            location: response.LOCATION_LEVEL,
            source: response.SOURCE_LEVEL,
            topic: response.TOPIC_LEVEL
        };

        return res.status(response.RESPONSE_STATUS).json({ username: response.USERNAME, dateJoined: response.JOINDATE, overallLevel: response.OVERALL_LEVEL, streaks: streakInfo, accuracy: accuracyInfo, totalPlayed: response.TOTAL_PLAYED, levels: levelInfo });
    });
});

// +==================================+
// |         Add Friend API           |
// +==================================+
// Incoming: { token, username }
// Outgoing: { status }
app.post("/api/add_friend", (req, res) => {
    const { token, username } = req.body;

    if (!token || !username) {
        return res.status(430).json({});
    }

    const data = sanitizeData({ token, username });

    const sql = "CALL add_friend(?, ?)";
    const params = [data.token, data.username];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        const response = result[0][0];

        return res.status(response.RESPONSE_STATUS).json({});
    });
});

// +==================================+
// |      Friend Request Sent API     |
// +==================================+
// Incoming: { token, username }
// Outgoing: { status, friendRequestSent }
app.post("/api/get_friend_status", (req, res) => {
    const { token, username } = req.body;

    if (!token || !username) {
        return res.status(430).json({});
    }

    const data = sanitizeData({ token, username });

    const sql = "CALL get_friend_status(?, ?)";
    const params = [data.token, data.username];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        const response = result[0][0];

        return res.status(response.RESPONSE_STATUS).json({ friendStatus: response.FRIEND_STATUS });
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
            return res.status(500).json({});
        }

        const response = result[0][0];

        if (isErrorStatus(response.RESPONSE_STATUS)) {
            return res.status(response.RESPONSE_STATUS).json({});
        }

        if (result[0].length === 1)
            return res.status(response.RESPONSE_STATUS).json({ friends: [] });

        let friendsList = [];

        for (let i = 1; i < result[0].length; i++) {
            friendsList.push(result[0][i].FRIEND_USERNAME);
        }

        return res.status(response.RESPONSE_STATUS).json({ friends: friendsList });
    });
});

// +==================================+
// |        Set Avatar API            |
// +==================================+
// Incoming: { token, colors, foreground }
// Outgoing: { status }
app.post("/api/set_avatar", (req, res) => {
    const { token, colors, foreground } = req.body;

    if (!token || !colors || foreground === undefined) {
        return res.status(430).json({});
    }

    const data = sanitizeData({ token, colors, foreground });

    const sql = "CALL set_avatar(?, ?, ?, ?, ?)";
    const params = [data.token, data.colors.background, data.colors.border, data.colors.foreground, data.foreground];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        const response = result[0][0];

        return res.status(response.RESPONSE_STATUS).json({});
    });
});

// +==================================+
// |        Get Avatar API            |
// +==================================+
// Incoming: { username }
// Outgoing: { status, colors, foreground }
app.get("/api/get_avatar", (req, res) => {
    const id = req.query.user;

    const sql = "CALL get_avatar(?)";

    db.query(sql, [id], function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        const response = result[0][0];

        if (isErrorStatus(response.RESPONSE_STATUS)) {
            return res.status(response.RESPONSE_STATUS).json({});
        }

        return res.status(response.RESPONSE_STATUS).json({ 
            colors: { 
                background: response.BGCOLOR, 
                border: response.BORDERCOLOR, 
                foreground: response.FGCOLOR 
            }, 
            foreground: response.FOREGROUND 
        });
    });
});

// +==================================+
// |            Verify API            |
// +==================================+
// Incoming: { token, code, action }
// Outgoing: { status, sensitiveToken }
app.post("/api/verify", (req, res) => {
    const { token, code, action } = req.body;

    if (!token || !code || !action) {
        return res.status(430).json({});
    }

    const data = sanitizeData({ token, code, action });

    const sql = "CALL verify(?, ?, ?)";
    const params = [data.token, data.code, data.action];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        const response = result[0][0];

        if (isErrorStatus(response.RESPONSE_STATUS)) {
            return res.status(response.RESPONSE_STATUS).json({});
        }

        return res.status(response.RESPONSE_STATUS).json({ sensitiveToken: response.SENSITIVE_TOKEN });
    });
});


// +==================================+
// |        Edit Username API         |
// +==================================+
// Incoming: { sensitiveToken, newUsername }
// Outgoing: { status }
app.post("/api/edit_username", (req, res) => {
    const { sensitiveToken, newUsername } = req.body;

    if (!sensitiveToken || !newUsername) {
        return res.status(430).json({});
    }

    const data = sanitizeData({ sensitiveToken, newUsername });

    const sql = "CALL edit_username(?, ?)";
    const params = [data.sensitiveToken, data.newUsername];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        const response = result[0][0];

        return res.status(response.RESPONSE_STATUS).json({});
    });
});

// +==================================+
// |        Reset Password API        |
// +==================================+
// Incoming: { sensitiveToken, newPassword }
// Outgoing: { status }
app.post("/api/reset_password", (req, res) => {
    const { sensitiveToken, newPassword } = req.body;

    if (!sensitiveToken || !newPassword) {
        return res.status(430).json({});
    }

    const data = sanitizeData({ sensitiveToken, newPassword });

    const sql = "CALL reset_password(?, ?)";
    const params = [data.sensitiveToken, data.newPassword];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        const response = result[0][0];

        return res.status(response.RESPONSE_STATUS).json({});
    });
});

// +==================================+
// |     Request Verification API     |
// +==================================+
// Incoming: { token, action, language }
// Outgoing: { status }
app.post("/api/request_verification", (req, res) => {
    const { token, action, language } = req.body;

    if (!token || !action || !language) {
        return res.status(430).json({});
    }

    const data = sanitizeData({ token, action, language });
    const verificationCode = generateNumberSequence(8);

    const sql = "CALL request_verification(?, ?, ?)";
    const params = [data.token, verificationCode, action];

    db.query(sql, params, function(err, result) {
        if (err) {
            console.log(`SQL database error ${err}`);
            return res.status(500).json({});
        }

        const response = result[0][0];

        
        if (isErrorStatus(response.RESPONSE_STATUS)) {
            return res.status(response.RESPONSE_STATUS).json({});
        }

        sendVerificationCodeEmail(response.EMAIL, data.language, verificationCode, data.action);

        return res.status(response.RESPONSE_STATUS).json({});
    });    
});

async function sendVerificationCodeEmail(email, language, verificationCode, action) {
    const { subject, message } = generateVerificationEmail(language, action, verificationCode);

    await mailTransporter.sendMail({
        from: "admin@minervacg.com.alexharris.design",
        to: email,
        subject: subject,
        text: message
    });
}

function generateVerificationEmail(language, action, verificationCode) {
    let subject = "";
    let message = "";

    switch (action.toLowerCase()) {
        case "edit_username":
            switch (language) {
                case "spanish":
                    subject = "Código de Verificación de Cambio de Nombre de Usuario";
                    message = "Su solicitud de cambio de nombre de usuario ha sido recibida. Utilice el código a continuación para cambiar su nombre de usuario.\n\n" + verificationCode + "\n\nSi no solicitó este cambio, contáctenos de inmediato.";
                    break;
                case "french":
                    subject = "Code de Vérification de Changement de Nom d'Utilisateur";
                    message = "Votre demande de changement de nom d'utilisateur a été reçue. Utilisez le code ci-dessous pour changer votre nom d'utilisateur.\n\n" + verificationCode + "\n\nSi vous n'avez pas demandé ce changement, veuillez nous contacter immédiatement.";
                    break;
                default:
                    subject = "Username Change Verification Code";
                    message = "Your username change request has been received. Use the code below to change your username.\n\n" + verificationCode + "\n\nIf you did not request this change, please contact us immediately.";
                    break;
            }
            break;
        case "reset_password":
            switch (language) {
                case "spanish":
                    subject = "Código de Verificación de Restablecimiento de Contraseña";
                    message = "Su solicitud de restablecimiento de contraseña ha sido recibida. Utilice el código a continuación para restablecer su contraseña.\n\n" + verificationCode + "\n\nSi no solicitó este cambio, contáctenos de inmediato.";
                    break;
                case "french":
                    subject = "Code de Vérification de Réinitialisation de Mot de Passe";
                    message = "Votre demande de réinitialisation de mot de passe a été reçue. Utilisez le code ci-dessous pour réinitialiser votre mot de passe.\n\n" + verificationCode + "\n\nSi vous n'avez pas demandé ce changement, veuillez nous contacter immédiatement.";
                    break;
                default:
                    subject = "Password Reset Verification Code";
                    message = "Your password reset request has been received. Use the code below to reset your password.\n\n" + verificationCode + "\n\nIf you did not request this change, please contact us immediately.";
                    break;
            }
            break;
    }

    return { subject, message };
}

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

function generateNumberSequence(length) {
    let sequence = "";

    for (let i = 0; i < length; i++) {
        sequence += Math.floor(Math.random() * 10);
    }

    return sequence;

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

function isErrorStatus(status) {
    return status >= 400 && status < 600;
}

function isSuccessfulStatus(status) {
    return status >= 200 && status < 300;
}