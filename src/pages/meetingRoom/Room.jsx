import { OpenVidu } from "openvidu-browser";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import UserVideoComponent from "./UserVideoCompoents";
import RoomFooter from "../../components/RoomFooter";
import RoomNav from "../../components/RoomNav";
import styled from "styled-components";

//style
const BackGround = styled.body`
  min-height: 100vh;
  background-color: #202124;
  overflow: auto;
`;

const EmtyBox = styled.div`
  margin-top: 8vh;
`;

const EmtyUnderBox = styled.div`
  margin-bottom: 8vh;
`;

const VideoBox = styled.div``;

const Room = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState(location.state.title); //회의록에서 사용할 제목
  const [mySessionId, setMySessionId] = useState(location.state.mySessionId); //session(회의방) 구분하기 위한 id
  const [mySessionPW, setMySessionPW] = useState(location.state.mySessionPW); //회의방 비밀번호
  const [myUserName, setMyUserName] = useState(location.state.myUserName); //회의에서 사용할 이름
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined); //발행자
  const [subscribers, setSubscribers] = useState([]); //참가자들
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

  const APPLICATION_SERVER_URL = "http://43.200.237.37:8080";
  const PROXY = window.location.hostname === "localhost" ? "" : "/proxy";

  const OV = useRef(new OpenVidu()); //초기값 : openVidu객체. {current: 초기값} 객체 형태로 반환. 다시 렌더링될때마다 초기화되지 않고, 생성된 값을 계속 사용한다.
  const mediaRecorderRef = useRef(null); // MediaRecorder 참조
  const recordedChunksRef = useRef([]); // 녹화된 데이터 저장

  //mount시에 session 생성 및 token생성 진행
  /*
  생성자 : "/api/sessions" -> "/api/sessions/connection" -> token
  참여자 : "/api/sessions/connection" -> token

  최종 token값으로 session.connection(token,유저네임) 실행
  */

  useEffect(() => {
    if (!session) joinSession();
  }, []);

  const joinSession = useCallback(() => {
    //OV.current.apiUrl = "/openvidu";
    const mySession = OV.current.initSession(); //새로운 session을 생성하여 return

    //session내에 새로운 stream이 생성될때마다 callback함수 호출
    mySession.on("streamCreated", (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      setSubscribers((subscribers) => [...subscribers, subscriber]);
    });

    mySession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    setSession(mySession);
  }, []);

  //의존성 배열 [session, myUserName]이 변경될때마다 실행된다.
  useEffect(() => {
    if (session) {
      console.log(session);
      // Get a token from the OpenVidu deployment (mySessionId -> sessionId -> token)
      getToken().then(async (token) => {
        console.log("서버로부터 받아온 token값", token);

        try {
          await session.connect(token, { clientData: myUserName }); //token과 username을 이용하여, session에 연결한다. (동기)
          console.log("session connect 성공!");
          let publisher = await OV.current.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "640x480",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: true,
          });

          session.publish(publisher); //생성한 publisher을 session에 등록

          const devices = await OV.current.getDevices(); //현재 시스템에서 사용가능한 device장치들을 가져온다.
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          const currentVideoDeviceId = publisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          const currentVideoDevice = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          );

          setMainStreamManager(publisher);
          setPublisher(publisher);
          setCurrentVideoDevice(currentVideoDevice);

          // 녹화 시작
          startRecording(publisher.stream.getMediaStream());
        } catch (error) {
          console.log("error!!!");
          console.log(
            "There was an error connecting to the session:",
            error.code,
            error.message
          );
        }
      });
    }
  }, [session, myUserName]);

  //session연결(생성자) 및 token 생성과정
  const getToken = useCallback(async () => {
    //생성자인 경우
    if (localStorage.getItem("owner")) {
      return createSession(mySessionId, mySessionPW, title).then(
        (data) => createToken(data.meetingId, data.password) //createSession함수로부터 얻은 meetingId와 password 이용하여, token을 생성한다.
      );
    }

    //참여자인 경우
    if (!localStorage.getItem("participant")) {
      return createToken(mySessionId, mySessionPW);
    }
  }, [mySessionId]);

  const createSession = async (sessionId, sessionPw, title) => {
    console.log("sessionId 출력");
    console.log(sessionId);
    console.log(sessionPw);
    console.log(title);
    try {
      const response = await axios.post(
        `${PROXY}/api/sessions`,
        { meetingId: sessionId, password: sessionPw, meetingTitle: title },
        {
          headers: {
            Authorization: `Basic ${btoa("OPENVIDUAPP:AutoMeet")}`,
            "Access-token": localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("create session 성공!");
      console.log(response.data);
      return response.data; // sessionId(meetingId)와 password 반환.
    } catch (err) {
      console.log(err);
    }
  };

  const createToken = async (id, pw) => {
    console.log("token 생성 시작");
    console.log(id, pw);

    try {
      const response = await axios.post(
        `${PROXY}/api/sessions/connection`,
        { meetingId: id, password: pw },
        {
          headers: {
            Authorization: `Basic ${btoa("OPENVIDUAPP:AutoMeet")}`,
            "Access-token": localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      console.log("create token 성공!");
      return response.data; // token 반환. 해당 token은 세션을 연결할때 userName과 함께 사용된다.
    } catch (err) {
      console.log("create token 실패");
      console.log(err);
    }
  };

  const startRecording = (stream) => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      //데이터가 사용가능할 때마다 발생한다.
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    mediaRecorder.start(); //녹화 시작
    mediaRecorderRef.current = mediaRecorder; //녹화 시작을 기준으로, 해당 mediaRecorder을 mediaRecorderRef에 저장한다.
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); //mediaRecorder을 중지
      mediaRecorderRef.current.onstop = () => {
        //onstop 이벤트핸들러. 녹화가 완전히 중지된 후 실행되므로, 현재 모든 데이터가 수집된 상태.
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/mp4",
        });
        const url = URL.createObjectURL(blob); //URL으로 변환
        const link = document.createElement("a");
        link.href = url;
        link.download = "recorded_session.mp4";
        document.body.appendChild(link); //다운로드 파일의 이름을 지정한다.
        link.click(); //브라우저 사에서 링크를 클릭하여 파일 다운로드를 시작
        document.body.removeChild(link);
        URL.revokeObjectURL(url); //URL객체를 해제
        recordedChunksRef.current = [];
      };
    }
  };

  const leaveSession = useCallback(() => {
    stopRecording();
    if (session) {
      session.disconnect(); //session연결 해제
    }
    OV.current = new OpenVidu(); // Reset all states and OpenVidu object
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("");
    setMyUserName("");
    setMySessionPW("");
    setMainStreamManager(undefined);
    setPublisher(undefined);
    localStorage.removeItem("owner");
    navigate("/");
  }, [session]); //session값이 변경되었을 경우에만, 해당 함수를 다시 선언하고, 그 이전까지는 계속 재사용한다.

  //camera toggle
  const camOff = useCallback(() => {
    if (publisher) {
      publisher.publishVideo(false);
    }
  }, [publisher]);

  const camOn = useCallback(() => {
    if (publisher) {
      publisher.publishVideo(true);
    }
  }, [publisher]);

  //microphone toggle
  const voiceOff = useCallback(() => {
    if (publisher) {
      publisher.publishAudio(false);
    }
  }, [publisher]);

  const voiceOn = useCallback(() => {
    if (publisher) {
      publisher.publishAudio(true);
    }
  }, [publisher]);

  const deleteSubscriber = useCallback((streamManager) => {
    setSubscribers((prevSubscribers) => {
      const index = prevSubscribers.indexOf(streamManager);
      if (index > -1) {
        const newSubscribers = [...prevSubscribers];
        newSubscribers.splice(index, 1);
        return newSubscribers;
      } else {
        return prevSubscribers;
      }
    });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      leaveSession();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [leaveSession]);

  return (
    <>
      <BackGround>
        {session !== undefined ? (
          <VideoBox>
            <RoomNav sessionId={mySessionId} />
            <EmtyBox />
            {mainStreamManager !== undefined ? (
              <div>
                <UserVideoComponent streamManager={mainStreamManager} />
              </div>
            ) : null}
            <div>
              {subscribers.map((sub, i) => (
                <div key={sub.id}>
                  <span>{sub.id}</span>
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
            <EmtyUnderBox />
            <RoomFooter
              voiceOff={voiceOff}
              voiceOn={voiceOn}
              camOff={camOff}
              camOn={camOn}
              leaveSession={leaveSession}
            />
          </VideoBox>
        ) : null}
      </BackGround>
    </>
  );
};

export default Room;
