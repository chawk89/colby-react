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
        this.selected = []
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
        // chart.canvas.addEventListener('dblclick', (event) => this.handlDoubleClick(event));
        // chart.canvas.addEventListener('click', (event) => this.handleClick(event));
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
                            return {
                                annotation,
                                dxRate: 0,
                                dyRate: 0
                            }
                        }
                    }
                    if (yScaleID && yScaleID == 'y') {
                        const annotationY = chart.scales.y.getPixelForValue(+yMin + borderWidth / 2);
                        if (this.isInClickThreshold(annotationY - eventY)) {
                            return {
                                annotation, dxRate: 0,
                                dyRate: 0
                            }
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
                        const width = (xMinPixel - xMaxPixel)
                        const height = (yMinPixel - yMaxPixel)
                        const dxRate = width ? (eventX - xMinPixel) / width : 0
                        const dyRate = height ? (eventY - yMinPixel) / height : 0
                        return {
                            annotation,
                            dxRate,
                            dyRate,
                        }
                    }
                    continue
                }
                case 'label': {
                    console.log('[annotation]', Object.entries(annotation))
                }
            }
        }
        return {
            annotation: null,
            dxRate: 0,
            dyRate: 0,
        };
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
        const { annotation: selectedAnnotation, dxRate, dyRate } = this.getFirstActiveObject({ eventX, eventY }, annotations, chart)

        if (selectedAnnotation && selectedAnnotation?.id == this.selectedAnnotation?.id) {
            this.selectedAnnotation = {
                id: ''
            }
        } else {
            this.selectedAnnotation = {
                id: selectedAnnotation?.id ?? '',
                x: eventX,
                y: eventY,
                dxRate,
                dyRate,
                obj: selectedAnnotation?.id ? selectedAnnotation : {}
            }
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
    }
    getAnnotationById(id) {
        if (!this.chart) {
            throw Error('chart is null')
        }
        const chart = this.chart
        const annotations = chart.options.plugins.annotation.annotations
        return annotations[id]
    }
    moveAnnotation(event) {
        if (!this.selectedAnnotation || !this.selectedAnnotation.id) {
            console.info('[there is no selected Annotation]')
            return;
        }
        const chart = this.chart
        const eventX = event.x + window.scrollX
        const eventY = event.y + window.scrollY
        const annotation = this.getAnnotationById(this.selectedAnnotation.id)
        // console.log('[handleClick]', Object.entries(annotation))
        const { yMin, xMin } = annotation

        const posX = chart.scales.x.getValueForPixel(eventX)
        const posY = chart.scales.y.getValueForPixel(eventY)
        const { dxRate, dyRate } = this.selectedAnnotation


        const dx = xMin ? +posX - xMin : 0
        const dy = yMin ? +posY - yMin : 0

        this.selectedAnnotation = {
            ...this.selectedAnnotation
        }

        this.dispatch({
            type: 'UPDATE_ANNOTATION_POSITION',
            id: this.selectedAnnotation.id,
            dx,
            dy,
            posX,
            posY,
            dxRate,
            dyRate
        })
    }
    handleClick(event) {
        // Get the clicked point
        event.preventDefault()

        if (!this.chart || !this.dispatch) {
            throw Error('chart is null or dispatch')
        }
        this.moveAnnotation(event)

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
    selectElement(element, selectedColor, unselectedColor) {
        console.log(element.label.options.content + ' selected');
        if (this.selected.includes(element)) {
            this.selected.splice(this.selected.indexOf(element), 1);
            element.options.backgroundColor = unselectedColor;
            element.label.options.font.size = 12;
        } else {
            this.selected.push(element);
            element.options.backgroundColor = selectedColor;
            element.label.options.font.size = 14;
        }
        return true;
    }

    onAnnoationClick(ctx) {
        console.log('[onClick]', ctx)
        const { id, element } = ctx
        if (!this.dispatch) {
            throw Error('Dispatch is null')
        }
        
        if(!this.selectedAnnotation) {
            this.selectedAnnotation = {
                id: ''
            }
        }
        const newId = this.selectedAnnotation?.id == id ? '' : id
        this.selectedAnnotation = {
            id: newId
        }
        this.dispatch({ type: 'ACTIVE_ANNOTATION_ITEM', id: newId })
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
