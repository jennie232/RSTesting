import React, { useState, useEffect } from 'react';
import showDialog from '../components/Dialog';

export default function Page_Setting() {
    const [ exportDir, setExportDir ] = useState(localStorage.getItem('exportDir'));
    const [ logoImagePath, setLogoImagePath ] = useState(localStorage.getItem("logoImagePath"));
    const [ bloodPrefix1 , setBloodPrefix1 ] = useState(localStorage.getItem("bloodPrefix1"));
    const [ bloodPrefix2 , setBloodPrefix2 ] = useState(localStorage.getItem("bloodPrefix2"));
    const [ bloodPrefix3 , setBloodPrefix3 ] = useState(localStorage.getItem("bloodPrefix3"));
    const [ bloodPrefix4 , setBloodPrefix4 ] = useState(localStorage.getItem("bloodPrefix4"));
    const [ bloodPrefix5 , setBloodPrefix5 ] = useState(localStorage.getItem("bloodPrefix5"));
    const [ bloodValidate1 , setBloodValidate1 ] = useState(localStorage.getItem("bloodValidate1") === "1" ? true : false);
    const [ bloodValidate2 , setBloodValidate2 ] = useState(localStorage.getItem("bloodValidate2") === "1" ? true : false);
    const [ bloodValidate3 , setBloodValidate3 ] = useState(localStorage.getItem("bloodValidate3") === "1" ? true : false);
    const [ bloodValidate4 , setBloodValidate4 ] = useState(localStorage.getItem("bloodValidate4") === "1" ? true : false);
    const [ bloodValidate5 , setBloodValidate5 ] = useState(localStorage.getItem("bloodValidate5") === "1" ? true : false);
    const [ bloodExpDateFormat, setBloodExpDateFormat ] = useState(localStorage.getItem("bloodExpDateFormat"));
    const [ showIndicatorField , setShowIndicatorField ] = useState(localStorage.getItem("showIndicatorField") === "1" ? true : false);
    const [ showIndicatorFieldOnReport , setShowIndicatorFieldOnReport ] = useState(localStorage.getItem("showIndicatorFieldOnReport") === "1" ? true : false);
    const [ indicatorPrefix1 , setIndicatorPrefix1 ] = useState(localStorage.getItem("indicatorPrefix1"));
    const [ indicatorPrefix2 , setIndicatorPrefix2 ] = useState(localStorage.getItem("indicatorPrefix2"));
    const [ indicatorValidate1 , setIndicatorValidate1 ] = useState(localStorage.getItem("indicatorValidate1") === "1" ? true : false);
    const [ indicatorValidate2 , setIndicatorValidate2 ] = useState(localStorage.getItem("indicatorValidate2") === "1" ? true : false);
    const [ indicatorExpDateFormat, setIndicatorExpDateFormat ] = useState(localStorage.getItem("indicatorExpDateFormat"));
    
    useEffect(() => {
        let isMounted = true;
        window.api.getExportDir(data => {
            if(!isMounted) return;
            setExportDir(data);
        });
        window.api.getLogoImagePath(data => {
            if(!isMounted) return;
            setLogoImagePath(data);
        });
        return () => {isMounted = false;};
    }, []);

    function saveSetting(){
        const setting_2 = [];
        console.log(exportDir);
        setting_2.push({id: 1, setting_name: "exportDirectory", setting_value: exportDir});
        setting_2.push({id: 2, setting_name: "logoImageDirectory", setting_value: logoImagePath});
        setting_2.push({id: 3, setting_name: "bloodPrefix1", setting_value: bloodPrefix1});
        setting_2.push({id: 4, setting_name: "bloodPrefix2", setting_value: bloodPrefix2});
        setting_2.push({id: 5, setting_name: "bloodPrefix3", setting_value: bloodPrefix3});
        setting_2.push({id: 6, setting_name: "bloodPrefix4", setting_value: bloodPrefix4});
        setting_2.push({id: 7, setting_name: "bloodPrefix5", setting_value: bloodPrefix5});
        setting_2.push({id: 8, setting_name: "bloodValidate1", setting_value: bloodValidate1});
        setting_2.push({id: 9, setting_name: "bloodValidate2", setting_value: bloodValidate2});
        setting_2.push({id: 10, setting_name: "bloodValidate3", setting_value: bloodValidate3});
        setting_2.push({id: 11, setting_name: "bloodValidate4", setting_value: bloodValidate4});
        setting_2.push({id: 12, setting_name: "bloodValidate5", setting_value: bloodValidate5});
        setting_2.push({id: 13, setting_name: "bloodExpDateFormat", setting_value: bloodExpDateFormat});
        setting_2.push({id: 14, setting_name: "showIndicatorField", setting_value: showIndicatorField});
        setting_2.push({id: 15, setting_name: "showIndicatorFieldOnReport", setting_value: showIndicatorFieldOnReport});
        setting_2.push({id: 16, setting_name: "indicatorPrefix1", setting_value: indicatorPrefix1});
        setting_2.push({id: 17, setting_name: "indicatorPrefix2", setting_value: indicatorPrefix2});
        setting_2.push({id: 18, setting_name: "indicatorValidate1", setting_value: indicatorValidate1});
        setting_2.push({id: 19, setting_name: "indicatorValidate2", setting_value: indicatorValidate2});
        setting_2.push({id: 20, setting_name: "indicatorExpDateFormat", setting_value: indicatorExpDateFormat});
        window.api.setSetting(setting_2)
            .then(() => { showDialog("info", "Setting", "Setting saved successfully."); window.close(); })
            .catch(error => { showDialog("error", "Error", "Setting Saving Error", error); });
    }

    function getDirPath(setting){ window.api.requestDirPath({setting: setting}); }

    return (
        <div className="container-fluid pt-2 px-3">
            <div className="row justify-content-between">
                <div className="col-6"><h1>Setting</h1></div>
                <div className="col-auto px-0"><button type="button" className="btn mx-2 btn-dark">Log In</button></div>
                <div className="col-auto px-0"><button type="button" className="btn mx-2 btn-primary" onClick={()=> saveSetting()}>Save</button></div>
                <div className="col-auto px-0"><button type="button" className="btn mx-2 btn-danger text-end" onClick={()=> window.close()}>Close</button></div>
            </div>
            <div className="card mt-1">
                <div className="card-header label4" style={{paddingLeft: '10px'}}>CSV Report</div>
                <div className="card-body py-2">
                    <div className ="row">
                        <div className="col-3">
                            <label className="col-form-label label4">Export Directory:</label>
                        </div>
                        <div className="col-8">
                            <input type="text" className="form-control" value={exportDir} onChange={e=> setExportDir(e.target.value)}/>
                        </div>
                        <div className="col-1"><button type="button" className="btn btn-outline-secondary" onClick={()=>getDirPath("export")}>...</button></div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-8">
                    <div className="card mt-3">
                        <div className="card-header label4" style={{paddingLeft: '10px'}}>Barcode / QR Code Prefixes</div>
                        <div className="card-body py-2">
                            <div className ="row">
                                <div className="col-4">
                                    <label className="col-form-label label4">ID Standard</label>
                                </div>
                                <div className="col-7">
                                    <select className="form-select">
                                        <option value>Select</option>
                                        <option value="1">ISBT 128</option>
                                        <option value="2">Custom</option>
                                        <option value="3">None</option>
                                    </select>
                                </div>
                            </div>
                            <div className ="row">
                                <div className="col-4"></div>
                                <div className="col-2 mt-2 text-center">Prefix</div>
                                <div className="col-2 mt-2 text-center" style={{marginLeft: '-15px'}}>Validate</div>
                                <div className="col-4 mt-2 text-center">Date Format</div>
                            </div>
                            <div className ="row">
                                <div className="col-4">
                                    <label className="col-form-label label4">User Badge ID :</label>
                                </div>
                                <div className="col-2">
                                    <input type="text" className="form-control" value={bloodPrefix1} onChange={e=> setBloodPrefix1(e.target.value)}/>
                                </div>
                                <div className="col-1 mt-1" style={{textAlign:'center'}}>
                                    <input className="form-check-input" type="checkbox" checked={bloodValidate1} onChange={() => setBloodValidate1(!bloodValidate1)}/>
                                </div>
                            </div>
                            <div className ="row mt-1">
                                <div className="col-4">
                                    <label className="col-form-label label4">Indicator Batch ID :</label>
                                </div>
                                <div className="col-2">
                                    <input type="text" className="form-control" value={bloodPrefix2} onChange={e=> setBloodPrefix2(e.target.value)}/>
                                </div>
                                <div className="col-1 mt-1" style={{textAlign:'center'}}>
                                    <input className="form-check-input" type="checkbox" checked={bloodValidate2} onChange={() => setBloodValidate2(!bloodValidate2)}/>
                                </div>
                            </div>
                            <div className ="row mt-1">
                                <div className="col-4">
                                    <label className="col-form-label label4">Product Code :</label>
                                </div>
                                <div className="col-2">
                                    <input type="text" className="form-control" value={bloodPrefix3} onChange={e=> setBloodPrefix3(e.target.value)}/>
                                </div>
                                <div className="col-1 mt-1" style={{textAlign:'center'}}>
                                    <input className="form-check-input" type="checkbox" checked={bloodValidate3} onChange={() => setBloodValidate3(!bloodValidate3)}/>
                                </div>
                            </div>
                            <div className ="row mt-1">
                                <div className="col-4">
                                    <label className="col-form-label label4">Donor ID :</label>
                                </div>
                                <div className="col-2">
                                    <input type="text" className="form-control" value={bloodPrefix4} onChange={e=> setBloodPrefix4(e.target.value)}/>
                                </div>
                                <div className="col-1 mt-1" style={{textAlign:'center'}}>
                                    <input className="form-check-input" type="checkbox" checked={bloodValidate4} onChange={(e) => setBloodValidate4(!bloodValidate4)}/>
                                </div>
                            </div>
                            <div className ="row mt-1">
                                <div className="col-4">
                                    <label className="col-form-label label4">Blood Exp Date : </label>
                                </div>
                                <div className="col-2">
                                    <input type="text" className="form-control" value={bloodPrefix5} onChange={e=> setBloodPrefix5(e.target.value)}/>
                                </div>
                                <div className="col-1 mt-1" style={{textAlign:'center'}}>
                                    <input className="form-check-input" type="checkbox" checked={bloodValidate5} onChange={() => setBloodValidate5(!bloodValidate5)}/>
                                </div>
                                <div className="col-5">
                                    <select className="form-select" value={bloodExpDateFormat} onChange={(e) => { e.preventDefault(); setBloodExpDateFormat(e.target.value);}}>
                                        <option>Select</option>
                                        <option value="YYDDD">YYDDD</option>
                                        <option value="YYYDDD">YYYDDD</option>
                                        <option value="YYYYDDD">YYYYDDD</option>
                                        <option value="MMDDYYYY">MMDDYYYY</option>
                                        <option value="DDMMYYYY">DDMMYYYY</option>
                                        <option value="YYYYMMDD">YYYYMMDD</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="card-header label4" style={{paddingLeft: '10px'}}>Extended Code Prefixes</div>
                        <div className="card-body py-2">
                            <div className="row">
                                <div className="col-1">
                                    <input className="form-check-input" type="checkbox" checked={showIndicatorField} onChange={() => setShowIndicatorField(!showIndicatorField)}/>
                                </div>
                                <div className="col-5"><label>Include on Screen</label></div>
                                <div className="col-1">
                                    <input className="form-check-input" type="checkbox" checked={showIndicatorFieldOnReport} onChange={() => setShowIndicatorFieldOnReport(!showIndicatorFieldOnReport)}/>
                                </div>
                                <div className="col-5"><label>Include on Report</label></div>
                            </div>
                            <div className ="row">
                                <div className="col-4"></div>
                                <div className="col-2 mt-2 text-center">Prefix</div>
                                <div className="col-2 mt-2 text-center" style={{marginLeft: '-15px'}}>Validate</div>
                                <div className="col-4 mt-2 text-center">Date Format</div>
                            </div>
                            <div className ="row">
                                <div className="col-4">
                                    <label className="col-form-label label4">Indicator Exp Date</label>
                                </div>
                                <div className="col-2">
                                    <input type="text" className="form-control" value={indicatorPrefix1} onChange={e=> setIndicatorPrefix1(e.target.value)}/>
                                </div>
                                <div className="col-1 mt-1" style={{textAlign:'center'}}>
                                    <input className="form-check-input" type="checkbox" checked={indicatorValidate1} onChange={() => setIndicatorValidate1(!indicatorValidate1)}/>
                                </div>
                                <div className="col-5">
                                    <select className="form-select" value={indicatorExpDateFormat} onChange={(e) => setIndicatorExpDateFormat(e.target.value)}>
                                        <option>Select</option>
                                        <option value="YYDDD">YYDDD</option>
                                        <option value="YYYDDD">YYYDDD</option>
                                        <option value="YYYYDDD">YYYYDDD</option>
                                        <option value="MMDDYYYY">MMDDYYYY</option>
                                        <option value="DDMMYYYY">DDMMYYYY</option>
                                        <option value="YYYYMMDD">YYYYMMDD</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    </select>
                                </div>
                            </div>
                            <div className ="row mt-1">
                                <div className="col-4">
                                    <label className="col-form-label label4">Indicator Cat. No.</label>
                                </div>
                                <div className="col-2">
                                    <input type="text" className="form-control" value={indicatorPrefix2} onChange={e=> setIndicatorPrefix2(e.target.value)}/>
                                </div>
                                <div className="col-1 mt-1" style={{textAlign:'center'}}>
                                    <input className="form-check-input" type="checkbox" checked={indicatorValidate2} onChange={() => setIndicatorValidate2(!indicatorValidate2)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card mt-3">
                        <div className="card-header label4" style={{paddingLeft: '10px'}}>Factory Setting</div>
                        <div className="card-body py-2">
                            <div>
                                <label className="col-form-label label4">Nominal Dose (Gy):</label>
                            </div>
                            <div className="mt-1">
                                <input type="text" className="form-control"/>
                            </div>
                            <div>
                                <label className="col-form-label label4">Cycle Time (seconds):</label>
                            </div>
                            <div className="mt-1">
                                <input type="text" className="form-control"/>
                            </div>
                            <div>
                                <label className="col-form-label label4">Minimum Elapsed Time:</label>
                            </div>
                            <div className="mt-1">
                                <input type="text" className="form-control"/>
                            </div>
                            <div>
                                <label className="col-form-label label4">Maximum Elapsed Time:</label>
                            </div>
                            <div className="mt-1">
                                <input type="text" className="form-control"/>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-2">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                        </div>
                        <div className="col-10"><label>Strip 2nd User ID Prefix</label></div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-2">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                        </div>
                        <div className="col-10"><label>Validate Barcodes</label></div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-2">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                        </div>
                        <div className="col-10"><label>Auto Print</label></div>
                    </div>
                </div>
            </div>
            <div className="card mt-3">
                <div className="card-header label4" style={{paddingLeft: '10px'}}>Institution Logo</div>
                <div className="card-body py-2">
                    <div className ="row">
                        <div className="col-3">
                            <label className="col-form-label label4">Logo Image File Name:</label>
                        </div>
                        <div className="col-8">
                            <input type="text" className="form-control" value={logoImagePath} onChange={e=> setLogoImagePath(e.target.value)}/>
                        </div>
                        <div className="col-1"><button type="button" className="btn btn-outline-secondary" onClick={()=>getDirPath("logoImage")}>...</button></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
