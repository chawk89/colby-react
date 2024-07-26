import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { PopoverPicker } from '../../common/PopoverPicker';
import { useChartContext } from '../../../hooks/useChartContext';
import { generateAnnotationId, getNewId } from '../../../utils/utils';
import useChartLabels from '../../../hooks/useChartLabels';

const LineAnnotation = () => {

    const { state, onAddAnnotation } = useChartContext()
    const { control, register, watch, setValue } = useFormContext()
    const lineEnabled = watch('annotationTemp.line.enabled')
    const axis = watch('annotationTemp.line.axis')
    const xAxis = watch('global.xAxis')


    // const dataset = datasetKey? datasets[datasetKey].values: []
    const labels = useChartLabels(state);

    const [triggerFlag, setTriggerFlag] = useState(false)

    const handleAddClick = () => {
        setTriggerFlag(true)
        const type = 'line'
        onAddAnnotation({
            type, id: generateAnnotationId(type)
        })
    }
    useEffect(() => {
        if (triggerFlag) {
            setValue('annotationTemp.line', state.forms.annotationTemp.line)
            setTriggerFlag(false)
        }
    }, [
        state.forms.annotationTemp.line,
        triggerFlag
    ])

    return <Card className="w-full">

        <Controller
            name="annotationTemp.line.enabled"
            control={control}
            render={({ field: { value, onChange } }) => {
                return <ToggleSwitch label="Line Annotation" checked={value} onChange={onChange} />
            }}
        />
        {lineEnabled && <div className="w-full grid grid-cols-3 gap-3 my-4 p-2">
            <div className="col-span-3">
                <h4 className='w-full text-lg font-bold mb-2 col-span-3'> {lineEnabled ? 'New Line' : 'Edit Line'}</h4>
            </div>
            <div className="col-span-1">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2" htmlFor="annotationAxisSelect" value="Axis:" />
                    <Select id="annotationAxisSelect" {...register('annotationTemp.line.axis')}>
                        <option value="x">X</option>
                        <option value="y">Y</option>
                    </Select>
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2 shrink-0" htmlFor="axis-position" value="Axis Position:" />
                    {
                        axis == 'x' ?
                            <TextInput id="axis-position" type="text" placeholder="10" {...register("annotationTemp.line.position")} /> :
                            <Select id="axis-position" {...register('annotationTemp.line.position')}>
                                {labels.map((label, index) => <option value={label} key={index}>{label}</option>)}
                            </Select>

                    }
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2 shrink-0" htmlFor="anno-linestyle" value="Line Style:" />
                    <Select id="anno-linestyle" {...register("annotationTemp.line.style")} >
                        <option value='none'>None</option>
                        <option value='dashed'>Dashed</option>
                        <option value='wave'>Wave</option>
                    </Select>
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2 shrink-0" htmlFor="axis-label" value="Label:" />
                    <TextInput id="axis-label" type="text" placeholder="Default Label" {...register("annotationTemp.line.label")} />
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2 shrink-0" htmlFor="anno-linecolor" value="Line Color:" />
                    <Controller
                        name="annotationTemp.line.color"
                        control={control}
                        render={({ field: { value, onChange } }) => {
                            return <PopoverPicker color={value} onChange={onChange} />;
                        }}
                    />
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2 shrink-0" htmlFor="anno-line-thickness" value="Line Thickness:" />
                    <TextInput id="anno-line-thickness" type="text" placeholder="10" {...register("annotationTemp.line.thickness")} />
                </div>
            </div>

            <div className="col-span-3">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Button onClick={handleAddClick}> Add </Button>
                </div>
            </div>

        </div>}
    </Card>

}

export default LineAnnotation