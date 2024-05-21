import React from "react";
import OpenViduVideoComponent from "./OvVideo";

export default function UserVideoComponent({ streamManager }) {
  const getNicknameTag = () => {
    // Gets the nickName of the user
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div>
      {streamManager !== undefined ? (
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={streamManager} />
          <div>
            <p style={{ color: "white" }}>{getNicknameTag()}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
