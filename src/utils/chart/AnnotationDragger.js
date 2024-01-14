/**
 * Chart JS Plugin
 */


export class AnnotationDragger {
    constructor() {
        this.id = "AnnotationDragger"
        // Initialize the instance
        this.element = null;
        this.lastEvent = null;
    }
    beforeEvent(chart, args, options) {
        if (this.handleDrag(args.event)) {
            args.changed = true;
            return;
        }
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
                default:
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
