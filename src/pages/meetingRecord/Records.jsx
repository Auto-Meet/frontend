import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
  margin-right: 4vw;
`;

const ContentBox = styled.div`
  background: #ffffff;
  border: 1.5px solid #eaebed;
  border-radius: 15px;
  margin-left: 25vw;
  margin-right: 25vw;
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
  font-size: 18px;
`;

const ContentDate = styled.p`
  font-size: 18px;
`;

const Content = styled.p`
  font-size: 16px;
  font-weight: 500;
`;

const Record = () => {
  const navigate = useNavigate();

  return (
    <>
      <Logo>AUTOMEET</Logo>

      <TopBox>
        <TitleBox>
          <Title>회의록 목록</Title>
          <SubTitle>
            지난 회의에서 자동으로 작성된 회의록을 확인해보세요.
            <br />
            직접 수정 및 삭제 가능합니다.
          </SubTitle>
        </TitleBox>
        <img src={`${process.env.PUBLIC_URL}/imgs/letters.svg`} alt="" />
      </TopBox>

      <ContentBox
        onClick={() => {
          navigate("/meetingRecordDetail");
        }}
      >
        <RBox>
          <ContentTitle>이곳은 제목</ContentTitle>
          <ContentDate>12:00</ContentDate>
        </RBox>

        <Content>
          이곳은 내용보여지는곳. 가나다라마바사.이곳은 내용보여지는곳.
          가나다라마바사.이곳은 내용보여지는곳. 가나다라마바사. 이곳은
          내용보여지는곳. 가나다라마바사.이곳은 내용보여지는곳.
          가나다라마바사.이곳은 내용보여지는곳. 가나다라마바사. 이곳은
        </Content>
      </ContentBox>
    </>
  );
};

export default Record;
