import React from 'react'
import { Select } from 'flowbite-react';
import { useFormContext } from 'react-hook-form';


const MarkerFormType = ({ datakey, ...rest }) => {
    const { register } = useFormContext()
    return (
        <Select {...rest} {...register(`datasets.${datakey}.markerType`)}  >
            <option value={'circle'} >Circle</option>
            <option value={'cross'} >Cross</option>
            <option value={'crossRot'} >CrossRot</option>
            <option value={'dash'} >Dash</option>
            <option value={'line'} >Line</option>
            <option value={'rect'} >Rect</option>
            <option value={'rectRounded'} >RectRounded</option>
            <option value={'rectRot'} >RectRot</option>
            <option value={'star'} >Star</option>
            <option value={'triangle'} >Triangle</option>
        </Select>
    )
}

export default MarkerFormType