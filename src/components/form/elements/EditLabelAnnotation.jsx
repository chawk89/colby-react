import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { PopoverPicker } from '../../common/PopoverPicker';
import { useChartContext } from '../../../hooks/useChartContext';
import { getNewId } from '../../../utils/utils';
import useChartLabels from '../../../hooks/useChartLabels';
import useChartDatasetKeys from '../../../hooks/useChartDatasetKeys';
import useChartDatasets from '../../../hooks/useChartDatasets';

const EditLabelAnnotation = () => {

    const { state, dispatch } = useChartContext()
    const { control, register, watch, setValue } = useFormContext()
    const { state: { annotationSelected } } = useChartContext()
    
    const xAxis = watch('global.xAxis')
    const datasetKey = watch('properties.datasetKey')

    const keyLabels = useChartDatasetKeys(state, xAxis)
    const labels = useChartLabels(state);
    const dataset = useChartDatasets(state, datasetKey)

    const handleDeleteClick = () => {
        dispatch({ type: 'DELETE_ANNOTATION_ITEM', id: annotationSelected })
    }
    const handleConfirmClick = () => {
        dispatch({ type: 'ACTIVE_ANNOTATION_ITEM', id: '' })
    }


    // const dataset = datasetKey? datasets[datasetKey].values: []
    

    return <div className="w-full grid grid-cols-3 gap-3 my-4 p-2">
         <div className="col-span-3">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="annotationAxisSelect" value="ID:" />
                <Label className="inline mr-2 text-gray-500" htmlFor="annotationAxisSelect" value={annotationSelected} />
            </div>
        </div>

        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="index-of-dimension" value="Index of Datasets:" />
                {/* <TextInput id="index-of-dimension" type="text" placeholder="10" {...register("properties.datasetKey")} /> */}
                <Select id="annotation-label-anchor" {...register('properties.datasetKey')}>
                    {keyLabels.map(({ key, label }) => <option value={key} key={key}>{label}</option>)}
                </Select>
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="series-name" value="Series Name:" />
                <Select id="annotation-label-anchor" {...register('properties.dataIndex')}>
                    {dataset.map((value, idx) => <option value={idx} key={idx}>{value}</option>)}
                </Select>
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="series-name" value="Caption:" />
                <TextInput id="series-name" type="text" placeholder="10" {...register("properties.caption")} />
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="annotation-label-fontSize" value="Line Opacity:" />
                <TextInput id="annotation-label-fontSize" type="number" placeholder="0.8" {...register('properties.opacity')} />
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="style-color" value="Color:" />
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
                <Label className="inline mr-2" htmlFor="annotation-label-fontName" value="Font Name:" />
                <TextInput id="annotation-label-fontName" type="text" placeholder="Lora" {...register('properties.fontName')} />
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="annotation-label-fontSize" value="Font Size:" />
                <TextInput id="annotation-label-fontSize" type="number" placeholder="10" {...register('properties.fontSize')} />
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

export default EditLabelAnnotation
