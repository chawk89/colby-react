// ChartContext.js
import React, { createContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { md5 } from 'js-md5';
import { SELECTED_COLOR, ARROW_CAGR_NORMAL_BORDER_COLOR, calculateCAGR, calculatePercentageDifference, copySimpleObject, getArrowElementId, getDatasetIndex, getDatasetIndexFromKey, getDatasetIndexWithoutXAxis, getLeftElementId, getRightElementId, getXValueForMultiDataset, yOffset, yValue, ARROW_CAGR_NORMAL_BACKGROUND_COLOR, calMaxValueInDatasets, generateAnnotationId, getFontStyle, colorToRGBA, getGradientColor, getBackgroundColor, isNonAxisChart } from '../utils/utils';
import { ARROW_LINE_TYPE_CAGR, ARROW_LINE_TYPE_CURVE, ARROW_LINE_TYPE_GENERAL, ARROW_LINE_TYPE_GROW_METRIC } from '../components/common/types';
// Initial state
const initState = {
    forms: {
        annotationTemp: {
            line: {
                enabled: false,
                axis: "x",
                position: 0,
                style: "dashed",
                thickness: "1",
                color: "#8F0000",
                label: "",
                type: 'line',
                id: 'lineTemp',
            },
            box: {
                enabled: false,
                label: "",
                xMax: "",
                xMin: "",
                yMax: "",
                yMin: "",
                type: 'box',
                id: 'boxTemp'
            },
            label: {
                enabled: false,
                datasetKey: "",
                dataIndex: 0,
                caption: "",
                opacity: 1,
                fontName: "",
                fontSize: "",
                anchor: "",
                color: "#000000",
                type: 'label',
                id: 'labelTemp',
                imageHeight: '20%', 
                imageWidth: '20%',
            },
            arrow: {
                enabled: false,
                type: "arrow",
                doubleArrow: "1",
                label: "asdfasdfasdf",
                color: "#000000",
                startDatasetKey: "",
                startDataIndex: "",
                endDatasetKey: "",
                endDataIndex: "",
                lineType: ARROW_LINE_TYPE_GENERAL,
                id: 'arrowTemp'
            },
            emphasis: {
                enabled: false,
                datasetKey: "",
                dataIndex: 0,
                darken: "#D3D3D3",
                highlight: '#BCE9FE',
            },
            image: {
                enabled: false,
                datasetKey: "",
                dataIndex: 0,
                caption: "",
                opacity: 1,
                fontName: "",
                fontSize: "",
                anchor: "",
                color: "#000000",
                type: 'label',
                id: 'labelTemp',
                imageHeight: '20%', 
                imageWidth: '20%',
            }
        },
        global: {
            title: "",
            xAxis: "",
            plotted: false,
            stacked: 'none',
            switchRowColumn: false,
            showLabels: false,
            showLegend: true,
            fontName: "Lora",
            fontSize: "18",
            titleColor: "#3e1818",
            backColor: "#ffffff",
            titleStyle: "italic-bold",
            legendPosition: "top"
        },
        xAxis: {
            min: "",
            max: "",
            labelStyle: "normal",
            labelColor: "#000000",
            ticksColor: "#000000", 
            labelSize: "10",
            showAxis: "1",
            showGrid: "1"
        },
        yAxis: {
            min: "",
            max: "",
            labelStyle: "normal",
            labelColor: "#000000",
            ticksColor: "#000000", 
            labelSize: "10",
            showAxis: "1",
            showGrid: "1"
        },
        datasets: {},
        axes: {
            keyLabels: [],
        },
        dataRange: '',
    },
    annotation: {
        // "line-1707320896272": {
        //     enabled: true,
        //     axis: "x",
        //     position: "500",
        //     style: "dashed",
        //     thickness: "1",
        //     color: "#8F0000",
        //     label: "Test",
        //     type: "line",
        //     id: "line-1707320896272",

        // },
        // "box-1707320977735": {
        //     enabled: true,
        //     label: "",
        //     xMax: "Q2 FY2013",
        //     xMin: "Q1 FY2013",
        //     yMax: "1500",
        //     yMin: "500",
        //     type: "box",
        //     id: "box-1707320977735"
        // },
        // "arrow-1707348807973+global": {
        //     "enabled": true,
        //     "doubleArrow": "1",
        //     "label": "asdfasdfasdf",
        //     "color": "#000000",
        //     "type": "arrow",
        //     "id": "arrow-1707348807973+global",
        //     "startDatasetKey": "YpmL7a6OYEv2tnX4VxEFXA==",
        //     "startDataIndex": "1",
        //     "endDatasetKey": "FL1pyNrYWyqAVBdtx7c/Jw==",
        //     "endDataIndex": "2",
        //     lineType: ARROW_LINE_TYPE_GENERAL
        // },
        // 'arrow-1707838906237+grow': {
        //     "enabled": true,
        //     "type": "arrow",
        //     "doubleArrow": "1",
        //     "label": "asdfasdfasdf",
        //     "color": "#000000",
        //     "startDatasetKey": "YpmL7a6OYEv2tnX4VxEFXA==",
        //     "startDataIndex": "5",
        //     "endDatasetKey": "YpmL7a6OYEv2tnX4VxEFXA==",
        //     "endDataIndex": 9,
        //     "lineType": ARROW_LINE_TYPE_GROW_METRIC,
        //     "id": "arrow-1707838906237+grow"
        // },
        // "label-1707349710912": {
        //     enabled: true,
        //     datasetKey: "YpmL7a6OYEv2tnX4VxEFXA==",
        //     dataIndex: "8",
        //     caption: "Test",
        //     fontName: "",
        //     fontSize: "",
        //     anchor: "1",
        //     color: "#000000",
        //     type: "label",
        //     id: "label-1707349710912"
        // }
    },
    annotationSelected: '',
    options: {
        responsive: true,
        events: ["mousedown", "mouseup", "mousemove", "mouseout", "mouseleave", "click"],
        aspectRatio: 1,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '',
            },
            datalabels: {
                display: false,
                align: "end",
                anchor: "end",
                color: "#3e1818", 
                formatter: (value) => value,
            },
            annotation: {
                annotations: {
                    dragger: {
                        id: 'dragger',
                        type: 'box',
                        display: false,
                        xMin: 0,
                        xMax: 1,
                        yMin: 100,
                        yMax: 300,

                        backgroundColor: 'gray',
                        label: {
                            display: true,
                            width: 20,
                            height: 30,
                            position: 'center',
                            content: ['DragMe']
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: false,
                title: {
                    display: true,
                    text: "",
                },
            },
            y: {
                stacked: false,
                title: {
                    display: true,
                    text: "Default Y-Axis Label",
                },
            }
        },
        layout: {
            padding: {
                right: 30,
                left: 20,
            }
        }
    },
    eventId: ''
};

// Action types
export const UDPATE_FORM = 'UDPATE_FORM';
export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export const RELOAD_FORM = 'RELOAD_FORM';
export const FETCH_DATA_RANGE = 'FETCH_DATA_RANGE';
export const ADD_ANNOTATION_ITEM = 'ADD_ANNOTATION_ITEM';
export const ACTIVE_ANNOTATION_ITEM = 'ACTIVE_ANNOTATION_ITEM';
export const UPDATE_ANNOTATION_ITEM = 'UPDATE_ANNOTATION_ITEM';
export const UPDATE_ANNOTATION_POSITION = 'UPDATE_ANNOTATION_POSITION';
export const UPDATE_ANNOTATION_ARROW_DATA = 'UPDATE_ANNOTATION_ARROW_DATA';
export const DELETE_ANNOTATION_ITEM = 'DELETE_ANNOTATION_ITEM';
export const CREATE_ANNOTATION_ITEM_BY_CONTEXTMENU = 'CREATE_ANNOTATION_ITEM_BY_CONTEXTMENU';
export const FETCH_BOT_RES = 'FETCH_BOT_RES'; 

export const DEFAULT_COLORS = ['rgba(255, 99, 132, 0.5)', 'rgba(53, 162, 235, 0.5)']


const updateGlobalOption = (oldOptions, global, state) => {
    const newOptions = { ...oldOptions }
    const { message } = state.forms; 
    const {
        title,
        stacked,
        switchRowColumn,
        showLabels,
        showLegend,
        fontName,
        fontSize,
        titleColor,
        titleStyle,
        bgColor,
        legendPosition,
        labelsColor,
    } = global

    // title
    newOptions.plugins.title.text = title
    // stacked
    switch (stacked) {
        case '100-stacked':
            newOptions.scales.y.stacked = true
            newOptions.scales.x.stacked = true
            newOptions.plugins.stacked100 = { enable: true}; 
            break;
        case 'stacked':
            newOptions.scales.y.stacked = true
            newOptions.scales.x.stacked = true
            newOptions.plugins.stacked100 = { enable: false}; 
            break;
        case 'none':
        default:
            newOptions.scales.y.stacked = false
            newOptions.scales.x.stacked = false
            break;
    }
    newOptions.scales.y.ticks.callback = (value) => calcYAxisTickCallback(value, state)

    // legend
    newOptions.plugins.legend.display = showLegend
    // show datalabels
    newOptions.plugins.datalabels.display = showLabels
    newOptions.plugins.datalabels.color = labelsColor
    // switch RowColumn
    newOptions.rowSwitch = switchRowColumn ? true : false

    let font = {}
    newOptions.plugins.title.color = titleColor
    if (fontName) {
        font.family = fontName
    }
    if (fontSize) {
        font.size = +fontSize
    }
    if (titleStyle) {
        font = getFontStyle(font, titleStyle)

    }
    newOptions.plugins.title.font = font
    newOptions.plugins.colbyDraggerPlugin = {
        bgcolor: bgColor
    }

    if (legendPosition) {
        newOptions.plugins.legend.position = legendPosition
    }
    return newOptions
}

const validateMinMaxValue = (v) => {
    if (v == "" || v == undefined || v == null) return false
    if (typeof v == "number") return true;
    if (typeof v == "string" && +v == v) return true;
    return false
}

const updateAxisRangeValue = (oldOptions, { xAxis, yAxis, chartType }) => {
    const newOptions = { ...oldOptions }

    const isNonAxis = isNonAxisChart(chartType)
    // xAxis Value
    {
        const {
            showGrid,
            showAxis,
            labelStyle,
            labelColor,
            labelSize,
            labelFont,
            min,
            max,
            label,
            ticksColor,
        } = xAxis

        newOptions.scales.x.min = validateMinMaxValue(min) ? min : undefined;
        newOptions.scales.x.max = validateMinMaxValue(max) ? max : undefined;
        newOptions.scales.x.title.text = label ?? "";

        newOptions.scales.x.display = isNonAxis ? false : showAxis == '1';
        newOptions.scales.x.border = {
            display: true
        }
        newOptions.scales.x.grid = {
            display: showGrid == '1',
            drawOnChartArea: true,
            drawTicks: true
        }


        let xAxisFont = {}
        newOptions.scales.x.title.color = labelColor
        newOptions.scales.x.ticks.color = ticksColor
        if (labelFont) {
            xAxisFont.family = labelFont
        }
        if (labelSize) {
            xAxisFont.size = +labelSize
        }
        if (labelStyle) {
            xAxisFont = getFontStyle(xAxisFont, labelStyle)

        }
        newOptions.scales.x.title.font = xAxisFont
    }
    // yAxis Value
    {
        const {
            showGrid,
            showAxis,
            labelStyle,
            labelColor,
            labelSize,
            labelFont,
            min,
            max,
            label,
            ticksColor, 
        } = yAxis

        newOptions.scales.y.min = validateMinMaxValue(min) ? min : undefined;
        newOptions.scales.y.max = validateMinMaxValue(max) ? max : undefined;
        newOptions.scales.y.title.text = label ?? "";
        newOptions.scales.y.display = isNonAxis ? false : showAxis == '1';


        let yAxisFont = {}
        newOptions.scales.y.title.color = labelColor
        newOptions.scales.y.ticks.color = ticksColor
        if (labelFont) {
            yAxisFont.family = labelFont
        }
        if (labelSize) {
            yAxisFont.size = +labelSize
        }
        if (labelStyle) {
            yAxisFont = getFontStyle(yAxisFont, labelStyle)

        }
        newOptions.scales.y.title.font = yAxisFont
        newOptions.scales.y.grid = {
            display: showGrid == '1',
            drawOnChartArea: true,
            ticks: true
        }
        newOptions.scales.y.border = {
            display: true
        }
    }

    return newOptions
}


const updateDatasetsStyles = (oldOptions, datasets) => {
    const newOptions = { ...oldOptions }
    // styles
    console.log('[newOptions]', newOptions)
    // datasets

    // colbyDraggerPlugin.bgcolor = bgColor
    return newOptions
}
const getLineAnnotation = (line, state) => {
    if (!line.id) return null
    if (line.id == 'lineTemp' && !line.enabled) return null


    const { axis: lineAxis, position: linePosition, style: lineStyle, thickness: lineThickness, color: lineColor, label: lineLabel } = line

    const isSelected = state.annotationSelected == line.id
    const unit = calcYAxisUnit(state)

    const lineAnnotation = {
        type: "line",
        id: line.id,
        borderColor: isSelected ? SELECTED_COLOR : lineColor,
        borderWidth: isSelected ? +lineThickness + 2 : lineThickness,
        draggable: true,
    };

    if (lineStyle == "dashed") {
        lineAnnotation.borderDash = [5, 5];
    } else if (lineStyle == "wave") {
        lineAnnotation.borderDash = [10, 5, 5];
    } else {
        lineAnnotation.borderDash = [];
    }

    if (lineLabel) {
        lineAnnotation.label = {
            content: [lineLabel],
            display: true,
            textAlign: 'center',
            drawTime: 'afterDatasetsDraw',
        }
    }

    if (lineAxis == "x") {
        lineAnnotation.yScaleID = "y"
        lineAnnotation.yMin = linePosition / unit
        lineAnnotation.yMax = linePosition / unit
    } else if (lineAxis == "y") {
        lineAnnotation.xScaleID = "x"
        lineAnnotation.xMin = linePosition
        lineAnnotation.xMax = linePosition
    }
    return { [line.id]: lineAnnotation }
}

const getBoxAnnotation = (box, state) => {
    if (!box.id) return null
    if (box.id == 'boxTemp' && !box.enabled) return null
    const active = box.id && state.annotationSelected == box.id
    const unit = calcYAxisUnit(state)

    const { xMin, xMax, yMin, yMax, label } = box
    const boxAnnotation = {
        type: "box",
        id: box.id ?? 'boxTemp',
        xMin,
        xMax,
        yMin: yMin / unit,
        yMax: yMax / unit,
        backgroundColor: active ? SELECTED_COLOR : 'rgba(255, 99, 132, 0.25)'
    };



    if (label) {
        boxAnnotation.label = {
            content: [label],
            display: true,
            textAlign: 'center',
        };
    }
    return { [box.id]: boxAnnotation }
}

const getArrowAnnotation = (arrow, state) => {
    const arrowId = arrow.id
    if (!arrow.id) return null
    if (arrow.id == 'arrowTemp' && !arrow.enabled) return null
    const { annotationSelected } = state
    const { startDatasetKey, startDataIndex, endDataIndex, endDatasetKey, lineType, doubleArrow, label: arrowLabel, color: arrowColor } = arrow
    const startDatasetIndex = getDatasetIndex(state, startDatasetKey)
    const endDatasetIndex = getDatasetIndex(state, endDatasetKey)

    if (startDatasetIndex < 0 || endDatasetIndex < 0) return null
    if (startDataIndex === '' || endDataIndex === '') return null;

    let startXValue = getXValueForMultiDataset(startDatasetIndex, +startDataIndex, { datasets: state.data.datasets, isStacked: state.forms.global.stacked })
    let endXValue = getXValueForMultiDataset(endDatasetIndex, +endDataIndex, { datasets: state.data.datasets, isStacked: state.forms.global.stacked })
    let startYValue = state.data.datasets[startDatasetIndex].data[+startDataIndex]
    let endYValue = state.data.datasets[endDatasetIndex].data[+endDataIndex]
    const unit = 1

    if (lineType == ARROW_LINE_TYPE_CURVE || lineType == ARROW_LINE_TYPE_GENERAL) {
        const borderColor = annotationSelected == arrowId ? SELECTED_COLOR : arrowColor;
        const arrowAnnotation = {
            type: "line",
            id: arrowId,
            borderWidth: 2,
            borderColor,
            label: {
                display: false,
            },
            arrowHeads: {
                start: {
                    display: doubleArrow == "1",
                    borderColor,
                },
                end: {
                    display: true,
                    borderColor,
                },
            },
            xMin: startXValue,
            xMax: endXValue,
            yMin: startYValue / unit,
            yMax: endYValue / unit,
        };
        // curved line
        if (lineType == ARROW_LINE_TYPE_CURVE) {
            arrowAnnotation.curve = true
        }
        if (arrowLabel) {
            arrowAnnotation.label = {
                display: true,
                backgroundColor: "rgb(211,211,211)",
                borderRadius: 0,
                color: "rgb(0,0,0)",
                content: [arrowLabel],
            }

        }
        return { [arrow.id]: arrowAnnotation };
    } else if (lineType == ARROW_LINE_TYPE_GROW_METRIC) {
        const yValue = Math.max(startYValue, endYValue) * 1.1
        const percentDiff = calculatePercentageDifference(+startYValue, +endYValue);
        const arrowAnnotation = {
            type: "line",
            id: arrowId,
            borderColor: arrowColor,
            borderWidth: 2,
            borderDash: [6, 6], // Make the arrow dashed
            label: {
                display: true,
                content: `${percentDiff} %`,
                position: 'center'
            },

            xMin: startXValue,
            xMax: endXValue,
            yMin: yValue / unit,
            yMax: yValue / unit,
        };
        const arrowAnnotationLeft = {
            type: 'line',
            id: getLeftElementId(arrowId),
            xMin: startXValue,
            xMax: startXValue,
            yMin: startYValue / unit,
            yMax: yValue / unit,
            borderColor: 'black',
            borderWidth: 3,
            borderDash: [6, 6],
        }
        const arrowAnnotationRight = {
            id: getRightElementId(arrowId),
            type: 'line',
            xMin: endXValue,
            xMax: endXValue,
            yMin: endYValue / unit,
            yMax: yValue / unit,
            borderColor: 'black',
            borderWidth: 3,
            borderDash: [6, 6],
        }
        return {
            [arrowId]: arrowAnnotation,
            [getLeftElementId(arrowId)]: arrowAnnotationLeft,
            [getRightElementId(arrowId)]: arrowAnnotationRight
        }
    } else if (lineType == ARROW_LINE_TYPE_CAGR) {

        const periods = Math.abs(startDataIndex - endDataIndex);
        const cagr = calculateCAGR(+startYValue, +endYValue, periods);

        const arrowAnnotation = {
            type: "line",
            id: arrowId,
            borderColor: arrowColor,
            borderWidth: 1,
            // borderDash: [6, 6], // Make the arrow dashed
            label: {
                display: true,
                content: `CAGR: ${cagr}`,
                position: 'center'
            },
            curve: false,
            xMin: startXValue,
            xMax: endXValue,
            yMin: startYValue / unit,
            yMax: endYValue / unit,
            arrowHeads: {
                end: {
                    display: true
                }
            },
        };
        const arrowAnnotationLeft = {
            id: getLeftElementId(arrowId),
            type: 'point',
            xValue: startXValue,
            yValue: startYValue,
            radius: 5,
            backgroundColor: ARROW_CAGR_NORMAL_BACKGROUND_COLOR,
            borderColor: ARROW_CAGR_NORMAL_BORDER_COLOR,
            borderWidth: 2
        }
        const arrowAnnotationRight = {
            id: getRightElementId(arrowId),
            type: 'point',
            xValue: endXValue / unit,
            yValue: endYValue / unit,
            radius: 5,
            backgroundColor: ARROW_CAGR_NORMAL_BACKGROUND_COLOR,
            borderColor: ARROW_CAGR_NORMAL_BORDER_COLOR,
            borderWidth: 2
        }
        return {
            [arrowId]: arrowAnnotation,
            [getLeftElementId(arrowId)]: arrowAnnotationLeft,
            [getRightElementId(arrowId)]: arrowAnnotationRight
        }
    }
    return null;
}

//recognize whether content is an image file
const isImageUrl = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
};

const getImageAnnotation = (image, state) => {
    const data = getLabelAnnotation(image, state); 
    return data; 
}

const getLabelAnnotation = (label, state) => {
    if (!label.id) return null
    if (label.id == 'labelTemp' && (!label.enabled)) return null
    const { datasetKey, dataIndex, opacity, caption: labelText, fontName: labelFont, fontSize, color: 
        labelColor, imageUrl, imageWidth, imageHeight } = label 

    

    if (!datasetKey || !dataIndex) return null

    const datasetIndex = getDatasetIndex(state, datasetKey)

    if (datasetIndex < 0) return null;

    const chart = state.getChart();

    const labelSize = fontSize ? +fontSize : 10
    const { annotationSelected } = state

    let adjustValueX = 0;
    let adjustValueY = -60;
    let yValue = state.data.datasets[datasetIndex].data[+dataIndex]
    const suggestedMax = calMaxValueInDatasets(state.data.datasets)
    if (suggestedMax * 0.9 <= yValue) {
        adjustValueY = -5
    }

    let xValue = getXValueForMultiDataset(datasetIndex, +dataIndex, { datasets: state.data.datasets, isStacked: state.forms.global.stacked })

    const labelAnnotation = {
        type: "label",
        backgroundColor: annotationSelected == label.id ? SELECTED_COLOR : 'rgba(245,245,245)',
        borderRadius: 6,
        borderWidth: 1,
        content: labelText ? [labelText] : imageUrl,
        position: {
            x: 'end',
            y: 'end'
        },
        callout: {
            display: true,
            position: "center",
            margin: 0,
            borderColor: `rgba(245, 245, 245, ${opacity})`,
        },
        font: {
            family: labelFont ? labelFont : '',
            size: labelSize ? labelSize : '',
        },
        xValue,
        yValue,
        xAdjust: adjustValueX,
        yAdjust: adjustValueY,
    };

    const getImage = () => {
        const img = new Image();
        img.src = `${imageUrl}`;
        console.log("image src?", imageUrl)
        return img;
    }

    try {
        if (isImageUrl(imageUrl)) {
            labelAnnotation.content = getImage();
            labelAnnotation.drawTime = 'afterDatasetsDraw';
            labelAnnotation.backgroundColor = 'white',
            labelAnnotation.width = imageWidth ? `${imageWidth}%` : '20%', 
            labelAnnotation.height = imageHeight ? `${imageHeight}%` :'20%',
            console.log("Image processed");
        } 
        } catch (error) {
        console.error("Error processing image URL:", error);
    }

    console.log("label annotatino?", labelAnnotation)

    return { [label.id]: labelAnnotation };
}

const getAnnotation = (item, state) => {
    // Line Annotation
    if (item.type == 'line') {
        return getLineAnnotation(item, state)
    }

    if (item.type == 'box') {
        return getBoxAnnotation(item, state)
    }

    if (item.type == 'label') {
        return getLabelAnnotation(item, state)
    }

    if (item.type == 'arrow') {
        return getArrowAnnotation(item, state)
    }

    if (item.type == 'image') {
        return getLabelAnnotation(item, state)
    }

    return null;

}
const updateAnnotation = (oldOptions, param, datasets, state) => {
    const newOptions = { ...oldOptions }

    const { line, box, label, arrow, image } = param
    const annotation = {
        annotations: {},
    }

    const { annotation: stateAnnotation } = state

    for (let annoKey in stateAnnotation) {
        const anno = stateAnnotation[annoKey]
        const item = getAnnotation(anno, state)

        if (item) {
            annotation.annotations = {
                ...annotation.annotations,
                ...item
            }
        }
    }

    const lineTemp = getLineAnnotation(line, state)
    if (lineTemp) {
        annotation.annotations = {
            ...annotation.annotations,
            ...lineTemp
        }
    }
    const boxTemp = getBoxAnnotation(box, state)
    if (boxTemp) {
        annotation.annotations = {
            ...annotation.annotations,
            ...boxTemp
        }
    }

    const labelTemp = getLabelAnnotation(label, state)
    if (labelTemp) {
        annotation.annotations = {
            ...annotation.annotations,
            ...labelTemp
        }
    }

    const imageTemp = getImageAnnotation(image, state)
    if (imageTemp) {
        annotation.annotations = {
            ...annotation.annotations,
            ...imageTemp
        }
    }
    
    const arrowTemp = getArrowAnnotation(arrow, state)
    if (arrowTemp) {
        annotation.annotations = {
            ...annotation.annotations,
            ...arrowTemp
        }
    }

    newOptions.plugins.annotation = {
        ...newOptions.plugins.annotation, ...annotation
    }

    return newOptions
}
const updateChartOptions = (oldOptions, forms, state) => {
    console.log("update to state", state)
    // chart title
    const { annotationTemp, global, xAxis, yAxis, datasets } = forms
    const { chartType } = state

    // global options
    let newOptions = updateGlobalOption(oldOptions, global, state)
    // axis options
    newOptions = updateAxisRangeValue(newOptions, { xAxis, yAxis, chartType })

    // updateAnnotation
    newOptions = updateAnnotation(newOptions, annotationTemp, forms, state)

    // updateDatasetsStyles
    newOptions = updateDatasetsStyles(newOptions, datasets)

    // console.log('[newOptions]', newOptions)

    return newOptions
}
const onMoveAnnotation = (data, state) => {
    const { id } = data
    const { annotation, forms: { annotationTemp } } = state
    let selected = null;

    switch (id) {
        case 'lineTemp':
        case 'line': {
            selected = annotationTemp['line'];
            break;
        }
        case 'boxTemp':
        case 'box': {
            selected = annotationTemp['box'];
            break;
        }
        case 'labelTemp':
        case 'label': {
            selected = annotationTemp['label'];
            break;
        }
        case 'arrowTemp':
        case 'arrow': {
            selected = annotationTemp['arrow'];
            break;
        }
        default:
            selected = annotation[id];

    }
    if (!selected) return;

    const { type, ...rest } = selected
    switch (type) {
        case 'line': {
            const { axis } = rest
            const { dx, dy } = data
            console.log('[onMoveAnnotation]', data, selected)
            if (axis == "x") {
                selected.position = +selected.position + dy
            } else if (axis == "y") {
                selected.position = +selected.position + dx
            }
            return selected;
        }
        case 'box': {
            const { dx, dy } = data
            if (dx) {
                // const width = +selected.xMax - selected.xMin
                // selected.xMin = +selected.xMin + dx + dxRate * width
                // selected.xMax = +selected.xMax + dx + dxRate * width                
                selected.xMin = +selected.xMin + dx
                selected.xMax = +selected.xMax + dx
            }
            if (dy) {
                selected.yMin = +selected.yMin + dy
                selected.yMax = +selected.yMax + dy
            }
            return selected;
        }
        default: {
            return selected;
        }
    }

}


const fetchDataRange = (range) => {
    if (window?.ColbyChartInfo?.fetchDataRange) {
        window.ColbyChartInfo.fetchDataRange(range)
    }
}

const fetchBotResWithInput = (message) => {
    if (window?.ColbyChartInfo?.fetchBotResWithInput) {
        window.ColbyChartInfo.fetchBotResWithInput(message)
    } 
}

const fetchDefaults = () => {
    if (window?.ColbyChartInfo?.fetchDefaults) {
        window.ColbyChartInfo.fetchDefaults()
    }
}

const addNewAnnotationByContextMenu = (data, state) => {
    const { type, subtype, x, y, nearestData } = data
    const annoInit = initState.forms.annotationTemp[type]
    const anno = copySimpleObject(annoInit);
    const id = generateAnnotationId(type)
    const { dataIndex, datasetKey } = nearestData
    anno.enabled = true;

    anno.id = id

    switch (type) {
        case 'line': {
            if (subtype == 'vertical') {
                anno.position = x
                anno.axis = 'y'
            } else if (subtype == 'horizontal') {
                anno.position = y
                anno.axis = 'x'
            }
            break;
        }
        case 'box': {
            anno.label = "undefined"
            anno.xMax = x
            anno.xMin = +x + 1
            anno.yMax = y
            anno.yMin = (+y) * 1.1
            break;
        }
        case 'label': {
            anno.dataIndex = dataIndex
            anno.datasetKey = datasetKey
            anno.caption = "undefined"

            break;
        }
        case 'arrow': {
            anno.label = "undefined"
            anno.startDatasetKey = datasetKey
            anno.startDataIndex = dataIndex
            anno.endDatasetKey = datasetKey
            anno.endDataIndex = +dataIndex + 1
            anno.lineType = subtype
            break;
        }
    }
    console.log('[handlDoubleClick]', x, y)
    if (anno.enabled) {
        const newState = { ...state, annotation: { ...state.annotation, [id]: anno }, annotationSelected: id }
        return newState
    }
    return state;

}
// Reducer function
const reducer = (state, action) => {
    const { type, ...payload } = action
    switch (type) {
        case UDPATE_FORM: {
            const { data: forms } = payload
            const options = updateChartOptions(state.options, forms, state)
            const newState = { ...state, options, forms: { ...state.forms, ...forms } };
            updateChartDatasets(newState);
            return newState
        }
        case RELOAD_FORM: {
            const { data } = payload
            const newState = { ...state, ...data }
            return newState
        }
        case FETCH_DATA_RANGE: {
            const { data: newDataRange } = payload
            const newState = {
                ...state, forms: {
                    ...state.forms,
                    dataRange: newDataRange
                }
            };
            fetchDataRange(newDataRange);
            return newState

        }
        case FETCH_BOT_RES: {
            const { data: { message } } = payload;
            const newState = {
                ...state, forms: {
                    ...state.forms,
                    botMessage: message
                }
            };
            fetchBotResWithInput(message)
            return newState
        }
        case ADD_ANNOTATION_ITEM: {
            const { type: annotationType, id } = payload.data
            console.log('[ADD_ANNOTATION_ITEM]', payload.data)

            let newState = {
                ...state,
            }
            const annoTemp = newState.forms.annotationTemp[annotationType]
            const annoInit = initState.forms.annotationTemp[annotationType]

            if (annoTemp.enabled) {
                const initValue = copySimpleObject(annoInit)

                const newAnnotation = copySimpleObject({
                    ...annoTemp,
                    id,
                    type: annotationType
                })

                // Get the current timestamp in milliseconds          
                newState.forms = {
                    ...newState.forms,
                    annotationTemp: {
                        ...newState.forms.annotationTemp,
                        [annotationType]: initValue
                    }
                }
                newState.annotation = {
                    ...newState.annotation,
                    [id]: newAnnotation
                }
            }

            return newState
        }
        case ACTIVE_ANNOTATION_ITEM: {
            const { id: annotationId } = payload
            const { annotationSelected } = state
            let newState = { ...state, annotationSelected: (annotationSelected == annotationId || annotationId == '') ? '' : annotationId };
            const options = updateChartOptions(state.options, newState.forms, newState)
            newState = { ...newState, options };
            updateChartDatasets(newState);
            return newState;
        }
        case UPDATE_ANNOTATION_POSITION: {
            const { id: annotationId } = payload

            let newState = { ...state };
            if (annotationId) {
                const annotation = onMoveAnnotation(payload, state)
                newState.annotation = {
                    ...newState.annotation,
                    [annotationId]: { ...annotation }
                }
            }
            return newState;
        }
        case UPDATE_ANNOTATION_ARROW_DATA: {
            const { id: annotationId, side, data } = payload
            let newState = { ...state };
            const { dataIndex, datasetIndex } = data
            const datasets = state.forms.axes.datasets
            const xAxis = state.forms.global.xAxis
            const keys = getDatasetIndexWithoutXAxis(Object.keys(datasets), xAxis)
            const key = keys[datasetIndex]
            if (annotationId.includes('Temp')) {
                if (side == 'left') {
                    newState.forms.annotationTemp[annotationId] = {
                        ...newState.forms.annotationTemp[annotationId],
                        startDataIndex: dataIndex,
                        startDatasetKey: key
                    }
                } else if (side == 'right') {
                    newState.forms.annotationTemp[annotationId] = {
                        ...newState.forms.annotationTemp[annotationId],
                        endDataIndex: dataIndex,
                        endDatasetKey: key
                    }
                }
            } else {
                if (side == 'left') {
                    newState.annotation[annotationId] = {
                        ...newState.annotation[annotationId],
                        startDataIndex: dataIndex,
                        startDatasetKey: key
                    }
                } else if (side == 'right') {
                    newState.annotation[annotationId] = {
                        ...newState.annotation[annotationId],
                        endDataIndex: dataIndex,
                        endDatasetKey: key
                    }
                }

            }
            const options = updateChartOptions(newState.options, newState.forms, newState)
            newState = { ...newState, options };
            updateChartDatasets(newState);
            return newState
        }
        case UPDATE_ANNOTATION_ITEM: {
            const { data } = payload
            const { id: annotationId } = data

            let newState = {
                ...state,
            }
            newState.annotation[annotationId] = copySimpleObject(data)
            const options = updateChartOptions(newState.options, newState.forms, newState)
            newState = { ...newState, options };
            updateChartDatasets(newState);

            return newState
        }
        case DELETE_ANNOTATION_ITEM: {
            const { id: annotationId } = payload
            const { [annotationId]: deletedAnnotaiton, ...restAnnotaiton } = state.annotation
            let newState = {
                ...state,
                annotation: restAnnotaiton,
                annotationSelected: ''
            }
            const options = updateChartOptions(newState.options, newState.forms, newState)
            newState = { ...newState, options };
            updateChartDatasets(newState);

            return newState
        }
        case CREATE_ANNOTATION_ITEM_BY_CONTEXTMENU: {
            const { data } = payload
            let newState = addNewAnnotationByContextMenu(data, state)
            const options = updateChartOptions(newState.options, newState.forms, newState)
            newState = { ...newState, options };
            updateChartDatasets(newState);
            return newState;
        }
        default:
            return state;
    }
};
export const ChartContext = createContext();

const getChartDataObj = (labels, cols) => {
    const result = {}
    for (let i = 0; i < labels.length; i++) {
        const { key, label } = labels[i]
        result[key] = {
            values: cols[i],
            label,
            key
        }
    }
    return result
}
const initializeState = ({ state, info }) => {
    console.log("initializing?", info)
    const { chartType, rawDatasets, defaultValues, rotateSheetData, botResponse, lastMessage } = info

    let chartData = rawDatasets
    let defaultChartType = null; 
    console.log("bot response 1?", botResponse); 

    if (defaultValues && botResponse) {
        console.log("bot response 2?", botResponse); 
        if (lastMessage) {
            state.forms.lastMessage = lastMessage; 
        }
        const defaultYAxis = botResponse?.defaultYAxis ?? defaultValues.defaultYAxis; 
        const defaultXAxis = botResponse?.defaultXAxis ?? defaultValues.defaultXAxis; 
        const title = botResponse?.title ?? defaultValues.title; 
        const legend = botResponse?.legend ?? defaultValues.legend; 
        const data = botResponse?.data ?? defaultValues.data; 
        const rowSwitch = botResponse?.rowSwitch ?? defaultValues.rowSwitch; 
        const stacked = botResponse?.stacked ?? defaultValues.stacked; 
        const backgroundColor = botResponse?.backgroundColor ?? defaultValues.backgroundColor; 
        const datalabels = botResponse?.datalabels ?? defaultValues.datalabels; 
        const labelsColor = botResponse?.labelsColor ?? defaultValues.labelsColor; 
        defaultChartType = botResponse?.chartType ?? defaultValues.chartType; 

        if (rotateSheetData) {
            const sheetData = rotateSheetData(data);
            chartData = sheetData;  
        }

        function applyAxisSettings(state, axisConfig, axisName) {
            const formsAxisName = axisName === 'x' ? 'xAxis' : 'yAxis'

            state.options.scales[axisName].title = axisConfig.title;
            state.options.scales[axisName].ticks = axisConfig.ticks;
            state.options.scales[axisName].stacked = axisConfig.stacked;
            state.options.scales[axisName].grid = { display : axisConfig.displayGridLine};
            state.options.scales[axisName].display = axisConfig.displayAxisLine;

            if (axisConfig.title) {
                state.forms[formsAxisName].label = axisConfig.title.text;
                state.forms[formsAxisName].labelColor = axisConfig.title.color;
                state.forms[formsAxisName].labelSize = axisConfig.title.fontSize;
            }
            if (axisConfig.ticks) {
                state.forms[formsAxisName].ticksColor = axisConfig.ticks.color;
            }
        }

        state.options.plugins.title = title; 
        state.options.plugins.title.font.family = title.font.family; 
        state.options.plugins.legend = legend; 

        state.options.plugins.datalabels.display = datalabels; 
        state.options.plugins.datalabels.color = labelsColor; 
        state.forms.global.showLabels = datalabels; 
        state.forms.global.labelsColor = labelsColor; 


        state.options.rowSwitch = rowSwitch;
        if (rowSwitch) {
            state.forms.global.switchRowColumn = true; 
        }

        applyAxisSettings(state, defaultXAxis, 'x');
        applyAxisSettings(state, defaultYAxis, 'y');
        // state.options.scales.y.max = defaultYAxis.max;
        // state.options.scales.y.max = defaultYAxis.min;

        state.forms.global.title = title.text; 
        state.forms.global.titleColor = title.color; 
        state.forms.global.titleStyle = title.style; 
        state.options.plugins.colbyDraggerPlugin = {
            bgcolor: backgroundColor
        }

        switch (stacked) {
            case '100-stacked':
                state.options.scales.y.stacked = true
                state.options.scales.x.stacked = true
                state.options.plugins.stacked100 = { enable: true}; 
                state.forms.global.stacked = '100-stacked'
                break;
            case 'stacked':
                state.options.scales.y.stacked = true
                state.options.scales.x.stacked = true
                state.options.plugins.stacked100 = { enable: false}; 
                state.forms.global.stacked = 'stacked'
                break;
            case 'none':
            default:
                state.options.scales.y.stacked = false
                state.options.scales.x.stacked = false
                state.forms.global.stacked = 'none'
                break;
        }
        
    }

    const keyLabels = chartData.header.map(h => ({ key: md5.base64(h), label: h }))
    const datasets = getChartDataObj(keyLabels, chartData.cols)
    const yAxis = keyLabels.reduce((prev, current) => ({ ...prev, [current.key]: true }), {});
    const formDatasets = state.forms.datasets
    let globalDatasets = keyLabels.reduce((obj, keyLabel, index) => {
        obj[keyLabel.key] = formDatasets[keyLabel.key] || {
            barPadding: 0.1,
            color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
            gradient: "no",
            opacity: 0.5
        };
        return obj;
    }, {});

    if (defaultValues && botResponse) {

        const arrowAnnotation = botResponse?.arrowAnnotation ?? defaultValues.arrowAnnotation;
        const emphasisAnnotation = botResponse?.emphasisAnnotation ?? defaultValues.emphasisAnnotation;
        const plottedDatasets = botResponse?.plottedDatasets ?? defaultValues.plottedDatasets;
        const chartTypes = botResponse?.chartTypes ?? defaultValues.chartTypes;

        state.forms.annotationTemp.arrow = arrowAnnotation; 
        state.forms.annotationTemp.arrow.startDatasetKey = globalDatasets[0]
        state.forms.annotationTemp.arrow.endDatasetKey = globalDatasets[1]

        state.forms.annotationTemp.emphasis = emphasisAnnotation; 
        state.forms.annotationTemp.emphasis.datasetKey = globalDatasets[2]

        if (plottedDatasets && plottedDatasets.length > 0) {
            Object.keys(yAxis).forEach((key, index) => {
                if (!plottedDatasets.includes(index)) {
                    yAxis[key] = false;
                }
            });
        }

        if (chartTypes) {
            Object.keys(globalDatasets).forEach((key, index) => {
                let chartType = chartTypes[index]
                globalDatasets[key] = {...globalDatasets[key], chartType}
            })

        }
    }


    const dataToReturn = {
        ...state,
        forms: {
            ...state.forms,
            global: {
                ...state.forms.global,
                xAxis: keyLabels[0].key,
                yAxis
            },
            axes: {
                keyLabels,
                datasets
            },
            datasets: globalDatasets
        },
        chartType: defaultValues ? defaultChartType : chartType 
    }

    return dataToReturn
}

const getXAxisDatafield = (data) => {
    const { forms: { global: { xAxis } } } = data
    return xAxis
}
const getYAxisDatafield = (data) => {
    const { forms: { global: { yAxis } } } = data
    return yAxis
}

const getFilteredDatasets = (data) => {
    const { forms } = data

    const axesDatasets = forms?.axes?.datasets || {};
    let xAxis = getXAxisDatafield(data)
    let yAxis = getYAxisDatafield(data)


    if (!xAxis) {
        console.log("No xAxis found");
        return {
        labels: [],
        datasets: [],
        xAxisLabel: 'test'
    }};

    if (data.options.rowSwitch ) {

        let newXAxis = Object.keys(yAxis).find(key => yAxis[key] === true);
        let newYAxis = {}
        newYAxis[xAxis] = true;

        xAxis = newXAxis; 
        yAxis = newYAxis; 
    }

    const labels = axesDatasets[xAxis]
    const filteredKeys = Object.keys(axesDatasets).filter(k => (k != xAxis && yAxis[k]))
    const datasets = filteredKeys.length > 0 ? filteredKeys.map(key => axesDatasets[key]) : []
    return {
        labels,
        datasets,
        xAxisLabel: axesDatasets[xAxis].label,
        forms
    }
}
const calcYAxisUnit = (state) => {
    const stacked = state?.forms?.global?.stacked || 'none'
    // title      
    let resultMaxValue = 1
    if (stacked == '100-stacked') {
        // const filteredDatasets = getFilteredDatasets(state);
        // if (!filteredDatasets?.datasets) return resultMaxValue;
        // resultMaxValue = Math.max(...filteredDatasets.datasets.map(d => Math.max(...d.values))) / 100
    }
    return resultMaxValue
}
const calcYAxisTickCallback = (value, state) => {
    // if (typeof value === 'number' && value == Math.floor(value)) return Math.floor(value)
    if (state.forms.global.stacked == '100-stacked') {
        return value + '%';
    } else {
        return value
    }
}
const updateChartDatasets = (state) => {
    const filteredDatasets = getFilteredDatasets(state); 

    if (!filteredDatasets) return;
    const { xAxisLabel, ...data } = filteredDatasets
    const createDatasets = window?.ColbyChartInfo?.createDatasets
    if (!createDatasets || !xAxisLabel) return;
    const result = createDatasets(data);
    const datasets = state.forms.datasets
    if (result) {
        const { chartType: parentChartType } = state

        // bubble chart
        if (parentChartType == 'bubble') {
            // console.log('[resultMaxValue]', resultMaxValue)
            result.datasets = result.datasets.map(d => {
                const { key, data, backgroundColor } = d
                const { barPadding, color, gradient, opacity, fill, chartType, lineStyle, thickness, pointRadius, markerType } = datasets[key]
                console.log('[datasets[key]]', datasets[key])
                const borderColor = colorToRGBA(color, +opacity)
                const dataset = {
                    ...d,
                    borderColor,
                    
                }
               
                return dataset;
            })
            state.data = result
            if (!state.options.scales.x.title.text) {
                state.options.scales.x.title.text = xAxisLabel
            }
        } else if (parentChartType == 'doughnut' || parentChartType == 'pie') {
            // console.log('[resultMaxValue]', resultMaxValue)
            result.datasets = result.datasets.map(d => {
                const dataset = {
                    ...d,
                    hoverOffset: 4
                }
                return dataset;
            })
            state.data = result
            // if (!state.options.scales.x.title.text) {
            //     state.options.scales.x.title.text = xAxisLabel
            // }
        } else {
            const resultMaxValue = calcYAxisUnit(state)
            console.log('[resultMaxValue]', resultMaxValue)
            result.datasets = result.datasets.map(d => {
                const { key, data, backgroundColor } = d
                const { barPadding, color, gradient, opacity, fill, chartType, lineStyle, thickness, pointRadius, markerType } = datasets[key]
                console.log('[datasets[key]]', key, datasets[key])
                const borderColor = colorToRGBA(color, +opacity)
                const barPercentage = (!!barPadding) ? 1 - barPadding : 0.9
                const chartData = data.map(d => Array.isArray(d) ? d.map(v => +v / resultMaxValue) : +d / resultMaxValue); 

                const dataset = {
                    ...d,
                    data: chartData,
                    borderColor: state.forms.annotationTemp.emphasis.darken ? state.forms.annotationTemp.emphasis.darken : borderColor,
                    backgroundColor: ({ chart }) => {
                        if (state.forms.annotationTemp.emphasis.datasetKey === d.key) {
                            return chartData.map((dataPoint, index) =>
                            index === parseInt(state.forms.annotationTemp.emphasis.dataIndex)
                                ? (state.forms.annotationTemp.emphasis.highlight ? state.forms.annotationTemp.emphasis.highlight : '#BCE9FE')
                                : (state.forms.annotationTemp.emphasis.highlight ? state.forms.annotationTemp.emphasis.darken : '#D3D3D3')
                        );
                        } else {
                            return (gradient == 'yes') ? getGradientColor({ chart, color, opacity }) : getBackgroundColor({ chart, color: borderColor, opacity: 0.3 })
                        }
                    },
                    barPercentage,
                    fill: fill == 'true',
                    borderWidth: thickness ? +thickness : 1,
                    type: chartType == 'default' ? parentChartType : chartType,
                    pointRadius: pointRadius && +pointRadius > 2 ? pointRadius : 2,
                    pointStyle: markerType ?? 'circle'
                }

                if (lineStyle == "dashed") {
                    dataset.borderDash = [10, 5, 5];
                } else if (lineStyle == "dotted") {
                    dataset.borderDash = [5, 5];
                } else {
                    dataset.borderDash = [];
                }
                return dataset;
            })
            state.data = result
            if (!state.options.scales.x.title.text) {
                state.options.scales.x.title.text = xAxisLabel
            }
        }

    }
}
const onAdditionalUpdates = (state, { chartType, chartRef }) => {
    state.chartType = chartType


    state.onChartRefresh = () => {
        if (!chartRef || !chartRef.current) return;
    }
    state.getChart = () => {
        return chartRef.current
    }


    state.options.plugins.annotation = {
        ...state.options.plugins.annotation,
    }
    state.options.scales.x.ticks = {
        ...state.options.scales.x.ticks,
    }
    state.options.scales.y.ticks = {
        ...state.options.scales.y.ticks,
        callback: (value) => calcYAxisTickCallback(value, state)
    }

    const isNonAxis = isNonAxisChart(chartType)
    
    if (isNonAxis) {
        state.options.scales.x.display = false
        state.options.scales.y.display = false
    }

    const xAxis = getXAxisDatafield(state)
    if (xAxis) {
        updateChartDatasets(state)
    }
}

export const ChartProvider = ({ children }) => {
    const ColbyChartInfo = window.ColbyChartInfo

    if (!ColbyChartInfo) return <></>

    const { storageKey, fetchDataRange, loadingStatus, fetchDefaults,  fetchBotRes, defaultsLoadingStatus, 
    botLoadingStatus, rangeLoadingStatus, fetchBotResWithInput, chatBotLoadingStatus, fetchLastMessageOfScript,
    lastMessageLoading, lastMessage } = ColbyChartInfo

    if (!storageKey || !fetchDataRange || !loadingStatus) {
        throw Error(`ColbyChartInfo is insufficient: loadingStatus, storageKey or fetchDataRange--4`)
    }

    const storageValue = JSON.parse(localStorage.getItem(storageKey))

    if (!ColbyChartInfo) {
        throw Error('ColbyChartInfo is missing context')
    }

    console.log(`[loadingStatus]`, rangeLoadingStatus, defaultsLoadingStatus, botLoadingStatus, chatBotLoadingStatus) 


    if (rangeLoadingStatus == 'none' || rangeLoadingStatus == 'loading' ) {
        if (rangeLoadingStatus == 'none') fetchDataRange(storageValue?.forms?.dataRange ?? '')
        return <></>
    }

    if (defaultsLoadingStatus == 'none' || defaultsLoadingStatus == 'loading') {
        if (defaultsLoadingStatus == 'none') fetchDefaults()
        return <></>
    }

    if (lastMessageLoading == 'none' || lastMessageLoading == 'loading') {
        if (lastMessageLoading == 'none') fetchLastMessageOfScript()
        return <></>
    }

    if (lastMessage && lastMessage !== 'N/A' && (storageValue && storageValue?.forms?.lastMessage !== lastMessage)) {
        if (botLoadingStatus == 'none' || botLoadingStatus == 'loading') {
            if (botLoadingStatus == 'none') fetchBotRes()
            return <></>
        }
    }
    
    console.log(`[loadingStatus] after last message`, defaultsLoadingStatus, botLoadingStatus, chatBotLoadingStatus, lastMessageLoading)

    if (storageValue && storageValue?.forms?.botMessage && (chatBotLoadingStatus == 'none' || chatBotLoadingStatus == 'loading')) {
        if (chatBotLoadingStatus == 'none') fetchBotResWithInput(storageValue?.forms?.botMessage ?? '')
        return <></> 
    }

    console.log(`[loadingStatus]`, defaultsLoadingStatus, botLoadingStatus, chatBotLoadingStatus, lastMessageLoading)
    console.log("all lodaded", ColbyChartInfo)

    const { chartType, createDatasets, rawDatasets} = ColbyChartInfo

    if (!chartType || !createDatasets || !storageKey || !rawDatasets ) {
        throw Error('ColbyChartInfo is insufficient')
    }


    const chartRef = useRef(null);
    const storedState = initializeState({ state: storageValue || initState, info: ColbyChartInfo });

    onAdditionalUpdates(storedState, { chartRef, chartType })

    const [state, dispatch] = useReducer(reducer, storedState);

    const onDownloadChart = () => {
        const canvas = chartRef.current.canvas;

        if (canvas) {
            console.log('chartRef.current', canvas)
            const newCanvas = canvas

            // Convert canvas to data URL
            const dataURL = newCanvas.toDataURL('image/png');
            // Create a link element
            const downloadLink = document.createElement('a');
            downloadLink.href = dataURL;
            downloadLink.download = 'canvas_image.png';

            // Trigger a click event on the link to initiate download
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }
    const onInsertImage = async () => {
        try {
            const newCanvas = chartRef.current.canvas;
            const dataURL = newCanvas.toDataURL('image/jpeg');
            if (window.onInsertImage) {
                const result = await window.onInsertImage(dataURL)
                console.log('[onInsertImage] - success newCanvas', result)
            }
        } catch (error) {
            console.log('[onInsertImage] - failed')
        }

    }
    const onClearCache = () => {
        localStorage.removeItem(storageKey)
        // console.log('[initialState.forms]', initialState.forms)
        // const state = getInitialState({ state: initialState, info: ColbyChartInfo })
        // onAdditionalUpdates(state)        
        // dispatch({ type: RELOAD_FORM, data: state })
    }
    const onAddAnnotation = (data) => {
        // type is line, box, arrow, label
        dispatch({
            type: ADD_ANNOTATION_ITEM,
            data
        })
    }


    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }, [state, storageKey]);

    return (
        <ChartContext.Provider value={{ state, dispatch, chartRef, onDownloadChart, onInsertImage, onClearCache, onAddAnnotation }}>
            {children}
        </ChartContext.Provider>
    );
};

