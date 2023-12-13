import React, { useEffect } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom'

// ID : NCXl7jpKm7KDwpD6yaB7
// PW : sJkLB_NdUS


const clientId = 'NCXl7jpKm7KDwpD6yaB7';
const redirectUri = 'http://localhost:3000';


const handleNaverLogin = () => {

  window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}`;
};


const handleNaverCallback = () => {

  const accessToken = window.location.hash.split('&')[0].split('=')[1];
  

  axios.get('https://openapi.naver.com/v1/nid/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  .then(response => {

    console.log(response.data);
  })
  .catch(error => {
    console.error('Error fetching user info from Naver API:', error);
  });
};

const MyComponent = () => {
  return (
    <div>
      <button onClick={handleNaverLogin}>네이버 로그인</button>
    </div>
  );
};

export default MyComponent;
