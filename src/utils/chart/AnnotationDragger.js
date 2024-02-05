/**
 * Chart JS Plugin
 */


export class AnnotationDragger {
    constructor() {
        this.id = "AnnotationDragger"
        // Initialize the instance
        this.element = null;
        this.lastEvent = null;
        this.lastPoint = null
        this.dispatch = null;
    }
    initPlugin(dispatch) {
        if (!dispatch) {
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
        chart.canvas.addEventListener('click', (event) => this.handleClick(event));
    }
    isInClickThreshold(dx) {
        const clickThreshold = 5
        return Math.abs(dx) < clickThreshold
    }
    getFirstActiveObject({ eventX, eventY }, annotations, chart) {
        const keys = Object.keys(annotations)

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
                    continue
                }
                case 'box': {
                    const { xMin, xMax, yMin, yMax } = annotation
                    const xMinPixel = chart.scales.x.getPixelForValue(xMin);
                    const xMaxPixel = chart.scales.x.getPixelForValue(xMax);
                    const yMinPixel = chart.scales.y.getPixelForValue(yMin);
                    const yMaxPixel = chart.scales.y.getPixelForValue(yMax);
                    if (xMinPixel <= eventX && eventX <= xMaxPixel
                        && ((yMinPixel <= eventY && eventY <= yMaxPixel) || (yMaxPixel <= eventY && eventY <= yMinPixel))) {
                        return annotation
                    }
                    continue
                }
            }
        }
        return null;
    }
    handleAnnotation(event, chart) {
        const dispatch = this.dispatch
        if (!dispatch) {
            throw Error('Needs to be initialized')
        }
        const eventX = event.x + window.scrollX
        const eventY = event.y + window.scrollY
        // const yValue = chart.scales.y.getValueForPixel(event.y);
        const annotations = chart.options.plugins.annotation.annotations
        const selectedAnnotation = this.getFirstActiveObject({ eventX, eventY }, annotations, chart)
        this.selectedAnnotation = {
            id: selectedAnnotation?.id ?? '',
            x: eventX,
            y: eventY,
            obj: selectedAnnotation?.id ? selectedAnnotation : {}
        }

        dispatch({ type: 'ACTIVE_ANNOTATION_ITEM', id: this.selectedAnnotation.id })
    }
    handlDoubleClick(event) {
        // Get the clicked point
        event.preventDefault()

        if (!this.chart || !this.dispatch) {
            throw Error('chart is null or dispatch')
        }

        const chart = this.chart
        this.handleAnnotation(event, chart)
        console.log('[activePoints]', activePoints)
    }
    handleClick(event) {
        // Get the clicked point
        event.preventDefault()

        if (!this.chart || !this.dispatch) {
            throw Error('chart is null or dispatch')
        }

        if (!this.selectedAnnotation || !this.selectedAnnotation.id) {
            console.info('[there is no selected Annotation]')
            return;
        }
        const chart = this.chart
        const eventX = event.x + window.scrollX
        const eventY = event.y + window.scrollY
        const { x: lastX, y: lastY } = this.selectedAnnotation
        const dx = chart.scales.x.getPixelForValue(eventX - lastX) * (eventX > lastX ? 1 : -1)
        const dy = chart.scales.y.getPixelForValue(eventY - lastY) * (eventY > lastY ? -1 : 1)
        console.log('[handleClick]', eventX - lastX, eventY - lastY)
        this.selectedAnnotation = {
            ...this.selectedAnnotation,
            x: eventX,
            y: eventY,
        }

        this.dispatch({
            type: 'UPDATE_ANNOTATION_POSITION',
            id: this.selectedAnnotation.id,
            dx, dy
        })
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
