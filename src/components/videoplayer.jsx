import React, { UseContext } from "react";
import { socketContext } from "../SocketContext";

const videoplayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    UseContext(socketContext);

  return <div>Video Player</div>;
};

export default videoplayer;
