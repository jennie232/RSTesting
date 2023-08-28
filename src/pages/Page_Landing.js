import React, { useState, useEffect } from 'react';
import showDialog from '../components/Dialog';
import EnhancedTable from '../components/Table';
import moment from 'moment';

const statusIcon_grey = 'bi bi-square-fill color-grey';
const statusIcon_green = 'bi bi-square-fill color-green';
const statusIcon_red = 'bi bi-square-fill color-red';
const dateFormat = {
    'Select': ".*",
    'YYDDD': "[0-9]{2}[0-3][0-9]{2}$",
    'YYYDDD': "[0-9]{3}[0-3][0-9]{2}$",
    'YYYYDDD': "[12][0-9]{3}[0-3][0-9]{2}$",
    'MMDDYYYY': "(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[0-9]{4}$",
    'DDMMYYYY': "(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])[0-9]{4}$",
    'YYYYMMDD': "[12][0-9]{3}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$",
    'MM/DD/YYYY': "(0[1-9]|1[012])/(0[1-9]|[12][0-9]|3[01])/[0-9]{4}$",
    'DD/MM/YYYY': "(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[0-9]{4}$"
}

var stopWatch;
function padTo2Digits(num) {return num.toString().padStart(2, '0');}
function msToTime(ms){
    var sec = Math.floor(ms / 1000);
    var min = Math.floor(sec / 60);
    var hr = Math.floor(min / 60);
    sec = sec % 60;
    min = min % 60;
    hr = hr % 24;
    return `${padTo2Digits(hr)}:${padTo2Digits(min)}:${padTo2Digits(sec)}`;
}

