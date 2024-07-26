import React from 'react'
import { Card, Checkbox, Label, RangeSlider, Select, TextInput, ToggleSwitch } from 'flowbite-react';
import { useFormContext } from 'react-hook-form';
import MarkerFormType from '../MarkerFormType';


const ScatterFormFields = ({ datakey }) => {
  const { control, register, watch } = useFormContext()
  return (
    <>
      <div className="col-span-1 mt-4">
        <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
          <Label className="inline mr-2 shrink-0" htmlFor="markerType" value="Point Style:" />
          <MarkerFormType className="w-full" datakey={datakey} />
        </div>
      </div>
      <div className="col-span-1 mt-4">
        <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
          <Label className="inline mr-2" htmlFor="line-thickness" value="Point Size:" />
          <TextInput id="line-thickness" type="number" min="1" placeholder="1" {...register(`datasets.${datakey}.pointRadius`)} />
        </div>
      </div>
    </>
  )
}

export default ScatterFormFields