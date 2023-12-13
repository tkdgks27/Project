import React from "react";
import { Link } from "react-router-dom";

const Main = () => {
  return <>
  <h1>Main page</h1>
  <Link to="/gallery">게시판으로</Link>
  <br />
  <Link to="/signin">로그인</Link>
  <br />
  </>;
};

export default Main;
