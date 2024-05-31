import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
  margin-left: 36vw;
  margin-right: 36vw;
  padding-left: 2vw;
  padding-right: 2vw;
  padding-top: 8vh;
`;

const SubmitInput = styled.input`
  font-size: 15px;
  border: none;
  border-bottom: 1px solid #8d8d8d;
  color: #8d8d8d;
  padding: 1%;
  width: 96%;
  margin-top: 2%;
`;

const SubmitBtn = styled.button`
  background: #1f316f;
  border-radius: 10px;
  color: white;
  font-size: 20px;
  font-weight: 600;
  width: 100%;
  margin-top: 4%;
  margin-bottom: 7%;

  padding-top: 2.5%;
  padding-bottom: 2.5%;
  cursor: pointer;
`;

const Create = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(""); //회의록에서 사용할 회의록 제목
  const [mySessionId, setMySessionId] = useState(""); //session(회의방) 구분하기 위한 id
  const [myUserName, setMyUserName] = useState(""); //회의방에서 사용할 이름
  const [mySessionPW, setMySessionPW] = useState(""); //회의방 비밀번호

  //생성자 : "/api/sessions" -> "/api/sessions/connection" -> token
  //생성자가 방 생성하면, localstorage "owner" key에 true 입력

  const handleChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const handleChangeSessionId = useCallback((e) => {
    setMySessionId(e.target.value);
  }, []);

  const handleChangeSessionPW = useCallback((e) => {
    setMySessionPW(e.target.value);
  }, []);

  const handleChangeUserName = useCallback((e) => {
    setMyUserName(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    //sessionId와 userName을 "room page"에 전달해준다.
    (e) => {
      e.preventDefault();
      localStorage.setItem("owner", true);
      navigate("/room", {
        state: { title, mySessionId, myUserName, mySessionPW },
      });
    },
    [title, mySessionId, mySessionPW, myUserName, navigate]
  );

  return (
    <>
      <Logo>AUTOMEET</Logo>
      <Box>
        <form onSubmit={handleSubmit}>
          <div style={{ fontSize: "20px", marginBottom: "7%" }}>
            <label>회의제목 </label>
            <SubmitInput
              type="text"
              id="title"
              value={title}
              placeholder="회의록에 입력될 회의제목을 입력해주세요."
              onChange={handleChangeTitle}
              required
            />
          </div>

          <div style={{ fontSize: "20px", marginBottom: "7%" }}>
            <label> Room ID </label>
            <SubmitInput
              type="text"
              id="sessionId"
              value={mySessionId}
              placeholder="회의방 아이디를 입력해주세요."
              onChange={handleChangeSessionId}
              required
            />
          </div>

          <div style={{ fontSize: "20px", marginBottom: "7%" }}>
            <label> Room Password </label>
            <SubmitInput
              type="text"
              id="sessionPW"
              value={mySessionPW}
              placeholder="회의방 비밀번호를 입력해주세요."
              onChange={handleChangeSessionPW}
              required
            />
          </div>

          <div style={{ fontSize: "20px", marginBottom: "7%" }}>
            <label>name </label>
            <SubmitInput
              type="text"
              id="userName"
              value={myUserName}
              placeholder="회의방에서 사용할 이름을 입력해주세요."
              onChange={handleChangeUserName}
              required
            />
          </div>

          <p
            style={{
              textAlign: "center",

              marginTop: "30%",
              marginBottom: "1%",
            }}
          >
            입력하신 ID로 다른 팀원들에게 공유 시, <br />
            해당 회의방으로 입장 가능합니다.
          </p>
          <SubmitBtn type="submit" value="회의방 개설">
            회의방 개설
          </SubmitBtn>
        </form>
      </Box>
    </>
  );
};

export default Create;
