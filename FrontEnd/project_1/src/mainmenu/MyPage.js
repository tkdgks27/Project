import React from 'react';

const MyPage = () => {
  const bodyStyle = {
    backgroundColor: "#17171e",
    paddingTop: 100,
    paddingBottom: 10,
    height: "100vh",
  };

  const fontStyle = {
    color: "white",
  }
  
  return (
    <div style={bodyStyle}>
      <h1 style={fontStyle}>My page</h1>
    </div>
  );
};

export default MyPage;