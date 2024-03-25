import React from 'react'
import { useMemo } from 'react';
import { isNonAxisChart } from '../utils/utils';

const useIsNonAxisChart = (chartType) => {
    return useMemo(() => {
        return isNonAxisChart(chartType)
    }, [chartType])
}

export default useIsNonAxisChart