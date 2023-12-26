import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Board from '../components/Board';

const BoardDetail = () => {
    const { idx } = useParams();
    const [loading, setLoading] = useState(true);
    const token = sessionStorage.getItem("token");
    const [board, setBoard] = useState({});

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
    const getBoard = async () => {
        const response = await (await axios.get("http://localhost:3001/post.get")).data;
        setBoard(response.data);
        setLoading(false);
    };

    useEffect(() => {
        connectionCheck();
    }, [])

  return (
    <>
        <Link to={"/2board"}>
        <button>글쓰기</button>
        </Link>
        {/* {loading ? (
            <h2>loading...</h2>
        ) : (
            <Board 
            idx={board.idx}
            title={board.title}
            subject={board.subject}
            id={board.id}
            />
        )} */}
    </>
  );
};

export default BoardDetail;