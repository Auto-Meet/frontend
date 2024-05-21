import React, { useState } from "react";
import styled from "styled-components";

const Box = styled.div`
  background-color: #202124;
  height: 8vh;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 4vw;
`;

const Logo = styled.p`
  color: white;
  font-size: 25px;
  font-weight: 600;
  margin-left: 4vw;
`;

const Circle = styled.img`
  height: 3.5vh;
  background-color: #494949;
  padding: 1vh;
  border-radius: 50px;
  cursor: pointer;
  margin-right: 1.2vw;
`;

const OffBtn = styled.img`
  background-color: #ff0000;
  height: 5vh;
  padding-left: 1.4vw;
  padding-right: 1.4vw;
  border-radius: 50px;
  cursor: pointer;
`;

const RoomFooter = ({ leaveSession, camOff, camOn, voiceOff, voiceOn }) => {
  const [cam, setCam] = useState(true); //false: OFF, true: ON
  const [voice, setVoice] = useState(true); //false: OFF, true: ON

  const camHandle = () => {
    if (cam) {
      //카메라가 켜져있는 경우
      camOff();
      setCam(false);
    } else {
      camOn();
      setCam(true);
    }
  };

  const voiceHandle = () => {
    if (voice) {
      //음성이 켜져있는 경우
      voiceOff();
      setVoice(false);
    } else {
      voiceOn();
      setVoice(true);
    }
  };

  return (
    <>
      <Box>
        <Logo>AUTOMEET</Logo>

        <MBox>
          <Circle
            src={`${process.env.PUBLIC_URL}/imgs/${
              voice ? "microphone.svg" : "microphoneOff.svg"
            }`}
            alt=""
            onClick={voiceHandle}
          />

          <Circle
            src={`${process.env.PUBLIC_URL}/imgs/${
              cam ? "cam.svg" : "camOff.svg"
            }`}
            alt=""
            onClick={camHandle}
          />

          <OffBtn
            src={`${process.env.PUBLIC_URL}/imgs/turnOff.svg`}
            alt=""
            onClick={leaveSession}
          />
        </MBox>
      </Box>
    </>
  );
};

export default RoomFooter;
