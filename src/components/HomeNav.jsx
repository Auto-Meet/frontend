import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

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
  cursor: pointer;
`;

const Box = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10vh;
  margin-bottom: 3vh;
  margin-left: 17vw;
  margin-right: 17vw;
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
  const [logCheck, setLogCheck] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLogCheck(true);
      setName(localStorage.getItem("name"));
    } else setLogCheck(false);
  }, []);

  const handleLog = () => {
    if (logCheck) {
      Swal.fire({
        title: "로그아웃",
        text: "로그아웃을 하시겠습니까?",
        icon: "question",

        showCancelButton: true,
        confirmButtonColor: "#1F316F",
        cancelButtonColor: "#b1b1b1",
        confirmButtonText: "네",
        cancelButtonText: "아니요",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("token");
          setLogCheck(false);
        }
      });
    }

    if (!logCheck) {
      navigate("/login");
    }
  };
  return (
    <>
      <Box>
        <LBox>
          <Logo>AUTOMEET</Logo>
          <SideLogo>새로운 멀티 플렛폼 회상회의 서비스</SideLogo>
        </LBox>
        <Empty />
        <RBox>
          <Name>
            {logCheck
              ? `${name}님 안녕하세요.`
              : "지금 로그인을 통해, 서비스를 이용해보세요."}
          </Name>
          <LogOut onClick={() => handleLog()}>
            {logCheck ? "로그아웃" : "로그인"}
          </LogOut>
        </RBox>
      </Box>
    </>
  );
};

export default HomeNav;
