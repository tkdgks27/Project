import React, { useEffect } from 'react'
import './Footerds.css';

const Footer = () => {
  useEffect(() => {
    document.title = "AI를 활용한 음성합성 프로그램";
  }, []);
  
  return (
    <footer className='footerds'>
        <div className='footerbx'>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href="/notice">공지사항</a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href="/use">이용약관</a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href="/privacy">개인정보처리방침</a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href="/ad">제휴/광고</a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
        </div>
    </footer>
  );
};

export default Footer;