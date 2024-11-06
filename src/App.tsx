import { useState } from "react";
import "./App.css";
import { DisplayState } from "./helpers";

const defaultBreakTime = 5 * 60;
const defaultSessionTime = 25 * 60;
const min = 60;
const max = 60 * 60;
const interval = 60;

function App() {
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [sessionTime, setSessionTime] = useState(defaultSessionTime);
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: "Session",
    timerRunning: false,
  });

  return (
    <div className="clock">
      <div className="setters">
        <div className="break">
          <h4>Break Length</h4>
          <TimeSetter />
        </div>
        <div className="session">
          <h4>Session Length</h4>
          <TimeSetter />
        </div>
      </div>
      <Display />
      <audio id="beep" src={AlarmSound} />
    </div>
  );
}

export default App;
