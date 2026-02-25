import React from "react";
import Leaderboard from "../Leaderboard";
import { CardActions } from "@mui/material";

const Welcome = ({ show, setShow }) => {

  const w = window.innerWidth;

  return (
    <>
      <Leaderboard />
      <CardActions
        sx={{
          justifyContent: `${(w<400)? "center" : "space-between"}`,
          backgroundColor: "transparent",
          mt: 5,
        }}
      >
        <button
          type="button"
          onClick={() => {
            setShow("Login")
          }}
          className={`${show === "Login"} nes-btn upperCase`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setShow("Signup");
          }}

          className={`${show === "Signup"} nes-btn upperCase`}
        >
          Signup
        </button>
      </CardActions>
    </>
  );
};

export default Welcome;
