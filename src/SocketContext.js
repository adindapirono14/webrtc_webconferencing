import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socketContext = createContext();

const socket = io("http://localhost:5000");

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setcall] = useState({});
  const [callaccepted, setcallaccpted] = useState(false);
  const [callended, setcallended] = useState(false);

  const [name, setName] = useState("");

  const myVideos = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideos.current.srcObject = currentStream;
      });

    socket.on("me", (id) => setMe(id));

    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setcall({
        isReceived: true,
        from: from,
        name: callerName,
        signal,
      });
    });
  }, []);

  const answercall = () => {
    setcallaccpted(true);

    const peer = new Peer({ initiator: false, tirckle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const calluser = (id) => {
    const peer = new Peer({ initiator: true, tirckle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      setcallaccpted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leavecall = () => {
    setcallended(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <socketContext.Provider
      value={{
        call,
        callaccepted,
        myVideos,
        userVideo,
        stream,
        name,
        setName,
        callended,
        me,
        calluser,
        leavecall,
        answercall,
      }}
    >
      {children}
    </socketContext.Provider>
  );
};

export { ContextProvider, socketContext };
