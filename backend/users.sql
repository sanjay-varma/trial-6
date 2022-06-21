CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(60) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `avatar` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELIMITER //
CREATE PROCEDURE put_user(
    p_email varchar(60),
    p_first_name varchar(50),
    p_last_name varchar(50),
    p_avatar varchar(100)
)                                                                                                                                                                     
BEGIN
insert into user 
values (null, p_email, p_first_name, p_last_name, p_avatar)
on duplicate key update 
	email = p_email,
	first_name = p_first_name,
	last_name = p_last_name,
	avatar = p_avatar;
    
select id from user where email = p_email;
END//
DELIMITER ;

INSERT INTO user VALUES (null,'george.bluth@reqres.in','George','Bluth','https://reqres.in/img/faces/1-image.jpg');
INSERT INTO user VALUES (null,'janet.weaver@reqres.in','Janet','Weaver','https://reqres.in/img/faces/2-image.jpg');
INSERT INTO user VALUES (null,'eve.holt@reqres.in','Eve','Holt','https://reqres.in/img/faces/4-image.jpg');
INSERT INTO user VALUES (null,'charles.morris@reqres.in','Charles','Morris','https://reqres.in/img/faces/5-image.jpg');
INSERT INTO user VALUES (null,'tracey.ramos@reqres.in','Tracey','Ramos','https://reqres.in/img/faces/6-image.jpg');
INSERT INTO user VALUES (null,'michael.lawson@reqres.in','Michael','Lawson','https://reqres.in/img/faces/7-image.jpg');
INSERT INTO user VALUES (null,'lindsay.ferguson@reqres.in','Lindsay','Ferguson','https://reqres.in/img/faces/8-image.jpg');
INSERT INTO user VALUES (null,'tobias.funke@reqres.in','Tobias','Funke','https://reqres.in/img/faces/9-image.jpg');
INSERT INTO user VALUES (null,'byron.fields@reqres.in','Byron','Fields','https://reqres.in/img/faces/10-image.jpg');
INSERT INTO user VALUES (null,'george.edwards@reqres.in','George','Edwards','https://reqres.in/img/faces/11-image.jpg');
INSERT INTO user VALUES (null,'rachel.howell@reqres.in','Rachel','Howell','https://reqres.in/img/faces/12-image.jpg');