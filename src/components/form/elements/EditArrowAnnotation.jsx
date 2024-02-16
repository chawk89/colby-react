import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { PopoverPicker } from '../../common/PopoverPicker';
import { useChartContext } from '../../../hooks/useChartContext';
import { getNewId } from '../../../utils/utils';
import useChartLabels from '../../../hooks/useChartLabels';
import useChartDatasetKeys from '../../../hooks/useChartDatasetKeys';
import useChartDatasets from '../../../hooks/useChartDatasets';
import { ARROW_LINE_TYPE_CAGR, ARROW_LINE_TYPE_CURVE, ARROW_LINE_TYPE_GENERAL, ARROW_LINE_TYPE_GROW_METRIC } from '../../common/types';

const arrowLineTypes = {
    [ARROW_LINE_TYPE_GENERAL]: 'Direct Line',
    [ARROW_LINE_TYPE_CURVE]: 'Curved Line',
    [ARROW_LINE_TYPE_GROW_METRIC]: 'Growth Metrics',
    [ARROW_LINE_TYPE_CAGR]: 'CAGR',
}
const EditArrowAnnotation = () => {

    const { state, dispatch } = useChartContext()
    const { control, register, watch, setValue } = useFormContext()
    const { state: { annotationSelected } } = useChartContext()

    const xAxis = watch('general.xAxis')

    const startDatasetKey = watch('properties.startDatasetKey')
    const endDatasetKey = watch('properties.endDatasetKey')
    const lineType = watch('properties.lineType')
    const keyLabels = useChartDatasetKeys(state, xAxis)

    const startDataset = useChartDatasets(state, startDatasetKey)
    const endDataset = useChartDatasets(state, endDatasetKey)


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
                <Label className="inline mr-2" htmlFor="annotationID" value="ID:" />
                <Label className="inline mr-2 text-gray-500" htmlFor="annotationID" value={annotationSelected} />
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="arrow-start-datasetIndex" value="Start Dataset Index:" />
                <Select id="arrow-start-datasetIndex" {...register('properties.startDatasetKey')}>
                    {keyLabels.map(({ key, label }) => <option value={key} key={key}>{label}</option>)}
                </Select>
            </div>
        </div>
        <div className="col-span-2">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="arrow-start-data" value="Start Data Index:" />
                <Select id="arrow-start-dataindex" {...register('properties.startDataIndex')}>
                    {startDataset.map((value, index) => <option value={index} key={index}>{value}</option>)}
                </Select>
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="arrow-end-dataindex" value="End Dataset Index:" />
                {/* <TextInput id="arrow-end-dataindex" type="text" placeholder="10" {...register("properties.yMin")} /> */}
                <Select id="arrow-end-dataindex" {...register('properties.endDatasetKey')}>
                    {keyLabels.map(({ key, label }) => <option value={key} key={key}>{label}</option>)}
                </Select>
            </div>
        </div>
        <div className="col-span-2">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="arrow-end-data" value="End Data Index:" />
                <Select id="arrow-end-data" {...register('properties.endDataIndex')}>
                    {endDataset.map((value, index) => <option value={index} key={index}>{value}</option>)}
                </Select>
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="arrow-double-arrow" value="Double Arrow:" />
                <Select id="arrow-double-arrow" {...register('properties.doubleArrow')}>
                    <option value={1}>true</option>
                    <option value={0}>false</option>
                </Select>
            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2" htmlFor="arrow-double-arrow" value="Line Type:" />
                <Label className="inline mr-2" htmlFor="arrow-double-arrow" value={lineType}></Label>


            </div>
        </div>
        <div className="col-span-1">
            <div className="flex items-center">
                <Label className="inline mr-2 shrink-0" htmlFor="arrow-Label" value="Label:" />
                <TextInput id="arrow-Label" type="text" placeholder="10" {...register("properties.label")} />
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

export default EditArrowAnnotation