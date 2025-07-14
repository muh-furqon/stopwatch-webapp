import React, {useState, useEffect} from "react";

const Stopwatch = () => {
    //initialize time variable
    const [time, setTime] = useState(0)
    //state to check is stopwatch currently run or not
    const [isRun, setIsRun] = useState(false)
    //state to track the laps
    const [laps, setLaps] = useState([])

    useEffect(() => {
        let intervalId
        if (isRun) {
            // set time from 0 to 1 every 10ms using js setinterval
            intervalId = setInterval(() => setTime(prevtime => prevtime + 1), 10)
        }
        return () => clearInterval(intervalId)
    }, [isRun])

    const startAndStop = () => {
        setIsRun(!isRun)
    }

    const reset = () => {
        setIsRun(false)
        setTime(0)
        setLaps([])
    }

    const handleTagLap = () => {
        if (!isRun) return;
        const newLap = {
            id: Date.now(),
            time: time,
        }

        setLaps([...laps, newLap])
    }

    const formatTime = (time) => {
        const hours = Math.floor(time / 360000)
        const minutes = Math.floor((time % 360000) / 6000)
        const seconds = Math.floor((time % 6000) / 100)
        const ms = time % 100;

        const pad = (num) => num.toString().padStart(2, '0')

        return {
            hours: pad(hours),
            minutes: pad(minutes),
            seconds: pad(seconds),
            ms: pad(ms),
            full: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(ms)}`
        }
    }

    const formattedTime = formatTime(time)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-slate-100">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 w-fit">
                <div className="text-6xl md:text-7xl font-mono tracking-widest mb-8 text-center">
                    <span>{formattedTime.hours}</span>:
                    <span>{formattedTime.minutes}</span>:
                    <span>{formattedTime.seconds}</span>
                    <span className="text-3xl md:text-4xl align-text-bottom text-emerald-400">.{formattedTime.ms}</span>
                </div>
                <div className="flex items-center justify-center gap-3 my-6">
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

                    <button
                        onClick={handleTagLap}
                        className="px-6 py-2 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 w-36"
                    >
                        Add Lap
                    </button>
                </div>

                {laps.length > 0 && (
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">ID</th>
                                    <th scope="col" className="px-6 py-3">Lap Duration</th>
                                    <th scope="col" className="px-6 py-3">Total Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {laps.map((lap, index) => {
                                    const prevLapTime = index > 0 ? laps[index - 1].time : 0;
                                    const lapDuration = lap.time - prevLapTime;

                                    return (
                                        <tr key={lap.id}>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {index + 1}
                                            </th>
                                            
                                            {/* ✅ FIX: Access the .full property */}
                                            <td className="px-6 py-4 font-mono">{formatTime(lapDuration).full}</td>
                                            
                                            {/* ✅ FIX: Access the .full property */}
                                            <td className="px-6 py-4 font-mono">{formatTime(lap.time).full}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}


export default Stopwatch