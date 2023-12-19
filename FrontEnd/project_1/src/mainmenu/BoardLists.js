import React from 'react';
import { Link } from 'react-router-dom';

const bodyStyle = {
    backgroundColor: "#17171e",
    paddingTop: 100,
    paddingBottom: 10,
    height: "100vh"
};

const BoardList = () => {
  return (
    <div style={bodyStyle}>
    <h2>게시판</h2>
    제목 : <input /><p />
    파일 : <input type='file' /><p />
    <button>업로드</button>
    <hr />
    <table border={1}></table>
    <br />
    <Link to="/boardwrite">
    <button>글쓰기</button>
    </Link>
    </div>
  );
};

export default BoardList;