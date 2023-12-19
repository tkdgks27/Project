import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Board from '../components/Board';

const BoardDetail = () => {
    const { idx } = useParams();
    const [loading, setLoading] = useState(true);
    const [board, setBoard] = useState({});
    const getBoard = async () => {
        const response = await (await axios.get("http://localhost:3001/write.do/${idx}")).data;
        setBoard(response.data);
        setLoading(false);
    };

    useEffect(() => {
        getBoard();
    })

  return (
    <div>
        {loading ? (
            <h2>loading...</h2>
        ) : (
            <Board 
            idx={board.idx}
            title={board.title}
            subject={board.subject}
            id={board.id}
            />
        )}
    </div>
  );
};

export default BoardDetail;