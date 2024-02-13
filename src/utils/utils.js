export const isEqualObject = (a, b) => JSON.stringify(a) == JSON.stringify(b)
export const copySimpleObject = (a) => JSON.parse(JSON.stringify(a))
export const getNewId = () => (new Date()).getTime()

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

function findNearestDataPoint(chart, value, dataIndex, axis) {
    let minDiff = Number.MAX_VALUE;
    let nearestValue = value;

    chart.data.labels.forEach((label, index) => {
        const chartValue = axis === 'x' ? index : chart.data.datasets[dataIndex].data[index];
        const diff = Math.abs(chartValue - value);
        if (diff < minDiff) {
            minDiff = diff;
            nearestValue = chartValue;
        }
    });

    return nearestValue;
}

export const getDatasetIndexFromKey = (list, key, xAxis) => list.filter(item => item != xAxis).findIndex(item => item == key)

export const getDatasetIndex = (state, datasetKey) => {
    const datasets = state.forms.axes.datasets
    const xAxis = state.forms.general.xAxis
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