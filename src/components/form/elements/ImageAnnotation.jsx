import React, { useEffect, useState } from 'react'
import { Button, Card, Label, Select, TextInput, ToggleSwitch, RangeSlider} from 'flowbite-react'
import { Controller, useFormContext } from 'react-hook-form';
import { useChartContext } from '../../../hooks/useChartContext';
import { generateAnnotationId, getNewId } from '../../../utils/utils';
import useChartDatasetKeys from '../../../hooks/useChartDatasetKeys';
import useChartDatasets from '../../../hooks/useChartDatasets';


const ImageAnnotation  = () => {
    const { state, onAddAnnotation } = useChartContext()
    const { control, register, watch, setValue } = useFormContext() 
    const imageEnabled = watch('annotationTemp.image.enabled')
    const [triggerFlag, setTriggerFlag] = useState(false)
    const xAxis = watch('global.xAxis')
    const selected = watch('global.yAxis')
    const datasetKey = watch('annotationTemp.image.datasetKey')
    const dataset = useChartDatasets(state, datasetKey)
    const keyLabels = useChartDatasetKeys(state, xAxis)

    const handleAddClick = () => {
        setTriggerFlag(true)
        const type = 'image'
        onAddAnnotation({
            type, id: generateAnnotationId(type)
        })
    }

    useEffect(() => {
        if (triggerFlag) {
            setValue('annotationTemp.image', state.forms.annotationTemp.image)
            setTriggerFlag(false)
        }
    }, [
        state.forms.annotationTemp.image,
        triggerFlag
    ])

    return (
        <Card className="w-full">
            <Controller
                name="annotationTemp.image.enabled"
                control={control}
                render={({ field: { value, onChange } }) => {
                    return <ToggleSwitch label="Image Annotation" checked={value} onChange={onChange} />
                }}
            />
            {imageEnabled &&
                <div className="w-full grid grid-cols-3 gap-3 my-4 p-2">
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="index-of-dimension" value="Index of Datasets:" />
                            <Select id="annotation-image-anchor" {...register('annotationTemp.image.datasetKey')}>
                                {keyLabels.map(({ key, label }) => selected[key] ? <option value={key} key={key}>{label}</option> : null)}
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="series-name" value="Series Name:" />
                            <Select id="annotation-image-anchor" {...register('annotationTemp.image.dataIndex')}>
                                {dataset.map((value, idx) => <option value={idx} key={idx}>{value}</option>)}
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-1">
                            <div className="flex items-center">
                                <Label className="inline mr-2" htmlFor="image-width" value="Image-Width:" />
                                <Controller
                                    name='annotationTemp.image.imageWidth'
                                    control={control}
                                    render={({ field: { value, onChange } }) => {
                                        return <RangeSlider color={value} onChange={onChange} min="0" max="100" step="1"/>;
                                    }}
                                />
                            </div>
                        </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="annotation-image-url" value="Image Url:" />
                            <TextInput id="annotation-image-url" type="text" placeholder="Image Url" {...register('annotationTemp.image.imageUrl')} />
                        </div>
                    </div>
                        <div className="col-span-1">
                        <div className="flex items-center">
                            <Button onClick={handleAddClick}> Add </Button>
                        </div>
                    </div>
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <Label className="inline mr-2" htmlFor="image-height" value="Image-Height:" />
                                <Controller
                                    name='annotationTemp.image.imageHeight'
                                    control={control}
                                    render={({ field: { value, onChange } }) => {
                                        return <RangeSlider color={value} onChange={onChange} min="0" max="100" step="1"/>;
                                    }}
                                />
                            </div>
                        </div>

                </div>
            }
        </Card>
    );

}

export default ImageAnnotation;  
