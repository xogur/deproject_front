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
        backgroundColor: '#fdfdfd', padding: '15px 0',
        textAlign: 'center', borderBottom: '1px solid #e0e0e0', zIndex: 1000,
        boxShadow: '0px 4px 12px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{ margin: '0', fontSize: '1.2rem' }}>안녕하세요 {userEmail}님! 오늘도 멋진 스타일을 찾아보세요!</h1>
        <button onClick={handleLogout} style={{ marginTop: '5px', backgroundColor: '#2C3E50', borderColor: '#2C3E50' }}>로그아웃</button>
      </header>

      <div style={{
        backgroundColor: '#f5f8fc',
        padding: '40px 30px',
        borderRadius: '20px',
        boxShadow: '8px 8px 20px #d1d9e6, -8px -8px 20px #ffffff',
        maxWidth: '800px',
        margin: '40px auto',
        textAlign: 'center',
        fontFamily: "'Pretendard', sans-serif"
      }}>
        
        <p style={{
          fontSize: '1.2rem',
          fontWeight: '500',
          color: '#f39c12',
          marginTop: '0'
        }}>
          당신의 오늘을 위한 패션 인사이트.
        </p>
      </div>

      <main style={{ paddingTop: '120px', textAlign: 'center'}}>
        <div className='box-container'>
        <div className="login-box">
          <h2>무신사 계정 등록</h2>
          {isRegistered ? (
            <div>
              <p style={{ color: '#fff' }}>이미 등록된 무신사 계정입니다.</p>
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
                  marginBottom: '20px',
                  backgroundColor: isCooldown ? '#ccc' : 'darkgrey',
                  color: 'white',
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
        
        <div className="login-box">
          <h2>패션 트렌드</h2>
          <p style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '10px' }}>
            무신사 계정 등록 후 AI가 분석한 트렌드를 확인할 수 있어요.
          </p>
          {isRegistered ? (
            <button
              onClick={() => {
                window.open('http://localhost:8501/', '_blank');
                
              }}
              style={{
                marginBottom: '20px',
                backgroundColor: 'darkgrey',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                cursor: isCooldown ? 'not-allowed' : 'pointer'
              }}
            >
              트렌드 분석 보러가기
            </button>
          ) : (
            <p style={{ color: '#fff' }}>무신사 계정 등록 후 사용 가능</p>
          )}
        </div>
        </div>
      </main>
    </div>
  );
};

export default Main;