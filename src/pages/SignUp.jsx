import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Swal from "sweetalert2";

//style
const Logo = styled.p`
  font-size: 40px;
  color: #112d4e;
  font-weight: 600;
  text-align: center;
  margin-top: 15vh;
  margin-bottom: 2vh;
`;

const Box = styled.div`
  background: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  margin-left: 38vw;
  margin-right: 38vw;
  padding-left: 2vw;
  padding-right: 2vw;
  padding-top: 3vh;
`;

const SubTitle = styled.p`
  text-align: center;
  font-size: 24px;
  margin-bottom: 7vh;
`;

const Label = styled.p`
  margin-bottom: 1vh;
`;

const SubmitInput = styled.input`
  font-size: 15px;
  border: none;
  border-bottom: 1px solid #8d8d8d;
  color: #8d8d8d;
  padding: 1%;
  width: 96%;
`;

const SubmitBtn = styled.button`
  background-color: ${({ state }) => (state ? "#1F316F" : "#f2f2f2")};
  border-radius: 10px;
  color: white;
  border: none;
  font-size: 20px;
  font-weight: 600;
  width: 100%;
  margin-top: 4%;
  margin-bottom: 7%;

  padding-top: 2.5%;
  padding-bottom: 2.5%;
  cursor: pointer;
`;

const SignUp = () => {
  const navigate = useNavigate();
  const emailInput = useRef();
  const passwordInput = useRef();
  const nameInput = useRef();
  const ageInput = useRef();
  const PROXY = window.location.hostname === "localhost" ? "" : "/proxy";

  const [state, setState] = useState({
    email: "",
    password: "",
    name: "",
    age: 0,
    check: false,
  });

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
      check:
        state.email.length > 0 && //이전값들
        state.password.length > 0 &&
        state.name.length > 0 &&
        e.target.value.length > 0, //현재값들
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

    if (state.name.length < 1) {
      nameInput.current.focus();
      return;
    }

    if (state.age.length < 1) {
      ageInput.current.focus();
      return;
    }

    console.log(state);
    axios
      .post(`${PROXY}/api/user/join`, {
        email: state.email,
        password: state.password,
        name: state.name,
        age: Number(state.age),
      })
      .then((res) => {
        localStorage.setItem("name", res.data.name);
        Swal.fire({
          text: "회원가입이 완료되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
          confirmButtonColor: "#1f316f",
        });
        navigate("/login");
      })
      .catch((err) => {
        Swal.fire({
          title: "회원가입 실패",
          text: err.response.data.message,
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "#1f316f",
        });
      });
  };

  return (
    <>
      <Logo>AUTOMEET</Logo>

      <Box>
        <SubTitle>가입을 시작합니다.</SubTitle>
        <Label>이메일 (email)</Label>
        <SubmitInput
          ref={emailInput}
          name="email"
          type="text"
          placeholder="사용하실 이메일을 입력해주세요."
          onChange={handleChangeState}
          style={{ marginBottom: "10%" }}
        />

        <Label>비밀번호 (password)</Label>
        <SubmitInput
          ref={passwordInput}
          name="password"
          type="password"
          placeholder="사용하실 비밀번호를 입력해주세요."
          onChange={handleChangeState}
          style={{ marginBottom: "10%" }}
        />

        <Label>이름 (name)</Label>
        <SubmitInput
          ref={nameInput}
          name="name"
          type="text"
          placeholder="이름을 입력해주세요."
          onChange={handleChangeState}
          style={{ marginBottom: "10%" }}
        />

        <Label>나이 (age)</Label>
        <SubmitInput
          ref={ageInput}
          name="age"
          placeholder="숫자로만 입력해주세요. 예) 25"
          onChange={handleChangeState}
          style={{ marginBottom: "20%" }}
        />
        <SubmitBtn onClick={() => handleSubmit()} state={state.check}>
          회원가입
        </SubmitBtn>
      </Box>
    </>
  );
};

export default SignUp;
