import React, { useEffect, useState } from 'react'
import { Button, Card, Label, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useFormContext } from 'react-hook-form';
import { generateAnnotationId } from '../../../utils/utils';
import { useChartContext } from '../../../hooks/useChartContext';

const BoxAnnotation = () => {

    const { state, onAddAnnotation } = useChartContext()
    const { control, register, watch, setValue } = useFormContext()
    const boxEnabled = watch('annotationTemp.box.enabled')
    const [triggerFlag, setTriggerFlag] = useState(false)

    const handleAddClick = () => {
        setTriggerFlag(true)
        const type = 'box'
        onAddAnnotation({
            type, id: generateAnnotationId(type)
        })
    }

    useEffect(() => {
        if (triggerFlag) {
            setValue('annotationTemp.box', state.forms.annotationTemp.box)
            setTriggerFlag(false)
        }
    }, [
        state.forms.annotationTemp.box,
        triggerFlag
    ])

    return (
        <Card className="w-full">
            <Controller
                name="annotationTemp.box.enabled"
                control={control}
                render={({ field: { value, onChange } }) => {
                    return <ToggleSwitch label="Box Annotation" checked={value} onChange={onChange} />
                }}
            />

            {boxEnabled && <div className="w-full grid grid-cols-4 gap-3 my-4 p-2">
                <div className="col-span-4">
                    <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Label className="inline mr-2" htmlFor="annotationBoxLabel" value="Label:" />
                        <TextInput id="annotationBoxLabel" type="text" placeholder="10" {...register('annotationTemp.box.label')} />
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Label className="inline mr-2" htmlFor="annotationBoxXMin" value="X Min:" />
                        <TextInput id="annotationBoxXMin" type="text" placeholder="10" {...register('annotationTemp.box.xMin')} />
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Label className="inline mr-2" htmlFor="annotationBoxXMax" value="X Max:" />
                        <TextInput id="annotationBoxXMax" type="text" placeholder="10" {...register('annotationTemp.box.xMax')} />
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Label className="inline mr-2" htmlFor="annotationBoxXMin" value="Y Min:" />
                        <TextInput id="annotationBoxYMin" type="text" placeholder="10" {...register('annotationTemp.box.yMin')} />
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Label className="inline mr-2" htmlFor="annotationBoxXMin" value="Y Max:" />
                        <TextInput id="annotationBoxYMax" type="text" placeholder="10" {...register('annotationTemp.box.yMax')} />
                    </div>
                </div>

                <div className="col-span-1">
                    <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Button onClick={handleAddClick}> Add </Button>
                    </div>
                </div>

            </div>}
        </Card>
    );

}

export default BoxAnnotation