import {  useContext } from 'react';
import { ChartContext } from '../context/ChartContext'


export const useChartContext = () => {
    const context = useContext(ChartContext);
    if (!context) {
        throw new Error('useMyContext must be used within a MyProvider');
    }
    return context;
};
