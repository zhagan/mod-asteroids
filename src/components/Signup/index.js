import React, { useState } from 'react';
import {
  TextField,
  Card,
  CardActions,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import { playMenuSound } from '../../utils/playSound';
const Signup = ({ show, setShow }) => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleFormSubmit}
    >
      <Typography
        sx={{
          textAlign: 'center',
        }}
      >
        Sign Up
      </Typography>
      <Grid
        container
        columnSpacing={{ md: 1 }}
        direction="column"
        sx={{
          mt: 15,
        }}
      >
        <Grid container>
          <Typography
            sx={{
              mr: 3,
            }}
          >
            Username
          </Typography>
          <TextField
            autoComplete="username"
            id="username"
            name="username"
            type="username"
            variant="standard"
            onChange={handleChange}
            sx={{
              bottomBorder: '1px #fff',
              mb: 5,
            }}
          />
        </Grid>
        <Grid container>
          <Typography
            sx={{
              mr: 9,
            }}
          >
            Email
          </Typography>
          <TextField
            id="email"
            name="email"
            type="email"
            variant="standard"
            onChange={handleChange}
            sx={{
              bottomBorder: '1px #fff',
              mb: 5,
            }}
          />
        </Grid>
        <Grid container>
          <Typography
            sx={{
              mr: 3,
            }}
          >
            Password
          </Typography>
          <TextField
            autoComplete="current-password"
            placeholder="******"
            id="password"
            name="password"
            type="password"
            variant="standard"
            onChange={handleChange}
            sx={{
              mb: 10,
            }}
          />
        </Grid>
        <Card
          sx={{
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <CardActions
            sx={{
              justifyContent: 'center',
              backgroundColor: 'transparent',
            }}
          >
            <button type="submit" className="nes-btn upperCase">
              Submit
            </button>
            <button
              type="button"
              onClick={() => {
                playMenuSound('menu_close');
                setShow('Welcome');
              }}
              className={`${show === 'Welcome'} nes-btn upperCase`}
            >
              Cancel
            </button>
          </CardActions>
        </Card>
      </Grid>
    </Box>
  );
};

export default Signup;
