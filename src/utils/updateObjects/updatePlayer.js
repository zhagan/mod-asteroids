function updatePlayer(globalPlayer, keysPressed, tpCache) {
    let { x, y, xB, yB, dir, thrust, vx, vy, turnSpeed, spriteDim, alive, invnsTimer, pressW, pressSpace, pressD, pressA } = globalPlayer;
    if (invnsTimer > 0) invnsTimer--;

    //if 'w' key opressed, add velocity in direction

    if (keysPressed.includes('w') || keysPressed.includes('arrowup')  || tpCache.current.includes('thrustBtn')) {
        pressW = true;
        vx -= thrust * Math.cos((dir) * Math.PI / 180);
        vy -= thrust * Math.sin((dir) * Math.PI / 180);
    } else {
        pressW = false;
    }
    //Rotate ship whe A or D pressed
    if (keysPressed.includes('d') || keysPressed.includes('arrowright')  || tpCache.current.includes('rightBtn')) {
        pressD = true;
        (dir < 360) ? dir += turnSpeed : dir = 0;
    } else {
        pressD = false;
    }
    if (keysPressed.includes('a') || keysPressed.includes('arrowleft')  || tpCache.current.includes('leftBtn')) {
        pressA = true;
        (dir <= 0) ? dir = 360 : dir -= turnSpeed;
    } else {
        pressA = false;
    }
    if (keysPressed.includes(' ')) {
        pressSpace = true;
    } else {
        pressSpace = false;
    }
    //constatley update momentum
    x += vx;
    y += vy;

    //Sprite wrapping --- 
    if (y > 980) y = 0;
    if (y < 0) y = 980;
    if (x > 1920) x = 0;
    if (x < 0) x = 1920;
    xB=x; if (xB+spriteDim.w>1920) xB -=1920;
    yB=y; if (yB+spriteDim.h>980) yB -=980;

    return { ...globalPlayer, x, y, xB, yB, dir, thrust, vx, vy, turnSpeed, spriteDim, alive, invnsTimer, pressW, pressSpace, pressD, pressA }
}

export default updatePlayer;
