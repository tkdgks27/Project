import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const bodyStyle = {
    backgroundColor: "#17171e",
    paddingTop: 100,
    paddingBottom: 10,
    height: "100vh"
};

const BoardList = () => {
  const navigate = useNavigate();
  const [BoardList, setBoardList] = useState([]);
  const token = sessionStorage.getItem("token");

  const connectionCheck = () => {
    axios
    .post("http://localhost:3001/parse.JWT", token, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
      })
      .then((res) => {
          console.log("토큰 검증 성공", res.data);
      // console.log("title :", title);
      // console.log("subject :", subject);
      // console.log("file :", file);
  })
  .catch((error) => {
      console.error("토큰 검증 중 오류 발생:", error);
  });
};

  const getBoardList = async () => {
    const response = await (await axios.get("http://localhost:3001/write.do")).data
    setBoardList(response.data);

    const pngn = response.pagination;
    console.log(pngn);
  };

  const MoveToWrite = () => {
    navigate('/2board');
  };

  useEffect(() => {
    connectionCheck();
  }, []);

  return (
    <div style={bodyStyle}>
    <div>
      <ul>
        {BoardList.map((board) => (
          <li key={board.idx}>
            <Link to ={'/board/${board.idx}'}>{board.title}</Link>
          </li>
        ))}
      </ul>
    </div>
    <button onClick={MoveToWrite}>글쓰기</button>
    </div>
  );
};

export default BoardList;
