import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const bodyStyle = {
    backgroundColor: "#17171e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    paddingTop: 70,
    paddingBottom: 0,
};

const formStyle = {
    width: "1000px",
    padding: "20px",
    border: "2px solid #fff",
    borderRadius: "10px",
    backgroundColor: "#1f1f2e",
    color: "#fff",
};

const titlestyle = {
    width: "900px",
};

const detailstyle = {
    width: "1000px",
    height: "500px",
};

const Boardwrite = () => {
    const navigate = useNavigate();

    const [board, setBoard] = useState({
        title: "",
        id: "",
        subject: "",
    });

    const [num, setNum] = useState(null);

    const { title, id, subject } = board;

    const onChange = (event) => {
        const { value, name } = event.target;
        setBoard({
            ...board,
            [name]: value,
        });
    };

    const onFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setBoard({
            ...board,
            file: selectedFile,
        });
    };

    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return '${year}-${month}-${day}';
    }

    const saveBoard = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("id", id);
        formData.append("subject", subject);
        formData.append("date", getCurrentDate());
        if (board.file) {
            formData.append("file", board.file);
        }

        try {
            const response = await axios.get("http://localhost:3001/write.do", formData);
            const {num} = response.data;
            setNum(num);

            alert("등록되었습니다. 글번호: " + num);
            navigate("/board");
        } catch (error) {
            alert("등록실패했습니다.")
            console.error("에러:", error);
        }
    };

    const backToList = () => {
        navigate('/board');
      };

    return (
        <div style={bodyStyle}>
            <div style={formStyle}>
                {num && (
                    <div>
                        <span>글 번호 : {num}</span>
                    </div>
                )}
                <div>
                    <span>제목 : </span>
                    <input
                        style={titlestyle}
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChange}
                    />
                </div>
                <br />
                <div>
                    <span>작성자 : </span>
                    <input
                        type="text"
                        name="id"
                        value={id}
                        onChange={onChange}
                    />
                </div>
                <div>
                    <span>작성 날짜 : {getCurrentDate()}</span>
                </div>
                <br />
                <div>
                    <span>내용</span>
                    <textarea
                        style={detailstyle}
                        name="subject"
                        cols="30"
                        rows="10"
                        value={subject}
                        onChange={onChange}
                    ></textarea>
                </div>
                <div>
                    파일 : <input type="file" onChange={onFileChange} />
                    <p />
                </div>
                <br />
                <div>
                    <button onClick={saveBoard}>저장</button>
                    <button onClick={backToList}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default Boardwrite;
