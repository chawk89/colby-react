

import { ChartjsDraggablePlugin } from './plugin';
import { DraggableAnnotationAccessor } from './annotation/accessor';

const plugin = new ChartjsDraggablePlugin([
	DraggableAnnotationAccessor
]);

export default plugin;
