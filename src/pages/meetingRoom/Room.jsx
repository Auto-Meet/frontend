import { OpenVidu } from "openvidu-browser";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import UserVideoComponent from "./UserVideoCompoents";
import RoomFooter from "../../components/RoomFooter";
import RoomNav from "../../components/RoomNav";
import styled from "styled-components";
import Swal from "sweetalert2";
import { createFFmpeg } from "@ffmpeg/ffmpeg";

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

const VideoBox = styled.div`
  margin-left: 0.5vw;
  margin-right: 0.5vw;
  margin-top: 10vh;
`;

const Vstyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

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
  const [sId, setSid] = useState(null);
  const PROXY = window.location.hostname === "localhost" ? "" : "/proxy";

  const OV = useRef(new OpenVidu()); //초기값 : openVidu객체. {current: 초기값} 객체 형태로 반환. 다시 렌더링될때마다 초기화되지 않고, 생성된 값을 계속 사용한다.
  const mediaRecorderRef = useRef(null); // MediaRecorder 참조
  const recordedChunksRef = useRef([]); // 녹화된 데이터 저장
  const allRecorderRef = useRef(null);
  const allRecordedChunksRef = useRef([]);

  /*
  < mount시에 session 생성 및 token생성 진행 >
  생성자 : "/api/sessions" -> "/api/sessions/connection" -> token
  참여자 : "/api/sessions/connection" -> token
  = 최종 token값으로 session.connection(token,유저네임) 실행
  */

  useEffect(() => {
    if (sId) {
      console.log("sId updated:", sId);
    }
  }, [sId]);

  //webcam으로 촬영한 파일을 mp4, wav파일로 변환
  const ffmpeg = useRef(createFFmpeg({ log: true }));
  const loadFFmpeg = useCallback(async () => {
    if (!ffmpeg.current.isLoaded()) {
      await ffmpeg.current.load();
    }
  }, []);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 FFmpeg 로드
    loadFFmpeg();
  }, [loadFFmpeg]);

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
            resolution: "540x480",
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

          await loadFFmpeg();

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
  }, [session, myUserName, loadFFmpeg]);

  //session연결(생성자) 및 token 생성과정
  const getToken = useCallback(async () => {
    //생성자인 경우
    if (localStorage.getItem("owner")) {
      return createSession(mySessionId, mySessionPW, title).then(
        (data) => createToken(data.meetingId, data.password) //createSession함수로부터 얻은 meetingId와 password 이용하여, token을 생성한다.
      );
    }

    //참여자인 경우
    if (localStorage.getItem("participant")) {
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

  // 개인 녹화 및 녹음시작
  const startRecording = async (stream) => {
    await loadFFmpeg();

    const options = { mimeType: 'video/webm; codecs="vp9, opus"' };
    const mediaRecorder = new MediaRecorder(stream, options);
    recordedChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
  };

  // 개인 녹화 및 녹음 종료
  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        await loadFFmpeg();

        ffmpeg.current.FS("writeFile", "input.webm", buffer);

        // mp4로 변환
        await ffmpeg.current.run("-i", "input.webm", "output.mp4");
        const videoData = ffmpeg.current.FS("readFile", "output.mp4");
        const videoBlob = new Blob([videoData.buffer], { type: "video/mp4" });

        // wav로 변환
        await ffmpeg.current.run("-i", "input.webm", "output.wav");
        const audioData = ffmpeg.current.FS("readFile", "output.wav");
        const audioBlob = new Blob([audioData.buffer], { type: "audio/wav" });

        const userName = localStorage.getItem("name");

        downloadBlob(
          audioBlob,
          `recorded_${mySessionId}_${userName}_audio.wav`
        );
        downloadBlob(
          videoBlob,
          `recorded_${mySessionId}_${userName}_video.mp4`
        );

        const audioFormData = new FormData();
        audioFormData.append("file", audioBlob);
        try {
          console.log("공유받은 id: ", sId);
          await axios.post(
            `${PROXY}/api/meet/${sId}/audio_analysis`,
            audioFormData,
            {
              headers: {
                "Access-token": localStorage.getItem("token"),
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("서버에게 음성파일 전송 성공!");
        } catch (error) {
          console.error("음성파일 전송 실패:", error);
        }

        const videoFormData = new FormData();
        videoFormData.append("file", videoBlob);
        try {
          console.log("공유받은 id: ", sId);
          await axios.post(
            `${PROXY}/api/meet/${sId}/video_analysis`,
            videoFormData,
            {
              headers: {
                "Access-token": localStorage.getItem("token"),
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("서버에게 영상파일 전송 성공!");
        } catch (error) {
          console.error("영상파일 전송 실패:", error);
        }

        recordedChunksRef.current = [];
      };
    }
  };

  // Blob 객체를 이용하여 파일 다운로드를 수행하는 함수
  const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob); // Blob URL 생성
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName; // 다운로드 파일 이름 설정
    document.body.appendChild(link);
    link.click(); // 가상 클릭 이벤트 발생
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // 생성된 URL 해제
  };

  const leaveSession = useCallback(async () => {
    await stopRecording();
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
    localStorage.removeItem("participant");
    navigate("/");
  }, [session]); //session값이 변경되었을 경우에만, 해당 함수를 다시 선언하고, 그 이전까지는 계속 재사용한다.

  //allRecord toggle(전체회의 녹화)
  const allRecord = async () => {
    await startScreenRecording();
    Swal.fire({
      text: "AI 자동 회의록 작성을 시작합니다.",
      icon: "success",
      confirmButtonText: "확인",
      confirmButtonColor: "#1f316f",
    });
  };

  //전체회의 녹화시작
  const startScreenRecording = async () => {
    console.log("전체회의 녹화 시작");

    try {
      // 화면 스트림 (화면에서 송출되는 소리 포함)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // OpenVidu에서 마이크 스트림 가져오기
      const audioStream = publisher.stream.getMediaStream();

      // 참가자들의 오디오 스트림 결합
      const audioTracks = [];
      subscribers.forEach((subscriber) => {
        const subAudioTracks = subscriber.stream
          .getMediaStream()
          .getAudioTracks();
        audioTracks.push(...subAudioTracks);
      });

      // 모든 오디오 트랙을 단일 MediaStream에 추가
      const combinedAudioStream = new MediaStream([
        ...audioStream.getAudioTracks(),
        ...audioTracks,
      ]);

      // 화면 비디오 트랙과 결합된 오디오 트랙을 결합
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...combinedAudioStream.getAudioTracks(),
      ]);

      const options = { mimeType: 'video/webm; codecs="vp9, opus"' };
      const allRecorder = new MediaRecorder(combinedStream, options);
      allRecordedChunksRef.current = [];

      allRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          allRecordedChunksRef.current.push(event.data);
        }
      };

      allRecorder.start();
      allRecorderRef.current = allRecorder;
    } catch (error) {
      console.error("화면 녹화 시작 오류:", error);
    }
  };

  //allStopRecord toggle(전체회의 녹화 종료)
  const allStopRecord = () => {
    console.log("전체회의 녹화 종료");

    if (allRecorderRef.current) {
      allRecorderRef.current.stop();
      allRecorderRef.current.onstop = async () => {
        const blob = new Blob(allRecordedChunksRef.current, {
          type: "video/webm",
        });

        const arrayBuffer = await blob.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        ffmpeg.current.FS("writeFile", "input.webm", buffer);

        // wav로 변환
        await ffmpeg.current.run("-i", "input.webm", "output.wav");
        const audioData = ffmpeg.current.FS("readFile", "output.wav");
        const audioBlob = new Blob([audioData.buffer], { type: "audio/wav" });

        const userName = localStorage.getItem("name");

        downloadBlob(
          audioBlob,
          `allRecorded_${mySessionId}_${userName}_audio.wav`
        );

        const audioFormData = new FormData();
        audioFormData.append("file", audioBlob);
        try {
          await axios
            .post(
              `${PROXY}/api/sessions/${mySessionId}/recording`,
              audioFormData,
              {
                headers: {
                  "Access-token": localStorage.getItem("token"),
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res) => {
              const temp = res.data.meetingId;
              setSid(temp);
            });
          console.log("서버에게 전체 음성파일 전송 성공!");
        } catch (error) {
          console.error("전체 음성파일 전송 실패:", error);
        }

        allRecordedChunksRef.current = [];
      };
    }
  };

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
        <RoomNav sessionId={mySessionId} />
        <EmtyBox />
        {session !== undefined ? (
          <Vstyle>
            {mainStreamManager !== undefined ? (
              <VideoBox>
                <UserVideoComponent streamManager={mainStreamManager} />
              </VideoBox>
            ) : null}

            {subscribers.map((sub, i) => (
              <VideoBox key={sub.id}>
                <span>{sub.id}</span>
                <UserVideoComponent streamManager={sub} />
              </VideoBox>
            ))}

            <EmtyUnderBox />
            <RoomFooter
              voiceOff={voiceOff}
              voiceOn={voiceOn}
              camOff={camOff}
              camOn={camOn}
              leaveSession={leaveSession}
              allRecord={allRecord}
              allStopRecord={allStopRecord}
            />
          </Vstyle>
        ) : null}
      </BackGround>
    </>
  );
};

export default Room;
