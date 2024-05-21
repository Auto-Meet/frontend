import React from "react";
import styled from "styled-components";

const Logo = styled.h1`
  font-size: 40px;
  color: #112d4e;
`;
const SideLogo = styled.p`
  font-size: 20px;
  color: #6f6f6f;
`;
const Name = styled.p`
  font-size: 20px;
`;
const LogOut = styled.p`
  font-size: 17px;
  color: #112d4e;
`;

const Box = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10vh;
  margin-bottom: 3vh;
`;

const LBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const RBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
`;

const Empty = styled.div`
  width: 7vw;
`;

const HomeNav = () => {
  return (
    <>
      <Box>
        <LBox>
          <Logo>AUTOMEET</Logo>
          <SideLogo>새로운 멀티 플렛폼 회상회의 서비스</SideLogo>
        </LBox>
        <Empty />
        <RBox>
          <Name>이연택님 안녕하세요.</Name>
          <LogOut>로그아웃</LogOut>
        </RBox>
      </Box>
    </>
  );
};

export default HomeNav;
