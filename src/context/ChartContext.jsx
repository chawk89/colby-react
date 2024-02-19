// ChartContext.js
import React, { createContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { md5 } from 'js-md5';
import { SELECTED_COLOR, ARROW_CAGR_NORMAL_BORDER_COLOR, calculateCAGR, calculatePercentageDifference, copySimpleObject, getArrowElementId, getDatasetIndex, getDatasetIndexFromKey, getDatasetIndexWithoutXAxis, getLeftElementId, getRightElementId, getXValueForMultiDataset, yOffset, yValue, ARROW_CAGR_NORMAL_BACKGROUND_COLOR, calMaxValueInDatasets, generateAnnotationId } from '../utils/utils';
import { ARROW_LINE_TYPE_CAGR, ARROW_LINE_TYPE_CURVE, ARROW_LINE_TYPE_GENERAL, ARROW_LINE_TYPE_GROW_METRIC } from '../components/common/types';
// Initial state
const initialState = {
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
                fontName: "",
                fontSize: "",
                anchor: "",
                color: "#000000",
                type: 'label',
                id: 'labelTemp'
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
            }
        },
        general: {
            title: "",
            xAxis: "",
            plotted: false,
            stacked: false,
            switchRowColumn: false,
            showLabels: false,
            showLegend: false
        },
        xAxis: {
            xMin: "",
            xMax: ""
        },
        yAxis: {
            yMin: "",
            yMax: ""
        },
        styles: {
            fontName: "Lora",
            fontSize: "18",
            fontColor: "#3e1818"
        },
        axes: {
            keyLabels: [],
        },
        dataRange: ''
    },
    annotation: {
        "line-1707320896272": {
            enabled: true,
            axis: "x",
            position: "500",
            style: "dashed",
            thickness: "1",
            color: "#8F0000",
            label: "Test",
            type: "line",
            id: "line-1707320896272",

        },
        "box-1707320977735": {
            enabled: true,
            label: "",
            xMax: "Q2 FY2013",
            xMin: "Q1 FY2013",
            yMax: "1500",
            yMin: "500",
            type: "box",
            id: "box-1707320977735"
        },
        "arrow-1707348807973+general": {
            "enabled": true,
            "doubleArrow": "1",
            "label": "asdfasdfasdf",
            "color": "#000000",
            "type": "arrow",
            "id": "arrow-1707348807973+general",
            "startDatasetKey": "YpmL7a6OYEv2tnX4VxEFXA==",
            "startDataIndex": "1",
            "endDatasetKey": "FL1pyNrYWyqAVBdtx7c/Jw==",
            "endDataIndex": "2",
            lineType: ARROW_LINE_TYPE_GENERAL
        },
        'arrow-1707838906237+grow': {
            "enabled": true,
            "type": "arrow",
            "doubleArrow": "1",
            "label": "asdfasdfasdf",
            "color": "#000000",
            "startDatasetKey": "YpmL7a6OYEv2tnX4VxEFXA==",
            "startDataIndex": "5",
            "endDatasetKey": "YpmL7a6OYEv2tnX4VxEFXA==",
            "endDataIndex": 9,
            "lineType": ARROW_LINE_TYPE_GROW_METRIC,
            "id": "arrow-1707838906237+grow"
        },
        "label-1707349710912": {
            enabled: true,
            datasetKey: "YpmL7a6OYEv2tnX4VxEFXA==",
            dataIndex: "8",
            caption: "Test",
            fontName: "",
            fontSize: "",
            anchor: "1",
            color: "#000000",
            type: "label",
            id: "label-1707349710912"
        }
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



const generalOptionUpdate = (oldOptions, general) => {
    const newOptions = { ...oldOptions }
    const {
        title,
        stacked,
        switchRowColumn,
        showLabels,
        showLegend
    } = general
    // title
    newOptions.plugins.title.text = title
    // stacked
    newOptions.scales.y.stacked = stacked
    newOptions.scales.x.stacked = stacked
    // legend
    newOptions.plugins.legend.display = showLegend
    // show datalabels
    newOptions.plugins.datalabels.display = showLabels
    // switch RowColumn
    // newOptions.indexAxis = switchRowColumn ? 'y' : 'x'

    return newOptions
}

const validateMinMaxValue = (v) => {
    if (v == "" || v == undefined || v == null) return false
    if (typeof v == "number") return true;
    if (typeof v == "string" && +v == v) return true;
    return false
}

const updateAxisRangeValue = (oldOptions, { xAxis, yAxis }) => {
    const newOptions = { ...oldOptions }


    newOptions.scales.x.min = validateMinMaxValue(xAxis.min) ? xAxis.min : undefined;
    newOptions.scales.x.max = validateMinMaxValue(xAxis.max) ? xAxis.max : undefined;
    newOptions.scales.x.title.text = xAxis.label ?? "";


    newOptions.scales.y.min = validateMinMaxValue(yAxis.min) ? yAxis.min : undefined
    newOptions.scales.y.max = validateMinMaxValue(yAxis.max) ? yAxis.max : undefined;
    newOptions.scales.y.title.text = yAxis.label ?? "";


    return newOptions
}


const updateGlobalStyles = (oldOptions, styles) => {
    const newOptions = { ...oldOptions }
    // styles
    // newOptions.plugins.title.text = title

    const { fontName, fontSize, fontColor } = styles
    const font = {}
    newOptions.plugins.title.color = fontColor
    if (fontName) {
        font.family = fontName
    }
    if (fontSize) {
        font.size = +fontSize
    }
    newOptions.plugins.title.font = font
    return newOptions
}
const getLineAnnotation = (line, state) => {
    if (!line.id) return null
    if (line.id == 'lineTemp' && !line.enabled) return null

    const { axis: lineAxis, position: linePosition, style: lineStyle, thickness: lineThickness, color: lineColor, label: lineLabel } = line

    const isSelected = state.annotationSelected == line.id

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
        lineAnnotation.yMin = linePosition
        lineAnnotation.yMax = linePosition
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

    const { xMin, xMax, yMin, yMax, label } = box
    const boxAnnotation = {
        type: "box",
        id: box.id ?? 'boxTemp',
        xMin,
        xMax,
        yMin,
        yMax,
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

    let startXValue = getXValueForMultiDataset(startDatasetIndex, +startDataIndex, { datasets: state.data.datasets, isStacked: state.forms.general.stacked })
    let endXValue = getXValueForMultiDataset(endDatasetIndex, +endDataIndex, { datasets: state.data.datasets, isStacked: state.forms.general.stacked })
    let startYValue = state.data.datasets[startDatasetIndex].data[+startDataIndex]
    let endYValue = state.data.datasets[endDatasetIndex].data[+endDataIndex]

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
            yMin: startYValue,
            yMax: endYValue,
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
            yMin: yValue,
            yMax: yValue,
        };
        const arrowAnnotationLeft = {
            type: 'line',
            id: getLeftElementId(arrowId),
            xMin: startXValue,
            xMax: startXValue,
            yMin: startYValue,
            yMax: yValue,
            borderColor: 'black',
            borderWidth: 3,
            borderDash: [6, 6],
        }
        const arrowAnnotationRight = {
            id: getRightElementId(arrowId),
            type: 'line',
            xMin: endXValue,
            xMax: endXValue,
            yMin: endYValue,
            yMax: yValue,
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
            yMin: startYValue,
            yMax: endYValue,
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
            xValue: endXValue,
            yValue: endYValue,
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



const getLabelAnnotation = (label, state) => {
    if (!label.id) return null
    if (label.id == 'labelTemp' && !label.enabled) return null

    const { datasetKey, dataIndex, caption: labelText, fontName: labelFont, fontSize, color: labelColor } = label

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



    let xValue = getXValueForMultiDataset(datasetIndex, +dataIndex, { datasets: state.data.datasets, isStacked: state.forms.general.stacked })


    const labelAnnotation = {
        type: "label",
        backgroundColor: annotationSelected == label.id ? SELECTED_COLOR : 'rgba(245,245,245)',
        borderRadius: 6,
        borderWidth: 1,
        content: [labelText],
        position: {
            x: 'end',
            y: 'end'
        },
        callout: {
            display: true,
            position: "center",
            margin: 0,
        },
        font: {
            family: labelFont,
            size: labelSize,
        },
        xValue,
        yValue,
        xAdjust: adjustValueX,
        yAdjust: adjustValueY,
    };

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

    return null;

}
const updateAnnotation = (oldOptions, param, global, state) => {
    const newOptions = { ...oldOptions }

    const { line, box, label, arrow } = param
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
    // chart title
    const { annotationTemp, general, xAxis, yAxis, styles } = forms

    // general options
    let newOptions = generalOptionUpdate(oldOptions, general)
    // axis options
    newOptions = updateAxisRangeValue(newOptions, { xAxis, yAxis })

    // updateAnnotation
    newOptions = updateAnnotation(newOptions, annotationTemp, forms, state)

    // updateGlobalStyles
    newOptions = updateGlobalStyles(newOptions, styles)

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

const addNewAnnotationByContextMenu = (data, state) => {
    const { type, subtype, x, y, nearestData } = data
    const annoInit = initialState.forms.annotationTemp[type]
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
        case ADD_ANNOTATION_ITEM: {
            const { type: annotationType, id } = payload.data
            console.log('[ADD_ANNOTATION_ITEM]', payload.data)

            let newState = {
                ...state,
            }
            const annoTemp = newState.forms.annotationTemp[annotationType]
            const annoInit = initialState.forms.annotationTemp[annotationType]

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
            const xAxis = state.forms.general.xAxis
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
const onInitializeState = ({ state, info }) => {

    const { chartType, rawDatasets } = info
    const chartData = rawDatasets

    const keyLabels = chartData.header.map(h => ({ key: md5.base64(h), label: h }))
    const datasets = getChartDataObj(keyLabels, chartData.cols)
    const yAxis = keyLabels.reduce((p, c) => ({ ...p, [c.key]: true }), {})

    return {
        ...state,
        forms: {
            ...state.forms,
            general: {
                ...state.forms.general,
                xAxis: keyLabels[0].key,
                yAxis
            },
            axes: {
                keyLabels,
                datasets
            }
        },
        chartType
    }
}
const getXAxisDatafield = (data) => {
    const { forms: { general: { xAxis } } } = data
    return xAxis
}
const getYAxisDatafield = (data) => {
    const { forms: { general: { yAxis } } } = data
    return yAxis
}

const getFilteredDatasets = (data) => {
    console.log('[getFilteredDatasets]', data)
    const { forms } = data
    const { axes: { datasets: axesDatasets } } = forms
    const xAxis = getXAxisDatafield(data)
    const yAxis = getYAxisDatafield(data)


    if (!xAxis) return {
        labels: [],
        datasets: [],
        xAxisLabel: 'test'
    };

    const labels = axesDatasets[xAxis]
    const filteredKeys = Object.keys(axesDatasets).filter(k => (k != xAxis && yAxis[k]))
    const datasets = filteredKeys.length > 0 ? filteredKeys.map(key => axesDatasets[key]) : []
    return {
        labels,
        datasets,
        xAxisLabel: axesDatasets[xAxis].label
    }
}
const updateChartDatasets = (state) => {
    const filteredDatasets = getFilteredDatasets(state);

    if (!filteredDatasets) return;

    const { xAxisLabel, ...data } = filteredDatasets
    const createDatasets = window?.ColbyChartInfo?.createDatasets
    if (!createDatasets || !xAxisLabel) return;
    const result = createDatasets(data);
    if (result) {
        state.data = result
        if (!state.options.scales.x.title.text) {
            state.options.scales.x.title.text = xAxisLabel
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
        callback: function (value) {
            // console.log(value)
            // if (typeof value === 'number' && value == Math.floor(value)) return Math.floor(value)
            return value
        }
    }

    const xAxis = getXAxisDatafield(state)
    if (xAxis) {
        updateChartDatasets(state)
    }
}

export const ChartProvider = ({ children }) => {
    const ColbyChartInfo = window.ColbyChartInfo

    if (!ColbyChartInfo) return <></>

    const { storageKey, fetchDataRange, loadingStatus } = ColbyChartInfo

    if (!storageKey || !fetchDataRange || !loadingStatus) {
        throw Error(`ColbyChartInfo is insufficient: loadingStatus, storageKey or fetchDataRange--4`)
    }

    const storageValue = JSON.parse(localStorage.getItem(storageKey))


    if (!ColbyChartInfo) {
        throw Error('ColbyChartInfo is missing')
    }

    console.log(`[loadingStatus]`, loadingStatus)

    if (loadingStatus == 'none' || loadingStatus == 'loading') {
        if (loadingStatus == 'none') fetchDataRange(storageValue?.forms?.dataRange ?? '')
        return <></>
    }

    const { chartType, createDatasets, rawDatasets } = ColbyChartInfo

    if (!chartType || !createDatasets || !storageKey || !rawDatasets) {
        throw Error('ColbyChartInfo is insufficient')
    }


    const chartRef = useRef(null);
    const storedState = onInitializeState({ state: storageValue || initialState, info: ColbyChartInfo });

    onAdditionalUpdates(storedState, { chartRef, chartType })

    const [state, dispatch] = useReducer(reducer, storedState);

    const onDownloadChart = () => {
        const canvas = chartRef.current.canvas;

        if (canvas) {
            console.log('chartRef.current', canvas)
            // Convert canvas to data URL
            const dataURL = canvas.toDataURL('image/png');
            // Create a link element
            const downloadLink = document.createElement('a');
            downloadLink.href = dataURL;
            downloadLink.download = 'canvas_image.jpg';

            // Trigger a click event on the link to initiate download
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }
    const onInsertImage = async () => {
        try {
            const canvas = chartRef.current.canvas;
            const dataURL = canvas.toDataURL('image/jpeg');
            const result = await window.onInsertImage(dataURL)
            console.log('[onInsertImage] - success', result)
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

