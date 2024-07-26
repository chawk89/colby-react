import React from 'react'
import { Card, Checkbox, Label, RangeSlider, Select, TextInput, ToggleSwitch } from 'flowbite-react';
import { useFormContext } from 'react-hook-form';

const BarFormFields = ({ datakey }) => {

  const { control, register, watch } = useFormContext()

  return (
    <>
      <div className="col-span-1 mt-4">
        <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
          <Label className="inline mr-2" htmlFor="bar-padding" value="Padding:" />
          <TextInput id="bar-padding" type="number" min="0" max="1" step="0.01" placeholder="0" {...register(`datasets.${datakey}.barPadding`)} />
        </div>
      </div>
    </>
  )
}

export default BarFormFields