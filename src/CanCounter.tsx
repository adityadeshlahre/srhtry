import { useEffect, useState } from "react";
import clickSound from "./../public/clickSound.wav";
import buttonClick from "./../public/buttonClick.ogg";

const row: number = 4;
const col: number = 5;

const shuffleArray = (array: number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const CanCounter = () => {
  const [buttonOrder, setButtonOrder] = useState<number[]>([]);
  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState(100);
  const [nextNumber, setNextNumber] = useState<number>(1);
  const [isGameActive, setIsGameActive] = useState<boolean>(true);

  const clickSoundEffect = new Audio(clickSound);
  const buttonClickEffect = new Audio(buttonClick);

  useEffect(() => {
    setButtonOrder(Array.from({ length: row * col }, (_, index) => index + 1));

    const scrambleInterval = setInterval(() => {
      setButtonOrder((prevOrder) => shuffleArray([...prevOrder]));
      clickSoundEffect.play();
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          setIsGameActive(false);
          clearInterval(scrambleInterval);
          clearInterval(progressInterval);
          return 0;
        }
        return prev > 0 ? prev - 0.5263 : 0;
      });
    }, 100);

    return () => {
      clearInterval(scrambleInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleClick = (num: number) => {
    if (!isGameActive) return;

    buttonClickEffect.play();

    if (num === nextNumber) {
      setClickedButtons((prev) => new Set(prev).add(num));
      setNextNumber(nextNumber + 1);
    } else {
      setProgress((prev) => {
        const newProgress = prev > 7.8947 ? prev - 7.8947 : 0;
        if (newProgress <= 0) {
          setIsGameActive(false);
        }
        return newProgress;
      });
    }

    console.log(`Button ${num} clicked`);
  };

  const getProgressColor = () => {
    if (progress > 60) return "bg-green-500";
    if (progress > 35) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <div className=" bg-slate-950 min-h-screen w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="text-6xl text-slate-50 pb-4">CanCounter</div>
          <div>
            <div className="grid grid-cols-5 gap-2 box-border h-72 w-80 p-2 border-4 border-amber-50">
              {buttonOrder.map((num, index) => (
                <button
                  key={index}
                  className={`text-center font-bold p-4 border-2 border-neutral-600 ${
                    clickedButtons.has(num)
                      ? "bg-slate-400 text-black"
                      : "bg-slate-600 text-white"
                  }`}
                  onClick={() => handleClick(num)}
                  disabled={!isGameActive || clickedButtons.has(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="box-border h-4 mt-2 border-4 border-amber-50 relative w-full overflow-hidden">
              <div
                className={`absolute h-full transition-all duration-1000 ease-linear ${getProgressColor()}`}
                style={{ width: `${progress}%`, left: 0 }}
              ></div>
            </div>
          </div>
          {!isGameActive && (
            <div className="text-4xl text-slate-100 mt-4">
              Time's up! Game Over!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CanCounter;
