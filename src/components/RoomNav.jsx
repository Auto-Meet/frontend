import React from "react";
import styled from "styled-components";

const Box = styled.div`
  background-color: #202124;
  height: 8vh;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RBox = styled.div`
  margin-left: 4vw;
`;

const RoomID = styled.p`
  font-size: 27px;
  color: white;
`;

const RoomNav = ({ sessionId }) => {
  return (
    <>
      <Box>
        <RBox>
          <RoomID>{sessionId}</RoomID>
          <p style={{ color: "#FF0000", fontSize: "12px" }}>
            🔴 회의방 입장과 동시에 자동 화면 녹화 및 음성 녹음이 진행됩니다.
          </p>
        </RBox>
      </Box>
    </>
  );
};

export default RoomNav;
