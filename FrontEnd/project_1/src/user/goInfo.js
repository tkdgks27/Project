import React from 'react'
import { Link } from 'react-router-dom'
import UserInfo from './UserInfo';

const GoInfo = () => {
  return (
    <div>
    <Link to="/info">
    <button>확인</button>
    </Link>
    </div>
  );
};

export default GoInfo;