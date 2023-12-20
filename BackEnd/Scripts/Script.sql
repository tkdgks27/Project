CREATE TABLE pro_member(
	pro_num number(3) PRIMARY KEY,
	pro_id varchar2(20 char) unique,
	pro_pw varchar2(40 char) NOT NULL,
	pro_email varchar2(200 char) unique,
	pro_birth DATE NOT NULL,
	pro_address varchar2(400 char) NOT NULL,
	pro_admin varchar2(10 char)
);

CREATE TABLE pro_community(
	com_num NUMBER(7) PRIMARY KEY,
	com_id varchar2(20 char) UNIQUE,
	com_title varchar2(100 char) NOT NULL,
	com_subject varchar2(1000 char) NOT NULL,
	com_file varchar2(2000 char),
	com_date DATE NOT NULL,
	FOREIGN key(com_id) REFERENCES pro_member(pro_id)
	ON DELETE cascade
);

CREATE TABLE pro_comment(
	com_num number(3) PRIMARY KEY,
	com_id varchar2(20 char) NOT NULL,
	com_comment varchar2(100 char) NOT NULL,
	com_titleNum number(7) NOT NULL,
	FOREIGN KEY (com_titleNum) REFERENCES pro_community(com_num),
	FOREIGN KEY (com_id) REFERENCES pro_member(pro_id)
	ON DELETE cascade
);

ALTER TABLE pro_community
drop COLUMN com_comment ;

ALTER TABLE pro_community
RENAME COLUMN pro_date TO com_date;


SELECT com_num, com_id, com_title, com_date
FROM pro_member, PRO_COMMUNITY
WHERE pro_id = com_id LIKE %%
ORDER BY com_date DESC ;


CREATE SEQUENCE pro_one_community_seq;

SELECT * FROM PRO_COMMUNITY ;

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