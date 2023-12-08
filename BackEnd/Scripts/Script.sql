CREATE TABLE pro_member(
	pro_id varchar2(20 char) PRIMARY KEY,
	pro_pw varchar2(40 char) NOT NULL,
	pro_birth DATE NOT NULL,
	pro_email varchar2(200 char) NOT NULL,
	pro_address varchar2(400 char) NOT NULL
);
CREATE SEQUENCE pro_one_member_seq;

SELECT * FROM PRO_MEMBER pm;

CREATE TABLE pro_jwttoken(
	pro_token varchar2(500 char) NOT null
);
