import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

//style
const Logo = styled.p`
  font-size: 40px;
  color: #112d4e;
  font-weight: 600;
  text-align: center;
  margin-top: 20vh;
  margin-bottom: 2vh;
`;

const Box = styled.div`
  background: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  margin-left: 38vw;
  margin-right: 38vw;
  padding-left: 3vw;
  padding-top: 8vh;
`;

const SubmitInput = styled.input`
  font-size: 15px;
  border: none;
  border-bottom: 1px solid #8d8d8d;
  color: #8d8d8d;
  padding: 1%;
  width: 81%;
`;

const SubmitBtn = styled.button`
  background-color: ${({ state }) => (state ? "#1F316F" : "#f2f2f2")};
  border-radius: 10px;
  color: white;
  border: none;
  font-size: 20px;
  font-weight: 600;
  width: 85%;
  margin-top: 4%;
  margin-bottom: 4%;

  padding-top: 2.5%;
  padding-bottom: 2.5%;
  cursor: pointer;
`;

const SignUp = styled.p`
  margin-right: 17%;
  margin-bottom: 13%;
  text-align: right;
  cursor: pointer;
`;

const Login = () => {
  const navigate = useNavigate();
  const emailInput = useRef();
  const passwordInput = useRef();

  const [state, setState] = useState({
    email: "",
    password: "",
    check: false,
  });

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
      check:
        state.email.length > 0 &&
        state.password.length > 0 &&
        e.target.value.length > 0,
    });
  };

  //아무것도 입력하지 않은 경우, 해당 부분에 focus을 준다.
  const handleSubmit = () => {
    if (state.email.length < 1) {
      emailInput.current.focus();
      return;
    }

    if (state.password.length < 1) {
      passwordInput.current.focus();
      return;
    }
  };

  const moveToSignUp = () => {
    navigate("/signUp");
  };
  return (
    <>
      <Logo>AUTOMEET</Logo>
      <Box>
        <SubmitInput
          ref={emailInput}
          name="email"
          type="text"
          placeholder="이메일을 입력해주세요."
          onChange={handleChangeState}
          style={{ marginBottom: "10%" }}
        />

        <SubmitInput
          ref={passwordInput}
          name="password"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          onChange={handleChangeState}
          style={{ marginBottom: "20%" }}
        />

        <SubmitBtn onClick={() => handleSubmit()} state={state.check}>
          로그인
        </SubmitBtn>

        <SignUp onClick={() => moveToSignUp()}>회원가입</SignUp>
      </Box>
    </>
  );
};

export default Login;
