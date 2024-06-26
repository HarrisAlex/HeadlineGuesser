DROP DATABASE IF EXISTS db;
CREATE DATABASE db;

DROP USER IF EXISTS 'dev'@'localhost';

USE db;

DROP TABLE IF EXISTS USER_LOGIN;
DROP TABLE IF EXISTS TOKEN_TABLE;

CREATE TABLE USER_LOGIN (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    EMAIL VARCHAR(255) NOT NULL,
    USERNAME VARCHAR(255) NOT NULL,
    PASS VARCHAR(255) NOT NULL,
    SALT VARCHAR(255) NOT NULL,
    LAST_USERNAME_CHANGE TIMESTAMP NOT NULL
);

CREATE TABLE SCORES (
    ID INT NOT NULL PRIMARY KEY,
    OVERALL_LEVEL INT NOT NULL,

    LOCATION_STREAK INT NOT NULL,
    SOURCE_STREAK INT NOT NULL,
    TOPIC_STREAK INT NOT NULL,

    LOCATION_STREAK_HIGH INT NOT NULL,
    SOURCE_STREAK_HIGH INT NOT NULL,
    TOPIC_STREAK_HIGH INT NOT NULL,

    LOCATION_TOTAL_CORRECT INT NOT NULL,
    SOURCE_TOTAL_CORRECT INT NOT NULL,
    TOPIC_TOTAL_CORRECT INT NOT NULL,

    TOTAL_PLAYED INT NOT NULL,

    LOCATION_LEVEL INT NOT NULL,
    SOURCE_LEVEL INT NOT NULL,
    TOPIC_LEVEL INT NOT NULL,

    LAST_DATE TIMESTAMP NOT NULL,

    FOREIGN KEY (ID) REFERENCES USER_LOGIN(ID)
);

CREATE TABLE TOKEN_TABLE (
    ID INT NOT NULL PRIMARY KEY,
    TOKEN CHAR(255) NOT NULL,
    EXPIRATION_DATE TIMESTAMP NOT NULL,
    FOREIGN KEY (ID) REFERENCES USER_LOGIN(ID)
);

CREATE TABLE SENSITIVE_TOKENS (
    ID INT NOT NULL PRIMARY KEY,
    TOKEN CHAR(255) NOT NULL,
    TARGET_ACTION VARCHAR(255) NOT NULL,
    EXPIRATION_DATE TIMESTAMP NOT NULL,
    FOREIGN KEY (ID) REFERENCES USER_LOGIN(ID)
);

CREATE TABLE VERIFICATION_CODES (
    ID INT NOT NULL PRIMARY KEY,
    CODE CHAR(8) NOT NULL,
    TARGET_ACTION VARCHAR(255) NOT NULL,
    EXPIRATION_DATE TIMESTAMP NOT NULL,
    FOREIGN KEY (ID) REFERENCES USER_LOGIN(ID)
);

CREATE TABLE LEVEL_LEADERBOARD (
    USERNAME VARCHAR(255) NOT NULL PRIMARY KEY,
    OVERALL_LEVEL INT NOT NULL
);

CREATE TABLE STREAKS_LEADERBOARD (
    USERNAME VARCHAR(255) NOT NULL PRIMARY KEY,
    LOCATION_STREAK INT NOT NULL,
    SOURCE_STREAK INT NOT NULL,
    TOPIC_STREAK INT NOT NULL
);

CREATE TABLE STREAKS_ALLTIME_LEADERBOARD (
    USERNAME VARCHAR(255) NOT NULL PRIMARY KEY,
    LOCATION_STREAK_HIGH INT NOT NULL,
    SOURCE_STREAK_HIGH INT NOT NULL,
    TOPIC_STREAK_HIGH INT NOT NULL
);

CREATE TABLE CORRECT_LEADERBOARD (
    USERNAME VARCHAR(255) NOT NULL PRIMARY KEY,
    LOCATION_TOTAL_CORRECT INT NOT NULL,
    SOURCE_TOTAL_CORRECT INT NOT NULL,
    TOPIC_TOTAL_CORRECT INT NOT NULL
);

CREATE TABLE TOTAL_PLAYED_LEADERBOARD (
    USERNAME VARCHAR(255) NOT NULL PRIMARY KEY,
    TOTAL_PLAYED INT NOT NULL
);

CREATE TABLE ACCURACY_LEADERBOARD (
    USERNAME VARCHAR(255) NOT NULL PRIMARY KEY,
    LOCATION_ACCURACY FLOAT NOT NULL,
    SOURCE_ACCURACY FLOAT NOT NULL,
    TOPIC_ACCURACY FLOAT NOT NULL
);

CREATE TABLE ACCURACY_ALLTIME_LEADERBOARD (
    USERNAME VARCHAR(255) NOT NULL PRIMARY KEY,
    LOCATION_ACCURACY_HIGH FLOAT NOT NULL,
    SOURCE_ACCURACY_HIGH FLOAT NOT NULL,
    TOPIC_ACCURACY_HIGH FLOAT NOT NULL
);

CREATE TABLE USER_INFO (
    ID INT NOT NULL PRIMARY KEY,
    DATEJOINED TIMESTAMP NOT NULL,
    FOREIGN KEY (ID) REFERENCES USER_LOGIN(ID)
);

