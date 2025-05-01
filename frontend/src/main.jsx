import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import App from "./App";
import HigherOrLower from "./Higherorlower";
import Leaderboard from "./Leaderboard";
import Forum from "./Forum";
import { Button, Typography, Box, Grid } from "@mui/material";

const MainPage = () => {
  return (
    <Box sx={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Minecraft Higher or Lower!
      </Typography>
      <Typography variant="h6" gutterBottom>
        A game by Matthieu Burkovic and Arthur Le Guillerme
      </Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: "20px" }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/game"
            sx={{ width: "200px", padding: "10px" }}
          >
            Play the Game
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/leaderboard"
            sx={{ width: "200px", padding: "10px" }}
          >
            View Leaderboard
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            component={Link}
            to="/forum"
            sx={{ width: "200px", padding: "10px" }}
          >
            Visit Forum
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "game", element: <HigherOrLower /> },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "Forum", element: <Forum /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);
