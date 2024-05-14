import React from "react";
import styled from "styled-components";
import HomeNav from "../components/HomeNav";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmptyBox = styled.div`
  width: 15vw;
`;

const Box = styled.div`
  display: flex;
  justify-content: center;
`;

const ClickBox = styled.div`
  width: 18vw;
  height: 64vh;
  background: #ffffff;
  border: 1.5px solid #eaebed;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin: 9px;

  transition: background-color 0.3s;
  &:hover {
    background: #f2f2f2;
  }
`;

const ClickMBox = styled.div`
  width: 13vw;
  height: 30vh;
  background: #ffffff;
  border: 1.5px solid #eaebed;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin: 9px;

  transition: background-color 0.3s;
  &:hover {
    background: #f2f2f2;
  }
`;

const ClockBox = styled.div`
  width: 27.3vw;
  height: 20vh;
  background: #ffffff;
  border: 1.5px solid #eaebed;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin: 9px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RBox = styled.div`
  display: flex;
`;

const LBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowBox = styled.div`
  display: flex;
`;

const Home = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
  }, []);

  return (
    <>
      <HomeNav />

      <Box>
        <EmptyBox />
        <RBox>
          <ClickBox
            onClick={() => {
              navigate("/createRoom");
            }}
          >
            <EmptyBox style={{ height: "18vh" }} />
            <img
              src={`${process.env.PUBLIC_URL}/imgs/meetRoom.svg`}
              style={{ marginLeft: "8%" }}
              alt=""
            />
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginTop: "60%",
                marginRight: "7%",
              }}
            >
              <p style={{ textAlign: "right", fontSize: "20px" }}>
                회의방 개설하기&nbsp;&nbsp;
              </p>
              <img
                src={`${process.env.PUBLIC_URL}/imgs/rightVector.svg`}
                alt=""
              />
            </div>
          </ClickBox>
          <ClickBox
            onClick={() => {
              navigate("/joinRoom");
            }}
          >
            <EmptyBox style={{ height: "18vh" }} />
            <img
              src={`${process.env.PUBLIC_URL}/imgs/join.svg`}
              style={{ marginLeft: "21%" }}
              alt=""
            />
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginTop: "63%",
                marginRight: "7%",
              }}
            >
              <p style={{ textAlign: "right", fontSize: "20px" }}>
                회의 참여하기&nbsp;&nbsp;
              </p>
              <img
                src={`${process.env.PUBLIC_URL}/imgs/rightVector.svg`}
                alt=""
              />
            </div>
          </ClickBox>
        </RBox>

        <LBox>
          <RowBox>
            <ClickMBox>
              <EmptyBox style={{ height: "7vh" }} />
              <img
                src={`${process.env.PUBLIC_URL}/imgs/letters.svg`}
                style={{ marginLeft: "27%" }}
                alt=""
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "22%",
                  marginRight: "7%",
                }}
              >
                <p style={{ textAlign: "right", fontSize: "20px" }}>
                  지난 회의록&nbsp;&nbsp;
                </p>
                <img
                  src={`${process.env.PUBLIC_URL}/imgs/rightVector.svg`}
                  alt=""
                />
              </div>
            </ClickMBox>
            <ClickMBox>
              <EmptyBox style={{ height: "5vh" }} />
              <img
                src={`${process.env.PUBLIC_URL}/imgs/contact.svg`}
                style={{ marginLeft: "27%" }}
                alt=""
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "25%",
                  marginRight: "7%",
                }}
              >
                <p style={{ textAlign: "right", fontSize: "20px" }}>
                  연락처&nbsp;&nbsp;
                </p>
                <img
                  src={`${process.env.PUBLIC_URL}/imgs/rightVector.svg`}
                  alt=""
                />
              </div>
            </ClickMBox>
          </RowBox>

          <ClockBox style={{ background: "#F7FBFC" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "13%",
              }}
            >
              <p style={{ fontSize: "28px" }}>
                {currentDate.toLocaleTimeString()}
              </p>
              <p style={{ fontSize: "18px" }}>
                {currentDate.toLocaleDateString()}
              </p>
            </div>
            <img
              src={`${process.env.PUBLIC_URL}/imgs/time.svg`}
              alt=""
              style={{ marginRight: "9%" }}
            />
          </ClockBox>
        </LBox>
        <EmptyBox />
      </Box>
    </>
  );
};

export default Home;
