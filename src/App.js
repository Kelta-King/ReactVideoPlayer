import * as React from 'react';
import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import Container from '@mui/material/Container';
import './App.css';
import ControlIcons from './Components/ControlIcons';

const format = (seconds) => {
    if (isNaN(seconds)) {
        return '00:00'
    }

    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");

    if (hh) {
        return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`
    } else {
        return `${mm}:${ss}`
    }
};

function App() {
    const [playerstate, setPlayerState] = useState({
        playing: true,
        muted: true,
        volume: 0.5,
        playerbackRate: 1.0,
        played: 0,
        seeking: false,
    })


    //Destructure State in other to get the values in it
    const { playing, muted, volume, playerbackRate, played, seeking } = playerstate;
    const playerRef = useRef(null);
    const playerDivRef = useRef(null);
    var moved = false;

    const useHover = () => {
        const [isHovering, setIsHovering] = React.useState(false);

        const handleMouseOver = React.useCallback(() => setIsHovering(true), []);
        const handleMouseOut = React.useCallback(() => setIsHovering(false), []);

        const nodeRef = React.useRef();

        const callbackRef = React.useCallback(
            node => {
                if (nodeRef.current) {
                    nodeRef.current.removeEventListener('mouseover', handleMouseOver);
                    nodeRef.current.removeEventListener('mouseout', handleMouseOut);
                }

                nodeRef.current = node;

                if (nodeRef.current) {
                    nodeRef.current.addEventListener('mouseover', handleMouseOver);
                    nodeRef.current.addEventListener('mouseout', handleMouseOut);
                }
            },
            [handleMouseOver, handleMouseOut]
        );

        return [callbackRef, isHovering];
    };


    //This function handles play and pause onchange button
    const handlePlayAndPause = () => {
        setPlayerState({ ...playerstate, playing: !playerstate.playing })
    }

    const handleMuting = () => {
        setPlayerState({ ...playerstate, muted: !playerstate.muted })
    }

    const handleRewind = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
    }

    const handleFastForward = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 30)
    }

    const handleVolumeChange = (e, newValue) => {
        setPlayerState({ ...playerstate, volume: parseFloat(newValue / 100), muted: newValue === 0 ? true : false, });
    }

    const handleVolumeSeek = (e, newValue) => {
        setPlayerState({ ...playerstate, volume: parseFloat(newValue / 100), muted: newValue === 0 ? true : false, });
    }

    const handlePlayerRate = (rate) => {
        setPlayerState({ ...playerstate, playerbackRate: rate });
    }

    const handleFullScreenMode = () => {
        console.log(screenfull.isFullscreen);
        screenfull.toggle(playerDivRef.current)
    }

    const handlePlayerProgress = (state) => {
        // console.log('onProgress', state);
        if (!playerstate.seeking) {
            setPlayerState({ ...playerstate, ...state });
        }
        // console.log('afterProgress', state);
    }

    const handlePlayerSeek = (e, newValue) => {
        setPlayerState({ ...playerstate, played: parseFloat(newValue / 100) });
        playerRef.current.seekTo(parseFloat(newValue / 100));
        // console.log(played)
    }

    const handlePlayerMouseSeekDown = (e) => {
        setPlayerState({ ...playerstate, seeking: true });
    }

    const handlePlayerMouseSeekUp = (e, newValue) => {
        setPlayerState({ ...playerstate, seeking: false });
        playerRef.current.seekTo(newValue / 100);
    }

    const currentPlayerTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00';
    const movieDuration = playerRef.current ? playerRef.current.getDuration() : '00:00';
    const playedTime = format(currentPlayerTime);
    const fullMovieTime = format(movieDuration);
    const [hoverRef, isHovering] = useHover();
    var timer;
    window.onmousemove = function(e){
        console.log("Mouse moved");
        if(screenfull.isFullscreen){
            document.getElementById("xyz").className = "opOne";
            clearTimeout(timer);
            timer = setTimeout(() => {
                document.getElementById("xyz").className = "opZero";
            }, 1500);
        }
    }

    React.useEffect(() => {
        if(screenfull.isFullscreen){
            return;
        }
        if(isHovering)
        {
            document.getElementById("xyz").className = "opOne";
        }
        else
        {
            document.getElementById("xyz").className = "opZero";
        }
        
    }, [isHovering]);

    return (
        <>
            <header className='header__section'>
                <p className='header__text'>Build a Video Player - Tutorial</p>
            </header>
            <Container maxWidth="md">
                <div ref={hoverRef}>
                    <div className='playerDiv' ref={playerDivRef}>
                        <ReactPlayer width={'100%'} height='100%'
                            ref={playerRef}
                            url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
                            playing={playing}
                            volume={volume}
                            playbackRate={playerbackRate}
                            onProgress={handlePlayerProgress}
                            muted={muted}
                            id="player"
                        />
                        <div id='xyz'>
                            <ControlIcons
                                key={volume.toString()}
                                playandpause={handlePlayAndPause}
                                playing={playing}
                                rewind={handleRewind}
                                fastForward={handleFastForward}
                                muting={handleMuting}
                                muted={muted}
                                volumeChange={handleVolumeChange}
                                volumeSeek={handleVolumeSeek}
                                volume={volume}
                                playerbackRate={playerbackRate}
                                playRate={handlePlayerRate}
                                fullScreenMode={handleFullScreenMode}
                                played={played}
                                onSeek={handlePlayerSeek}
                                onSeekMouseUp={handlePlayerMouseSeekUp}
                                onSeekMouseDown={handlePlayerMouseSeekDown}
                                playedTime={playedTime}
                                fullMovieTime={fullMovieTime}
                                seeking={seeking}
                            />
                        </div>
                        {/* {isHovering ? <OpOneController /> : <OpZeroController />} */}

                    </div>
                </div>
            </Container>
        </>
    );
}

export default App;