import { useEffect } from "react";

export default function clickOutside(ref: any, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(e: Event) {
      if (
        ref.current &&
        !(ref.current as HTMLDivElement).contains(e.target as Node)
      ) {
        setTimeout(callback, 0);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
