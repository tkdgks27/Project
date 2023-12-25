import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const bodyStyle = {
    backgroundColor: "#17171e",
    paddingTop: 100,
    paddingBottom: 10,
    height: "100vh"
};

const DataRoom = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [progress, setProgress] = useState(0);

  

  const connectionCheck = () => {
    axios
    .post("http://localhost:3001/data.uploadd", token, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
      })
      .then((res) => {
          console.log("토큰 검증 성공", res.data);
      console.log(res.data.id);
      // console.log(res.data.num);
      // console.log("title :", title);
      // console.log("subject :", subject);
      // console.log("file :", file);
  })
  .catch((error) => {
      console.error("토큰 검증 중 오류 발생:", error);
  });
};
const sendVideoChunks = async () => {
  const chunkSize = 1024 * 1024; // 1MB
  const file = document.getElementById("video-file").files[0];

  const totalChunks = Math.ceil(file.size / chunkSize);
  let currentChunk = 0;

  const sendNextChunk = async () => {
    const start = currentChunk * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("token", token)
    formData.append("chunk", chunk, file.name);
    formData.append("chunkNumber", currentChunk);
    formData.append("totalChunks", totalChunks);

    try {
      const resp = await axios.post("/post.get", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
        },
      });

      if (resp.status === 206) {
        setProgress(Math.round((currentChunk / totalChunks) * 100));
        currentChunk++;

        if (currentChunk < totalChunks) {
          sendNextChunk();
        }
      } else if (resp.status === 200) {
        const data = await resp.text();
        setProgress(data);
      }
    } catch (err) {
      console.error("Error uploading video chunk", err);
    }
  };

  sendNextChunk();
};
 
 
const handleDownload = async () => {
  try {
    // 파일 다운로드 API 호출
    const resp = await axios.get("/post.get", {
      responseType: 'blob', 
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    // 파일 다운로드
    const url = window.URL.createObjectURL(new Blob([resp.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'downloaded_file.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Error downloading file", err);
  }
  
}

useEffect(() => {
  connectionCheck();})


const bodyStyle = {
  backgroundColor: "#17171e",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  paddingTop: 70,
  paddingBottom: 0,
};




  return <>
    <Link to="/">홈으로</Link>
    <div style={bodyStyle}>
      <input id="video-file" type="file" name="file" />
      <button onClick={sendVideoChunks}>업로드</button>
      <div>{progress}%</div>

      <button onClick={handleDownload}>다운로드</button>
    </div>
  
  </>;
};


export default DataRoom;