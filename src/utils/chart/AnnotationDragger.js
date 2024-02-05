/**
 * Chart JS Plugin
 */

import { copySimpleObject } from "../utils";


export class AnnotationDragger {
    constructor() {
        this.id = "AnnotationDragger"
        // Initialize the instance
        this.element = null;
        this.lastEvent = null;
        this.dispatch = null;
    }
    initPlugin(dispatch) {
        if(!dispatch) {
            throw Error('Dispach is null')
        }
        this.dispatch = dispatch;        
    }
    beforeEvent(chart, args, options) {
        if (this.handleDrag(args.event)) {
            // args.changed = true;
        }

        if (args.event.type == 'mousedown') {
            this.chart = chart
            this.args = args
        }
    }
    afterEvent(chart, args, options) {
        // console.log('[afterEvent]', args.event.type)
    }
    afterInit(chart, args) {
        // Add event listener to the canvas element
        chart.canvas.addEventListener('dblclick', (event) => this.handlDoubleClick(event));
    }
    isInClickThreshold(dx) {
        const clickThreshold = 5
        return Math.abs(dx) < clickThreshold
    }
    getFirstActiveObject({ eventX, eventY }, annotations, chart) {
        const keys = Object.keys(annotations)
        // console.log('[handleAnnotation]', keys, annotations)

        for (const key of keys) {
            const annotation = annotations[key]
            const { type } = annotation
            switch (type) {
                case 'line': {
                    const { xScaleID, xMin, yScaleID, yMin, borderWidth } = annotation
                    if (xScaleID && xScaleID == 'X') {
                        const annotationX = chart.scales.x.getPixelForValue(+xMin + borderWidth / 2);
                        if (this.isInClickThreshold(annotationX - eventX)) {
                            return annotation
                        }
                    }
                    if (yScaleID && yScaleID == 'y') {
                        const annotationY = chart.scales.y.getPixelForValue(+yMin + borderWidth / 2);
                        if (this.isInClickThreshold(annotationY - eventY)) {
                            return annotation
                        }
                    }

                }
            }
        }
        return null;
    }
    handleAnnotation(event, chart) {
        console.log('[handleAnnotation]', this.dispatch);
        // const eventX = event.x + window.scrollX
        // const eventY = event.y + window.scrollY
        // // const yValue = chart.scales.y.getValueForPixel(event.y);
        // const annotations = chart.options.plugins.annotation.annotations
        // const selectedAnnotation = this.getFirstActiveObject({ eventX, eventY }, annotations, chart)
        // // console.log('[handleAnnotation]', Object.entries(selectedAnnotation))
        // let active = {};
        // if (selectedAnnotation) {
        //     selectedAnnotation.display = false
        //     active = copySimpleObject(selectedAnnotation)
        //     active.borderColor = 'blue';
        //     active.borderWidth = 3;
        //     active.borderDash = [];
        //     active.shadowColor = 'rgba(0, 0, 255, 0.5)';            

        // }
        // chart.options.plugins.annotation.annotations = {       
        //     ...annotations,
        //     active
        // }

    }
    handlDoubleClick(event) {
        // Get the clicked point
        if (this.chart) {
            const chart = this.chart
            const activePoints = chart.getElementsAtEventForMode(event, 'point', chart.options);
            console.log('[activePoints]', activePoints, this.chart)
            this.handleAnnotation(event, chart)
            // Check if there is at least one active point
            if (activePoints.length > 0) {
                // Get the first active point
                var firstPoint = activePoints[0];

                // // Perform custom actions here
                // // You can access the dataset and index of the clicked point
                var datasetIndex = firstPoint.datasetIndex;
                var index = firstPoint.index;

                // Example: Log the dataset and index of the clicked point
                console.log('Dataset Index:', datasetIndex);
                console.log('Point Index:', index);
            } else {

            }
        }

        event.preventDefault()
    }
    drawOnExternalTooltip(context) {
        // Tooltip Element
        let tooltipEl = document.getElementById('chartjs-tooltip');

        // Create element on first render
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = '<div class="test">This is test</div>';
            document.body.appendChild(tooltipEl);
        }

        // Hide if no tooltip
        const tooltipModel = context.tooltip;
        if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
        } else {
            tooltipEl.classList.add('no-transform');
        }

        function getBody(bodyItem) {
            return bodyItem.lines;
        }

        // Set Text
        if (tooltipModel.body) {
            const titleLines = tooltipModel.title || [];
            const bodyLines = tooltipModel.body.map(getBody);

            let innerHtml = '<thead>';

            titleLines.forEach(function (title) {
                innerHtml += '<tr><th>' + title + '</th></tr>';
            });
            innerHtml += '</thead><tbody>';

            bodyLines.forEach(function (body, i) {
                const colors = tooltipModel.labelColors[i];
                let style = 'background:' + colors.backgroundColor;
                style += '; border-color:' + colors.borderColor;
                style += '; border-width: 2px';
                const span = '<span style="' + style + '">' + body + '</span>';
                innerHtml += '<tr><td>' + span + '</td></tr>';
            });
            innerHtml += '</tbody>';

            let tableRoot = tooltipEl.querySelector('table');
            tableRoot.innerHTML = innerHtml;
        }

        const position = context.chart.canvas.getBoundingClientRect();
        const bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
        tooltipEl.style.font = bodyFont.string;
        tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
        tooltipEl.style.pointerEvents = 'none';
    }


    enter(ctx) {
        this.element = ctx.element;
    }
    leave() {
        // console.log('[leave]')
        // this.element = undefined;
        // this.lastEvent = undefined;
    }
    handleDrag(event) {
        if (this.element) {
            if (event.type in ["mousemove", "mouseout", "mouseup", "mousedown"]) {
                console.log('[handleDrag]', event.type, event)
            }
            switch (event.type) {
                case "mousemove":
                    return this.handleElementDragging(event);
                case "mouseout":
                case "mouseup":
                    this.lastEvent = undefined;
                    this.element = undefined;
                    break;
                case "mousedown":
                    this.lastEvent = event;
                    break;
                default: {
                    console.log('[handleDrag]', event)
                }
            }
        }

        return true
    }

    handleElementDragging(event) {
        if (!this.lastEvent || !this.element) {
            return;
        }
        const moveX = event.x - this.lastEvent.x;
        const moveY = event.y - this.lastEvent.y;
        this.onDrag(moveX, moveY);
        this.lastEvent = event;
        return true;
    }
    onDrag(moveX, moveY) {
        this.element.x += moveX;
        this.element.y += moveY;
        this.element.x2 += moveX;
        this.element.y2 += moveY;
        this.element.centerX += moveX;
        this.element.centerY += moveY;
        if (this.element.elements && this.element.elements.length) {
            for (const subEl of this.element.elements) {
                subEl.x += moveX;
                subEl.y += moveY;
                subEl.x2 += moveX;
                subEl.y2 += moveY;
                subEl.centerX += moveX;
                subEl.centerY += moveY;
                subEl.bX += moveX;
                subEl.bY += moveY;
            }
        }
    }
};
