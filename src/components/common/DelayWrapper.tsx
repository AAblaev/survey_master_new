import React, { useState, useEffect } from "react";
import { TIMEOUT_VALUE } from "../../consts/const";

const useAppearAfterDelay = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, TIMEOUT_VALUE);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return isVisible;
};

const DelayWrapper: React.FC = ({ children }) => {
  const isVisible = useAppearAfterDelay();

  return <>{isVisible && <div>{children}</div>}</>;
};

export default DelayWrapper;
