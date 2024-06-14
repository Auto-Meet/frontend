import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Logo = styled.h1`
  font-size: 40px;
  color: #112d4e;
  margin-top: 10vh;
  margin-bottom: 3vh;
  margin-left: 25vw;

  cursor: pointer;
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

const Date = styled.p`
  margin-left: 25vw;
  margin-bottom: 1vh;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-left: 25vw;
  margin-bottom: 2vh;
`;

const Participants = styled.p`
  margin-left: 0.5vw;
`;

const ContentTitle = styled.input`
  background: #ffffff;
  border: 1.5px solid #eaebed;
  border-radius: 15px;
  width: 45vw;
  margin-left: 25vw;
  margin-right: 25vw;
  margin-bottom: 3vh;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 1.2%;
  padding-bottom: 1.2%;
  font-size: 18px;
  font-family: "BMJUA";
`;

const Content = styled.textarea`
  background: #ffffff;
  border: 1.5px solid #eaebed;
  border-radius: 15px;

  width: 45vw;
  margin-left: 25vw;
  margin-right: 25vw;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 1.2%;
  padding-bottom: 1.2%;

  font-size: 18px;
  font-family: "BMJUA";
`;

const Btn = styled.div`
  background: #1f316f;
  border-radius: 15px;
  width: 5vw;
  margin-left: 68.5vw;
  margin-top: 2vh;

  color: white;
  padding: 0.3%;
  padding-top: 0.7%;
  padding-bottom: 0.7%;
  text-align: center;

  cursor: pointer;
`;

const ScoreResultTitle = styled.h1`
  font-size: 30px;
  color: #112d4e;
  text-align: center;
  margin-top: 13vh;
  margin-bottom: 0.5vh;
`;

const ScoreResultSubTitle = styled.p`
  font-size: 18px;
  color: #6f6f6f;
  text-align: center;
  margin-bottom: 2vh;
`;

const FeedBackTitle = styled.h1`
  font-size: 30px;
  color: #112d4e;
  text-align: center;
  margin-top: 13vh;
  margin-bottom: 0.5vh;
`;

const ScoreFlex = styled.div`
  display: flex;
  margin-left: 25vw;
`;

const ScoreBox = styled.div`
  background: #ffffff;
  border: 1.5px solid #eaebed;
  border-radius: 15px;

  width: 21.8vw;
  height: 32vh;
  padding-top: 1.8%;
  padding-left: 1.5%;
  padding-right: 1.5%;
`;

const ScoreTitle = styled.p`
  font-size: 25px;

  color: #112d4e;
`;

const SocreText = styled.div`
  font-size: 20px;
  text-align: center;
`;

const FeedBackSubTitle = styled.p`
  font-size: 18px;
  color: #6f6f6f;
  text-align: center;
  margin-bottom: 2vh;
`;

const TextInput = styled.textarea`
  background: #ffffff;
  border: 1.5px solid #eaebed;
  border-radius: 15px;
  width: 47vw;
  height: 10vh;
  margin-left: 25vw;
  margin-right: 25vw;

  padding: 1%;
  font-size: 18px;
  font-family: "Noto Sans KR", sans-serif;
`;

const FooterEmty = styled.div`
  height: 20vh;
