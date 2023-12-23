import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// title subject file 넣을 수 있게

// 토큰으로 작성자 식별하고

// 저장, 취소 버튼

// 파일 첨부 가능하게

// token 포함해서 write.do에 넣으면 token 식별해서 맞으면 올라가게

// write.do에 글이 저장된다.

// write.do에 있는 글을 게시판 페이지에서 끌어와서 띄워줘야된다

// 백엔드에서 글 번호 붙이고

const NewBoard = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  // const token = tokenString ? JSON.parse(tokenString) : null;
  // const token = sessionStorage.getItem("token");
  // const jsontoken = JSON.stringify(token);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [id, setId] = useState("");
  const [num, setNum] = useState("");
  const [userData, setUserData] = useState(null);
  
  const fileInput = useRef();
  
  const connectionCheck = () => {
      axios
      .post("http://localhost:3001/parse.JWT", token, {
          withCredentials: true,
          headers: {
              "Content-Type": "application/json",
              //   Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            console.log("토큰 검증 성공", res.data);
        setUserData(res.data);
        console.log(res.data.id);
        console.log(res.data.num);
        console.log(userData);
        // console.log("title :", title);
        // console.log("subject :", subject);
        // console.log("file :", file);
    })
    .catch((error) => {
        console.error("토큰 검증 중 오류 발생:", error);
    });
};


const saveBoard = () => {
    const board = new FormData();
    board.append("num",userData.num);
    //   board.append("num",num);
    //   board.append("id", id);
    board.append("id", userData.id);
    board.append("title", title);
    board.append("subject", subject);
    board.append("file", file);
    
    for (const pair of board.entries()) {
        console.log(pair[0], pair[1]);
    }
    // axios.get(`http://localhost:3001/write.do?token=${sessionStorage.getItem("token")}`)
    // .then((res) => {
        //   alert(JSON.stringify(res.data));
        // });
        axios
        .post("http://localhost:3001/write.do", board, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("저장 성공 : ", res.data);
      })
      .catch((error) => {
        // console.log("id:", id);
        // console.log("num:", num);
        console.error("저장실패: ", error);
        console.log(JSON.stringify(board));
        console.log(board);
        console.log(userData);
        // console.log("Token Value: ", tokenString);
        

        if (error.response) {
          // 서버 응답 왔을때
          alert("서버 오류 : " + error.response.status);
        } else if (error.request) {
          //요청은 가는데 응답이 안올때
          alert("서버 응답 오류");
          console.log("id :", userData.id);
          console.log("num :", userData.num);
        } else {
          // 요청 전송전에 에러발생
          alert("요청 전송 중 오류 발생");
        }
      });
  };
  useEffect(() => {
    connectionCheck();
  }, []);

  const backToList = () => {
    navigate("/board");
  }

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

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  };

  const getDynamicInputStyle = () => {
    return {
      width: "300px",
      padding: "10px",
      marginBottom: "10px",
      border: "2px solid #fff",
      borderRadius: "5px",
      backgroundColor: "#1f1f2e",
      color: "#fff",
      outline: "none",
    };
  };

  const inputStyle = {
    width: "300px",
    padding: "10px",
    marginBottom: "10px",
    border: "2px solid #fff",
    borderRadius: "5px",
    backgroundColor: "#1f1f2e",
    color: "#fff",
    outline: "none",
  };

  const buttonStyle = {
    marginTop: "-7px",
    marginLeft: "15px",
    cursor: "pointer",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "2px solid #fff",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "10px",
    whiteSpace: "nowrap",
  };

  const detailstyle = {
    width: "1000px",
    height: "500px",
};

  return (
    <div style={bodyStyle}>
      <div style={formStyle}>
        <label style={labelStyle}>
          제목:
            <input
            value={title}
            name="title"
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
              }}
            />
        </label>
        <label style={labelStyle}>
          내용
          <textarea
            style={detailstyle}
            value={subject}
            name="subject"
            cols="30"
            rows="10"
            type="text"
            onChange={(e) => {
              setSubject(e.target.value);
            }}
          />
        </label>
        <label>File: </label>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          />
        <p />
        <br />
          <div>
            <button style={buttonStyle} onClick={saveBoard}>
              게시
            </button>
            <button style={buttonStyle} onClick={backToList}>
              취소
            </button>
          </div>
        </div>
    </div>
  );
};

export default NewBoard;
