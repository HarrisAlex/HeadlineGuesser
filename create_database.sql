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
    SALT VARCHAR(255) NOT NULL
);

CREATE TABLE SCORES (
    ID INT NOT NULL PRIMARY KEY,
    SCORE INT NOT NULL,
    FOREIGN KEY (ID) REFERENCES USER_LOGIN(ID)
);

CREATE TABLE TOKEN_TABLE (
    ID INT NOT NULL PRIMARY KEY,
    TOKEN CHAR(255) NOT NULL,
    EXPIRATION_DATE TIMESTAMP NOT NULL,
    FOREIGN KEY (ID) REFERENCES USER_LOGIN(ID)
);

CREATE TABLE LEADERBOARD (
    USERNAME VARCHAR(255) NOT NULL PRIMARY KEY,
    SCORE INT NOT NULL
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
        RESPONSE_STATUS VARCHAR(20),
        RESPONSE_MESSAGE VARCHAR(255)
    );

    SELECT COUNT(*) INTO emailExists FROM USER_LOGIN WHERE EMAIL = input_email;
    SELECT LENGTH(input_pass) INTO passLength;

    -- Check if email already exists and password is valid
    IF emailExists > 0 THEN
        INSERT INTO RESPONSE VALUES ('ERROR', 'EMAIL_EXISTS');
    ELSEIF passLength < 8 THEN
        INSERT INTO RESPONSE VALUES ('ERROR', 'PASSWORD_LENGTH_ERROR');
    ELSE
        -- Generate salt
        SET salt = HEX(RANDOM_BYTES(64));

        -- Create token id
        SET tokenID = UUID();

        -- Insert user
        INSERT INTO USER_LOGIN (EMAIL, USERNAME, PASS, SALT) VALUES (input_email, input_username, SHA2(CONCAT(input_pass, salt), 256), salt);
        INSERT INTO SCORES (SCORE, ID) VALUES (0, (SELECT ID FROM USER_LOGIN WHERE EMAIL = input_email));
        INSERT INTO USER_INFO (DATEJOINED, ID) VALUES (NOW(), (SELECT ID FROM USER_LOGIN WHERE EMAIL = input_email));

        -- Insert token
        SELECT ID INTO userID FROM USER_LOGIN WHERE EMAIL = input_email;
        INSERT INTO TOKEN_TABLE (TOKEN, EXPIRATION_DATE, ID) VALUES (tokenID, DATE_ADD(NOW(), INTERVAL 1 DAY), userID);

        INSERT INTO RESPONSE VALUES ('SUCCESS', tokenID);
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
        RESPONSE_STATUS VARCHAR(20),
        RESPONSE_MESSAGE VARCHAR(255)
    );

    -- Get all users by email
    SELECT COUNT(*) INTO isValid FROM USER_LOGIN WHERE EMAIL = input_email;

    IF isValid = 0 THEN
        INSERT INTO RESPONSE VALUES ('ERROR', 'INVALID_USER');
    ELSE
        -- Get user id and salt
        SELECT ID, SALT INTO userID, userSalt FROM USER_LOGIN WHERE EMAIL = input_email;
        SET hashsedPass = SHA2(CONCAT(input_pass, userSalt), 256);

        -- Check if password is valid
        IF hashsedPass != (SELECT PASS FROM USER_LOGIN WHERE ID = userID) THEN
            INSERT INTO RESPONSE VALUES ('ERROR', 'INVALID_USER');
        ELSE
            -- Check for existing token
            IF (SELECT COUNT(*) FROM TOKEN_TABLE WHERE ID = userID AND EXPIRATION_DATE > NOW()) > 0 THEN
                -- Get existing token
                SELECT TOKEN INTO tokenID FROM TOKEN_TABLE WHERE ID = userID;
            ELSE
                -- Insert new token if none exists
                INSERT INTO TOKEN_TABLE (TOKEN, EXPIRATION_DATE, ID) VALUES (tokenID, DATE_ADD(NOW(), INTERVAL 1 DAY), userID);
            END IF;
            
            INSERT INTO RESPONSE VALUES ('SUCCESS', tokenID);
        END IF;
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- UPDATE SCORE
CREATE PROCEDURE update_score(IN input_token CHAR(255), IN input_score INT)
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userScore INT;
    DECLARE userID INT;

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS VARCHAR(20),
        RESPONSE_MESSAGE VARCHAR(255)
    );

    -- Check if token is valid
    SELECT COUNT(*) INTO isValid FROM TOKEN_TABLE WHERE TOKEN = input_token AND EXPIRATION_DATE > NOW();

    IF isValid = 0 THEN
        INSERT INTO RESPONSE VALUES ('ERROR', 'INVALID_TOKEN');
    ELSE
        -- Get user id
        SELECT ID INTO userID FROM TOKEN_TABLE WHERE TOKEN = input_token;
        SELECT SCORE INTO userScore FROM SCORES WHERE ID = userID;
        -- Update score
        UPDATE SCORES SET SCORE = (userScore + input_score) WHERE ID = userID;
        INSERT INTO RESPONSE VALUES ('SUCCESS', 'SCORE_UPDATED');
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- GET USER
CREATE PROCEDURE get_user(IN input_token CHAR(255), IN input_username VARCHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;
    DECLARE outputUsername VARCHAR(255);
    DECLARE userScore INT;
    DECLARE userJoinDate TIMESTAMP;

    -- Create response table
    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS VARCHAR(20),
        RESPONSE_MESSAGE VARCHAR(255),
        USERNAME VARCHAR(255),
        SCORE INT,
        JOINDATE TIMESTAMP
    );

    -- Check if token is valid
    SELECT COUNT(*) INTO isValid FROM TOKEN_TABLE WHERE TOKEN = input_token AND EXPIRATION_DATE > NOW();

    IF isValid = 0 THEN
        INSERT INTO RESPONSE VALUES ('ERROR', 'INVALID_TOKEN', NULL, NULL, NULL);
    ELSE
        SELECT COUNT(*) INTO isValid FROM USER_LOGIN WHERE USERNAME = input_username;

        IF isValid = 0 THEN
            INSERT INTO RESPONSE VALUES ('ERROR', 'INVALID_USER', NULL, NULL, NULL);
        ELSE
            -- Get user info
            SELECT ID INTO userID FROM USER_LOGIN WHERE USERNAME = input_username;

            -- Get username, score, date joined, and friend count
            SELECT USERNAME INTO outputUsername FROM USER_LOGIN WHERE ID = userID;
            SELECT SCORE INTO userScore FROM SCORES WHERE ID = userID;
            SELECT DATEJOINED INTO userJoinDate FROM USER_INFO WHERE ID = userID;

            INSERT INTO RESPONSE VALUES ('SUCCESS', 'USER_FOUND', outputUsername, userScore, userJoinDate);
        END IF;
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- GET FRIENDS
CREATE PROCEDURE get_friends(IN input_token CHAR(255), IN input_username VARCHAR(255))
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
        RESPONSE_STATUS VARCHAR(20),
        RESPONSE_MESSAGE VARCHAR(255),
        FRIEND_USERNAME VARCHAR(255)
    );

    -- Check if token is valid
    SELECT COUNT(*) INTO isValid FROM TOKEN_TABLE WHERE TOKEN = input_token AND EXPIRATION_DATE > NOW();

    IF isValid = 0 THEN
        INSERT INTO RESPONSE VALUES ('ERROR', 'INVALID_TOKEN', NULL);
    ELSE
        SELECT COUNT(*) INTO isValid FROM USER_LOGIN WHERE USERNAME = input_username;

        -- Check if user exists
        IF isValid = 0 THEN
            INSERT INTO RESPONSE VALUES ('ERROR', 'INVALID_USER', NULL);
        ELSE
            -- Get user id
            SELECT ID INTO userID FROM USER_LOGIN WHERE USERNAME = input_username;

            INSERT INTO RESPONSE VALUES ('SUCCESS', 'FRIENDS_FOUND', NULL);

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

                -- Insert friend into response table
                INSERT INTO RESPONSE VALUES ('SUCCESS', 'FRIEND_FOUND', friendUsername);
            END LOOP;

            CLOSE friendCursor;
        END IF;
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

