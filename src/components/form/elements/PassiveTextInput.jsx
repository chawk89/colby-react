import React, { useState } from 'react'
import {  TextInput } from 'flowbite-react';

const PassiveTextInput = ({ value, onChange, ...rest }) => {
    const [val, setVal] = useState(value)
    return <TextInput value={val} onChange={(e) => setVal(e.target.value)} onBlur={onChange} {...rest} />
}

export default PassiveTextInput