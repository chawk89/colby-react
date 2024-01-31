import React from 'react'
import LineAnnotation from '../elements/LineAnnotation';
import BoxAnnotation from '../elements/BoxAnnotation';
import LabelAnnotation from '../elements/LabelAnnotation';
import ArrowAnnotation from '../elements/ArrowAnnotation';

const AnnotationTab = () => {
    return (
        <div className="flex flex-col gap-4">
            <LineAnnotation />
            <BoxAnnotation />
            <LabelAnnotation />
            <ArrowAnnotation />
        </div>
    );

}

export default AnnotationTab