CREATE TABLE pro_member(
	pro_num number(3) PRIMARY KEY,
	pro_id varchar2(20 char) unique,
	pro_pw varchar2(40 char) NOT NULL,
	pro_email varchar2(200 char) unique,
	pro_birth DATE NOT NULL,
	pro_address varchar2(400 char) NOT NULL,
	pro_admin varchar2(10 char)
);
alter TABLE PRO_MEMBER 
MODIFY COLUMN 

CREATE TABLE pro_community(
	pro_num NUMBER(7) PRIMARY KEY,
	pro_id varchar2(20 char) UNIQUE,
	pro_title varchar2(100 char) NOT NULL,
	pro_subject varchar2(1000 char) NOT NULL,
	pro_file varchar2(2000 char),
	pro_date DATE NOT NULL,
	FOREIGN key(pro_id) REFERENCES pro_member(pro_id)
);



CREATE SEQUENCE pro_one_community_seq;

SELECT * FROM pro_member;

INSERT INTO pro_member values(pro_one_member_seq.nextval, 'tkdgks27', 'qaz1!', 'tkdgks27@naver.com', TO_date('1998-04-08', 'YYYY-MM-DD'), '수성구', '1');

CREATE TABLE pro_jwttoken(
	pro_token varchar2(500 char) NOT null
);

ALTER TABLE pro_member
ADD pro_admin varchar2(40 char);

CREATE TABLE pro_checkEmail(
	pro_cEmail varchar2(200 char) NOT null
);
SELECT  * FROM pro_checkEmail;

CREATE TABLE pro_banishedemail(
	pro_email varchar2(200) unique
);

CREATE TABLE bord_field(
	
);
DROP TABLE pro_checkEmail;

CREATE TABLE pro_banishedmail(
	pro_email varchar2(200) PRIMARY KEY
);

SELECT * FROM PRO_BANISHEDMAIL ;