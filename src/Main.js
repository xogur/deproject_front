// src/Main.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      alert('로그인이 필요합니다.');
      navigate('/'); // 로그인 안 돼있으면 redirect
    } else {
      setUserEmail(email);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>🎉 환영합니다, {userEmail}님!</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default Main;
