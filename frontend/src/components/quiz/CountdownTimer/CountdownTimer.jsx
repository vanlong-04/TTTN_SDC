import formatTime from "../../../utils/formatTime";
import "./CountdownTimer.scss";

const CountdownTimer = ({ timeLeft }) => (
  <div
    className={`countdown-timer${timeLeft <= 60 ? " danger" : ""}`}
    role="timer"
    aria-live={timeLeft <= 60 ? "polite" : "off"}
    aria-label={`Thời gian còn lại ${formatTime(timeLeft)}`}
  >
    <span className="timer-label">Thời gian còn lại</span>
    <strong>{formatTime(timeLeft)}</strong>
  </div>
);

export default CountdownTimer;
