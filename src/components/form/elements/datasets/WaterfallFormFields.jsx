import React from 'react'
import { Card, Checkbox, Label, RangeSlider, Select, TextInput, ToggleSwitch } from 'flowbite-react';
import { useFormContext } from 'react-hook-form';



const WaterfallFormFields = ({ datakey }) => {

  const { control, register, watch } = useFormContext()
  return (
    <>
      <div className="col-span-1 mt-4">
        <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
          <Label className="inline mr-2 shrink-0" htmlFor="markertype" value="Marker Type:" />
          <Select className="w-full" {...register(`datasets.${datakey}.markertype`)}>
            <option value={'triangle'}>Triangle</option>
            <option value={'square'}>Square</option>
            <option value={'point'}>Point</option>
          </Select>
        </div>
      </div>
    </>
  )
}

export default WaterfallFormFields