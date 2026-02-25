import { useEffect } from 'react';

const Touch = ({ tpCache, spaceDown }) => {


    useEffect(() => {
        const toggleFullscreen = () => {
            const elem = document.querySelector("body");
            if (!document.fullscreenElement) {
                elem.requestFullscreen().catch((err) => {
                    alert(
                        `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
                    );
                });
            } else {
                // document.exitFullscreen();
            }
        };
        const updateTouch = (event) => {
            const touches = event.touches;
            tpCache.current = [];
            for (let i = 0; i < touches.length; i++) {
                tpCache.current.push(touches[i].target.id);
            }

            if (tpCache.current.includes("shootBtn") && spaceDown.current !== 2) {
                spaceDown.current = 1;
            }
            if (!tpCache.current.includes("shootBtn")) spaceDown.current = 0;
        };

        const handleTouchStart = (event) => {
            updateTouch(event);
        };

        const handleTouchEnd = (event) => {
            if (event.target.id === "FullScreen") {
                toggleFullscreen();
                return;
            }
            updateTouch(event);
        };

        window.addEventListener("touchstart", handleTouchStart, false);
        window.addEventListener("touchend", handleTouchEnd, false);

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [spaceDown, tpCache]);

    return (
        <div id="touch-component">

            <button id='leftBtn' className='touchButton' />
            <button id='rightBtn' className='touchButton' />

            <div id='actionButtons'>
                <button id='thrustBtn' className='touchButton' />
                <button id='shootBtn' className='touchButton' />
            </div>



        </div>
    )
}

export default Touch;
