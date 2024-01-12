import React, { useContext } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Chart as ReactChart } from 'react-chartjs-2';
import { useChartContext } from '../hooks/useChartContext'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);



const ColbyChart = () => {
    const context = useChartContext()
    const { state: { options, data, chartType } } = context
    console.log('[ColbyChart]', context.state)
    return (
        <ReactChart type={chartType} options={options} data={data} />
    )
}

export default ColbyChart