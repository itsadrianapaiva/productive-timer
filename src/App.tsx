import { useEffect, useState, useRef } from "react";
import "./styles/main.scss";
import { DisplayState, Flower } from "./helpers";
import TimeSetter from "./TimeSetter";
import Display from "./Display";
import AlarmSound from "./assets/AlarmSound.mp3";

const defaultBreakTime = 5 * 60;
const defaultSessionTime = 25 * 60;
const min = 60;
const max = 60 * 60;
const interval = 60;

const flowerColors = [
  '#ff69b4', // pink
  '#ff9ecd', // light pink
  '#ffb6c1', // lighter pink
  '#ffc0cb', // even lighter pink
  '#dda0dd'  // plum
];

function App() {
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [sessionTime, setSessionTime] = useState(defaultSessionTime);
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: "Session",
    timerRunning: false,
  });
  const [flowers, setFlowers] = useState<Flower[]>([]);

  useEffect(() => {
    const flowerInterval = setInterval(() => {
      const newFlower = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (2.5 - 0.8) + 0.8,
        type: Math.floor(Math.random() * 3), // 0-2 for different flower types
      color: flowerColors[Math.floor(Math.random() * flowerColors.length)]
      };
      setFlowers((prevFlowers) => [...prevFlowers, newFlower]);
    }, 20000);

    return () => clearInterval(flowerInterval);
    }, [displayState.timerRunning]);

  const timerRef = useRef<number | null> (null);
  useEffect(() => {
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!displayState.timerRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    
    timerRef.current = window.setInterval(decrementDisplay, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [displayState.timerRunning]);

  useEffect(() => {
    if (displayState.time === 0) {
      setDisplayState((prev) => ({ ...prev, timerRunning: false }));
  
      const audio = document.getElementById("beep") as HTMLAudioElement;
      audio.currentTime = 0;
      audio.play().catch((err) => console.log(err));

console.log(displayState.timeType);
console.log(displayState.timerRunning);

      setTimeout(() => {
        setDisplayState((prev) => ({
          ...prev,
          timeType: prev.timeType === "Session" ? "Break" : "Session",
          time: prev.timeType === "Session" ? breakTime : sessionTime,
          timerRunning: true,
        }));
      }, 1000); 
    }
    console.log(displayState.timeType);
console.log(displayState.timerRunning);

  }, [displayState.time, breakTime, sessionTime, displayState.timerRunning, displayState.timeType]);
  

  const reset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setBreakTime(defaultBreakTime);
    setSessionTime(defaultSessionTime);
    setFlowers([]);

    setDisplayState({
      time: defaultSessionTime,
      timeType: "Session",
      timerRunning: false,
    });

    const audio = document.getElementById("beep") as HTMLAudioElement;
    audio.pause();
    audio.currentTime = 0;
    };

  const startStop = () => {
    setDisplayState((prev) => ({
      ...prev, 
      timerRunning: !prev.timerRunning
    }))
    console.log(displayState)
  };

  const changeBreakTime = (time: number) => {
    if (displayState.timerRunning) return;
    setBreakTime(time);
  };

  const decrementDisplay = () => {
    setDisplayState((prev) => {
      if (!prev.timerRunning) return prev; 
      return { ...prev, time: prev.time - 1 };
    });
  };

  const changeSessionTime = (time: number) => {
    if (displayState.timerRunning) return;
    setSessionTime(time);
    setDisplayState({
      time: time,
      timeType: "Session",
      timerRunning: false,
    })
  };

  return (
    <div className="clock">
      <div className="setters">
        <div className="break">
          <h4 id="break-label">Break Length</h4>
          <TimeSetter 
            time={breakTime} setTime={changeBreakTime} min={min} max={max} interval={interval} type="break"/>
        </div>
        <div className="session">
          <h4 id="session-label">Session Length</h4>
          <TimeSetter 
            time={sessionTime} setTime={changeSessionTime} min={min} max={max} interval={interval} type="session"/>
        </div>
      </div>
      <Display 
        displayState={displayState} reset={reset} startStop={startStop}
      />
      <audio id="beep" src={AlarmSound} />
      <div className="flowers">
        {flowers.map((flower) => (
          <div
          key={flower.id}
          className={`flower type-${flower.type}`}
          style={{ 
            left: `${flower.x}%`, 
        top: `${flower.y}%`,
        width: `${flower.size * 30}px`,
        height: `${flower.size * 30}px`,
        color: flower.color,
        opacity: 0.8,
        transition: 'all 0.3s ease-out'
          }}
        ></div>
        ))}
      </div>
    </div>
  );
}

export default App;
