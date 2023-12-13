import React, { useEffect } from "react";
import "./Headerds.css";

const Header = () => {
    useEffect(() => {
        document.title = "AI를 활용한 음성합성 프로그램";
    });

    const loginButtonStyle = {
        position: "absolute",
        top: "30px",
        right: "10px",
      };

    return (
        <div>
            <header className="headerds">
                <div className="headerbx">
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a href="/" className="homeds">
                        홈
                    </a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a href="/gallery" className="boardds">
                        게시판
                    </a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a href="/qna" className="qnads">
                        Q&A
                    </a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a href="/suggestions" className="sugds">
                        건의사항
                    </a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                </div>
                <div className="mypagebx">
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a href="/mypage" className="mpds">
                        MyPage
                    </a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a href="/logout" className="logoutds">
                        LogOut
                    </a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a href= "/signin" style={loginButtonStyle}>
                        로그인
                    </a>
                </div>
                <hr />
            </header>
        </div>
    );
};

export default Header;
