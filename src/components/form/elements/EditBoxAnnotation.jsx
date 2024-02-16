import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { PopoverPicker } from '../../common/PopoverPicker';
import { useChartContext } from '../../../hooks/useChartContext';
import { getNewId } from '../../../utils/utils';
import useChartLabels from '../../../hooks/useChartLabels';

const EditBoxAnnotation = () => {

    const { state, dispatch } = useChartContext()
    const { control, register, watch, setValue } = useFormContext()
    const { state: { annotationSelected } } = useChartContext()
    const axis = watch('properties.axis')

    const handleDeleteClick = () => {
        dispatch({ type: 'DELETE_ANNOTATION_ITEM', id: annotationSelected })
    }
    const handleConfirmClick = () => {
        dispatch({ type: 'ACTIVE_ANNOTATION_ITEM', id: '' })
    }


    // const dataset = datasetKey? datasets[datasetKey].values: []
    const labels = useChartLabels(state);


    return <div className="w-full grid grid-cols-3 gap-3 my-4 p-2">

        <div className="col-span-3">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="annotationAxisSelect" value="ID:" />
                <Label className="inline mr-2 text-gray-500" htmlFor="annotationAxisSelect" value={annotationSelected} />
            </div>
        </div>
        <div className="col-span-4">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="annotationBoxLabel" value="Label:" />
                <TextInput id="annotationBoxLabel" type="text" placeholder="10" {...register('properties.label')} />
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="annotationBoxXMin" value="X Min:" />
                <TextInput id="annotationBoxXMin" type="text" placeholder="10" {...register('properties.xMin')} />
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="annotationBoxXMax" value="X Max:" />
                <TextInput id="annotationBoxXMax" type="text" placeholder="10" {...register('properties.xMax')} />
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="annotationBoxXMin" value="Y Min:" />
                <TextInput id="annotationBoxYMin" type="text" placeholder="10" {...register('properties.yMin')} />
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="annotationBoxXMin" value="Y Max:" />
                <TextInput id="annotationBoxYMax" type="text" placeholder="10" {...register('properties.yMax')} />
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Button onClick={handleConfirmClick}> ok </Button>
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Button onClick={handleDeleteClick}> Delete </Button>
            </div>
        </div>

    </div>


}

export default EditBoxAnnotation