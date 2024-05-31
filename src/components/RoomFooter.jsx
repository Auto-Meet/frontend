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

const FBox = styled.div`
  display: flex;
  align-items: center;
  width: 100vw;
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
  margin-right: 4vw;
`;

const RecordBtn = styled.div`
  color: white;
  font-size: 18px;
  background: linear-gradient(
    90deg,
    #3274d6 0%,
    #3172d3 0.01%,
    #005be3 99.98%,
    #bccee8 99.99%
  );
  border-radius: 25px;
  padding-top: 0.5%;
  padding-bottom: 0.8%;
  padding-left: 1.7%;
  padding-right: 1.7%;
  cursor: pointer;
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
        <FBox>
          <Logo>AUTOMEET</Logo>
          <RecordBtn>✨AI 회의록 생성하기</RecordBtn>
        </FBox>

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
