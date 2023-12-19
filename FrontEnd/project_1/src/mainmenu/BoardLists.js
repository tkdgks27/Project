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

  const getBoardList = async () => {
    const response = await (await axios.get("http://localhost:3001/write.do")).data
    setBoardList(response.data);

    const pngn = response.pagination;
    console.log(pngn);
  };

  const MoveToWrite = () => {
    navigate('/boardwrite');
  };

  useEffect(() => {
    getBoardList();
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
