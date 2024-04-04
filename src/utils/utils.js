import { ARROW_LINE_TYPE_CAGR, ARROW_LINE_TYPE_CURVE, ARROW_LINE_TYPE_GENERAL, ARROW_LINE_TYPE_GROW_METRIC } from "../components/common/types";

export const SELECTED_COLOR = 'rgb(0, 0, 255)'
export const ARROW_CAGR_NORMAL_BORDER_COLOR = 'rgb(0, 255, 0)'
export const ARROW_CAGR_NORMAL_BACKGROUND_COLOR = 'rgb(255, 255, 255)'

export const isEqualObject = (a, b) => JSON.stringify(a) == JSON.stringify(b)
export const copySimpleObject = (a) => JSON.parse(JSON.stringify(a))
export const getNewId = () => (new Date()).getTime()


export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function yValue(ctx, label) {
    const chart = ctx.chart;
    const dataset = chart.data.datasets[0];
    return dataset.data[chart.data.labels.indexOf(label)];
}

export function yOffset(ctx, label) {
    const value = yValue(ctx, label);
    const chart = ctx.chart;
    const scale = chart.scales.y;
    const y = scale.getPixelForValue(value);
    const lblPos = scale.getPixelForValue(100);
    return lblPos - y - 5;
}

export function findNearestDataPoint(chart, value, axis) {
    let minDiff = Number.MAX_VALUE;
    let nearestData = {
        dataIndex: 0,
        datasetIndex: 0,
    };
    const datasets = chart.data.datasets
    const labels = chart.data.labels
    for (let datasetIndex = 0; datasetIndex < datasets.length; datasetIndex++) {
        const datasetMeta = chart.getDatasetMeta(datasetIndex);
        labels.forEach((label, dataIndex) => {
            const rectangle = datasetMeta.data[+dataIndex];
            if (!rectangle) return;
            const boundingBox = rectangle.getProps(['x', 'y', 'base', 'width', 'height'], true);

            const diff = Math.abs(+boundingBox.x + boundingBox.width / 2 - value);
            if (diff < minDiff) {
                minDiff = diff;
                nearestData = {
                    dataIndex,
                    datasetIndex,
                };
            }
        });
    }
    return nearestData;
}
export function getDataPointFromXValue(xValue, datasets, isStacked = false) {
    const dataIndex = Math.round(xValue)
    let datasetIndex = 0;
    for (let i = 0; i < datasets.length; i++) {
        const calcXValue = getXValueForMultiDataset(i, dataIndex, { datasets, isStacked })
        if (Math.abs(xValue - calcXValue) < 0.01) {
            datasetIndex = i
            break;
        }
    }
    return {
        dataIndex,
        datasetIndex
    }
}

export const getDatasetIndexWithoutXAxis = (list, xAxis) => list.filter(item => item != xAxis)
export const getDatasetIndexFromKey = (list, key, xAxis) => getDatasetIndexWithoutXAxis(list, xAxis).findIndex(item => item == key)

export const getDatasetIndex = (state, datasetKey) => {
    const datasets = state.forms.axes.datasets
    const xAxis = state.forms.global.xAxis
    const datasetsKeys = Object.keys(datasets)

    const dataIndex = getDatasetIndexFromKey(datasetsKeys, datasetKey, xAxis)
    return dataIndex;
}
export const getXValueForMultiDataset = (datasetIndex, dataIndex, {
    datasets,
    isStacked
}) => {
    if (window.ColbyChartInfo.chartType != 'bar') {
        return +dataIndex
    }
    if (isStacked) {
        return +dataIndex;
    }
    const lblLen = datasets.length

    return +dataIndex + (datasetIndex * 2 + 1) / (2 * lblLen) - 0.5
}
export const checkValidateValueSame = (isEqual, propertyList, { preValues, curValues }) => {
    return propertyList.every(a => isEqual(preValues[a], curValues[a]))
}
export function highlightLine(chart, options, isHighlighted, subtype) {
    if (isHighlighted) {
        if (subtype == ARROW_LINE_TYPE_GROW_METRIC) {
            // Change the line's appearance when selected
            options.borderColor = SELECTED_COLOR; // Change to a highlighted color
            options.borderWidth = 3; // Increase the line width
        } else if (subtype == ARROW_LINE_TYPE_CAGR) {
            options.backgroundColor = SELECTED_COLOR;
            options.borderColor = SELECTED_COLOR;
        }
        // chart.update();
    } else {
        // Revert the line's appearance
        unhighlightLine(chart, options, subtype);
    }
}
export function unhighlightLine(chart, options, subtype) {
    if (subtype == ARROW_LINE_TYPE_GROW_METRIC) {
        // Revert the line's appearance to its original state
        options.borderColor = 'black';
        options.borderWidth = 2;
    } else if (subtype == ARROW_LINE_TYPE_CAGR) {
        options.backgroundColor = ARROW_CAGR_NORMAL_BACKGROUND_COLOR;
        options.borderColor = ARROW_CAGR_NORMAL_BORDER_COLOR;
    }
    chart.update();
}

