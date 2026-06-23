import { useCallback, useEffect, useRef, useState } from "react";

const useCountdown = ({ onExpire, enabled = true } = {}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const resetCountdown = useCallback((seconds) => {
    setTimeLeft(Math.max(0, Number(seconds) || 0));
  }, []);

  useEffect(() => {
    if (!enabled || timeLeft <= 0) return undefined;

    const timer = window.setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          window.clearInterval(timer);
          onExpireRef.current?.();
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [enabled, timeLeft <= 0]);

  return { timeLeft, resetCountdown };
};

export default useCountdown;
