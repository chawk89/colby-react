import React, { useEffect, useRef } from 'react'

export const useIsLoading = () => {
    const ColbyChartInfo = useRef(window?.ColbyChartInfo)
    useEffect(() => {
        const handleWindowVariableChange = () => {
            if (ColbyChartInfo.current !== window?.ColbyChartInfo) {

            }
            // Update the previous value of the window variable
            ColbyChartInfo.current = window?.ColbyChartInfo;
        };

        window.addEventListener('resize', handleWindowVariableChange);
        return () => {
            window.removeEventListener('resize', handleWindowVariableChange);
        };
    }, []);
    console.log('[useIsLoading]', ColbyChartInfo?.current?.isLoading)
    return ColbyChartInfo?.current?.isLoading ?? true
}
