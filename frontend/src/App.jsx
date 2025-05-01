import React from "react";
import { Outlet, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function App() {
  return (
    <div className = "App">
      {/* AppBar Component */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            App
          </Typography>
          {/* Navigation Links */}
          <Box>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/game">
              Play the game
            </Button>
            <Button color="inherit" component={Link} to="/leaderboard">
              Leaderboard
            </Button>
            <Button color="inherit" component={Link} to="/forum">
              Forum
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet/>
    </div>
  );
}

export default App;