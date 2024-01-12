import React, { useState } from 'react'
import { Accordion, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'

const Annotation = () => {
    const [switch1, setSwitch1] = useState(false);
    const [switch2, setSwitch2] = useState(false);
    const [switch3, setSwitch3] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <ToggleSwitch checked={switch1} label="Line Annotation" onChange={setSwitch1} />
                {switch1 && <div className="w-full grid grid-cols-3 gap-3 my-4 p-2">
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="generalXAxisSelect" value="Axis:" />
                            <Select id="generalXAxisSelect" required>
                                <option>X</option>
                                <option>Y</option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="axis-position" value="Axis Position:" />
                            <TextInput id="axis-position" type="text" placeholder="10" required />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="anno-linestyle" value="Line Style:" />
                            <Select id="anno-linestyle" required>
                                <option>None</option>
                                <option>Dashed</option>
                                <option>Wave</option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="anno-linecolor" value="Line Color:" />
                            <TextInput id="anno-linecolor" type="color" placeholder="10" required />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="anno-line-thickness" value="Line Thickness:" />
                            <TextInput id="anno-line-thickness" type="text" placeholder="10" required />
                        </div>
                    </div>

                </div>
                }
            </div>
            <div>
                <ToggleSwitch checked={switch2} label="Box Annotation" onChange={setSwitch2} />
            </div>
            <div>
                <ToggleSwitch checked={switch3} label="Label Annotation" onChange={setSwitch3} />
            </div>
            <div>
                <ToggleSwitch checked={switch2} label="Arrow Annotation" onChange={setSwitch2} />
            </div>
        </div>
    );

}

export default Annotation