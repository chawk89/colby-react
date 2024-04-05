import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { PopoverPicker } from '../../common/PopoverPicker';
import { useChartContext } from '../../../hooks/useChartContext';
import { getNewId } from '../../../utils/utils';
import useChartLabels from '../../../hooks/useChartLabels';

const EditLineAnnotation = () => {

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
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="annotationAxisSelect" value="Axis:" />
                <Select id="annotationAxisSelect" {...register('properties.axis')}>
                    <option value="x">X</option>
                    <option value="y">Y</option>
                </Select>
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="axis-position" value="Axis Position:" />
                {
                    axis == 'x' ?
                        <TextInput id="axis-position" type="text" placeholder="10" {...register("properties.position")} /> :
                        <Select id="axis-position" {...register('properties.position')}>
                            {labels.map((label, index) => <option value={label} key={index}>{label}</option>)}
                        </Select>
                }
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="anno-linestyle" value="Line Style:" />
                <Select id="anno-linestyle" {...register("properties.style")} >
                    <option value='none'>Solid</option>
                    <option value='dashed'>Dashed</option>
                    <option value='wave'>Wave</option>
                </Select>
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="axis-label" value="Label:" />
                <TextInput id="axis-label" type="text" placeholder="Default Label" {...register("properties.label")} />
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center h-full">
                <Label className="inline mr-2 shrink-0" htmlFor="anno-linecolor" value="Line Color:" />
                <Controller
                    name="properties.color"
                    control={control}
                    render={({ field: { value, onChange } }) => {
                        return <PopoverPicker color={value} onChange={onChange} />;
                    }}
                />
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="anno-line-thickness" value="Line Thickness:" />
                <TextInput id="anno-line-thickness" type="text" placeholder="10" {...register("properties.thickness")} />
            </div>
        </div>
        <div className="col-span-3">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="anno-line-bg-opacity" value="Label Bg Opacity:" />
                <TextInput id="anno-line-bg-opacity" type="text" placeholder="10" {...register("properties.labelBgOpacity")} />
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

export default EditLineAnnotation