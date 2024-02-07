import React, { useEffect, useState } from 'react'
import { Button, Card, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useFormContext } from 'react-hook-form';
import { PopoverPicker } from '../../common/PopoverPicker';
import { useChartContext } from '../../../hooks/useChartContext';
import { getNewId } from '../../../utils/utils';




const LabelAnnotation = () => {

    const { state, onAddAnnotation } = useChartContext()
    const { control, register, watch, setValue } = useFormContext()
    const labelEnabled = watch('annotationTemp.label.enabled')
    const [triggerFlag, setTriggerFlag] = useState(false)

    const handleAddClick = () => {
        setTriggerFlag(true)
        const type = 'label'
        onAddAnnotation({
            type, id: `${type}-${getNewId()}`
        })
    }

    useEffect(() => {
        if (triggerFlag) {
            setValue('annotationTemp.label', state.forms.annotationTemp.label)
            setTriggerFlag(false)
        }
    }, [
        state.forms.annotationTemp.label,
        triggerFlag
    ])
    console.log('[labelEnabled]', labelEnabled)

    return (
        <Card className="w-full">
            <Controller
                name="annotationTemp.label.enabled"
                control={control}
                render={({ field: { value, onChange } }) => {
                    return <ToggleSwitch label="Label Annotation" checked={value} onChange={onChange} />
                }}
            />
            {labelEnabled &&
                <div className="w-full grid grid-cols-3 gap-3 my-4 p-2">
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="index-of-dimension" value="Index of dimension:" />
                            <TextInput id="index-of-dimension" type="text" placeholder="10" {...register("annotationTemp.label.nindex")} />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="series-name" value="Series Name:" />
                            <TextInput id="series-name" type="text" placeholder="10" {...register("annotationTemp.label.name")} />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="series-name" value="Caption:" />
                            <TextInput id="series-name" type="text" placeholder="10" {...register("annotationTemp.label.caption")} />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="style-color" value="Color:" />
                            <Controller
                                name="annotationTemp.label.color"
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
                            <TextInput id="annotation-label-fontName" type="text" placeholder="Lora" {...register('annotationTemp.label.fontName')} />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="annotation-label-fontSize" value="Font Size:" />
                            <TextInput id="annotation-label-fontSize" type="number" placeholder="10" {...register('annotationTemp.label.fontSize')} />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="annotation-label-anchor" value="Anchor:" />
                            <Select id="annotation-label-anchor" {...register('annotationTemp.label.anchor')}>
                                <option value={1}>true</option>
                                <option value={0}>false</option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Button onClick={handleAddClick}> Add </Button>
                        </div>
                    </div>
                </div>
            }
        </Card>
    );

}

export default LabelAnnotation 