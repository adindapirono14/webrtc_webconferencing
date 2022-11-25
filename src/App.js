import React from "react";
import { Typography, AppBar, Toolbar } from "@material-ui/core";

import VideoPlayer from "./components/videoplayer";

import Options from "./components/options";
import Notif from "./components/notif";

const App = () => {
  return (
    <div>
      {/* <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h2" align="center">
            Video Chat
          </Typography>
        </Toolbar>
      </AppBar> */}
      Video Chat
      <VideoPlayer />
      <Options>
        <Notif />
      </Options>
    </div>
  );
};

export default App;
