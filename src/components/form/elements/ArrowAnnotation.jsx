import React, { useEffect, useState } from 'react'
import { Button, Card, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useFormContext } from 'react-hook-form';
import { useChartContext } from '../../../hooks/useChartContext';
import { PopoverPicker } from '../../common/PopoverPicker';
import { getNewId } from '../../../utils/utils';


const ArrowAnnotation = () => {
    const { state, onAddAnnotation } = useChartContext()
    const { control, register, watch, setValue } = useFormContext()
    const arrowEnabled = watch('annotationTemp.arrow.enabled')
    const [triggerFlag, setTriggerFlag] = useState(false)

    const handleAddClick = () => {
        setTriggerFlag(true)
        const type = 'arrow'
        onAddAnnotation({
            type, id: `${type}-${getNewId()}`
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
                        <Label className="inline mr-2 shrink-0" htmlFor="arrow-xMin" value="X Min:" />
                        <TextInput id="arrow-xMin" type="text" placeholder="10" {...register("annotationTemp.arrow.xMin")} />
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="flex items-center">
                        <Label className="inline mr-2 shrink-0" htmlFor="arrow-XMax" value="X Max:" />
                        <TextInput id="arrow-XMax" type="text" placeholder="10" {...register("annotationTemp.arrow.xMax")} />
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center">
                        <Label className="inline mr-2 shrink-0" htmlFor="arrow-xMin" value="Y Min:" />
                        <TextInput id="arrow-xMin" type="text" placeholder="10" {...register("annotationTemp.arrow.yMin")} />
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="flex items-center">
                        <Label className="inline mr-2 shrink-0" htmlFor="arrow-XMax" value="Y Max:" />
                        <TextInput id="arrow-XMax" type="text" placeholder="10" {...register("annotationTemp.arrow.yMax")} />
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