export default function Page_Landing() {
    const [setting, setSetting] = useState(null);
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState([]);

    // USB-201
    const [hvOn, setHvOn ] = useState(false);
    const [beepOn, setBeepOn ] = useState(false);
    const [faultOn, setFaultOn ] = useState(false);
    const [lampOn, setLampOn] = useState(false);

    // Settings
    const [ exportDir, setExportDir ] = useState("");
    const [ logoImagePath, setLogoImagePath ] = useState("");
    const [ bloodPrefix1 , setBloodPrefix1 ] = useState("");
    const [ bloodPrefix2 , setBloodPrefix2 ] = useState("");
    const [ bloodPrefix3 , setBloodPrefix3 ] = useState("");
    const [ bloodPrefix4 , setBloodPrefix4 ] = useState("");
    const [ bloodPrefix5 , setBloodPrefix5 ] = useState("");
    const [ bloodValidate1 , setBloodValidate1 ] = useState("0");
    const [ bloodValidate2 , setBloodValidate2 ] = useState("0");
    const [ bloodValidate3 , setBloodValidate3 ] = useState("0");
    const [ bloodValidate4 , setBloodValidate4 ] = useState("0");
    const [ bloodValidate5 , setBloodValidate5 ] = useState("0");
    const [ bloodExpDateFormat, setBloodExpDateFormat ] = useState("");
    const [ showIndicatorField , setShowIndicatorField ] = useState("0");
    const [ showIndicatorFieldOnReport , setShowIndicatorFieldOnReport ] = useState("0");
    const [ indicatorPrefix1 , setIndicatorPrefix1 ] = useState("");
    const [ indicatorPrefix2 , setIndicatorPrefix2 ] = useState("");
    const [ indicatorValidate1 , setIndicatorValidate1 ] = useState("0");
    const [ indicatorValidate2 , setIndicatorValidate2 ] = useState("0");
    const [ indicatorExpDateFormat, setIndicatorExpDateFormat ] = useState("");

    // User Input
    const [userId, setUserId] = useState("");
    const [productCode, setProductCode] = useState("");
    const [donorId, setDonorId] = useState("");
    const [bloodExp, setBloodExp] = useState("");
    const [notes, setNotes] = useState("");
    const [indicatorBatchId, setIndicatorBatchId] = useState("");
    const [indicatorExp, setIndicatorExp] = useState("");
    const [indicatorCat, setIndicatorCat] = useState("");

    // Timer
    const [started, setStarted] = useState(false);
    const [startTime, setStartTime] = useState("00:00:00");
    const [elapsedMilisec, setElapsedMilisec] = useState(0);
    const [elapsedTime, setElapsedTime] = useState("00:00:00");
    const [stopTime, setStopTime] = useState("00:00:00");

    useEffect(() => {
        let isMounted = true;
        if(setting === null) window.api.requestSetting();
        window.api.getSetting(data => {
          if(!isMounted) return;
          setSetting(data);
          try{
            storeSetting("exportDir", data[0].dataValues.setting_value || "", setExportDir);
            storeSetting("logoImagePath", data[1].dataValues.setting_value || "", setLogoImagePath);
            storeSetting("bloodPrefix1", data[2].dataValues.setting_value || "", setBloodPrefix1);
            storeSetting("bloodPrefix2", data[3].dataValues.setting_value || "", setBloodPrefix2);
            storeSetting("bloodPrefix3", data[4].dataValues.setting_value || "", setBloodPrefix3);
            storeSetting("bloodPrefix4", data[5].dataValues.setting_value || "", setBloodPrefix4);
            storeSetting("bloodPrefix5", data[6].dataValues.setting_value || "", setBloodPrefix5);
            storeSetting("bloodValidate1", data[7].dataValues.setting_value || "0", setBloodValidate1);
            storeSetting("bloodValidate2", data[8].dataValues.setting_value || "0", setBloodValidate2);
            storeSetting("bloodValidate3", data[9].dataValues.setting_value || "0", setBloodValidate3);
            storeSetting("bloodValidate4", data[10].dataValues.setting_value || "0", setBloodValidate4);
            storeSetting("bloodValidate5", data[11].dataValues.setting_value || "0", setBloodValidate5);
            storeSetting("bloodExpDateFormat", data[12].dataValues.setting_value || "Select", setBloodExpDateFormat);
            storeSetting("showIndicatorField", data[13].dataValues.setting_value || "0", setShowIndicatorField);
            storeSetting("showIndicatorFieldOnReport", data[14].dataValues.setting_value || "0", setShowIndicatorFieldOnReport);
            storeSetting("indicatorPrefix1", data[15].dataValues.setting_value || "", setIndicatorPrefix1);
            storeSetting("indicatorPrefix2", data[16].dataValues.setting_value || "", setIndicatorPrefix2);
            storeSetting("indicatorValidate1", data[17].dataValues.setting_value || "0", setIndicatorValidate1);
            storeSetting("indicatorValidate2", data[18].dataValues.setting_value || "0", setIndicatorValidate2);
            storeSetting("indicatorExpDateFormat", data[19].dataValues.setting_value || "Select", setIndicatorExpDateFormat);
          }catch{}
        });

        window.api.errorStatusUpdate(data => {
            if(!isMounted) return;
            setHvOn(data.HvOn < 1 ? false : true);
            setBeepOn(data.BeepOn < 1 ? false : true);
            setFaultOn(data.FaultOn < 1 ? false : true);
            setLampOn(data.LampOn < 1 ? false : true);
        });
        return () => {isMounted = false;};
    }, [setting]);

    useEffect(() => {
        let isMounted = true;
        if(!isMounted) return;
        if(hvOn){
            if(!started) startStopWatch();
            else resumeStopWatch();
        }else{
            if(started) pauseStopWatch();
        }
        return () => {isMounted = false;};
    }, [hvOn]);

    function storeSetting(setting_name, setting_value, set_function){
        localStorage.setItem(setting_name, setting_value);
        set_function(setting_value);
    }

    function addTOList(e){
        e.preventDefault();
        const isInvalid = document.getElementsByClassName("is-invalid").length !== 0;
        if(isInvalid){
            showDialog("info", "Invalid Barcode", "Incorrect barcode. Please rescan barcode before proceeding.");
        }else{
            const isDuplicate = rows.filter(r => r.indicator_id === indicatorBatchId).length !== 0;
            if(isDuplicate){
                showDialog("info", "Duplicate", "Incorrect barcode. Please rescan barcode before proceeding.");
                return;
            }
            const user_id = userId;
            const indicator_id = indicatorBatchId;
            const product_code = productCode;
            const donor_id = donorId;
            const blood_exp = bloodExp;
            const ind_exp = indicatorExp;
            const ind_ok = "No";
            setRows([...rows, { user_id, indicator_id, product_code, donor_id, blood_exp, notes, ind_exp, ind_ok }]);
            emptyInputField();
        }
    }

    const deleteRow = () => {
        for(var i=selected.length-1;i>=0;i--){ rows.splice(selected[i],1); }
        setSelected([]);
    };

    const getSelected = (selected) => { setSelected(selected.sort((a,b) => a - b)); }

    const validatePrefix = (e, value, setfunction, isValidate, regex, minLength) =>{
        setfunction(value);
        if(isValidate === "1"){
            if(!new RegExp(regex).test(value) && value.length > minLength) e.target.classList.add('is-invalid');
            else e.target.classList.remove('is-invalid');
        }
    }

    const validateProductCode = (e, value, setfunction) => {
        setfunction(value);
        if(!/^[A-Za-z][A-Za-z0-9]*$/.test(value.replace(bloodPrefix3, ""))) e.target.classList.add('is-invalid');
        else e.target.classList.remove('is-invalid');
    }

    const emptyInputField = () => { setUserId(""); setProductCode(""); setDonorId(""); setBloodExp(""); setNotes(""); setIndicatorBatchId(""); setIndicatorExp(""); setIndicatorCat("");}

    const startStopWatch = () => {
        setStarted(true);
        var now = Date.now();
        setStartTime(new Date(now).toLocaleTimeString());
        stopWatch = setInterval(function(){ 
            const elapsed = Date.now(); 
            setElapsedMilisec(elapsed-now);
            setElapsedTime(msToTime(elapsed-now));
        }, 1000)
    }

    const pauseStopWatch = () => { clearInterval(stopWatch); setStopTime(new Date().toLocaleTimeString()) }
    const resumeStopWatch = () => { 
        const now = Date.now();
        stopWatch = setInterval(function(){ 
            const elapsed = Date.now(); 
            setElapsedMilisec(elapsedMilisec + (elapsed-now));
            setElapsedTime(msToTime(elapsedMilisec + (elapsed-now)));
        }, 1000) 
    }



    return (
        <div className="row container-fluid">
            <div className="col-3 pt-3" style={{height: '100vh', backgroundColor: '#e1eaf6'}}>
                <form id="info-form" onSubmit={(e) => addTOList(e)}>
                <div className ="row container-fluid">
                    <div className="col-4">
                        <label className="col-form-label label1">User ID</label>
                    </div>
                    <div className="col-8">
                        <input type="text" className="form-control" value={userId} onChange={e=> validatePrefix(e, e.target.value, setUserId, bloodValidate1,"^"+bloodPrefix1+".*", bloodPrefix1.length)} required/>
                    </div>
                </div>
                <div className="card mt-3">
                    <div className="card-header label2" style={{paddingLeft: '10px'}}>Blood Bag Data</div>
                    <div className="card-body pt-2">
                        <div className ="row">
                            <div className="col-5">
                                <label className="col-form-label label2">Product Code</label>
                            </div>
                            <div className="col-7">
                                <input type="text" className="form-control" value={productCode} onChange={e=> bloodValidate3 === "1" ? validatePrefix(e, e.target.value, setProductCode, bloodValidate3,"^"+bloodPrefix3+"[A-Za-z][A-Za-z0-9]*$", bloodPrefix3.length) : validateProductCode(e, e.target.value, setProductCode)} maxLength={bloodValidate3 === "1" ? bloodPrefix3.length+5 : 5} required/>
                            </div>
                        </div>
                        <div className ="row mt-2">
                            <div className="col-5">
                                <label className="col-form-label label2">Donor ID</label>
                            </div>
                            <div className="col-7">
                                <input type="text" className="form-control" value={donorId} onChange={e=> validatePrefix(e, e.target.value, setDonorId, bloodValidate4,"^"+bloodPrefix4+".*", bloodPrefix4.length)} required/>
                            </div>
                        </div>
                        <div className ="row mt-2">
                            <div className="col-6">
                                <label className="col-form-label label2">Blood Exp Date</label>
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" value={bloodExp} onChange={e=> validatePrefix(e, e.target.value, setBloodExp, bloodValidate5,"^"+bloodPrefix5+dateFormat[bloodExpDateFormat], bloodPrefix5.length)} required/>
                            </div>
                        </div>
                        <div>
                            <label className="col-form-label label2">Notes (optional)</label>
                        </div>
                        <div className="mt-1">
                            <input type="text-area" className="form-control" value={notes} onChange={e=> setNotes(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className="card mt-3">
                    <div className="card-header label2" style={{paddingLeft: '10px'}}>Irradiation Indicator</div>
                    <div className="card-body pt-1">
                        <div>
                            <label className="col-form-label label3">Indicator Batch ID</label>
                        </div>
                        <div className="mt-1">
                            <input type="text-area" className="form-control" value={indicatorBatchId} onChange={e=> validatePrefix(e, e.target.value, setIndicatorBatchId, bloodValidate2,"^"+bloodPrefix2+".*", bloodPrefix2.length)} required/>
                        </div>
                        {showIndicatorField && showIndicatorField === "1" ? <>
                        <div className ="row mt-2">
                            <div className="col-6">
                                <label className="col-form-label label3">Indicator Exp Date</label>
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" value={indicatorExp} onChange={e=> validatePrefix(e, e.target.value, setIndicatorExp, indicatorValidate1,"^"+indicatorPrefix1+dateFormat[indicatorExpDateFormat], indicatorPrefix1.length)} required/>
                            </div>
                        </div>
                        <div className ="row mt-2">
                            <div className="col-6">
                                <label className="col-form-label label3">Indicator Cat. No</label>
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" value={indicatorCat} onChange={e=> validatePrefix(e, e.target.value, setIndicatorCat, indicatorValidate2,"^"+indicatorPrefix2+".*", indicatorPrefix2.length)} required/>
                            </div>
                        </div></>: ""}
                    </div>
                </div>
                <div className="card mt-3">
                    <div className="card-header label2" style={{paddingLeft: '10px'}}>Timer</div>
                    <div className="card-body pt-1">
                        <div className ="row mt-1">
                            <div className="col-7"><label className="label4">Start Time</label></div>
                            <div className="col-5"><label className="label4">{startTime}</label></div>
                        </div>
                        <div className ="row mt-1">
                            <div className="col-7"><label className="label4">Elapsed Time (Runtime)</label></div>
                            <div className="col-5"><label className="label4">{elapsedTime}</label></div>
                        </div>
                        <div className ="row mt-1">
                            <div className="col-7"><label className="label4">Stop Time</label></div>
                            <div className="col-5"><label className="label4">{stopTime}</label></div>
                        </div>
                    </div>
                </div>
                {/* <div className="card mt-3">
                    <div className="card-header label2" style={{paddingLeft: '10px'}}>Irradiation Status</div>
                    <div className="card-body pt-1">
                        <div className ="row mt-1">
                            <div className="col-4"><label className="label4">Cycle Started</label></div>
                            <div className="col-2"><i className={statusIcon_grey}></i></div>
                            <div className="col-5"><label className="label4">Cycle Complete</label></div>
                            <div className="col-1"><i className="bi bi-square-fill color-grey"></i></div>
                        </div>
                        <div className ="row mt-1">
                            <div className="col-4"><label className="label4">High Voltage</label></div>
                            <div className="col-2"><i className={!hvOn ? statusIcon_grey : statusIcon_green}></i></div>
                            <div className="col-5"><label className="label4">Fault</label></div>
                            <div className="col-1"><i className={!faultOn ? statusIcon_grey : statusIcon_red}></i></div>
                        </div>
                        <div className ="row mt-1">
                            <div className="col-4"><label className="label4">Lamp</label></div>
                            <div className="col-2"><i className={!lampOn ? statusIcon_grey : statusIcon_green}></i></div>
                            <div className="col-5"><label className="label4">Beep</label></div>
                            <div className="col-1"><i className={!beepOn ? statusIcon_grey : statusIcon_green}></i></div>
                        </div>
                    </div>
                </div> */}
                <p>v.{process.env.REACT_APP_VERSION}</p>
                </form>
            </div>
            <div className="col-9" style={{height: '100vh', backgroundColor: 'lightgrey'}}>
                <div className="row" style={{ backgroundColor: 'white'}}>
                    {!hvOn ? <></> : <div className="col-2 warning blink">X-RAYS ON</div> }
                    {!beepOn ? <></> : <div className="col-3 warning blink">CONDITIONING ON</div> }
                    {!faultOn ? <></> : <div className="col-4 warning blink">FAULT DETECTED DURING CYCLE</div> }
                    {!lampOn ? <></> : <div className="col-3 warning blink">NO DEVICE CONNECTED</div> }
                </div>
                <div className="row pt-2 pb-2" style={{ backgroundColor: '#e6e6fa'}}>
                    <input type="submit" className="col btn btn-light" form="info-form" value="Add To List"/>
                    <button type="button" className="col btn btn-light">Save</button>
                    <button type="button" className="col btn btn-light">Turn Off Conditioning</button>
                    <button type="button" className="col btn btn-light">Reset</button>
                    <button type="button" className="col btn btn-light">Cycle Incomplete</button>
                </div>
                <div className="row pt-1">
                    <EnhancedTable rows={rows} deleteRow={deleteRow} selected={selected} setSelected={getSelected} showIndicatorField={showIndicatorField}></EnhancedTable>
                </div>
            </div>
        </div>
    )
}
