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
import { Chart as ReactChart } from 'react-chartjs-2';
import { useChartContext } from '../hooks/useChartContext'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels,
    AnnotationPlugin
);



const ColbyChart = () => {
    const context = useChartContext()
    const { state: { options, data, chartType } } = context
    return (
        <ReactChart type={chartType} options={options} data={data} />
    )
}

export default ColbyChart