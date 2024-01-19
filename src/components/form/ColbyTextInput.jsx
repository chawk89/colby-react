import React, { useState } from 'react'
import PassiveTextInput from './PassiveTextInput';
import { Controller } from "react-hook-form"

const ColbyTextInput = ({ name, control, ...rest }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => {
                return <PassiveTextInput {...rest}  value={value} onChange={onChange} />
            }}
        />
    )
}

export default ColbyTextInput