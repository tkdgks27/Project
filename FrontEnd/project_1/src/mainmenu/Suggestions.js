import React from 'react'

const bodyStyle = {
  backgroundColor: "#17171e",
  paddingTop: 100,
  paddingBottom: 10,
  height: "100vh"
};

const Suggestion = () => {
  return (
    <div style={bodyStyle}>
    <h2>건의사항</h2>
    제목 : <input /><p />
    파일 : <input type='file' /><p />
    <button>업로드</button>
    <hr />
    <table border={1}></table>
  
    </div>
  );
};

export default Suggestion;