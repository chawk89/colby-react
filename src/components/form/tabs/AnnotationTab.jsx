import React, { useState } from 'react'
import { Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useFormContext } from 'react-hook-form';
import { PopoverPicker } from '../../common/PopoverPicker';
import LineAnnotation from '../elements/LineAnnotation';
import BoxAnnotation from '../elements/BoxAnnotation';
import LabelAnnotation from '../elements/LabelAnnotation';
import ArrowAnnotation from '../elements/ArrowAnnotation';

const AnnotationTab = () => {
    const { control, watch } = useFormContext()

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