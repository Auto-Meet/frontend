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

//URL
const APPLICATION_SERVER_URL = "http://localhost:5000/";

const Room = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mySessionId, setMySessionId] = useState(location.state.mySessionId); //session(회의방) 구분하기 위한 id
  const [myUserName, setMyUserName] = useState(location.state.myUserName); //회의에서 사용할 이름
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined); //발행자
  const [subscribers, setSubscribers] = useState([]); //참가자들
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

  const OV = useRef(new OpenVidu()); //초기값 : openVidu객체. {current: 초기값} 객체 형태로 반환. 다시 렌더링될때마다 초기화되지 않고, 생성된 값을 계속 사용한다.

  //mount시에 session 생성 및 token생성 진행
  useEffect(() => {
    if (!session) joinSession();
  }, []);

  const joinSession = useCallback(() => {
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
      // Get a token from the OpenVidu deployment (mySessionId -> sessionId -> token)
      getToken().then(async (token) => {
        try {
          await session.connect(token, { clientData: myUserName }); //token과 username을 이용하여, session에 연결한다. (동기)

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

          //영상 및 음성 자동 녹음 시작.
        } catch (error) {
          console.log(
            "There was an error connecting to the session:",
            error.code,
            error.message
          );
        }
      });
    }
  }, [session, myUserName]);

  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect(); //session연결 해제
    }
    OV.current = new OpenVidu(); // Reset all states and OpenVidu object
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("");
    setMyUserName("");
    setMainStreamManager(undefined);
    setPublisher(undefined);
    navigate("/home");
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

  //session생성 및 token 생성과정
  const getToken = useCallback(async () => {
    return createSession(mySessionId).then(
      (sessionId) => createToken(sessionId) //createSession함수로부터 얻은 sessionId을 이용하여, token을 생성한다.
    );
  }, [mySessionId]);

  const createSession = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions",
      { customSessionId: sessionId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // sessionId 반환. 앞서 구한 mySessionId와는 다른 값이다.
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // token 반환. 해당 token은 세션을 연결할때 userName과 함께 사용된다.
  };

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
