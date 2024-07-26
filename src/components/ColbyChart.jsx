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


class CustomBarController extends BarController {
    draw() {
      super.draw();
    }
  }

  CustomBarController.id = 'custom'; 


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    LineController,
    LineElement,
    CustomBarController, 

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
    const [selectedAnnotationType, setSelectedAnnotationType] = useState(null); 
    const { state: { options, forms, data, chartType, getChart }, chartRef, dispatch } = context

    const colbyDraggerPlugin = useAnnotationDragger(dispatch, context.state); 
    const chartOptions = markColbyChartOptions(options, dispatch);

    console.log("context??", options)
   
    const handleClick = (event, data) => {
        // document.querySelector
        console.log('[handleClick]', event.target, data);
        setSelectedAnnotationType(data.subtype); 
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

    const handleOnMouseEnter = (event) => {
        const distanceToLineSegment = (x1, y1, x2, y2, x0, y0) => {
            var A = x0 - x1;
            var B = y0 - y1;
            var C = x2 - x1;
            var D = y2 - y1;
        
            var dot = A * C + B * D;
            var len_sq = C * C + D * D;
            var param = -1;
            if (len_sq != 0) {
                param = dot / len_sq;
            }
        
            var xx, yy;
        
            if (param < 0) {
                xx = x1;
                yy = y1;
            } else if (param > 1) {
                xx = x2;
                yy = y2;
            } else {
                xx = x1 + param * C;
                yy = y1 + param * D;
            }
        
            var dx = x0 - xx;
            var dy = y0 - yy;
            return Math.sqrt(dx * dx + dy * dy);
        }

        const checkIfNearLine = (scales, event, line, proximity) => {
            console.log("in check!")
            // var x = scales[`x`].getPixelForValue(line.xMax);
            console.log("scales?", line.xMax, event)

            // var y = scales.y.getPixelForValue(line.yMin);
            // var xEnd = scales.x.getPixelForValue(line.xMax);
            // var yEnd = scales.y.getPixelForValue(line.yMax);
        
            // var distance = distanceToLineSegment(x, y, xEnd, yEnd, event.offsetX, event.offsetY);
            // return distance < proximity;
        }

        const currentAnnotations = Object.values(options.plugins.annotation.annotations); 
        console.log("arrowLine?", currentAnnotations); 

        if (currentAnnotations) {
            var nearLine = checkIfNearLine(options.scales, event, currentAnnotations[0], 10);
            if (nearLine) {
                if (!isCursorNearLine) {
                    console.log("not near line?")
                }
                showCallout(event);
            } else {
                if (isCursorNearLine) {
                    console.log("is near line")
                }
            }
        }
    }
    return (
        <>   
            <ReactChart ref={chartRef} type={chartType}
                    options={chartOptions}
                    data={data}
                    plugins={[colbyDraggerPlugin,]} 
                    style={{marginTop: '50px'}}
                    onMouseEnter={(event) => handleOnMouseEnter(event)}
            />
            <ChartMenu onClick={handleClick} selectedAnnotationType={selectedAnnotationType}
            
            />

            
        </>
    )
}

export default ColbyChart