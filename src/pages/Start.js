import React, { useEffect } from "react";
import { 
  useHistory, 
  // Redirect 
} from "react-router-dom";
import Leaderboard from "../components/Leaderboard";
import Footer from "../components/Footer";
import { Box, Container, Grid, CardActions } from "@mui/material";
// import Auth from "../utils/auth";
// import { playMenuSound } from "../utils/playSound";
import Logo from "../assets/img/logo.svg";
import GameRules from "../components/GameRules";

const Start = ({ gameState, setGameState }) => {
  const navigate = useHistory();

  useEffect(() => {
    setGameState((old) => ({
      ...old,
      curLevel: 0,
      score: 0,
      exp: 0,
      lives: 3,
      playerLevel: 0,
      numberOfAsteroids: 0,
      timer: 0,
      paused: 0,
      gameOver: 0,
      loggedIn: 1
    }));
    // playMenuSound("menu_select");
  }, [setGameState]);

  // const navigate = useHistory();

  const handleStart = () => {
    navigate.push("/main");
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Container component="main" sx={{ mb: 2 }} maxWidth="xxl">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>

        <Grid
          container
          columnSpacing={{ md: 1 }}
          direction="row"
          justifyContent="center"
        >
          <Leaderboard />
        </Grid>
        <Container maxWidth="xs">
          <CardActions
            sx={{
              justifyContent: "center",
              backgroundColor: "transparent",
              mt: 5,
            }}
          >
            <button
              type="button"
              className="nes-btn upperCase"
              onClick={handleStart}
            >
              Start
            </button>

            <GameRules/>

          </CardActions>
        </Container>
      </Container>
      <Footer />
    </Box>
  );
};

export default Start;
