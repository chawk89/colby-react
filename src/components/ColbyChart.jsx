import React, { useContext, useMemo } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineController, LineElement, PointElement,
    BarController, 
    registerables
} from 'chart.js';

import { Chart as ReactChart } from 'react-chartjs-2';
import { useChartContext } from '../hooks/useChartContext'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    LineController,
    LineElement,

    PointElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels,
    AnnotationPlugin,
    ...registerables
);



const ColbyChart = () => {
    const context = useChartContext()
    const { state: { options, data, chartType }, chartRef, draggerPlugin } = context


    return (
        <ReactChart ref={chartRef} type={chartType} options={options} data={{ ...data }}
            plugins={[draggerPlugin]}
            redraw={true}
        />
    )
}

export default ColbyChart