--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
CREATE TABLE `candidates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `age` varchar(45) NOT NULL,
  `isMol` tinyint(1) NOT NULL,
  `isOut` int(2) DEFAULT 0,
  `uuid` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idparticipants_UNIQUE` (`id`)
);

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_uuid` varchar(36) NOT NULL,
  `feedback` varchar(2000) NOT NULL,
  `email` varchar(90) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

--
-- Table structure for table `groupz`
--

DROP TABLE IF EXISTS `groupz`;
CREATE TABLE `groupz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `admin_uuid` varchar(36) DEFAULT NULL,
  `share_code` varchar(64) DEFAULT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `public` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `share_code_UNIQUE` (`share_code`)
);

--
-- Table structure for table `point_guesses`
--

DROP TABLE IF EXISTS `point_guesses`;
CREATE TABLE `point_guesses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mol_uuid` varchar(36) NOT NULL,
  `user_uuid` varchar(36) NOT NULL,
  `round` int(2) NOT NULL,
  `points` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guess` (`mol_uuid`,`user_uuid`,`round`)
);

--
-- Table structure for table `points_result`
--

DROP TABLE IF EXISTS `points_result`;
CREATE TABLE `points_result` (
  `user_uuid` varchar(36) NOT NULL,
  `unspent_points` int(11) NOT NULL,
  `scored_points` int(11) NOT NULL,
  `round` int(2) NOT NULL,
  `previous_points` int(11) NOT NULL,
  `new_points` int(11) NOT NULL,
  PRIMARY KEY (`user_uuid`,`round`),
  UNIQUE KEY `uniq_con` (`user_uuid`,`round`)
);

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `sid` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `session` text COLLATE utf8_unicode_ci NOT NULL,
  `expires` int(11) DEFAULT NULL,
  PRIMARY KEY (`sid`)
);

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(256) DEFAULT NULL,
  `lastName` varchar(256) DEFAULT NULL,
  `firstName` varchar(256) NOT NULL,
  `channel` varchar(64) NOT NULL,
  `openid` varchar(128) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  `available_points` int(11) DEFAULT 3,
  `endscore` int(11) DEFAULT 0,
  `uuid` varchar(36) DEFAULT NULL,
  `nickname` varchar(45) DEFAULT NULL,
  `is_public` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `IND_CHANNEL_OPENID` (`channel`,`openid`)
);

--
-- Table structure for table `users_in_group`
--

DROP TABLE IF EXISTS `users_in_group`;
CREATE TABLE `users_in_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_uuid` varchar(36) NOT NULL,
  `group_uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index2` (`group_uuid`,`user_uuid`)
);

--
-- Dumping routines for database
--
DELIMITER ;;
CREATE PROCEDURE `calculate_final_score`(IN in_user_uuid VARCHAR(64),  in_round INT)
BEGIN
	DECLARE start_points INT;
    DECLARE unspent_points INT;
    DECLARE scored_points INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
        BEGIN
            ROLLBACK;
            RESIGNAL;
        END;
    
    -- START TRANSACTION;
    
		SELECT available_points INTO start_points FROM users WHERE uuid = in_user_uuid;
        SELECT IFNULL(sum(points), 0) INTO scored_points FROM point_guesses WHERE user_uuid =  in_user_uuid and mol_uuid = (select uuid from candidates where isMol = 1);
		
		UPDATE users SET available_points = (scored_points + start_points ) WHERE uuid = in_user_uuid and id > 0;
	-- COMMIT;


END ;;
DELIMITER ;
DELIMITER ;;
CREATE PROCEDURE `calculate_final_scores`(IN in_round INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE user_uuid VARCHAR(36);
    DECLARE cur_users CURSOR FOR SELECT uuid FROM users;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur_users;

    read_loop: LOOP
        FETCH cur_users INTO user_uuid;
        IF done THEN
          LEAVE read_loop;
        END IF;
        CALL calculate_final_score(user_uuid, in_round);
    END LOOP;

    CLOSE cur_users;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE PROCEDURE `calculate_round_scores`(IN in_round INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE user_uuid VARCHAR(36);
    DECLARE cur_users CURSOR FOR SELECT uuid FROM users;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur_users;

    read_loop: LOOP
        FETCH cur_users INTO user_uuid;
        IF done THEN
          LEAVE read_loop;
        END IF;
        CALL calculate_score(user_uuid, in_round);
    END LOOP;

    CLOSE cur_users;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE PROCEDURE `calculate_score`(IN in_user_uuid VARCHAR(64),  in_round INT)
BEGIN
	DECLARE start_points INT;
    DECLARE unspent_points INT;
    DECLARE scored_points INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
        BEGIN
            ROLLBACK;
            RESIGNAL;
        END;
    
    START TRANSACTION;
    
		SELECT available_points INTO start_points FROM users WHERE uuid = in_user_uuid;
		SELECT IFNULL(start_points - sum(points), 0) INTO unspent_points  FROM point_guesses WHERE  user_uuid =  in_user_uuid and round = in_round;
		SELECT IFNULL(sum(points), 0) INTO scored_points FROM point_guesses WHERE user_uuid =  in_user_uuid and round = in_round and mol_uuid in (select uuid from candidates where isOut = 0);

		-- select startPoints, unspent_points, scored_points, (scored_points * in_round) + start_points from dual;
		INSERT INTO points_result
		(`user_uuid`,
		`unspent_points`,
		`scored_points`,
		`round`,
		`previous_points`,
		`new_points`)
		VALUES
		(in_user_uuid,
		unspent_points,
		scored_points,
		in_round,
		start_points,
		(scored_points * in_round) + start_points );
		
		UPDATE users SET available_points = ((scored_points * in_round) + start_points ) WHERE uuid = in_user_uuid and id > 0;
	COMMIT;


END ;;
DELIMITER ;


-- Dump completed: 2023-05
