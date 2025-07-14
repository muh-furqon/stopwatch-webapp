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

    //flip the run status for simplicity
    const startAndStop = () => {
        setIsRun(!isRun)
    }

    //reset everything
    const reset = () => {
        setIsRun(false)
        setTime(0)
        setLaps([])
    }

    //handling the lap tagging
    const handleTagLap = () => {
        if (!isRun) return;
        const newLap = {
            id: Date.now(),
            time: time,
        }

        //get current laps arrays, permutable it and then add new lap value
        setLaps([...laps, newLap])
    }

    //new formatting system for reusability
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

    // LOGIC FOR THE CLOCK SPINNING

    //SVG, colors and animation constants

    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const colors = ['#34d399', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

    //tracking how many minutes has been passed
    const completedMinutes = Math.floor(time / 6000)

    //current minute progress tracked
    const currentMinuteProgress = (time % 6000) / 6000;
    const strokeOffset = circumference - currentMinuteProgress * circumference

    
    const currentColor = colors[completedMinutes % colors.length]

    //put the formatted time inside this constant
    const formattedTime = formatTime(time)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-slate-100">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 w-fit flex flex-col items-center">
                <div className="relative grid place-items-center mb-8 h-96 w-96">
                    <svg viewBox="0 0 200 200" className="-rotate-90">
                        {/* 1. Background Circle */}
                        <circle cx="100" cy="100" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" opacity="0.2" />
                        
                        {/* 2. Render a FULL circle for each COMPLETED minute */}
                        {Array.from({ length: completedMinutes }).map((_, index) => {
                            const minuteColor = colors[index % colors.length];
                            return (
                                <circle
                                    key={`minute-${index}`}
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    fill="none"
                                    stroke={minuteColor}
                                    strokeWidth="10"
                                    strokeDasharray={circumference}
                                    strokeDashoffset="0" // Offset is 0 for a full circle
                                    strokeLinecap="round"
                                />
                            );
                        })}

                        {/* 3. Render the CURRENTLY ANIMATING circle on top */}
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke={currentColor}
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeOffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.2s linear' }}
                        />
                    </svg>

                    <div className="absolute flex items-baseline text-3xl md:text-4xl font-mono tracking-widest text-center">
                        <span>{formattedTime.hours}</span>:
                        <span>{formattedTime.minutes}</span>:
                        <span>{formattedTime.seconds}</span>
                        <span className="text-lg md:text-xl text-emerald-400 ml-1">.{formattedTime.ms}</span>
                    </div>
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

                {/* only showing the table if the laps array is not empty */}
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
                                {/* looping through every lap index */}
                                {laps.map((lap, index) => {
                                    const prevLapTime = index > 0 ? laps[index - 1].time : 0;
                                    const lapDuration = lap.time - prevLapTime;

                                    return (
                                        <tr key={lap.id}>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {index + 1}
                                            </th>
                                            <td className="px-6 py-4 font-mono">{formatTime(lapDuration).full}</td>
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