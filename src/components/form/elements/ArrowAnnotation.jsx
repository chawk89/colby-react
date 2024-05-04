import React, { useEffect, useState } from 'react'
import { Button, Card, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useFormContext } from 'react-hook-form';
import { useChartContext } from '../../../hooks/useChartContext';
import { PopoverPicker } from '../../common/PopoverPicker';
import { generateAnnotationId, getArrowElementId, getNewId } from '../../../utils/utils';
import useChartDatasetKeys from '../../../hooks/useChartDatasetKeys';
import useChartDatasets from '../../../hooks/useChartDatasets';
import { ARROW_LINE_TYPE_CAGR, ARROW_LINE_TYPE_CURVE, ARROW_LINE_TYPE_GENERAL, ARROW_LINE_TYPE_GROW_METRIC } from '../../common/types';


const ArrowAnnotation = () => {
    const { state, onAddAnnotation } = useChartContext()
    const { control, register, watch, setValue } = useFormContext()
    const arrowEnabled = watch('annotationTemp.arrow.enabled')
    const [triggerFlag, setTriggerFlag] = useState(false)

    const xAxis = watch('global.xAxis')
    const selected = watch('global.yAxis')
    const startDatasetKey = watch('annotationTemp.arrow.startDatasetKey')
    const endDatasetKey = watch('annotationTemp.arrow.endDatasetKey')
    const lineType = watch('annotationTemp.arrow.lineType')
    const keyLabels = useChartDatasetKeys(state, xAxis)

    const startDataset = useChartDatasets(state, startDatasetKey)
    const endDataset = useChartDatasets(state, endDatasetKey)

    const handleAddClick = () => {
        setTriggerFlag(true)
        const type = 'arrow'
        onAddAnnotation({
            type, id: getArrowElementId(generateAnnotationId(type), lineType), 
        })
    }

    useEffect(() => {
        if (triggerFlag) {
            setValue('annotationTemp.arrow', state.forms.annotationTemp.arrow)
            setTriggerFlag(false)
        }
    }, [
        state.forms.annotationTemp.arrow,
        triggerFlag
    ])

    return (
        <Card className="w-full">
            <Controller
                name="annotationTemp.arrow.enabled"
                control={control}
                render={({ field: { value, onChange } }) => {
                    return <ToggleSwitch label="Arrow Annotation" checked={value} onChange={onChange} />
                }}
            />

            {arrowEnabled && <div className="w-full grid grid-cols-3 gap-3 my-4 p-2">
                <div className="col-span-1">
                    <div className="flex items-center">
                        <Label className="inline mr-2 shrink-0" htmlFor="arrow-start-datasetIndex" value="Start Dataset Index:" />
                        <Select id="arrow-start-datasetIndex" {...register('annotationTemp.arrow.startDatasetKey')}>
                            {keyLabels.map(({ key, label }) => selected[key] ? <option value={key} key={key}>{label}</option> : null)}
                        </Select>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="flex items-center">
                        <Label className="inline mr-2 shrink-0" htmlFor="arrow-start-data" value="Start Data Index:" />
                        <Select id="arrow-start-dataindex" {...register('annotationTemp.arrow.startDataIndex')}>
                            {startDataset.map((value, index) => <option value={index} key={index}>{value}</option>)}
                        </Select>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center">
                        <Label className="inline mr-2 shrink-0" htmlFor="arrow-end-dataindex" value="End Dataset Index:" />
                        {/* <TextInput id="arrow-end-dataindex" type="text" placeholder="10" {...register("annotationTemp.arrow.yMin")} /> */}
                        <Select id="arrow-end-dataindex" {...register('annotationTemp.arrow.endDatasetKey')}>
                            {keyLabels.map(({ key, label }) => selected[key] ? <option value={key} key={key}>{label}</option> : null)}
                        </Select>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="flex items-center">
                        <Label className="inline mr-2 shrink-0" htmlFor="arrow-end-data" value="End Data Index:" />
                        <Select id="arrow-end-data" {...register('annotationTemp.arrow.endDataIndex')}>
                            {endDataset.map((value, index) => <option value={index} key={index}>{value}</option>)}
                        </Select>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center">
                        <Label className="inline mr-2" htmlFor="arrow-double-arrow" value="Double Arrow:" />
                        <Select id="arrow-double-arrow" {...register('annotationTemp.arrow.doubleArrow')}>
                            <option value={1}>true</option>
                            <option value={0}>false</option>
                        </Select>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center">
                        <Label className="inline mr-2" htmlFor="arrow-double-arrow" value="Line Type:" />
                        <Select id="arrow-double-arrow" {...register('annotationTemp.arrow.lineType')}>
                            <option value={ARROW_LINE_TYPE_GENERAL}>Direct Line</option>
                            <option value={ARROW_LINE_TYPE_CURVE}>Curved Line</option>
                            <option value={ARROW_LINE_TYPE_GROW_METRIC}>Growth Metrics</option>
                            <option value={ARROW_LINE_TYPE_CAGR}>CAGR</option>
                        </Select>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center">
                        <Label className="inline mr-2 shrink-0" htmlFor="arrow-Label" value="Label:" />
                        <TextInput id="arrow-Label" type="text" placeholder="10" {...register("annotationTemp.arrow.label")} />
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center">
                        <Label className="inline mr-2" htmlFor="arrow-color" value="Color:" />
                        <Controller
                            name="annotationTemp.arrow.color"
                            control={control}
                            render={({ field: { value, onChange } }) => {
                                return <PopoverPicker color={value} onChange={onChange} />;
                            }}
                        />
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="flex items-center">
                        <Button onClick={handleAddClick}> Add </Button>
                    </div>
                </div>

            </div>
            }
        </Card>
    );

}

export default ArrowAnnotation