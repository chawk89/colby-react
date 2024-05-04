import React, { useEffect, useState } from 'react'
import { Button, Card, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useFormContext } from 'react-hook-form';
import { PopoverPicker } from '../../common/PopoverPicker';
import { useChartContext } from '../../../hooks/useChartContext';
import { generateAnnotationId, getNewId } from '../../../utils/utils';
import useChartDatasetKeys from '../../../hooks/useChartDatasetKeys';
import useChartDatasets from '../../../hooks/useChartDatasets';

const EmphasisAnnotation = () => {

    const { state, onAddAnnotation } = useChartContext()
    const { control, register, watch, setValue } = useFormContext()
    const emphasisEnabled = watch('annotationTemp.emphasis.enabled')
    const [triggerFlag, setTriggerFlag] = useState(false)
    const xAxis = watch('global.xAxis')
    const selected = watch('global.yAxis')
    const datasetKey = watch('annotationTemp.emphasis.datasetKey')
    const dataset = useChartDatasets(state, datasetKey)
    const keyLabels = useChartDatasetKeys(state, xAxis)

    const handleAddClick = () => {
        setTriggerFlag(true)
        const type = 'emphasis'
        onAddAnnotation({
            type, id: generateAnnotationId(type)
        })
    }

    useEffect(() => {
        if (triggerFlag) {
            setValue('annotationTemp.emphasis', state.forms.annotationTemp.emphasis)
            setTriggerFlag(false)
        }
    }, [
        state.forms.annotationTemp.emphasis,
        triggerFlag
    ])

    return (
        <Card className="w-full">
            <Controller
                name="annotationTemp.emphasis.enabled"
                control={control}
                render={({ field: { value, onChange } }) => {
                    return <ToggleSwitch label="Emphasis Annotation" checked={value} onChange={onChange} />
                }}
            />
            {emphasisEnabled &&
                <div className="w-full grid grid-cols-3 gap-3 my-4 p-2">
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="index-of-dimension" value="Index of Datasets:" />
                            <Select id="annotation-emphasis-anchor" {...register('annotationTemp.emphasis.datasetKey')}>
                                {keyLabels.map(({ key, label }) => selected[key] ? <option value={key} key={key}>{label}</option> : null)}
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                        <Label className="inline mr-2" htmlFor="style-color" value="Highlight" />
                            <Controller
                                name="annotationTemp.emphasis.highlight"
                                control={control}
                                render={({ field: { value, onChange } }) => {
                                    return <PopoverPicker color={value} onChange={onChange} />;
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Button onClick={handleAddClick}> Add </Button>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="series-name" value="Series Name:" />
                            <Select id="annotation-emphasis-anchor" {...register('annotationTemp.emphasis.dataIndex')}>
                                {dataset.map((value, idx) => <option value={idx} key={idx}>{value}</option>)}
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="style-color" value="Darken" />
                            <Controller
                                name="annotationTemp.emphasis.darken"
                                control={control}
                                render={({ field: { value, onChange } }) => {
                                    return <PopoverPicker color={value} onChange={onChange} />;
                                }}
                            />
                        </div>
                    </div>
                </div>
            }
        </Card>
    );

}

export default EmphasisAnnotation;  
