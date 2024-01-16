import React, { useEffect, useRef, useState } from 'react'

export const useIsLoaded = () => {   
    const [chartInfo, setChartInfo] = useState(window?.ColbyChartInfo);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newChartInfo = window?.ColbyChartInfo;
            if (newChartInfo !== chartInfo) {
                setChartInfo(newChartInfo);
                console.log('ChartInfo changed:', newChartInfo);
                // Perform any additional actions based on the change
                clearInterval(intervalId);
            }
        }, 1000); // Adjust the interval duration as needed

        return () => {
            clearInterval(intervalId);
        };
    }, []);
    return chartInfo?.isLoaded


}
