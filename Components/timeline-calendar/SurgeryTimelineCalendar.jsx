import moment from "moment-timezone";
import { useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";

const SurgeryTimelineCalendar = ({
  surgeryAppointments,
  setReserve,
  setClinic,
  setReservedTimeModal,
  setDocumentId,
  setDoctorId,
  setVisitTime,
  setGetInfoLoading,
  getInfoLoading,
  documentId,
  setPatientId,
  setSurgeryAppointmentInfoModal,
  setReception,
}) => {
  const [infoLoading, setInfoLoading] = useState(false);

  const reserveHandler = (clinicId, doctorId, visitTime) => {
    setReserve(true);
    setClinic(clinicId);
    setDoctorId(doctorId);
    setVisitTime(visitTime);
  };

  const showReservedHandler = (documentId, patientId, reception) => {
    // setReservedTimeModal(true);
    setDocumentId(documentId);
    setGetInfoLoading(true);
    setPatientId(patientId);
    setSurgeryAppointmentInfoModal(true);
    setReception(reception);
    setInfoLoading(true);
  };

 

  return (
    <div className="main-timeline2 relative  border-l border-r border-gray-200 rounded-cs">
      <tr className="absolute top-12 bottom-0 right-[14.5%] w-0 border-dashed border   -z-50 " />
      <tr className="absolute top-0 bottom-0 right-[26.3%] w-0 border-dashed border  -z-50 " />
      <tr className="absolute top-0 bottom-0 right-[38.1%] w-0 border-dashed border  -z-50 " />
      <tr className="absolute top-0 bottom-0 right-[49.9%] w-0 border-dashed border -z-50 " />
      <tr className="absolute top-0 bottom-0 right-[61.7%] w-0 border-dashed border  -z-50 " />
      <tr className="absolute top-0 bottom-0 right-[73.5%] w-0 border-dashed border  -z-50 " />
      <tr className="absolute top-0 bottom-0 right-[85.3%] w-0 border-dashed border  -z-50 " />
      <tr className="absolute top-12 bottom-0 right-[97.1%] w-0 border-dashed border  -z-50 " />
      {/* 0 */}
      <div className="grid-row-1 border-b">
        <div className="a  border-l"></div>
        <div className="b flex items-center text-sm pr-3  border-l">پزشکان</div>
        <div className="c w-full ">
          <div className="h-full  px-11">
            <div className="h-full  flex items-center justify-around text-sm leading-4">
              <span className="">08:00 - 10:00</span>
              <span className="">10:00 - 12:00</span>
              <span className="">12:00 - 14:00</span>
              <span className="">14:00 - 16:00</span>
              <span className="">16:00 - 18:00</span>
              <span className="">18:00 - 20:00</span>
              <span className="">20:00 - 21:00</span>
            </div>
          </div>
        </div>
      </div>

      {surgeryAppointments &&
        surgeryAppointments.map((appointment) => {
          return (
            <div key={appointment.id} className="grid-row-1 border-b">
              <div className="r relative border-l min-h-[80px]">
                <span className="absolute  text-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap -rotate-90">
                  {appointment.title}
                </span>
              </div>
              <div className="flex flex-col justify-center text-xs leading-4 gap-y-[26px] py-4 border-l">
                {appointment.doctor.map((doctor) => {
                  if (doctor.days.length === 0) {
                    return "";
                  } else {
                    return (
                      <span key={doctor.id} className="py-2 pr-3">
                        {doctor.name}
                      </span>
                    );
                  }
                })}
              </div>
              <div className="flex flex-col gap-y-[26px] py-4 px-5 w-full">
                {appointment.doctor.map((doctor) => {
                  if (doctor.days.length === 0) {
                    return "";
                  } else {
                    return (
                      <div key={doctor.id} className="">
                        {doctor.days.map((day) => {
                          // for (var i = 0; i < day.times.length; i++) {
                          //   array1.push(i);
                          // }


                          const array1 = new Array();
                          const array2 = new Array();

                        

                          let doctorStartHour1 =
                            day.times[0].start.split(":")[0];
                          let doctorStartMin1 =
                            day.times[0].start.split(":")[1];
                          let doctorStart1 = Number(
                            day.times[0].start.split(":")[0]
                          );
                          let doctorEnd1 =
                            Number(day.times[0].end.split(":")[0]) + 0.1;
                          let dvs = doctor.dv.find((dv) => dv.key === "DVS");
                          let appointment_time = Number(dvs.value);
                          const length1 =
                            (doctorEnd1 - doctorStart1) /
                            ((appointment_time * (doctorEnd1 - doctorStart1)) /
                              ((doctorEnd1 - doctorStart1) * 60));

                          let doctorStartHour2 =
                            day.times[1]?.start.split(":")[0];
                          let doctorStartMin2 =
                            day.times[1]?.start.split(":")[1];
                          let doctorStart2 = Number(
                            day.times[1]?.start.split(":")[0]
                          );
                          let doctorEnd2 =
                            Number(day.times[1]?.end.split(":")[0]) + 0.1;
                          const length2 =
                            (doctorEnd2 - doctorStart2) /
                            ((appointment_time * (doctorEnd2 - doctorStart2)) /
                              ((doctorEnd2 - doctorStart2) * 60));

                          for (var i = 0; i < length1; i++) {
                            array1.push(
                              moment(
                                `${doctorStartHour1}:${doctorStartMin1}:00`,
                                "HH:mm:ss"
                              )
                                .add(i * appointment_time, "minutes")
                                .format("HH:mm:ss")
                            );
                          }
                          for (var i = 0; i < length2; i++) {
                            array2.push(
                              moment(
                                `${doctorStartHour2}:${doctorStartMin2}:00`,
                                "HH:mm:ss"
                              )
                                .add(i * appointment_time, "minutes")
                                .format("HH:mm:ss")
                            );
                          }

                          // const arr = new Array();
                          // day.times.forEach((time) => {
                          //   let doctorStartHour = time.start.split(":")[0];
                          //   let doctorStartMin = time.start.split(":")[1];
                          //   let doctorStart = Number(time.start.split(":")[0]);
                          //   let doctorEnd =
                          //     Number(time.end.split(":")[0]) + 0.1;
                          //   let dvs = doctor.dv.find((dv) => dv.key === "DVS");
                          //   let appointment_time = Number(dvs.value);

                          //   const length =
                          //     (doctorEnd - doctorStart) /
                          //     ((appointment_time * (doctorEnd - doctorStart)) /
                          //       ((doctorEnd - doctorStart) * 60));
                          //   const length2 =
                          //     (doctorEnd - doctorStart) /
                          //     ((appointment_time * (doctorEnd - doctorStart)) /
                          //       ((doctorEnd - doctorStart) * 60));

                          //   for (var i = 0; i < length; i++) {
                          //     arr.push(
                          //       moment(
                          //         `${doctorStartHour}:${doctorStartMin}:00`,
                          //         "HH:mm:ss"
                          //       )
                          //         .add(i * appointment_time, "minutes")
                          //         .format("HH:mm:ss")
                          //     );
                          //   }

                          //   array1.push(...arr);
                          // });

                          

                          // let dvs = doctor.dv.find((dv) => dv.key === "DVS");
                          // let appointment_time = Number(dvs.value);

                          let vip = doctor.appointment_surgery.filter(
                            (s) => s.vip !== null
                          );
                          let vipTimes = vip.map((v, i) => v.VisitTime).sort();

                          return (
                            <div key={day.id} className="relative w-full">
                              {vip.map((v, ind) => {
                                let asd = Number(v.VisitTime.split(":")[0]);
                                let fgh =
                                  Number(v.VisitTime.split(":")[1]) / 60;
                                let formattedVt = `${
                                  v.VisitTime.split(":")[0]
                                }:${v.VisitTime.split(":")[1]}`;

                                return (
                                  <div
                                    className={`absolute border-2 border-white   rounded-full vipTimeItems group  cursor-pointer ${
                                      getInfoLoading &&
                                      v.id === documentId &&
                                      "animate-spin"
                                    } `}
                                    style={{
                                      right: `${
                                        (((asd + fgh - 8) * 100) / 16) * 1.1
                                      }%`,
                                      top: 35,
                                      width: 12,
                                      height: 12,
                                      backgroundColor:
                                        v.reception === 2
                                          ? getInfoLoading &&
                                            v.id === documentId
                                            ? "white"
                                            : "green"
                                          : v.reception === 1
                                          ? getInfoLoading &&
                                            v.id === documentId
                                            ? "white"
                                            : "blue"
                                          : getInfoLoading &&
                                            v.id === documentId
                                          ? "white"
                                          : "red",
                                    }}
                                    onClick={showReservedHandler.bind(
                                      null,
                                      v?.id,
                                      v?.document_id,
                                      v?.reception
                                    )}
                                    key={v.VisitTime}
                                  >
                                    {getInfoLoading && v.id === documentId && (
                                      <CgSpinner className="w-2 h-2" />
                                    )}
                                    <div className="w-14 h-6 bg-black  border text-white text-xs absolute -top-6 left-0 z-50 rounded-cs hidden group-hover:block vipTimeItemsModal">
                                      <span className="absolute text-[10px]  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  text-center w-[100px]">
                                        {formattedVt}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}

                              <div className="timeline-times-grid">
                                {array1.map((a, i) => {
                                   let startBreak1 = moment('12:59:00',"hh:mm")
                                   let endBreak1 = moment('13:45:00',"hh:mm")
                                   let startBreak2 = moment('16:59:00',"hh:mm")
                                   let endBreak2 = moment('17:45:00',"hh:mm")
                                  let doctorStart = Number(a.split(":")[0]);
                                  let doctorStartSecond = Number(
                                    a.split(":")[1]
                                  );
                                  let doctorStartHour = a.split(":")[0];
                                  let doctorStartMin = a.split(":")[1];
                                  let lengthSpan = appointment_time / 5;
                                  let startSpan =
                                    ((Number(array1[0].split(":")[0]) - 8) *
                                      60) /
                                      5 +
                                    i * lengthSpan +
                                    1;
                                  // let startSpan =
                                  //   ((Number(a.split(":")[0]) + Math.floor((Number(a.split(":")[1])/60))) - 8) * 60 / 5 + 1 + i;
                                  let startdate = moment(
                                    `${doctorStartHour}:${doctorStartMin}`,
                                    "HH:mm"
                                  )
                                    // .add(i * appointment_time, "minutes")
                                    .format("HH:mm");

                                  let ff = doctor.appointment_surgery.find(
                                    (s) => s.VisitTime === a
                                  );

                                  let bb = moment(a,"hh:mm").isBetween(startBreak1,endBreak1) || moment(a,"hh:mm").isBetween(startBreak2,endBreak2)
                                  // return (
                                  //   <div
                                  //     key={i}
                                  //     style={{
                                  //       backgroundColor: "red",
                                  //       gridColumn: `${startSpan} / span ${lengthSpan}`,
                                  //       // right:`${
                                  //       //   (((asd + fgh - 8) * 100) / 16) * 1.1
                                  //       // }%`,
                                  //       // width:`${lengthSpan * 8}px`
                                  //     }}
                                  //   >
                                  //     {startdate}
                                  //   </div>
                                  // );

                                  return ff ? (
                                    <div
                                      style={{
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                      }}
                                      onClick={showReservedHandler.bind(
                                        null,
                                        ff?.id,
                                        ff?.document_id,
                                        ff?.reception
                                      )}
                                      key={a}
                                      className={`relative bg-gray-200 w-full text-[11px] text-gray-400 font-light flex items-center justify-center whitespace-nowrap px-1 py-2 border border-gray-400 rounded-md cursor-pointer hover:shadow-box2`}
                                    >
                                      <span
                                        className={` ${
                                          getInfoLoading &&
                                          ff.id === documentId &&
                                          "animate-spin"
                                        }`}
                                      >
                                        {getInfoLoading &&
                                        ff.id === documentId ? (
                                          <CgSpinner className="w-4 h-4" />
                                        ) : (
                                          startdate
                                        )}
                                        {ff?.reception === 1 && (
                                          <>
                                            {(getInfoLoading && ff.id === documentId )? (
                                              ""
                                            ) : (
                                              <span className="absolute top-5 right-0">
                                                <MdOutlineDone className="text-green-700 w-4 h-3" />
                                              </span>
                                            )}
                                          </>
                                        )}
                                        {ff?.reception === 2 && (
                                          <>
                                            {getInfoLoading &&
                                            ff.id === documentId ? (
                                              ""
                                            ) : (
                                              <>
                                                <span className="absolute top-5 right-0">
                                                  <MdOutlineDone className="text-green-700 w-4 h-3" />
                                                </span>
                                                <span className="absolute top-5 right-1">
                                                  <MdOutlineDone className="text-green-700 w-4 h-3" />
                                                </span>
                                              </>
                                            )}
                                          </>
                                        )}
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                      }}
                                      onClick={reserveHandler.bind(
                                        null,
                                        doctor.clinic_id,
                                        doctor.id,
                                        startdate
                                      )}
                                      key={a}
                                      className={`${bb && 'hidden'} bg-primary-100 w-full text-[11px] text-primary-900 font-light flex items-center justify-center whitespace-nowrap px-1 py-2 border border-primary-900 rounded-md cursor-pointer hover:text-white hover:bg-primary-700`}
                                    >
                                      <span className="">{startdate}</span>
                                    </div>
                                  );
                                })}
                                {array2.map((a, i) => {
                                     let startBreak1 = moment('12:59:00',"hh:mm")
                                     let endBreak1 = moment('13:45:00',"hh:mm")
                                     let startBreak2 = moment('16:59:00',"hh:mm")
                                     let endBreak2 = moment('17:45:00',"hh:mm")
                                  let doctorStart = Number(a.split(":")[0]);
                                  let doctorStartSecond = Number(
                                    a.split(":")[1]
                                  );
                                  let doctorStartHour = a.split(":")[0];
                                  let doctorStartMin = a.split(":")[1];
                                  let lengthSpan = appointment_time / 5;
                                  let startSpan =
                                    ((Number(array2[0].split(":")[0]) - 8) *
                                      60) /
                                      5 +
                                    i * lengthSpan +
                                    1;
                                  // let startSpan =
                                  //   ((Number(a.split(":")[0]) + Math.floor((Number(a.split(":")[1])/60))) - 8) * 60 / 5 + 1 + i;
                                  let startdate = moment(
                                    `${doctorStartHour}:${doctorStartMin}`,
                                    "HH:mm"
                                  )
                                    // .add(i * appointment_time, "minutes")
                                    .format("HH:mm");

                                  let ff = doctor.appointment_surgery.find(
                                    (s) => s.VisitTime === a
                                  );
                                  let bb = moment(a,"hh:mm").isBetween(startBreak1,endBreak1) || moment(a,"hh:mm").isBetween(startBreak2,endBreak2)

                                  // return (
                                  //   <div
                                  //     key={i}
                                  //     style={{
                                  //       backgroundColor: "red",
                                  //       gridColumn: `${startSpan} / span ${lengthSpan}`,
                                  //       // right:`${
                                  //       //   (((asd + fgh - 8) * 100) / 16) * 1.1
                                  //       // }%`,
                                  //       // width:`${lengthSpan * 8}px`
                                  //     }}
                                  //   >
                                  //     {startdate}
                                  //   </div>
                                  // );

                                  return ff ? (
                                    <div
                                      style={{
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                      }}
                                      onClick={showReservedHandler.bind(
                                        null,
                                        ff?.id,
                                        ff?.document_id,
                                        ff?.reception
                                      )}
                                      key={a}
                                      className="relative bg-gray-200 w-full text-[11px] text-gray-400 font-light flex items-center justify-center whitespace-nowrap px-1 py-2 border border-gray-400 rounded-md cursor-pointer hover:shadow-box2"
                                    >
                                      <span
                                        className={` ${
                                          getInfoLoading &&
                                          ff.id === documentId &&
                                          "animate-spin"
                                        }`}
                                      >
                                        {getInfoLoading &&
                                        ff.id === documentId ? (
                                          <CgSpinner className="w-4 h-4" />
                                        ) : (
                                          startdate
                                        )}
                                        {ff?.reception === 1 && (
                                          <>
                                            {(getInfoLoading && ff.id === documentId) ? (
                                              ""
                                            ) : (
                                              <span className="absolute top-5 right-0">
                                                <MdOutlineDone className="text-green-700 w-4 h-3" />
                                              </span>
                                            )}
                                          </>
                                        )}
                                        {ff?.reception === 2 && (
                                          <>
                                            {getInfoLoading &&
                                            ff.id === documentId ? (
                                              ""
                                            ) : (
                                              <>
                                                <span className="absolute top-5 right-0">
                                                  <MdOutlineDone className="text-green-700 w-4 h-3" />
                                                </span>
                                                <span className="absolute top-5 right-1">
                                                  <MdOutlineDone className="text-green-700 w-4 h-3" />
                                                </span>
                                              </>
                                            )}
                                          </>
                                        )}
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                      }}
                                      onClick={reserveHandler.bind(
                                        null,
                                        doctor.clinic_id,
                                        doctor.id,
                                        startdate
                                      )}
                                      key={a}
                                      className={`${bb && 'hidden'} bg-primary-100 w-full text-[11px] text-primary-900 font-light flex items-center justify-center whitespace-nowrap px-1 py-2 border border-primary-900 rounded-md cursor-pointer hover:text-white hover:bg-primary-700`}
                                    >
                                      <span className="">{startdate}</span>
                                    </div>
                                  );
                                })}
                                {/* {array1.map((a, i) => {
                                  let doctorStart = Number(a.split(":")[0]);
                                  let doctorStartSecond = Number(
                                    a.split(":")[1]
                                  );
                                  let doctorStartHour = a.split(":")[0];
                                  let doctorStartMin = a.split(":")[1];
                                  let lengthSpan = appointment_time / 5;
                                  let startSpan =
                                    ((Number(array1[0].split(":")[0]) - 8) *
                                      60) /
                                      5 +
                                    i * lengthSpan +
                                    1;
                                  // let startSpan =
                                  //   ((Number(a.split(":")[0]) + Math.floor((Number(a.split(":")[1])/60))) - 8) * 60 / 5 + 1 + i;
                                  let startdate = moment(
                                    `${doctorStartHour}:${doctorStartMin}`,
                                    "HH:mm"
                                  )
                                    // .add(i * appointment_time, "minutes")
                                    .format("HH:mm");

                                  let ff = doctor.appointment_surgery.find(
                                    (s) => s.VisitTime === a
                                  );

                                  
                                  // let asd = Number(a.split(":")[0]);
                                  // let fgh =
                                  //   Number(a.split(":")[1]) / 60;

                                  return (
                                    <div
                                      key={i}
                                      style={{
                                        backgroundColor: "red",
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                        // right:`${
                                        //   (((asd + fgh - 8) * 100) / 16) * 1.1
                                        // }%`,
                                        // width:`${lengthSpan * 8}px`
                                      }}
                                    >
                                      {startdate}
                                    </div>
                                  );

                                  return ff ? (
                                    <div
                                      style={{
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                      }}
                                      onClick={showReservedHandler.bind(
                                        null,
                                        ff?.id,
                                        ff?.document_id
                                      )}
                                      key={a}
                                      className="relative bg-gray-200 w-full text-[11px] text-gray-400 font-light flex items-center justify-center whitespace-nowrap px-1 py-2 border border-gray-400 rounded-md cursor-pointer hover:shadow-box2"
                                    >
                                      <span className="">
                                        {startdate}
                                        {ff?.reception === 1 && (
                                          <span className="absolute top-5 right-0">
                                            <MdOutlineDone className="text-green-700 w-4 h-3" />
                                          </span>
                                        )}
                                        {ff?.reception === 2 && (
                                          <>
                                            <span className="absolute top-5 right-0">
                                              <MdOutlineDone className="text-green-700 w-4 h-3" />
                                            </span>
                                            <span className="absolute top-5 right-1">
                                              <MdOutlineDone className="text-green-700 w-4 h-3" />
                                            </span>
                                          </>
                                        )}
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                      }}
                                      onClick={reserveHandler.bind(
                                        null,
                                        doctor.clinic_id,
                                        doctor.id,
                                        startdate
                                      )}
                                      key={a}
                                      className="bg-primary-100 w-full text-[11px] text-primary-900 font-light flex items-center justify-center whitespace-nowrap px-1 py-2 border border-primary-900 rounded-md cursor-pointer hover:text-white hover:bg-primary-700"
                                    >
                                      <span className="">{startdate}</span>
                                    </div>
                                  );
                                })} */}

                                {/* {array2.map((a, i) => {
                                  let doctorStart = Number(a.split(":")[0]);
                                  let doctorStartSecond = Number(
                                    a.split(":")[1]
                                  );
                                  let doctorStartHour = a.split(":")[0];
                                  let doctorStartMin = a.split(":")[1];
                                  let lengthSpan = appointment_time / 5;
                                  let startSpan =
                                    ((Number(array2[0].split(":")[0]) - 8) *
                                      60) /
                                      5 +
                                    i * lengthSpan +
                                    1;
                                  // let startSpan =
                                  //   ((Number(a.split(":")[0]) + Math.floor((Number(a.split(":")[1])/60))) - 8) * 60 / 5 + 1 + i;
                                  let startdate = moment(
                                    `${doctorStartHour}:${doctorStartMin}`,
                                    "HH:mm"
                                  )
                                    // .add(i * appointment_time, "minutes")
                                    .format("HH:mm");

                                  let ff = doctor.appointment_surgery.find(
                                    (s) => s.VisitTime === a
                                  );

                                 
                                  // let asd = Number(a.split(":")[0]);
                                  // let fgh =
                                  //   Number(a.split(":")[1]) / 60;

                                  return (
                                    <div
                                      key={i}
                                      style={{
                                        backgroundColor: "red",
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                        // right:`${
                                        //   (((asd + fgh - 8) * 100) / 16) * 1.1
                                        // }%`,
                                        // width:`${lengthSpan * 8}px`
                                      }}
                                    >
                                      {startdate}
                                    </div>
                                  );

                                  return ff ? (
                                    <div
                                      style={{
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                      }}
                                      onClick={showReservedHandler.bind(
                                        null,
                                        ff?.id,
                                        ff?.document_id
                                      )}
                                      key={a}
                                      className="relative bg-gray-200 w-full text-[11px] text-gray-400 font-light flex items-center justify-center whitespace-nowrap px-1 py-2 border border-gray-400 rounded-md cursor-pointer hover:shadow-box2"
                                    >
                                      <span className="">
                                        {startdate}
                                        {ff?.reception === 1 && (
                                          <span className="absolute top-5 right-0">
                                            <MdOutlineDone className="text-green-700 w-4 h-3" />
                                          </span>
                                        )}
                                        {ff?.reception === 2 && (
                                          <>
                                            <span className="absolute top-5 right-0">
                                              <MdOutlineDone className="text-green-700 w-4 h-3" />
                                            </span>
                                            <span className="absolute top-5 right-1">
                                              <MdOutlineDone className="text-green-700 w-4 h-3" />
                                            </span>
                                          </>
                                        )}
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                      }}
                                      onClick={reserveHandler.bind(
                                        null,
                                        doctor.clinic_id,
                                        doctor.id,
                                        startdate
                                      )}
                                      key={a}
                                      className="bg-primary-100 w-full text-[11px] text-primary-900 font-light flex items-center justify-center whitespace-nowrap px-1 py-2 border border-primary-900 rounded-md cursor-pointer hover:text-white hover:bg-primary-700"
                                    >
                                      <span className="">{startdate}</span>
                                    </div>
                                  );
                                })} */}

                                {/* {array2.map((a, i) => {
                                  let doctorStart = Number(a.split(":")[0]);
                                  let doctorStartSecond = Number(
                                    a.split(":")[1]
                                  );
                                  let doctorStartHour = a.split(":")[0];
                                  let doctorStartMin = a.split(":")[1];
                                  let lengthSpan = appointment_time / 5;
                                  let startSpan =
                                    ((Number(array2[0].split(":")[0]) - 8) *
                                      60) /
                                      5 +
                                    i * lengthSpan +
                                    1;
                                  // let startSpan =
                                  //   ((Number(a.split(":")[0]) + Math.floor((Number(a.split(":")[1])/60))) - 8) * 60 / 5 + 1 + i;
                                  let startdate = moment(
                                    `${doctorStartHour}:${doctorStartMin}`,
                                    "HH:mm"
                                  )
                                    // .add(i * appointment_time, "minutes")
                                    .format("HH:mm");

                                  let ff = doctor.appointment_surgery.find(
                                    (s) => s.VisitTime === a
                                  );

                                  
                                  // let asd = Number(a.split(":")[0]);
                                  // let fgh =
                                  //   Number(a.split(":")[1]) / 60;

                                  return (
                                    <div
                                      key={i}
                                      style={{
                                        backgroundColor: "red",
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                        // right:`${
                                        //   (((asd + fgh - 8) * 100) / 16) * 1.1
                                        // }%`,
                                        // width:`${lengthSpan * 8}px`
                                      }}
                                    >
                                      {startdate}
                                    </div>
                                  );

                                  return ff ? (
                                    <div
                                      style={{
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                      }}
                                      onClick={showReservedHandler.bind(
                                        null,
                                        ff?.id,
                                        ff?.document_id
                                      )}
                                      key={a}
                                      className="relative bg-gray-200 w-full text-[11px] text-gray-400 font-light flex items-center justify-center whitespace-nowrap px-1 py-2 border border-gray-400 rounded-md cursor-pointer hover:shadow-box2"
                                    >
                                      <span className="">
                                        {startdate}
                                        {ff?.reception === 1 && (
                                          <span className="absolute top-5 right-0">
                                            <MdOutlineDone className="text-green-700 w-4 h-3" />
                                          </span>
                                        )}
                                        {ff?.reception === 2 && (
                                          <>
                                            <span className="absolute top-5 right-0">
                                              <MdOutlineDone className="text-green-700 w-4 h-3" />
                                            </span>
                                            <span className="absolute top-5 right-1">
                                              <MdOutlineDone className="text-green-700 w-4 h-3" />
                                            </span>
                                          </>
                                        )}
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        gridColumn: `${startSpan} / span ${lengthSpan}`,
                                      }}
                                      onClick={reserveHandler.bind(
                                        null,
                                        doctor.clinic_id,
                                        doctor.id,
                                        startdate
                                      )}
                                      key={a}
                                      className="bg-primary-100 w-full text-[11px] text-primary-900 font-light flex items-center justify-center whitespace-nowrap px-1 py-2 border border-primary-900 rounded-md cursor-pointer hover:text-white hover:bg-primary-700"
                                    >
                                      <span className="">{startdate}</span>
                                    </div>
                                  );
                                })} */}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SurgeryTimelineCalendar;
