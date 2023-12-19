import React, { useEffect } from "react";
import "./Headerds.css";

const Header = () => {
    useEffect(() => {
        document.title = "AI를 활용한 음성합성 프로그램";
    });

    return (
            <header className="mainmenuds">
                <div className="mainlogo">
                    <a href="/" className="homeds">
                    AI를 활용한 
                    <br></br>
                    음성합성 프로그램
                    </a>
                </div>
                <div className="mainmenubx">
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a href="/board" className="boardds">
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
                    <a href= "/signin" className="loginds">
                        로그인
                    </a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                </div>
            </header>       
    );
};

export default Header;
