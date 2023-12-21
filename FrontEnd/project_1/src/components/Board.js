import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Board = ({idx, title, subject, id, num, date }) => {
    const navigate = useNavigate();

    const MoveToUpdate = () => {
        navigate('/update/' + idx);
    };

    const DeleteBoard = async () => {
        if (window.confirm('게시글을 삭제하시겠습니까?')) {
            await axios.delete("http://localhost:3001/write.do/${idx}").then((res) => {
                alert('삭제되었습니다.');
                navigate('/board')
            });
        }
    };

    const MoveToList = () => {
        navigate('/board');
    };
            
  return (
    <div>
    <div>
        <h1>{num}</h1>
        <h2>{title}</h2>
        <h3>{id}</h3>
        <h4>{date}</h4>
        <hr />
        <p>{subject}</p>
    </div>
    <div>
        <button onClick={MoveToUpdate}>수정</button>
        <button onClick={DeleteBoard}>삭제</button>
        <button onClick={MoveToList}>목록</button>
    </div>
    </div>
  );
};

export default Board;