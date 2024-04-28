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

CREATE TABLE TOKEN_TABLE (
    TOKEN CHAR(255) NOT NULL,
    EXPIRATION_DATE TIMESTAMP NOT NULL,
    ID INT NOT NULL,
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
        INSERT INTO RESPONSE VALUES ('ERROR', 'Email already exists');
    ELSEIF passLength < 8 THEN
        INSERT INTO RESPONSE VALUES ('ERROR', 'Password must be at least 8 characters');
    ELSE
        -- Generate salt
        SET salt = HEX(RANDOM_BYTES(64));

        -- Insert user
        INSERT INTO USER_LOGIN (EMAIL, USERNAME, PASS, SALT) VALUES (input_email, input_username, SHA2(CONCAT(input_pass, salt), 256), salt);
        INSERT INTO RESPONSE VALUES ('SUCCESS', 'User created');
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
        INSERT INTO RESPONSE VALUES ('ERROR', 'invalid user login');
    ELSE
        -- Get user id and salt
        SELECT ID, SALT INTO userID, userSalt FROM USER_LOGIN WHERE EMAIL = input_email;
        SET hashsedPass = SHA2(CONCAT(input_pass, userSalt), 256);

        -- Check if password is valid
        IF hashsedPass != (SELECT PASS FROM USER_LOGIN WHERE ID = userID) THEN
            INSERT INTO RESPONSE VALUES ('ERROR', 'invalid user login');
        ELSE
            -- Insert token
            INSERT INTO TOKEN_TABLE (TOKEN, EXPIRATION_DATE, ID) VALUES (tokenID, DATE_ADD(NOW(), INTERVAL 1 DAY), userID);
            INSERT INTO RESPONSE VALUES ('SUCCESS', tokenID);
        END IF;
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
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
        INSERT INTO RESPONSE VALUES ('ERROR', 'invalid token');
    ELSE 
        INSERT INTO RESPONSE VALUES ('SUCCESS', 'valid token');
    END IF;

    SELECT * FROM RESPONSE;
    DROP TEMPORARY TABLE RESPONSE;
END //
DELIMITER ;

CREATE EVENT IF NOT EXISTS delete_old_token_event

-- Delete old tokens every 12 hours
ON SCHEDULE EVERY 12 HOUR
DO 
    CALL delete_old_tokens;