CREATE TABLE FRIENDS (
    ID INT NOT NULL,
    FRIEND INT NOT NULL,
    FOREIGN KEY (ID) REFERENCES USER_LOGIN(ID),
    FOREIGN KEY (FRIEND) REFERENCES USER_LOGIN(ID)
);

CREATE TABLE AVATARS (
    ID INT NOT NULL,
    BGCOLOR INT NOT NULL,
    BORDERCOLOR INT NOT NULL,
    FGCOLOR INT NOT NULL,
    FOREGROUND INT NOT NULL,
    FOREIGN KEY (ID) REFERENCES USER_LOGIN(ID)
);

CREATE USER 'dev'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

GRANT ALL PRIVILEGES ON db.* TO 'dev'@'localhost';

FLUSH PRIVILEGES;

DELIMITER //
-- INSERT USER_LOGIN
CREATE PROCEDURE insert_user_login(IN input_email VARCHAR(255), IN input_username VARCHAR(255), IN input_pass VARCHAR(255))
BEGIN
    DECLARE emailExists INT;
    DECLARE passLength INT;
    DECLARE tokenID CHAR(255);
    DECLARE userID INT;
    DECLARE salt VARCHAR(255);

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT,
        TOKEN VARCHAR(255),
        USERNAME VARCHAR(255)
    );

    SELECT COUNT(*) INTO emailExists FROM USER_LOGIN WHERE EMAIL = input_email;
    SELECT LENGTH(input_pass) INTO passLength;

    -- Check if email already exists and password is valid
    IF emailExists > 0 THEN
        -- Email already exists
        INSERT INTO RESPONSE VALUES (427, NULL, NULL);
    ELSEIF passLength < 8 THEN
        -- Password too short
        INSERT INTO RESPONSE VALUES (406, NULL, NULL);
    ELSE
        -- Generate salt
        SET salt = HEX(RANDOM_BYTES(64));

        -- Create token id
        SET tokenID = UUID();

        -- Insert user
        INSERT INTO USER_LOGIN (EMAIL, USERNAME, PASS, SALT, LAST_USERNAME_CHANGE) VALUES (input_email, input_username, SHA2(CONCAT(input_pass, salt), 256), salt, NOW());
        INSERT INTO SCORES (OVERALL_LEVEL, ID, LOCATION_STREAK, SOURCE_STREAK, TOPIC_STREAK, LOCATION_STREAK_HIGH, SOURCE_STREAK_HIGH, TOPIC_STREAK_HIGH, LOCATION_TOTAL_CORRECT, SOURCE_TOTAL_CORRECT, TOPIC_TOTAL_CORRECT, TOTAL_PLAYED, LOCATION_LEVEL, SOURCE_LEVEL, TOPIC_LEVEL, LAST_DATE)
            VALUES (1, (SELECT ID FROM USER_LOGIN WHERE EMAIL = input_email), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, NOW());
        INSERT INTO USER_INFO (DATEJOINED, ID) VALUES (NOW(), (SELECT ID FROM USER_LOGIN WHERE EMAIL = input_email));
        INSERT INTO AVATARS (ID, BGCOLOR, BORDERCOLOR, FGCOLOR, FOREGROUND) VALUES ((SELECT ID FROM USER_LOGIN WHERE EMAIL = input_email), 0, 0, 0, 0);

        -- Insert token
        SELECT ID INTO userID FROM USER_LOGIN WHERE EMAIL = input_email;
        INSERT INTO TOKEN_TABLE (TOKEN, EXPIRATION_DATE, ID) VALUES (tokenID, DATE_ADD(NOW(), INTERVAL 1 DAY), userID);

        -- Sucessfully created user
        INSERT INTO RESPONSE VALUES (201, tokenID, input_username);
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- VALIDATE USER_LOGIN
CREATE PROCEDURE validate_user(IN input_email VARCHAR(255), IN input_pass VARCHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;
    DECLARE userSalt VARCHAR(255);
    DECLARE tokenID CHAR(255);
    DECLARE hashsedPass VARCHAR(255);

    -- Create token id
    SET tokenID = UUID();

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT,
        TOKEN CHAR(255),
        USERNAME VARCHAR(255)
    );

    -- Get all users by email
    SELECT COUNT(*) INTO isValid FROM USER_LOGIN WHERE EMAIL = input_email;

    IF isValid = 0 THEN
        -- User does not exist
        INSERT INTO RESPONSE VALUES (404, NULL, NULL);
    ELSE
        -- Get user id and salt
        SELECT ID, SALT INTO userID, userSalt FROM USER_LOGIN WHERE EMAIL = input_email;
        SET hashsedPass = SHA2(CONCAT(input_pass, userSalt), 256);

        -- Check if password is valid
        IF hashsedPass != (SELECT PASS FROM USER_LOGIN WHERE ID = userID) THEN
            INSERT INTO RESPONSE VALUES (406, NULL, NULL);
        ELSE
            -- Check for existing token
            IF (SELECT COUNT(*) FROM TOKEN_TABLE WHERE ID = userID AND EXPIRATION_DATE > NOW()) > 0 THEN
                -- Get existing token
                SELECT TOKEN INTO tokenID FROM TOKEN_TABLE WHERE ID = userID;
            ELSE
                -- Insert new token if none exists
                INSERT INTO TOKEN_TABLE (TOKEN, EXPIRATION_DATE, ID) VALUES (tokenID, DATE_ADD(NOW(), INTERVAL 1 DAY), userID);
            END IF;
            
            -- Successfully validated user and created token
            INSERT INTO RESPONSE VALUES (201, tokenID, (SELECT USERNAME FROM USER_LOGIN WHERE ID = userID));
        END IF;
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- UPDATE SCORE
CREATE PROCEDURE update_scores(IN input_token CHAR(255), IN location_correct INT, IN source_correct INT, IN topic_correct INT)
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userOverallLevel INT;
    DECLARE userLocationStreak INT;
    DECLARE userSourceStreak INT;
    DECLARE userTopicStreak INT;
    DECLARE userLocationStreakHigh INT;
    DECLARE userSourceStreakHigh INT;
    DECLARE userTopicStreakHigh INT;
    DECLARE userLocationTotalCorrect INT;
    DECLARE userSourceTotalCorrect INT;
    DECLARE userTopicTotalCorrect INT;
    DECLARE userTotalPlayed INT;
    DECLARE userLocationLevel INT;
    DECLARE userSourceLevel INT;
    DECLARE userTopicLevel INT;
    DECLARE userLastDate TIMESTAMP;
    DECLARE userID INT;

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT
    );

    -- Check if token is valid
    SELECT COUNT(*) INTO isValid FROM TOKEN_TABLE WHERE TOKEN = input_token AND EXPIRATION_DATE > NOW();

    IF isValid = 0 THEN
        -- Invalid token
        INSERT INTO RESPONSE VALUES (401);
    ELSE
        -- Get user id
        SELECT ID INTO userID FROM TOKEN_TABLE WHERE TOKEN = input_token;

        -- Get user scores
        SELECT OVERALL_LEVEL INTO userOverallLevel FROM SCORES WHERE ID = userID;
        SELECT LOCATION_STREAK INTO userLocationStreak FROM SCORES WHERE ID = userID;
        SELECT SOURCE_STREAK INTO userSourceStreak FROM SCORES WHERE ID = userID;
        SELECT TOPIC_STREAK INTO userTopicStreak FROM SCORES WHERE ID = userID;
        SELECT LOCATION_STREAK_HIGH INTO userLocationStreakHigh FROM SCORES WHERE ID = userID;
        SELECT SOURCE_STREAK_HIGH INTO userSourceStreakHigh FROM SCORES WHERE ID = userID;
        SELECT TOPIC_STREAK_HIGH INTO userTopicStreakHigh FROM SCORES WHERE ID = userID;
        SELECT LOCATION_TOTAL_CORRECT INTO userLocationTotalCorrect FROM SCORES WHERE ID = userID;
        SELECT SOURCE_TOTAL_CORRECT INTO userSourceTotalCorrect FROM SCORES WHERE ID = userID;
        SELECT TOPIC_TOTAL_CORRECT INTO userTopicTotalCorrect FROM SCORES WHERE ID = userID;
        SELECT TOTAL_PLAYED INTO userTotalPlayed FROM SCORES WHERE ID = userID;
        SELECT LOCATION_LEVEL INTO userLocationLevel FROM SCORES WHERE ID = userID;
        SELECT SOURCE_LEVEL INTO userSourceLevel FROM SCORES WHERE ID = userID;
        SELECT TOPIC_LEVEL INTO userTopicLevel FROM SCORES WHERE ID = userID;
        SELECT LAST_DATE INTO userLastDate FROM SCORES WHERE ID = userID;

        -- Check if streaks are broken
        IF userLastDate < DATE_SUB(NOW(), INTERVAL 1 DAY) THEN
            SET userLocationStreak = 0;
            SET userSourceStreak = 0;
            SET userTopicStreak = 0;
        END IF;

        -- Update streaks
        IF location_correct = 1 THEN
            SET userLocationStreak = userLocationStreak + 1;
            IF userLocationStreak > userLocationStreakHigh THEN
                SET userLocationStreakHigh = userLocationStreak;
            END IF;
        ELSE
            SET userLocationStreak = 0;
        END IF;

        IF source_correct = 1 THEN
            SET userSourceStreak = userSourceStreak + 1;
            IF userSourceStreak > userSourceStreakHigh THEN
                SET userSourceStreakHigh = userSourceStreak;
            END IF;
        ELSE
            SET userSourceStreak = 0;
        END IF;

        IF topic_correct = 1 THEN
            SET userTopicStreak = userTopicStreak + 1;
            IF userTopicStreak > userTopicStreakHigh THEN
                SET userTopicStreakHigh = userTopicStreak;
            END IF;
        ELSE
            SET userTopicStreak = 0;
        END IF;

        -- Update total correct
        SET userLocationTotalCorrect = userLocationTotalCorrect + location_correct;
        SET userSourceTotalCorrect = userSourceTotalCorrect + source_correct;
        SET userTopicTotalCorrect = userTopicTotalCorrect + topic_correct;

        -- Update total played
        SET userTotalPlayed = userTotalPlayed + 1;

        -- Update levels
        SET userLocationLevel = FLOOR(userLocationTotalCorrect / 10) + 1;
        SET userSourceLevel = FLOOR(userSourceTotalCorrect / 10) + 1;
        SET userTopicLevel = FLOOR(userTopicTotalCorrect / 10) + 1;
        SET userOverallLevel = FLOOR((userLocationLevel + userSourceLevel + userTopicLevel) / 3);

        -- Update last date
        SET userLastDate = NOW();

        -- Update scores
        UPDATE SCORES SET LOCATION_STREAK = userLocationStreak, 
            SOURCE_STREAK = userSourceStreak, 
            TOPIC_STREAK = userTopicStreak, 
            LOCATION_STREAK_HIGH = userLocationStreakHigh, 
            SOURCE_STREAK_HIGH = userSourceStreakHigh, 
            TOPIC_STREAK_HIGH = userTopicStreakHigh, 
            LOCATION_TOTAL_CORRECT = userLocationTotalCorrect, 
            SOURCE_TOTAL_CORRECT = userSourceTotalCorrect, 
            TOPIC_TOTAL_CORRECT = userTopicTotalCorrect, 
            TOTAL_PLAYED = userTotalPlayed, 
            LOCATION_LEVEL = userLocationLevel, 
            SOURCE_LEVEL = userSourceLevel, 
            TOPIC_LEVEL = userTopicLevel, 
            LAST_DATE = userLastDate 
            WHERE ID = userID;

        -- Update score
        INSERT INTO RESPONSE VALUES (209);
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- GET USER
CREATE PROCEDURE get_user(IN input_username VARCHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;
    DECLARE outputUsername VARCHAR(255);
    DECLARE userOverallLevel INT;
    DECLARE userLocationStreak INT;
    DECLARE userSourceStreak INT;
    DECLARE userTopicStreak INT;
    DECLARE userLocationStreakHigh INT;
    DECLARE userSourceStreakHigh INT;
    DECLARE userTopicStreakHigh INT;
    DECLARE userLocationTotalCorrect INT;
    DECLARE userSourceTotalCorrect INT;
    DECLARE userTopicTotalCorrect INT;
    DECLARE userTotalPlayed INT;
    DECLARE userLocationLevel INT;
    DECLARE userSourceLevel INT;
    DECLARE userTopicLevel INT;
    DECLARE userJoinDate TIMESTAMP;

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT,
        USERNAME VARCHAR(255),
        OVERALL_LEVEL INT,
        LOCATION_STREAK INT,
        SOURCE_STREAK INT,
        TOPIC_STREAK INT,
        LOCATION_STREAK_HIGH INT,
        SOURCE_STREAK_HIGH INT,
        TOPIC_STREAK_HIGH INT,
        LOCATION_TOTAL_CORRECT INT,
        SOURCE_TOTAL_CORRECT INT,
        TOPIC_TOTAL_CORRECT INT,
        TOTAL_PLAYED INT,
        LOCATION_LEVEL INT,
        SOURCE_LEVEL INT,
        TOPIC_LEVEL INT,
        JOINDATE TIMESTAMP
    );

    SELECT COUNT(*) INTO isValid FROM USER_LOGIN WHERE USERNAME = input_username;

    IF isValid = 0 THEN
        -- User does not exist
        INSERT INTO RESPONSE VALUES (404, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
    ELSE
        -- Get user info
        SELECT ID INTO userID FROM USER_LOGIN WHERE USERNAME = input_username;

        -- Get username, score, date joined, and friend count
        SELECT USERNAME INTO outputUsername FROM USER_LOGIN WHERE ID = userID;
        SELECT OVERALL_LEVEL INTO userOverallLevel FROM SCORES WHERE ID = userID;
        SELECT LOCATION_STREAK INTO userLocationStreak FROM SCORES WHERE ID = userID;
        SELECT SOURCE_STREAK INTO userSourceStreak FROM SCORES WHERE ID = userID;
        SELECT TOPIC_STREAK INTO userTopicStreak FROM SCORES WHERE ID = userID;
        SELECT LOCATION_STREAK_HIGH INTO userLocationStreakHigh FROM SCORES WHERE ID = userID;
        SELECT SOURCE_STREAK_HIGH INTO userSourceStreakHigh FROM SCORES WHERE ID = userID;
        SELECT TOPIC_STREAK_HIGH INTO userTopicStreakHigh FROM SCORES WHERE ID = userID;
        SELECT LOCATION_TOTAL_CORRECT INTO userLocationTotalCorrect FROM SCORES WHERE ID = userID;
        SELECT SOURCE_TOTAL_CORRECT INTO userSourceTotalCorrect FROM SCORES WHERE ID = userID;
        SELECT TOPIC_TOTAL_CORRECT INTO userTopicTotalCorrect FROM SCORES WHERE ID = userID;
        SELECT TOTAL_PLAYED INTO userTotalPlayed FROM SCORES WHERE ID = userID;
        SELECT LOCATION_LEVEL INTO userLocationLevel FROM SCORES WHERE ID = userID;
        SELECT SOURCE_LEVEL INTO userSourceLevel FROM SCORES WHERE ID = userID;
        SELECT TOPIC_LEVEL INTO userTopicLevel FROM SCORES WHERE ID = userID;
        SELECT DATEJOINED INTO userJoinDate FROM USER_INFO WHERE ID = userID;

        -- Found user, grabbing information
        INSERT INTO RESPONSE VALUES (200, outputUsername, 
            userOverallLevel, 
            userLocationStreak, 
            userSourceStreak, 
            userTopicStreak, 
            userLocationStreakHigh, 
            userSourceStreakHigh, 
            userTopicStreakHigh, 
            userLocationTotalCorrect, 
            userSourceTotalCorrect, 
            userTopicTotalCorrect, 
            userTotalPlayed, 
            userLocationLevel, 
            userSourceLevel, 
            userTopicLevel, 
            userJoinDate);
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- ADD FRIEND
CREATE PROCEDURE add_friend(IN input_token CHAR(255), IN input_friend_username VARCHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;
    DECLARE friendID INT;

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT
    );

    -- Check if token is valid
    SELECT COUNT(*) INTO isValid FROM TOKEN_TABLE WHERE TOKEN = input_token;

    IF isValid = 0 THEN
        -- Invalid token
        INSERT INTO RESPONSE VALUES (401);
    ELSE
        -- Get user id
        SELECT ID INTO userID FROM TOKEN_TABLE WHERE TOKEN = input_token;

        -- Check if friend exists
        SELECT COUNT(*) INTO isValid FROM USER_LOGIN WHERE USERNAME = input_friend_username;

        IF isValid = 0 THEN
            -- Friend does not exist
            INSERT INTO RESPONSE VALUES (404);
        ELSE
            -- Get friend id
            SELECT ID INTO friendID FROM USER_LOGIN WHERE USERNAME = input_friend_username;

            -- Check if friend is already added
            SELECT COUNT(*) INTO isValid FROM FRIENDS WHERE ID = userID AND FRIEND = friendID;

            IF isValid > 0 THEN
                SELECT COUNT(*) INTO isValid FROM FRIENDS WHERE ID = friendID AND FRIEND = userID;
                
                -- Are already friends
                INSERT INTO RESPONSE VALUES (427);
            ELSE
                IF userID = friendID THEN
                    -- Cannot friend self
                    INSERT INTO RESPONSE VALUES (406);
                ELSE
                    -- Add friend, create entry in table
                    INSERT INTO FRIENDS VALUES (userID, friendID);
                    INSERT INTO RESPONSE VALUES (201);
                END IF;
            END IF;
        END IF;
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- FRIEND REQUEST SENT
CREATE PROCEDURE get_friend_status(IN input_token CHAR(255), IN input_friend_username VARCHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;
    DECLARE friendID INT;

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT,
        FRIEND_STATUS VARCHAR(255)
    );

    -- Check if token is valid
    SELECT COUNT(*) INTO isValid FROM TOKEN_TABLE WHERE TOKEN = input_token;

    IF isValid = 0 THEN
        -- Invalid token
        INSERT INTO RESPONSE VALUES (401);
    ELSE
        -- Get user id
        SELECT ID INTO userID FROM TOKEN_TABLE WHERE TOKEN = input_token;

        -- Check if friend exists
        SELECT COUNT(*) INTO isValid FROM USER_LOGIN WHERE USERNAME = input_friend_username;

        IF isValid = 0 THEN
            -- Friend does not exist
            INSERT INTO RESPONSE VALUES (404);
        ELSE
            -- Get friend id
            SELECT ID INTO friendID FROM USER_LOGIN WHERE USERNAME = input_friend_username;

            -- Check if friend is already added
            SELECT COUNT(*) INTO isValid FROM FRIENDS WHERE ID = userID AND FRIEND = friendID;

            IF isValid > 0 THEN
                SELECT COUNT(*) INTO isValid FROM FRIENDS WHERE ID = friendID AND FRIEND = userID;

                IF isValid > 0 THEN
                    -- Are already friends
                    INSERT INTO RESPONSE VALUES (200, 'ALREADY_FRIENDS');
                ELSE
                    -- Friend request already sent
                    INSERT INTO RESPONSE VALUES (200, 'FRIEND_REQUEST_SENT');
                END IF;
            ELSE
                IF userID = friendID THEN
                    -- Cannot friend self
                    INSERT INTO RESPONSE VALUES (427, 'CANNOT_FRIEND_SELF');
                ELSE
                    -- Not friends
                    INSERT INTO RESPONSE VALUES (200, 'FRIEND_REQUEST_NOT_SENT');
                END IF;
            END IF;
        END IF;
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- GET FRIENDS
CREATE PROCEDURE get_friends(IN input_username VARCHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;
    DECLARE friendID INT;
    DECLARE friendUsername VARCHAR(255);
    DECLARE done INT DEFAULT FALSE;
    DECLARE friendCursor CURSOR FOR SELECT FRIEND FROM FRIENDS WHERE ID = userID;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT,
        FRIEND_USERNAME VARCHAR(255)
    );

    SELECT COUNT(*) INTO isValid FROM USER_LOGIN WHERE USERNAME = input_username;

    -- Check if user exists
    IF isValid = 0 THEN
        INSERT INTO RESPONSE VALUES (404, NULL);
    ELSE
        -- Get user id
        SELECT ID INTO userID FROM USER_LOGIN WHERE USERNAME = input_username;

        -- Header row for response
        INSERT INTO RESPONSE VALUES (200, 'FRIENDS');

        OPEN friendCursor;

        -- Loop through all friends
        read_loop: LOOP
            -- Get friend id
            FETCH friendCursor INTO friendID;

            -- Exit loop if no more friends
            IF done THEN
                LEAVE read_loop;
            END IF;

            -- Get friend username
            SELECT USERNAME INTO friendUsername FROM USER_LOGIN WHERE ID = friendID;

            -- Check if mutual friends
            SELECT COUNT(*) INTO isValid FROM FRIENDS WHERE ID = friendID AND FRIEND = userID;

            IF isValid > 0 THEN
                -- Add row for mutual friend
                INSERT INTO RESPONSE VALUES (200, friendUsername);
            END IF;
        END LOOP;

        CLOSE friendCursor;
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- SET AVATAR
CREATE PROCEDURE set_avatar(IN input_token CHAR(255), IN input_bgcolor INT, IN input_bordercolor INT, IN input_fgcolor INT, IN input_foreground INT)
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT
    );

    -- Check if token is valid
    SELECT COUNT(*) INTO isValid FROM TOKEN_TABLE WHERE TOKEN = input_token AND EXPIRATION_DATE > NOW();
    
    IF isValid = 0 THEN
        -- Invalid token
        INSERT INTO RESPONSE VALUES (401);
    ELSE
        -- Get user id
        SELECT ID INTO userID FROM TOKEN_TABLE WHERE TOKEN = input_token;

        -- Update avatar
        UPDATE AVATARS SET BGCOLOR = input_bgcolor, BORDERCOLOR = input_bordercolor, FGCOLOR = input_fgcolor, FOREGROUND = input_foreground WHERE ID = userID;

        -- Avatar updated
        INSERT INTO RESPONSE VALUES (209);
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- GET AVATAR
CREATE PROCEDURE get_avatar(IN input_username VARCHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;
    DECLARE user_bgcolor INT;
    DECLARE user_bordercolor INT;
    DECLARE user_fgcolor INT;
    DECLARE user_foreground INT;

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT,
        BGCOLOR INT,
        BORDERCOLOR INT,
        FGCOLOR INT,
        FOREGROUND INT
    );

    SELECT COUNT(*) INTO isValid FROM USER_LOGIN WHERE USERNAME = input_username;

    IF isValid = 0 THEN
        -- User does not exist
        INSERT INTO RESPONSE VALUES (404, NULL, NULL, NULL, NULL);
    ELSE
        -- Get user id
        SELECT ID INTO userID FROM USER_LOGIN WHERE USERNAME = input_username;

        -- Get avatar
        SELECT BGCOLOR, BORDERCOLOR, FGCOLOR, FOREGROUND INTO user_bgcolor, user_bordercolor, user_fgcolor, user_foreground FROM AVATARS WHERE ID = userID;

        -- Grab user's avatar
        INSERT INTO RESPONSE VALUES (200, user_bgcolor, user_bordercolor, user_fgcolor, user_foreground);
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- REQUEST VERIFICATION
CREATE PROCEDURE request_verification(IN input_token CHAR(255), IN user_code CHAR(8), IN input_action VARCHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;
    DECLARE userEmail VARCHAR(255);

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT,
        EMAIL VARCHAR(255)
    );

    -- Check if token is valid
    SELECT COUNT(*) INTO isValid FROM TOKEN_TABLE WHERE TOKEN = input_token AND EXPIRATION_DATE > NOW();

    IF isValid = 0 THEN
        -- Invalid token
        INSERT INTO RESPONSE VALUES (401, NULL);
    ELSE
        -- Get user email
        SELECT ID INTO userID FROM TOKEN_TABLE WHERE TOKEN = input_token;
        SELECT EMAIL INTO userEmail FROM USER_LOGIN WHERE ID = userID;

        -- Remove any existing verification codes
        DELETE FROM VERIFICATION_CODES WHERE ID = userID;

        -- Insert verification code
        INSERT INTO VERIFICATION_CODES (CODE, EXPIRATION_DATE, TARGET_ACTION, ID) VALUES (user_code, DATE_ADD(NOW(), INTERVAL 10 MINUTE), input_action, userID);

        -- Return user's email
        INSERT INTO RESPONSE VALUES (200, userEmail);
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- VERIFY
CREATE PROCEDURE verify(IN input_token CHAR(255), IN input_code CHAR(8), IN input_action VARCHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;
    DECLARE sensitiveToken CHAR(255);

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT,
        SENSITIVE_TOKEN CHAR(255)
    );

    -- Check if token is valid
    SELECT COUNT(*) INTO isValid FROM TOKEN_TABLE WHERE TOKEN = input_token AND EXPIRATION_DATE > NOW();

    IF isValid = 0 THEN
        INSERT INTO RESPONSE VALUES (401, NULL);
    ELSE
        -- Get token ID
        SELECT ID INTO userID FROM TOKEN_TABLE WHERE TOKEN = input_token;

        -- Check if code is valid
        SELECT COUNT(*) INTO isValid FROM VERIFICATION_CODES WHERE CODE = input_code AND EXPIRATION_DATE > NOW() AND ID = userID AND TARGET_ACTION = input_action;

        IF isValid = 0 THEN
            -- Invalid code
            INSERT INTO RESPONSE VALUES (401, NULL);
        ELSE
            -- Delete verification code
            DELETE FROM VERIFICATION_CODES WHERE CODE = input_code;

            -- Generate sensitive token
            SET sensitiveToken = UUID();

            -- Dekete any existing sensitive tokens
            DELETE FROM SENSITIVE_TOKENS WHERE ID = userID;

            -- Insert sensitive token
            INSERT INTO SENSITIVE_TOKENS (TOKEN, EXPIRATION_DATE, TARGET_ACTION, ID) VALUES (sensitiveToken, DATE_ADD(NOW(), INTERVAL 10 MINUTE), input_action, userID);

            -- Return sensitive token
            INSERT INTO RESPONSE VALUES (200, sensitiveToken);
        END IF;
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- EDIT USERNAME
CREATE PROCEDURE edit_username(IN input_sensitive_token CHAR(255), IN input_new_username VARCHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;
    DECLARE lastUsernameChange TIMESTAMP;

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT
    );

    -- Check if token is valid
    SELECT COUNT(*) INTO isValid FROM SENSITIVE_TOKENS WHERE TOKEN = input_sensitive_token AND EXPIRATION_DATE > NOW() AND TARGET_ACTION = 'EDIT_USERNAME';

    IF isValid = 0 THEN
        -- Invalid token
        INSERT INTO RESPONSE VALUES (401);
    ELSE
        -- Get user id
        SELECT ID INTO userID FROM SENSITIVE_TOKENS WHERE TOKEN = input_sensitive_token;

        -- Get last username change
        SELECT LAST_USERNAME_CHANGE INTO lastUsernameChange FROM USER_LOGIN WHERE ID = userID;

        -- Check if username change is too recent
        IF lastUsernameChange > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN
            -- Delete sensitive token
            DELETE FROM SENSITIVE_TOKENS WHERE TOKEN = input_sensitive_token;

            -- Username change too recent
            INSERT INTO RESPONSE VALUES (425);
        ELSE
            -- Update username
            UPDATE USER_LOGIN SET USERNAME = input_new_username WHERE ID = userID;

            -- Delete sensitive token
            DELETE FROM SENSITIVE_TOKENS WHERE TOKEN = input_sensitive_token;

            -- Username updated
            INSERT INTO RESPONSE VALUES (209);
        END IF;
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- RESET PASSWORD
CREATE PROCEDURE reset_password(IN input_sensitive_token CHAR(255), IN input_new_password VARCHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;
    DECLARE salt VARCHAR(255);

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS INT
    );

    -- Check if token is valid
    SELECT COUNT(*) INTO isValid FROM SENSITIVE_TOKENS WHERE TOKEN = input_sensitive_token AND EXPIRATION_DATE > NOW() AND TARGET_ACTION = 'RESET_PASSWORD'; 

    IF isValid = 0 THEN
        -- Invalid token
        INSERT INTO RESPONSE VALUES (401);
    ELSE
        -- Get user id
        SELECT ID INTO userID FROM SENSITIVE_TOKENS WHERE TOKEN = input_sensitive_token;

        -- Generate salt
        SET salt = HEX(RANDOM_BYTES(64));

        -- Update password
        UPDATE USER_LOGIN SET PASS = SHA2(CONCAT(input_new_password, salt), 256), SALT = salt WHERE ID = userID;

        -- Delete sensitive token
        DELETE FROM SENSITIVE_TOKENS WHERE TOKEN = input_sensitive_token;

        -- Password updated
        INSERT INTO RESPONSE VALUES (209);
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- UPDATE LEADERBOARD
CREATE PROCEDURE update_leaderboard()
BEGIN
    -- Clear all leaderboards
    TRUNCATE TABLE LEVEL_LEADERBOARD;
    TRUNCATE TABLE STREAKS_LEADERBOARD;
    TRUNCATE TABLE STREAKS_ALLTIME_LEADERBOARD;
    TRUNCATE TABLE CORRECT_LEADERBOARD;
    TRUNCATE TABLE TOTAL_PLAYED_LEADERBOARD;
    TRUNCATE TABLE ACCURACY_LEADERBOARD;
    TRUNCATE TABLE ACCURACY_ALLTIME_LEADERBOARD;

    -- Insert top 50 users into each leaderboard
    INSERT INTO LEVEL_LEADERBOARD (USERNAME, OVERALL_LEVEL) SELECT USERNAME, s.OVERALL_LEVEL FROM USER_LOGIN u 
        INNER JOIN SCORES s ON u.ID = s.ID 
        ORDER BY s.OVERALL_LEVEL DESC LIMIT 50;

    INSERT INTO STREAKS_LEADERBOARD (USERNAME, LOCATION_STREAK, SOURCE_STREAK, TOPIC_STREAK) SELECT USERNAME, s.LOCATION_STREAK, s.SOURCE_STREAK, s.TOPIC_STREAK FROM USER_LOGIN u
        INNER JOIN SCORES s ON u.ID = s.ID
        ORDER BY s.LOCATION_STREAK DESC, s.SOURCE_STREAK DESC, s.TOPIC_STREAK DESC LIMIT 50;

    INSERT INTO STREAKS_ALLTIME_LEADERBOARD (USERNAME, LOCATION_STREAK_HIGH, SOURCE_STREAK_HIGH, TOPIC_STREAK_HIGH) SELECT USERNAME, s.LOCATION_STREAK_HIGH, s.SOURCE_STREAK_HIGH, s.TOPIC_STREAK_HIGH FROM USER_LOGIN u
        INNER JOIN SCORES s ON u.ID = s.ID
        ORDER BY s.LOCATION_STREAK_HIGH DESC, s.SOURCE_STREAK_HIGH DESC, s.TOPIC_STREAK_HIGH DESC LIMIT 50;

    INSERT INTO CORRECT_LEADERBOARD (USERNAME, LOCATION_TOTAL_CORRECT, SOURCE_TOTAL_CORRECT, TOPIC_TOTAL_CORRECT) SELECT USERNAME, s.LOCATION_TOTAL_CORRECT, s.SOURCE_TOTAL_CORRECT, s.TOPIC_TOTAL_CORRECT FROM USER_LOGIN u
        INNER JOIN SCORES s ON u.ID = s.ID
        ORDER BY s.LOCATION_TOTAL_CORRECT DESC, s.SOURCE_TOTAL_CORRECT DESC, s.TOPIC_TOTAL_CORRECT DESC LIMIT 50;

    INSERT INTO TOTAL_PLAYED_LEADERBOARD (USERNAME, TOTAL_PLAYED) SELECT USERNAME, s.TOTAL_PLAYED FROM USER_LOGIN u
        INNER JOIN SCORES s ON u.ID = s.ID
        ORDER BY s.TOTAL_PLAYED DESC LIMIT 50;

    INSERT INTO ACCURACY_LEADERBOARD (USERNAME, LOCATION_ACCURACY, SOURCE_ACCURACY, TOPIC_ACCURACY) SELECT USERNAME, IF(s.TOTAL_PLAYED = 0, 0, (s.LOCATION_TOTAL_CORRECT / s.TOTAL_PLAYED)), IF(s.TOTAL_PLAYED = 0, 0, (s.SOURCE_TOTAL_CORRECT / s.TOTAL_PLAYED)), IF(s.TOTAL_PLAYED = 0, 0, (s.TOPIC_TOTAL_CORRECT / s.TOTAL_PLAYED)) FROM USER_LOGIN u
        INNER JOIN SCORES s ON u.ID = s.ID
        ORDER BY IF(s.TOTAL_PLAYED = 0, 0, (s.LOCATION_TOTAL_CORRECT / s.TOTAL_PLAYED)) DESC, IF(s.TOTAL_PLAYED = 0, 0, (s.SOURCE_TOTAL_CORRECT / s.TOTAL_PLAYED)) DESC, IF(s.TOTAL_PLAYED = 0, 0, (s.TOPIC_TOTAL_CORRECT / s.TOTAL_PLAYED)) DESC LIMIT 50;

    INSERT INTO ACCURACY_ALLTIME_LEADERBOARD (USERNAME, LOCATION_ACCURACY_HIGH, SOURCE_ACCURACY_HIGH, TOPIC_ACCURACY_HIGH) SELECT USERNAME, IF(s.TOTAL_PLAYED = 0, 0, (s.LOCATION_TOTAL_CORRECT / s.TOTAL_PLAYED)), IF(s.TOTAL_PLAYED = 0, 0, (s.SOURCE_TOTAL_CORRECT / s.TOTAL_PLAYED)), IF(s.TOTAL_PLAYED = 0, 0, (s.TOPIC_TOTAL_CORRECT / s.TOTAL_PLAYED)) FROM USER_LOGIN u
        INNER JOIN SCORES s ON u.ID = s.ID
        ORDER BY IF(s.TOTAL_PLAYED = 0, 0, (s.LOCATION_TOTAL_CORRECT / s.TOTAL_PLAYED)) DESC, IF(s.TOTAL_PLAYED = 0, 0, (s.SOURCE_TOTAL_CORRECT / s.TOTAL_PLAYED)) DESC, IF(s.TOTAL_PLAYED = 0, 0, (s.TOPIC_TOTAL_CORRECT / s.TOTAL_PLAYED)) DESC LIMIT 50;
