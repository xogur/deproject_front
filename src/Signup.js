// 리액트의 useState를 사용용
import React, { useState } from 'react';
import './css/Signup.css';
// 페이지 이동 기능을 하게 해주는 useNavigate를 사용용
import { useNavigate } from 'react-router-dom'; // 추가

// 회원가입 함수수
const Signup = () => {
  // navigate에 페이지 이동 기능 선언언
  const navigate = useNavigate();
  // isSignUp객체를 선언하고 초기값은 true, 객체 값을 변환할때는 setIsSignUp함수를 사용해야 함함
  const [isSignUp, setIsSignUp] = useState(true);
  // form객체 선언, 초기값 선언, form값을 변환할 때 setForm함수를 사용해야 함함
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  // handleInputChange함수 선언, e == 이벤트가 발생  -> form객체 값을 변환환
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 현재 값을 뒤집어서 저장해줘. 즉, 클릭할 때마다 true ↔ false 전환!
  const togglePanel = () => {
    setIsSignUp(!isSignUp);
  };

  // ✅ 회원가입 요청
  const handleSignup = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:8000/api/users/signup';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      const data = await response.text();
      if (response.ok) {
        alert('✅ ' + data);
        localStorage.setItem('userEmail', form.email); // ✅ 로그인 상태 저장
        navigate('/main'); // ✅ 메인 페이지로 이동
      } else {
        alert('❌ ' + data);
      }
    } catch (error) {
      alert('서버 연결 실패: ' + error.message);
    }
  };

  // ✅ 로그인 요청
  const handleLogin = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:8000/api/users/login';
    // const url = 'http://backend:8000/api/users/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.text();
      if (response.ok) {
        alert('✅ ' + data);
        localStorage.setItem('userEmail', form.email); // ✅ 로그인 상태 저장
        navigate('/main'); // ✅ 메인 페이지로 이동
      } else {
        alert('❌ ' + data);
      }
    } catch (error) {
      alert('서버 연결 실패: ' + error.message);
    }
  };

  return (
    <div className={`container ${!isSignUp ? 'right-panel-active' : ''}`} id="container">
      {/* 🔹 회원가입 폼 */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignup}>
          <h1>Create Account __ </h1>
          {/* form 객체의 name값을 변경 */}
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
          {/* form 객체의 email값을 변경 */}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
          {/* form 객체의 password값을 변경 */}
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* 🔸 로그인 폼 */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLogin}>
          <h1>Sign in</h1>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* 🔁 오버레이 */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>이미 계정이 있다면 로그인하세요.</p>
            <button className="ghost" id="signIn" onClick={togglePanel}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>정보를 입력해 회원가입을 진행하세요.</p>
            <button className="ghost" id="signUp" onClick={togglePanel}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