`;

const RecordDetail = () => {
  const [dataCheck, setDataCheck] = useState({
    title: false,
    content: false,
  });
  const [data, setData] = useState({});
  const titleInput = useRef();
  const contentInput = useRef();
  const PROXY = window.location.hostname === "localhost" ? "" : "/proxy";
  const meetingId = localStorage.getItem("meetingId");
  const navigate = useNavigate();

  let emtionResult = "";

  useEffect(() => {
    axios
      .get(`${PROXY}/api/meet/66630a87f9e17f5280e1dfba`, {
        headers: {
          "Access-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);

        if (res.data.userAnalysis.sentimentScore) {
          let score = res.data.userAnalysis.sentimentScore;
          if (score >= 80) emtionResult = "";
          if (50 <= score < 80) emtionResult = "중간값";
        }

        console.log(emtionResult);
      });
  }, []);

  const handleTitle = (title) => {
    setData({ ...data, title: title });
    setDataCheck({ ...dataCheck, title: true });
  };

  const handleContent = (content) => {
    setData({ ...data, content: content });
    setDataCheck({ ...dataCheck, content: true });
  };

  const handleRecordEdit = () => {
    if (data.title?.length < 1 || data.title?.length > 30) {
      titleInput.current.focus();
      return;
    }

    if (data.content?.length < 1) {
      contentInput.current.focus();
      return;
    }

    let title = null;
    let content = null;

    if (dataCheck.title || dataCheck.content) {
      title = data.title;
      content = data.content;
    } else {
      Swal.fire({
        text: "변경사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#1f316f",
      });

      return;
    }

    axios
      .patch(
        `${PROXY}/api/meet/66630a87f9e17f5280e1dfba`,
        {
          title: title,
          content: content,
        },
        {
          headers: {
            "Access-token": localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        Swal.fire({
          text: "수정이 완료되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
          confirmButtonColor: "#1f316f",
        });
      })
      .catch((err) => console.log(err.response));
  };

  return (
    <>
      <Logo
        onClick={() => {
          navigate("/");
        }}
      >
        AUTOMEET
      </Logo>
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
      <Date>
        {data.meetingTime?.split("T")[0]}&nbsp;
        {data.meetingTime?.split("T")[1]?.split(".")[0]}
      </Date>
      <Row>
        <img src={`${process.env.PUBLIC_URL}/imgs/profile.svg`} alt="" />
        <Participants>{data.userNames?.join(" ")}</Participants>
      </Row>
      <ContentTitle
        ref={titleInput}
        value={data.title}
        placeholder="이곳에 회의제목을 입력해주세요."
        onChange={(e) => handleTitle(e.target.value)}
      />

      <Content
        ref={contentInput}
        value={data.content}
        placeholder="이곳에 회의내용을 입력해주세요."
        onChange={(e) => handleContent(e.target.value)}
      />

      <Btn onClick={handleRecordEdit}>수정하기</Btn>

      <ScoreResultTitle>회의 분위기 분석 결과</ScoreResultTitle>
      <ScoreResultSubTitle>
        지난 회의에서 나의 감정과 집중도를 분석한 결과를 확인해보세요.
      </ScoreResultSubTitle>
      <ScoreFlex>
        <ScoreBox style={{ marginRight: "1vw" }}>
          <ScoreTitle style={{ marginBottom: "20%" }}>
            나의 감정 점수
          </ScoreTitle>
          <img
            src={`${process.env.PUBLIC_URL}/imgs/emotion.svg`}
            alt=""
            style={{ marginLeft: "23%", width: "55%" }}
          />
          <SocreText style={{ marginTop: "5%" }}>
            {data.userAnalysis?.sentimentScore}
            <span style={{ color: "#BCBCBC" }}>/100</span>
          </SocreText>
        </ScoreBox>
        <ScoreBox>
          <ScoreTitle style={{ marginBottom: "11%" }}>
            나의 집중도 점수
          </ScoreTitle>
          <img
            src={`${process.env.PUBLIC_URL}/imgs/target.svg`}
            alt=""
            style={{ marginLeft: "31%", width: "33%" }}
          />
          <SocreText style={{ marginTop: "1%" }}>
            {data.userAnalysis?.concentrationScore}
            <span style={{ color: "#BCBCBC" }}>/100</span>
          </SocreText>
        </ScoreBox>
      </ScoreFlex>

      <FeedBackTitle>회의록 피드백</FeedBackTitle>
      <FeedBackSubTitle>
        지난 회의에 대해서 중요한 사항이나 이외에 피드백들을 이곳에 적어주세요.
      </FeedBackSubTitle>
      <TextInput placeholder="피드백 작성 완료 시, 수정 불가능합니다." />
      <Btn>작성하기</Btn>
      <FooterEmty />
    </>
  );
};

export default RecordDetail;
