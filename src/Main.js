import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/main.css';

const Main = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [musinsa, setMusinsa] = useState({ musinsaId: '', musinsaPassword: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(60);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      alert('로그인이 필요합니다.');
      navigate('/');
    } else {
      setUserEmail(email);
      checkMusinsaRegistered(email);
    }
  }, [navigate]);

  const checkMusinsaRegistered = async (email) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/musinsa?email=${email}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.musinsaId) {
          setIsRegistered(true);
        }
      }
    } catch (error) {
      console.error('등록 확인 실패:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  const handleChange = (e) => {
    setMusinsa({ ...musinsa, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('userEmail');
    const url = `${process.env.REACT_APP_API_URL}/api/users/musinsa`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          musinsaId: musinsa.musinsaId,
          musinsaPassword: musinsa.musinsaPassword,
        }),
      });

      const data = await response.text();
      alert(response.ok ? '✅ ' + data : '❌ ' + data);
      if (response.ok) setIsRegistered(true);
    } catch (err) {
      alert('서버 요청 실패: ' + err.message);
    }
  };

// 토글글
  const handleTriggerAirflowDag = async (email) => {
    try {
      const response = await fetch('http://localhost:8081/api/v1/dags/dags_sale_info/dagRuns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('airflow:airflow') // Basic 인증 정보
        },
        body: JSON.stringify({
          conf: { user_email: email }
        })
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('✅ DAG 실행 성공:', result);
      } else {
        console.error('❌ DAG 실행 실패:', result);
      }
    } catch (err) {
      console.error('서버 요청 오류:', err);
    }
  };

  

  return (
    <div>
      <header style={{
        position: 'fixed', top: 0, left: 0, width: '100%',
        backgroundColor: '#f5f5f5', padding: '15px 0', textAlign: 'center',
        borderBottom: '1px solid #ddd', zIndex: 1000
      }}>
        <h1 style={{ margin: '0', fontSize: '1.2rem' }}>🎉 환영합니다, {userEmail}님!</h1>
        <button onClick={handleLogout} style={{ marginTop: '5px' }}>로그아웃</button>
      </header>

      <main style={{ paddingTop: '120px', textAlign: 'center' }}>
        <div className="login-box">
          <h2>무신사 계정 등록</h2>

          {isRegistered ? (
            <div>
              <p style={{ color: '#fff' }}>✅ 이미 등록된 무신사 계정입니다.</p>
              <button
                onClick={async () => {
                  const userEmail = localStorage.getItem('userEmail');

                  // 1️⃣ DAG 실행
                  await handleTriggerAirflowDag(userEmail);

                  // 2️⃣ 쿨다운 시작
                  setIsCooldown(true);
                  let countdown = 60;
                  setCooldownTime(countdown);
                  const interval = setInterval(() => {
                    countdown -= 1;
                    setCooldownTime(countdown);
                    if (countdown <= 0) {
                      clearInterval(interval);
                      setIsCooldown(false);
                    }
                  }, 1000);
                }}
                disabled={isCooldown}
                style={{
                  marginTop: '20px',
                  backgroundColor: isCooldown ? '#ccc' : '#03e9f4',
                  color: '#000',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: isCooldown ? 'not-allowed' : 'pointer'
                }}
              >
                {isCooldown ? `⏳ ${cooldownTime}초 후 재시도` : '관심 상품 세일 알림 받기'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="user-box">
                <input type="text" name="musinsaId" value={musinsa.musinsaId} onChange={handleChange} required />
                <label>아이디</label>
              </div>
              <div className="user-box">
                <input type="password" name="musinsaPassword" value={musinsa.musinsaPassword} onChange={handleChange} required />
                <label>비밀번호</label>
              </div>
              <button type="submit" style={{ marginTop: '20px', background: 'rgba(0,0,0,.5)', borderColor: 'rgba(0,0,0,.5)' }}>등록</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Main;