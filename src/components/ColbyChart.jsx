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
// import ChartjsDraggablePlugin from '../plugins/draggerable'
import ChartJSdragDataPlugin from 'chartjs-plugin-dragdata'

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
    ChartJSdragDataPlugin,
    ...registerables
);





const ColbyChart = () => {
    const context = useChartContext()
    const { state: { options, data, chartType }, chartRef, dispatch } = context

    const colbyDraggerPlugin = useAnnotationDragger()
    const chartOptions = markColbyChartOptions(options)
    return (
        <ReactChart ref={chartRef} type={chartType}
            options={chartOptions}
            data={data}
            plugins={[colbyDraggerPlugin,
                {
                    id: 'dragData',
                    round: 1, // rounds the values to n decimal places 
                    // in this case 1, e.g 0.1234 => 0.1)
                    showTooltip: true, // show the tooltip while dragging [default = true]
                    // dragX: true // also enable dragging along the x-axis.
                    // this solely works for continous, numerical x-axis scales (no categories or dates)!
                    onDragStart: function (e, element) {
                        /*
                        // e = event, element = datapoint that was dragged
                        // you may use this callback to prohibit dragging certain datapoints
                        // by returning false in this callback
                        if (element.datasetIndex === 0 && element.index === 0) {
                          // this would prohibit dragging the first datapoint in the first
                          // dataset entirely
                          return false
                        }
                        */
                       console.log(e, element)
                    },
                    onDrag: function (e, datasetIndex, index, value) {
                        /*     
                        // you may control the range in which datapoints are allowed to be
                        // dragged by returning `false` in this callback
                        if (value < 0) return false // this only allows positive values
                        if (datasetIndex === 0 && index === 0 && value > 20) return false 
                        */
                    },
                    onDragEnd: function (e, datasetIndex, index, value) {
                        // you may use this callback to store the final datapoint value
                        // (after dragging) in a database, or update other UI elements that
                        // dependent on it
                    },
                }]}
        />
    )
}

export default ColbyChart