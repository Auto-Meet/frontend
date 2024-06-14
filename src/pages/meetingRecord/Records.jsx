import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logo = styled.h1`
  font-size: 40px;
  color: #112d4e;
  margin-top: 10vh;
  margin-bottom: 5vh;
  margin-left: 25vw;
`;

const TopBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2vh;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 25vw;
`;

const Title = styled.p`
  font-size: 30px;
  color: #112d4e;
`;

const SubTitle = styled.p`
  font-size: 18px;
  color: #6f6f6f;
  margin-right: 2vw;
`;

const ContentBox = styled.div`
  background: #ffffff;
  border: 1.5px solid #eaebed;
  border-radius: 15px;
  margin-left: 25vw;
  margin-right: 25vw;
  margin-bottom: 1vh;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 1.3%;
  padding-bottom: 1.3%;

  transition: background-color 0.3s;
  &:hover {
    background: #dbe2ef;
  }

  cursor: pointer;
`;

const RBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2%;
`;

const ContentTitle = styled.p`
  font-size: 16px;
`;

const ContentDate = styled.p`
  font-size: 16px;
`;

const Content = styled.p`
  font-size: 16px;
  font-weight: 500;
`;

const Record = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const PROXY = window.location.hostname === "localhost" ? "" : "/proxy";

  useEffect(() => {
    axios
      .get(`${PROXY}/api/meet`, {
        headers: {
          "Access-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setList(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  return (
    <>
      <Logo>AUTOMEET</Logo>

      <TopBox>
        <TitleBox>
          <Title>회의록 목록</Title>
          <SubTitle>
            지난 회의에서 자동으로 작성된 회의록과 회의 분위기 분석결과를
            확인해보세요.
            <br />
            직접 수정 및 삭제 가능합니다.
          </SubTitle>
        </TitleBox>
        <img src={`${process.env.PUBLIC_URL}/imgs/letters.svg`} alt="" />
      </TopBox>

      {list.map((value, index) => (
        <ContentBox
          onClick={() => {
            navigate("/meetingRecordDetail");
          }}
        >
          <RBox>
            <ContentTitle>{value.title}</ContentTitle>
            <ContentDate>
              {value.meetingTime?.split("T")[0]}&nbsp;
              {value.meetingTime?.split("T")[1]?.split(".")[0]}
            </ContentDate>
          </RBox>

          <Content>{value.content}</Content>
        </ContentBox>
      ))}
    </>
  );
};

export default Record;
