import React, { useState } from 'react'
import { Button, Checkbox, Label, Select, Tabs, TextInput, ToggleSwitch, Accordion } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import Annotation from './form/Annotation';


const ColbyChartForm = () => {
    const [switch1, setSwitch1] = useState(false);
    return (
        <>
            <Tabs style="fullWidth" className='w-full'>
                <Tabs.Item active title="General" icon={MdDashboard}>
                    <div className="w-full grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <Label className="inline mr-2" htmlFor="title" value="Title:" />
                                <TextInput id="title" type="text" placeholder="Default title" required />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <Label className="inline mr-2" htmlFor="generalXAxisSelect" value="X-Axis Dataset:" />
                                <Select id="generalXAxisSelect" required>
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>France</option>
                                    <option>Germany</option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="plotted-datasets" value="Plotted Datasets:" />
                                    <Checkbox id="plotted-datasets" defaultChecked />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <ToggleSwitch checked={switch1} label="Stacked" onChange={setSwitch1} />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="flex items-center">
                                <ToggleSwitch checked={switch1} label="Switch rows and columns" onChange={setSwitch1} />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <ToggleSwitch checked={switch1} label="Show Labels" onChange={setSwitch1} />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <ToggleSwitch checked={switch1} label="Show Legend" onChange={setSwitch1} />
                            </div>
                        </div>

                    </div>
                </Tabs.Item>
                <Tabs.Item title="X-Axis" icon={MdDashboard}>
                    <div className="w-full grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <Label className="inline mr-2" htmlFor="xMin" value="X-Min:" />
                                <TextInput id="xMin" type="number" placeholder="xMin" required />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <Label className="inline mr-2" htmlFor="xMax" value="X-Max:" />
                                <TextInput id="xMax" type="number" placeholder="xMax" required />
                            </div>
                        </div>
                    </div>
                </Tabs.Item>
                <Tabs.Item title="Y-Axis" icon={HiAdjustments}>
                    <div className="w-full grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <Label className="inline mr-2" htmlFor="yMin" value="Y-Min:" />
                                <TextInput id="yMin" type="number" placeholder="yMin" required />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <Label className="inline mr-2" htmlFor="yMax" value="Y-Max:" />
                                <TextInput id="yMax" type="number" placeholder="yMax" required />
                            </div>
                        </div>
                    </div>
                </Tabs.Item>
                <Tabs.Item title="Annotations" icon={HiClipboardList}>
                    <Annotation />
                </Tabs.Item>
                <Tabs.Item title="Style" icon={HiAdjustments}>
                    <div className="w-full grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <Label className="inline mr-2" htmlFor="style-titlefont" value="Title Font:" />
                                <TextInput id="style-titlefont" type="text" placeholder="Lora" required />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <Label className="inline mr-2" htmlFor="style-color" value="Title Color:" />
                                <TextInput id="style-color" type="color" placeholder="#007F7F" sizing="lg" required />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <Label className="inline mr-2" htmlFor="style-fontsize" value="Font Size:" />
                                <TextInput id="style-fontsize" type="text" placeholder="18" required />
                            </div>
                        </div>
                    </div>

                </Tabs.Item>
            </Tabs>
            <div className="w-full flex justify-between mt-10">
                <Button color="blue">Force Refresh</Button>
                <Button color="gray" outline>Clear Cache</Button>
                <Button color="success">Download Chart</Button>
            </div>

        </>
    );
}


export default ColbyChartForm