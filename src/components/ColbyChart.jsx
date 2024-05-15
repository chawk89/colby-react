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
import useAnnotationDragger, { hideColbyMenu, markColbyChartOptions } from '../hooks/useAnnotationDragger';
import ChartMenu from './common/ChartMenu';
import { findNearestDataPoint, getDatasetIndexWithoutXAxis } from '../utils/utils';
import ChartjsPluginStacked100 from "chartjs-plugin-stacked100";

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
        ChartjsPluginStacked100,
    // ChartjsDraggablePlugin,
    ...registerables
);


const ColbyChart = () => {
    const context = useChartContext()
    const { state: { options, forms, data, chartType, getChart }, chartRef, dispatch } = context

    const colbyDraggerPlugin = useAnnotationDragger(dispatch, context.state)
    const chartOptions = markColbyChartOptions(options, dispatch)
    const handleClick = (event, data) => {
        // document.querySelector
        console.log('[handleClick]', event.target, data);
        const chart = getChart()
        const rect = chart.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const xValue = chart.scales.x.getValueForPixel(x);
        const yValue = chart.scales.y.getValueForPixel(y);
        const datasets = forms.axes.datasets
        const xAxis = forms.global.xAxis
        const nearestData = findNearestDataPoint(chart, x, 'x');

        const datasetKeys = getDatasetIndexWithoutXAxis(Object.keys(datasets), xAxis)
        const datasetKey = datasetKeys[nearestData.datasetIndex]

        hideColbyMenu()
        dispatch({ type: 'CREATE_ANNOTATION_ITEM_BY_CONTEXTMENU', data: { ...data, x: xValue, y: yValue, nearestData: { ...nearestData, datasetKey } } })

    }
    return (
        <>   
                <ReactChart ref={chartRef} type={chartType}
                    options={chartOptions}
                    data={data}
                    plugins={[colbyDraggerPlugin,]} 
                    style={{marginTop: '50px'}}
                />
            <ChartMenu onClick={handleClick} />
        </>
    )
}

export default ColbyChart