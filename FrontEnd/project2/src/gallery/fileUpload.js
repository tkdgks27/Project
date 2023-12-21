import React from 'react'
import { Link } from 'react-router-dom';


const FileUpload = () => {
  return <>
    <Link to="/">홈으로</Link>
    <h2>게시판</h2>
    제목 : <input /><p />
    파일 : <input type='file' /><p />
    <button>업로드</button>
    <hr />
    <table border={1}></table>
  
  </>;
};


export default FileUpload;