export function calculatePercentageDifference(value1, value2) {
    if (value1 === 0 && value2 === 0) return 0;
    const diff = value2 - value1;
    return ((diff / value1) * 100).toFixed(2);
}
export function calculateCAGR(startValue, endValue, periods) {
    if (startValue === 0 || periods === 0) return 'N/A'; // Prevent division by zero
    return ((Math.pow(endValue / startValue, 1 / periods) - 1) * 100).toFixed(2) + '%';
}

export const getMainElementId = (id) => id.split('_')[0]
export const getArrowElementId = (id, subtype) => subtype ? `${id}+${subtype}` : `${id}`
export const getLeftElementId = (id) => `${id}_left`
export const getRightElementId = (id) => `${id}_right`

export const getArrowSubtypeById = (id) => {
    if (!id.startsWith('arrow')) return ''
    if (id.includes(ARROW_LINE_TYPE_GROW_METRIC)) return ARROW_LINE_TYPE_GROW_METRIC
    if (id.includes(ARROW_LINE_TYPE_CAGR)) return ARROW_LINE_TYPE_CAGR
    if (id.includes(ARROW_LINE_TYPE_GENERAL)) return ARROW_LINE_TYPE_GENERAL
    if (id.includes(ARROW_LINE_TYPE_CURVE)) return ARROW_LINE_TYPE_CURVE
    return ''
}
export const isArrowElement = (elementId) => elementId.startsWith('arrow')

export const calMaxValueInDatasets = (datasets) => {
    return Math.max(...datasets.map((dataset) => Math.max(...dataset.data)))
}
export const generateAnnotationId = (type) => `${type}-${getNewId()}`
export const getFontStyle = (font, style) => {
    switch (style) {
        case 'normal': {
            return {
                ...font,
                style: 'normal',
                weight: 'normal'
            }
        }
        case 'bold': {
            return {
                ...font,
                style: 'normal',
                weight: 'bold'
            }
        }
        case 'italic': {
            return {
                ...font,
                style: 'italic',
                weight: 'normal'
            }
        }
        case 'italic-bold': {
            return {
                ...font,
                style: 'italic',
                weight: 'bold'
            }
        }
    }
    return font;
}
export const getGradientColor = ({ chart, color, opacity }) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) {
        // This case happens on initial chart load
        return color;
    }
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    gradient.addColorStop(0, colorToRGBA(color, 0));
    gradient.addColorStop(0.3, colorToRGBA(color, +opacity * 0.5));
    gradient.addColorStop(1, colorToRGBA(color, +opacity));
    return gradient;
}
export const getBackgroundColor = ({ chart, color, opacity }) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) {
        // This case happens on initial chart load
        return color;
    }

    return colorToRGBA(color, +opacity);
}
export function colorToRGBA(color, opacity) {
    if (color[0] == '#') {
        return hexToRGBA(color, opacity);
    }
    if (color.startsWith('rgba')) {
        return rgbaToRGBA(color, opacity);
    }
    if (color.startsWith('rgb')) {
        return rgbToRGBA(color, opacity);
    }
    return color

}
export function hexToRGBA(hex, opacity) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
}
export function rgbToRGBA(rgb, opacity) {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) {
        throw new Error('Invalid RGB color format');
    }
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
}

export function rgbaToRGBA(color, opacity) {
    // Remove 'rgba(' and ')' from the color string
    const colorValues = color.substring(5, color.length - 1);

    // Split the color values into an array
    const valuesArray = colorValues.split(',');

    // Extract the individual color values
    const red = parseInt(valuesArray[0].trim(), 10);
    const green = parseInt(valuesArray[1].trim(), 10);
    const blue = parseInt(valuesArray[2].trim(), 10);

    // Create and return the RGBA object
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}


export const isNonAxisChart = (chartType) => {

    switch (chartType) {
        case 'pie':
        case 'doughnut':
            return true;
    }
    return false;
}
export const updateChartMouseCursorStyle = (chart, cursor) => {
    // console.trace('[updateChartMouseCursorStyle]', chart.canvas, )
    if(chart?.canvas) {
        chart.canvas.style.cursor = cursor
    }
}

export const updateChartEleemntStyle = (chart, cursor) => {
    if(chart?.canvas) {
        chart.canvas.style.cursor = cursor
    }
}

