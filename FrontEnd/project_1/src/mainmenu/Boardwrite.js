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
        createdBy: "",
        contents: "",
    });

    const { title, createdBy, contents } = board;

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

    const saveBoard = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("createdBy", createdBy);
        formData.append("contents", contents);
        if (board.file) {
            formData.append("file", board.file);
        }

        try {
            await axios.post("//localhost:3000/board", formData);
            alert("등록되었습니다.");
            navigate("/board");
        } catch (error) {
            alert("등록실패했습니다.")
            console.error("에러:", error);
        }
    };

    return (
        <div style={bodyStyle}>
            <div style={formStyle}>
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
                        name="createdBy"
                        value={createdBy}
                        onChange={onChange}
                    />
                </div>
                <br />
                <div>
                    <span>내용</span>
                    <textarea
                        style={detailstyle}
                        name="contents"
                        cols="30"
                        rows="10"
                        value={contents}
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
                    <Link to="/board">
                        <button>취소</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Boardwrite;
