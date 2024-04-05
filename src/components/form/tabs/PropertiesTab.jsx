import React, { useCallback, useEffect, useState } from 'react'
import { useChartContext } from '../../../hooks/useChartContext';
import { useFormContext } from "react-hook-form"
import EditLineAnnotation from '../elements/EditLineAnnotation';

import useFormValue from '../../../hooks/useFormValue';
import { UPDATE_ANNOTATION_ITEM } from '../../../context/ChartContext';
import { Button, Card, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import EditBoxAnnotation from '../elements/EditBoxAnnotation';
import EditLabelAnnotation from '../elements/EditLabelAnnotation';
import EditArrowAnnotation from '../elements/EditArrowAnnotation';
import { copySimpleObject } from '../../../utils/utils';

const FormPropertyValues = ["properties"]
const PropertiesTab = () => {
    const { state: { forms, data, annotationSelected, annotation }, dispatch } = useChartContext()
    const { control, register, watch, setValue } = useFormContext()
    const selected = annotation[annotationSelected]

    useEffect(() => {
        if (selected) {
            setValue('properties', copySimpleObject(selected))
        }
    }, [])

    const handleUpdate = useCallback((data) => {
        const { properties } = data
        // const list = Object.keys(selected)
        // if (checkValidateValueSame(isEqualObject, list, { preValues: selected, curValues: properties })) return;
        console.log(properties);
        dispatch({ type: UPDATE_ANNOTATION_ITEM, data: properties })
    }, [dispatch, selected])
    useFormValue(watch, handleUpdate, FormPropertyValues)

    return (
        selected && <Card className="w-full">
            <div className="col-span-3">
                <h3 className='text-2xl uppercase font-bold'> Edit Properties</h3>
            </div>
            {annotationSelected.startsWith('line') && <EditLineAnnotation />}
            {annotationSelected.startsWith('box') && <EditBoxAnnotation />}
            {annotationSelected.startsWith('label') && <EditLabelAnnotation />}
            {annotationSelected.startsWith('arrow') && <EditArrowAnnotation />}
        </Card>
    )
}

export default PropertiesTab