DELIMITER //
-- GET LEADERBOARD
CREATE PROCEDURE get_leaderboard()
BEGIN
    -- Get leaderboard
    SELECT * FROM LEADERBOARD;
END //
DELIMITER ;

DELIMITER //
-- UPDATE LEADERBOARD
CREATE PROCEDURE update_leaderboard()
BEGIN
    -- Clear leaderboard
    TRUNCATE TABLE LEADERBOARD;
    -- Insert top 50 users into leaderboard
    INSERT INTO LEADERBOARD (USERNAME, SCORE) SELECT USERNAME, s.SCORE FROM USER_LOGIN u 
        INNER JOIN SCORES s ON u.ID = s.ID 
        ORDER BY s.SCORE DESC LIMIT 50;
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
-- TOKEN VALIDATION
CREATE PROCEDURE token_validation(IN input_token CHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;

    CREATE TEMPORARY TABLE IF NOT EXISTS RESPONSE (
        RESPONSE_STATUS VARCHAR(20),
        RESPONSE_MESSAGE VARCHAR(255)
    );

    -- Check if token is valid
    SELECT COUNT(*) INTO isValid FROM TOKEN_TABLE WHERE TOKEN = input_token AND EXPIRATION_DATE > NOW();

    IF isValid = 0 THEN
        INSERT INTO RESPONSE VALUES ('ERROR', 'INVALID_TOKEN');
    ELSE 
        INSERT INTO RESPONSE VALUES ('SUCCESS', 'VALID_TOKEN');
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

-- Delete old tokens every 12 hours
CREATE EVENT IF NOT EXISTS delete_old_token_event
ON SCHEDULE EVERY 12 HOUR
DO 
    CALL delete_old_tokens;

-- Update leaderboard every 1 minute
CREATE EVENT IF NOT EXISTS update_leaderboard_event
ON SCHEDULE EVERY 1 MINUTE
DO
    CALL update_leaderboard;

CALL insert_user_login('apple', 'apple', 'password');
CALL insert_user_login('banana', 'banana', 'password');
CALL insert_user_login('cherry', 'cherry', 'password');

insert into friends values (3, 2);
insert into friends values (3, 1);