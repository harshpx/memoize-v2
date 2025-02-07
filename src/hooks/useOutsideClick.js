import { useState, useEffect, useRef } from "react";

const useOutsideClick = () => {
  const ref = useRef(null);
  const [isOutsideClick, setIsOutsideClick] = useState(true);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOutsideClick(true);
      } else {
        setIsOutsideClick(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return { ref, isOutsideClick };
}

export default useOutsideClick;