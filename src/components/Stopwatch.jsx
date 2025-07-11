import React, {useState, useEffect} from "react";

const Stopwatch = () => {
    //initialize time variable
    const [time, setTime] = useState(0)

    //state to check is stopwatch currently run or not
    const [isRun, setIsRun] = useState(false)

    useEffect(() => {
        let intervalId
        if (isRun) {
            // set time from 0 to 1 every 10ms using js setinterval
            intervalId = setInterval(() => setTime(prevtime => prevtime + 1), 10)
        }
        return () => clearInterval(intervalId)
    }, [isRun])

    const hours = Math.floor(time / 360000)

    const minutes = Math.floor((time % 360000) / 6000)

    const seconds = Math.floor((time % 6000) / 100)

    const ms = time % 100;

    const startAndStop = () => {
        setIsRun(!isRun)
    }

    const reset = () => {
        setIsRun(false)
        setTime(0)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-slate-100">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 w-fit">
                <div className="text-6xl md:text-7xl font-mono tracking-widest mb-8 text-center">
                    <span>{hours.toString().padStart(2, '0')}</span>:
                    <span>{minutes.toString().padStart(2, '0')}</span>:
                    <span>{seconds.toString().padStart(2, '0')}</span>
                    <span className="text-3xl md:text-4xl align-text-bottom text-emerald-400">.{ms.toString().padStart(2, '0')}</span>
                </div>
                <div>
                    <button
                        onClick={startAndStop}
                        className={`px-6 py-2 text-lg font-semibold rounded-md transition-colors duration-200 w-28 ${
                            isRun
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                    >
                        {isRun ? 'Stop' : 'Start'}
                    </button>
                    <button
                        onClick={reset}
                        className="px-6 py-2 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 w-28"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    )
}


export default Stopwatch