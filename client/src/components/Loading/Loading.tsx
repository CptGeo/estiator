import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";

export default function Loading() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setDots(oldDots => {
        return ( oldDots + 1 ) % 4;
      });
    }, 500);

    return () => {
      clearInterval(t);
    }
  }, []);

  return (
    <div className="w-full h-[calc(100vh-300px)] flex justify-center items-center">
      <div className="flex flex-col gap-5">
        <Spinner color="current" size="lg" className="mb-2" label={`Loading${".".repeat(dots)}`} />
      </div>
    </div>
  )
}