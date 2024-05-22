import React from "react";
import styled from "styled-components";

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

const ContentTitle = styled.div`
  background: #ffffff;
  border: 1.5px solid #eaebed;
  border-radius: 15px;
  margin-left: 25vw;
  margin-right: 25vw;
  margin-bottom: 3vh;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 1.2%;
  padding-bottom: 1.2%;

  font-size: 18px;
`;

const Content = styled.div`
  background: #ffffff;
  border: 1.5px solid #eaebed;
  border-radius: 15px;
  margin-left: 25vw;
  margin-right: 25vw;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 1.2%;
  padding-bottom: 1.2%;

  font-size: 18px;
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

const FeedBackTitle = styled.h1`
  font-size: 30px;
  color: #112d4e;
  text-align: center;
  margin-top: 13vh;
  margin-bottom: 0.5vh;
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

      <Date>2024-05-21</Date>

      <Row>
        <img src={`${process.env.PUBLIC_URL}/imgs/profile.svg`} alt="" />
        <Participants>홍길동 외 4명</Participants>
      </Row>

      <ContentTitle>
        이번 회의 제목은 점심 메뉴를 무엇을 먹을지에 대해서 고민을 해보겠어요
      </ContentTitle>

      <Content>
        이곳은 내용보여지는곳. 가나다라마바사.이곳은 내용보여지는곳.
        가나다라마바사.이곳은 내용보여지는곳. 가나다라마바사. 이곳은
        내용보여지는곳. 가나다라마바사.이곳은 내용보여지는곳.
        가나다라마바사.이곳은 내용보여지는곳. 가나다라마바사. 이곳은이곳은
        내용보여지는곳. 가나다라마바사.이곳은 내용보여지는곳.
        가나다라마바사.이곳은 내용보여지는곳. 가나다라마바사. 이곳은
        내용보여지는곳. 가나다라마바사.이곳은 내용보여지는곳.
        가나다라마바사.이곳은 내용보여지는곳. 가나다라마바사. 이곳은
      </Content>

      <Btn>수정하기</Btn>
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
