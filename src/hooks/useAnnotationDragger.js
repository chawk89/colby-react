
/**
 * Chart JS Plugin
 */



import { useEffect } from 'react'
import { copySimpleObject } from '../utils/utils';


export const CLICK_TIMEOUT = 250
export const SELECTED_COLOR = '#0000FF'

export const onDrag = function (element, moveX, moveY) {

    element.x += moveX;
    element.y += moveY;
    element.x2 += moveX;
    element.y2 += moveY;
    element.centerX += moveX;
    element.centerY += moveY;
    if (element.elements && element.elements.length) {
        for (const subEl of element.elements) {
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
};
function updateLine(element, isSelected, selected) {
    console.log('[updateLine]', element)
    const { options } = element

    if (isSelected) {
        options.borderColor = selected.borderColor
        options.borderWidth = selected.borderWidth
        return {}
    } else {
        const result = copySimpleObject({
            id: options.id,
            borderColor: options.borderColor,
            borderWidth: options.borderWidth
        })
        options.borderColor = SELECTED_COLOR
        options.borderWidth = +options.borderWidth + 2
        return result;
    }
}
function onSelectClick(element, colbyAnnotation, chart) {
    if (!colbyAnnotation) return false;

    const { options } = element
    const isSelected = colbyAnnotation.selected?.id == options.id
    console.log("[annotation][Double click]", options, chart, isSelected);

    switch (options.type) {
        case 'line':
            colbyAnnotation.selected = updateLine(element, isSelected, colbyAnnotation.selected);
            break;
    }

    return true;
}


export const markColbyChartOptions = (options) => ({
    ...options,
    plugins: {
        ...options.plugins,
        annotation: {
            ...options.plugins.annotation,
            enter(ctx) {
                window.colbyAnnotation.element = ctx.element
            },
            leave() {

            },
            click(ctx, { chart }) {
                // window.colbyAnnotation.element = null
                // window.colbyAnnotation.lastEvent = null
                const colbyAnnotationTemp = window?.colbyAnnotationTemp
                const colbyAnnotation = window.colbyAnnotation
                if (!colbyAnnotationTemp) return;
                colbyAnnotationTemp.clickCount = colbyAnnotationTemp.clickCount + 1;

                const { idx, type, element } = ctx
                if (colbyAnnotationTemp.clickCount == 1) {
                    colbyAnnotationTemp.clickTimer = setTimeout(() => {
                        colbyAnnotationTemp.clickCount = 0
                        clearTimeout(colbyAnnotationTemp.clickTimer)
                    }, CLICK_TIMEOUT)
                } else if (colbyAnnotationTemp.clickCount == 2) {
                    // Double click action
                    onSelectClick(element, colbyAnnotation, chart)

                    colbyAnnotationTemp.clickCount = 0;
                    clearTimeout(colbyAnnotationTemp.clickCount)
                }
            }
        },
    }
})

const useAnnotationDragger = () => {
    useEffect(() => {
        window.colbyAnnotation = {
            element: null,
            lastEvent: null,
            selected: null
        }
        window.colbyAnnotationTemp = {
            clickCount: 0,
            clickTimer: null
        }
    }, [])

    const handleElementDragging = function (event) {
        const { lastEvent, element } = window.colbyAnnotation
        if (!lastEvent || !element) {
            return;
        }
        let moveX = event.x - lastEvent.x;
        let moveY = event.y - lastEvent.y;
        if (element.options.type == 'line') {
            if (!element.options.xScaleID) {
                moveX = 0;
            }
            if (!element.options.yScaleID) {
                moveY = 0;
            }

        }

        onDrag(element, moveX, moveY);
        window.colbyAnnotation.lastEvent = event

        return true;
    };

    const handleDrag = function (event, element) {
        if (element) {
            switch (event.type) {
                case 'mousemove':
                    return handleElementDragging(event);
                case 'mouseout':
                case 'mouseup':
                    window.colbyAnnotation.element = null
                    window.colbyAnnotation.lastEvent = null
                    break;
                case 'mousedown':

                    window.colbyAnnotation.lastEvent = event
                    break;
                default:
            }
        }
    };


    return ({
        id: 'colbyDraggerPlugin',
        beforeEvent: (chart, args, options) => {
            const { element } = window.colbyAnnotation
            if (handleDrag(args.event, element)) {
                args.changed = true;
                return;
            }
        }
    })
}

export default useAnnotationDragger







