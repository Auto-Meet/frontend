import React, { useState, useCallback } from "react";
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
  margin-left: 36vw;
  margin-right: 36vw;
  padding-left: 5vw;
  padding-top: 8vh;
`;

const SubmitInput = styled.input`
  font-size: 15px;
  border: none;
  border-bottom: 1px solid #8d8d8d;
  color: #8d8d8d;
  padding: 5px;
  width: 60%;
`;

const SubmitBtn = styled.button`
  background: #1f316f;
  border-radius: 10px;
  color: white;
  font-size: 20px;
  font-weight: 600;
  width: 80%;
  margin-top: 4%;
  margin-bottom: 5%;
  padding-top: 2%;
  padding-bottom: 2%;
  cursor: pointer;
`;

const Create = () => {
  const navigate = useNavigate();
  const [mySessionId, setMySessionId] = useState(""); //session(회의방) 구분하기 위한 id
  const [myUserName, setMyUserName] = useState(""); //회의방에서 사용할 이름

  const handleChangeSessionId = useCallback((e) => {
    setMySessionId(e.target.value);
  }, []);

  const handleChangeUserName = useCallback((e) => {
    setMyUserName(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    //sessionId와 userName을 "room page"에 전달해준다.
    (e) => {
      e.preventDefault();
      navigate("/room", { state: { mySessionId, myUserName } });
    },
    [mySessionId, myUserName, navigate]
  );

  return (
    <>
      <Logo>AUTOMEET</Logo>
      <Box>
        <form onSubmit={handleSubmit}>
          <div style={{ fontSize: "20px", marginBottom: "7%" }}>
            <label>Name </label>
            <SubmitInput
              type="text"
              id="userName"
              value={myUserName}
              placeholder="사용하실 이름을 입력해주세요."
              onChange={handleChangeUserName}
              required
            />
          </div>

          <div style={{ fontSize: "20px", marginBottom: "4%" }}>
            <label> Room ID </label>
            <SubmitInput
              type="text"
              id="sessionId"
              value={mySessionId}
              placeholder="회의방 ID를 입력해주세요."
              onChange={handleChangeSessionId}
              required
              style={{
                width: "55%",
              }}
            />
          </div>

          <p
            style={{
              textAlign: "center",
              marginRight: "20%",
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