END //
DELIMITER ;

DELIMITER //
-- DELETE OLD TOKENS
CREATE PROCEDURE delete_old_tokens()
BEGIN
    DELETE FROM TOKEN_TABLE WHERE EXPIRATION_DATE < NOW();
END //
DELIMITER ;

DELIMITER //
-- DELETE OLD VERIFICATION CODES
CREATE PROCEDURE delete_old_verification_codes()
BEGIN
    DELETE FROM VERIFICATION_CODES WHERE EXPIRATION_DATE < NOW();
END //
DELIMITER ;

DELIMITER //
-- DELETE OLD SENSITIVE TOKENS
CREATE PROCEDURE delete_old_sensitive_tokens()
BEGIN
    DELETE FROM SENSITIVE_TOKENS WHERE EXPIRATION_DATE < NOW();
END //
DELIMITER ;

-- Delete old tokens every 12 hours
CREATE EVENT IF NOT EXISTS delete_old_token_event ON SCHEDULE EVERY 12 HOUR DO CALL delete_old_tokens;

-- Delete old verification codes 5 minutes
CREATE EVENT IF NOT EXISTS delete_old_verification_codes_event ON SCHEDULE EVERY 5 MINUTE DO CALL delete_old_verification_codes;

-- Delete old sensitive tokens every 5 minutes
CREATE EVENT IF NOT EXISTS delete_old_sensitive_tokens_event ON SCHEDULE EVERY 5 MINUTE DO CALL delete_old_sensitive_tokens;

-- Update leaderboard every 1 minute
CREATE EVENT IF NOT EXISTS update_leaderboard_event ON SCHEDULE EVERY 1 MINUTE DO CALL update_leaderboard;

CALL insert_user_login('apple', 'apple', 'password');
CALL insert_user_login('banana', 'banana', 'password');
CALL insert_user_login('cherry', 'cherry', 'password');

insert into friends values (3, 2);
insert into friends values (3, 1);