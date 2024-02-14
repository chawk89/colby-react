import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineController,
    LineElement,
    PointElement,
    BarController,
    registerables
} from 'chart.js';

import { Chart as ReactChart } from 'react-chartjs-2';
import { useChartContext } from '../hooks/useChartContext'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import useAnnotationDragger, { markColbyChartOptions } from '../hooks/useAnnotationDragger';
import ChartMenu from './common/ChartMenu';

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
    // ChartjsDraggablePlugin,
    ...registerables
);





const ColbyChart = () => {
    const context = useChartContext()
    const { state: { options, data, chartType }, chartRef, dispatch } = context

    const colbyDraggerPlugin = useAnnotationDragger(dispatch, context.state)
    const chartOptions = markColbyChartOptions(options)
    return (
        <>
            <ReactChart ref={chartRef} type={chartType}
                options={chartOptions}
                data={data}
                plugins={[colbyDraggerPlugin,]}
            />
            <ChartMenu />
        </>
    )
}

export default ColbyChart