import React, { useState } from 'react';
import { Post, Post2, Post3 } from "./component/Post";
import { Box, Button, Typography } from "@mui/material";

function App() {
  const [display, setDisplay] = useState(true);

  function handleClickDisplayPost1() {
    setDisplay(preDisplay => !preDisplay);
  }

  return (
    <Box>
      <Typography>Suspense</Typography>
      <Box>
        {display && <React.Suspense fallback={"loading"}>
            <Post/>
        </React.Suspense>}
        <Box>
          <Button variant={"contained"} onClick={handleClickDisplayPost1}>display post 1</Button>
        </Box>
      </Box>
      <Box>
        <React.Suspense fallback={"loading2"}>
          <Post2/>
        </React.Suspense>
      </Box>
      <Box>
        <React.Suspense fallback={"loading3"}>
        <Post3/>
        </React.Suspense>
      </Box>
    </Box>
  );
}

export default App;
