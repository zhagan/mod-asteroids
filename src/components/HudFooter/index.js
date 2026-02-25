import * as React from "react";
import { Box, Grid, Typography } from "@mui/material";
import Auth from "../../utils/auth";
import { baseGameState } from "../../utils/gameStateDefaults";

export default function HudFooter({ setGameState, setGlobalPlayer }) {

    const handleQuit = () => {
        setGameState(old => ({
            ...old,
            lives: 0,
            gameOver: 1,
        }));
        setGlobalPlayer(old => ({ ...old, alive: false }));
    };

    const handleRetry = () => {
        const isLoggedIn = (Auth.loggedIn()) ? 1 : 0;
        setGameState((old) => ({
            ...baseGameState,
            username: old.username,
            loggedIn: isLoggedIn,
            restartId: old.restartId + 1,
        }));
    };

    return (
        <div id='hud-footer'>
            <Box
                component="footer"
                sx={{
                    px: 3,
                    mt: 'auto',
                }}
            >
                <Grid container spacing={2} direction="row" alignItems="center">
                    {(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ?
                        (<>
                            <div id="quitLogoutMobile">
                                <button
                                    type="button"
                                    className="nes-btn upperCase mobile-button"
                                    onClick={handleRetry}>
                                    Retry
                                </button>

                                <button style={{ "opacity": "0", "width": "150px" }}></button> {/*Space between buttons, lol */}
                                <button
                                    type="button"
                                    className="nes-btn upperCase mobile-button"
                                    onClick={handleQuit}>
                                    Quit
                                </button>
                            </div>
                        </>)
                        : (
                            <>
                                <Grid item xs={9}  >
                                    {/* Controls */}
                                    <Typography variant="h6" align="left">
                                        Move with Arrow keys or WSAD | Space to shoot 
                                    </Typography>
                                </Grid>
                                <Grid id="quitLogButtons" item xs={3} align="center">
                                    <Box display="flex" justifyContent="space-between" sx={{ mx: 10 }}>
                                        <button
                                            type="button"
                                            className="nes-btn upperCase"
                                            onClick={handleRetry}>
                                            Retry
                                        </button>
                                        <button
                                            type="button"
                                            className="nes-btn upperCase"
                                            onClick={handleQuit}>
                                            Quit
                                        </button>
                                    </Box>
                                </Grid>
                            </>)
                    }
                </Grid>
            </Box>
        </div>
    );
}
