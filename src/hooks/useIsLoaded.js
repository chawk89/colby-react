import React, { useEffect, useRef, useState } from 'react'

export const useIsLoaded = () => {
    // const ColbyChartInfo = useRef(window?.ColbyChartInfo)
    // useEffect(() => {
    //     const handleWindowVariableChange = () => {
    //         if (ColbyChartInfo.current !== window?.ColbyChartInfo) {

    //         }
    //         // Update the previous value of the window variable
    //         ColbyChartInfo.current = window?.ColbyChartInfo;
    //     };

    //     window.addEventListener('resize', handleWindowVariableChange);
    //     return () => {
    //         window.removeEventListener('resize', handleWindowVariableChange);
    //     };
    // }, []);
    // return ColbyChartInfo?.current?.isLoaded ?? false
    const [chartInfo, setChartInfo] = useState(window?.ColbyChartInfo);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newChartInfo = window?.ColbyChartInfo;
            if (newChartInfo !== chartInfo) {
                setChartInfo(newChartInfo);
                console.log('Window variable changed:', newChartInfo);
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
