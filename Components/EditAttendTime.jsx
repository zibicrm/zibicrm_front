import moment from "moment";
import React, { useState, useEffect } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import PrimaryBtn from "../common/PrimaryBtn";
import TimePicker from "../common/TimePicker";
import HourInput from "./HourInput";
import Modal from "./Modal";
import { FaPlus } from "react-icons/fa";
import OutlineBtn from "../common/OutlineBtn";
import { CloseBtn } from "../common/CloseBtn";
import { useFormik } from "formik";
import convertDay from "../hooks/ConvertDayToPersian";
import {
  EditTimeService,
  addDayService,
  addTimeService,
  deleteDayService,
  deleteTimeService,
} from "../Services/doctorServices";
import { useRouter } from "next/router";
import { useAuth } from "../Provider/AuthProvider";
import DeleteWarning from "./DeleteWarning";
import { MdEdit } from "react-icons/md";

const EditAttendTime = ({
  formik,
  daySelected,
  setDays,
  doctorTimes,
  getData,
}) => {
  const { user, loading } = useAuth();
  const [showTime, setShowTime] = useState(0);
  const [allDays, setAllDays] = useState([]);
  const [time, setTime] = useState("12:34pm");
  const [timeAdd, setTimeAdd] = useState("12:34pm");
  const [selected, setSelect] = useState("");
  const [edit, setEdit] = useState("");
  const [editAdd, setEditAdd] = useState("");
  const [error, setError] = useState("");
  const [click, setClick] = useState(false);
  const [errorAdd, setErrorAdd] = useState("");
  const [clickAdd, setClickAdd] = useState(false);
  const [addTime, setAddTime] = useState(null);
  const [timeStatus, setTimeStatus] = useState(0);
  const [disableEdit, setDisableEdit] = useState(true);
  const [editTime, setEditTime] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const [editTimeAdd, setEditTimeAdd] = useState("");
  const [selectDelete, setDelete] = useState("");
  const [selectAdd, setAdd] = useState("");
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [isOpenAdd, setOpenAdd] = useState(false);
  const [addLevel, setAddLevel] = useState(0);
  const [deleteAlert, setDeleteAlert] = useState(-20);
  const router = useRouter();
  const query = router.query;
  const days = [
    { id: 1, value: "Saturday", label: "شنبه" },
    { id: 2, value: "Sunday", label: "یکشنبه" },
    { id: 3, value: "Monday", label: "دوشنبه" },
    { id: 4, value: "Tuesday", label: "سه شنبه" },
    { id: 5, value: "Wednesday", label: "چهارشنبه" },
    { id: 6, value: "Thursday", label: "پنجشنبه" },
    { id: 7, value: "Friday", label: "جمعه" },
  ];

  console.log('select',selected);

  const TimeHandler = (e) => {
    let convertedTime = moment(e, "hh:mm:ss A").format("HH:mm");
    let filter = formik.values[selected].filter(
      (item) => item.id === editTime.id
    )[0];
    let index = formik.values[selected].indexOf(filter);
    let filterValue = formik.values[selected];
    filter = { ...filter, [editTime.type]: convertedTime };

    if (filter.end <= filter.start) {
      toast.error("بازه زمانی انتخابی اشتباه می باشد");
    }
    if (filter.end > filter.start) {
      filterValue[index] = filter;

      delete filterValue[index].created_at;
      delete filterValue[index].updated_at;
      delete filterValue[index].doctor_id;
      delete filterValue[index].day_id;
      delete filterValue[index].clinic_id;
      filterValue[index]["time_id"] = filterValue[index]["id"];
      // delete filterValue[index]["id"];

      setEditedTime(filterValue[index]);
    }
  };
  const changeHandler = (e) => {
    let filtered = daySelected.filter((item) => item === e.target.value);
    if (!filtered.length) {
      setDays([...daySelected, e.target.value]);
    }
    if (filtered.length) {
      let filter = daySelected.filter((item) => item !== e.target.value);
      setDays(filter);
    }
  };
  const clickHandler = (id, day) => {
    let chcek = allDays.includes(day);
    if (chcek) {
      setSelect(day);
    } else {
      setAllDays([...allDays, day]);
    }
  };
  const initialValuesTime = {
    Saturday: [],
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  };
  const timeFormik = useFormik({
    initialValues: initialValuesTime,
    onSubmit: (values) => {},
    enableReinitialize: true,
  });
  const TimeHandlerAdd = (e) => {
    let convertedTime = moment(e, "hh:mm:ss A").format("HH:mm");
    let filter = timeFormik.values[selectAdd].filter(
      (item) => item.id === editTimeAdd.id
    )[0];
    let index = timeFormik.values[selectAdd].indexOf(filter);
    let filterValue = timeFormik.values[selectAdd];
    filter = { ...filter, [editTimeAdd.type]: convertedTime };
    if (filter.end <= filter.start) {
      toast.error("بازه زمانی انتخابی اشتباه می باشد");
    }
    if (filter.end > filter.start) {
      filterValue[index] = filter;
      timeFormik.setFieldValue(selectAdd, filterValue);
    }
  };
  useEffect(() => {
    daySelected[0] ? setSelect(daySelected[0]) : setSelect("");
    daySelected && setAllDays(daySelected);
  }, [daySelected]);
  useEffect(() => {
    allDays[0] && setSelect(allDays[0]);
  }, [allDays]);
  const deleteTimeHandler = () => {
    // let filter = formik.values[selected].filter((item) => item.id !== id);
    // formik.setFieldValue([selected], filter);
    if(formik.values[selected] && formik.values[selected].length > 1){
      console.log('test 1',formik.values[selected].length);
      deleteTimeService(deleteAlert, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(
              `در این بازه زمانی ${
                Number(data.message.appointment_surgery_count) > 0
                  ? data.message.appointment_surgery_count + " نوبت جراحی "
                  : ""
              } ${
                Number(data.message.appointment_surgery_count) &&
                Number(data.message.appointment_count)
                  ? "و"
                  : ""
              } ${
                Number(data.message.appointment_count) > 0
                  ? data.message.appointment_count + " نوبت ویزیت "
                  : ""
              }وجود دارد`
            );
          } else {
            setDeleteAlert(-20);
            getData();
            toast.success(data.result[0]);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            userDispatch({
              type: "LOGOUTNOTTOKEN",
            });
          }
          if (err.response) {
            toast.error(err.response.data.message);
          }
        });
    } else {
      let filter = doctorTimes.filter((e) => e.day === selected)[0];
      // console.log('filetr',filetr);
      deleteTimeService(deleteAlert, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(
              `در این بازه زمانی ${
                Number(data.message.appointment_surgery_count) > 0
                  ? data.message.appointment_surgery_count + " نوبت جراحی "
                  : ""
              } ${
                Number(data.message.appointment_surgery_count) &&
                Number(data.message.appointment_count)
                  ? "و"
                  : ""
              } ${
                Number(data.message.appointment_count) > 0
                  ? data.message.appointment_count + " نوبت ویزیت "
                  : ""
              }وجود دارد`
            );
          } else {
// delete day as well
deleteDayService(filter.id, {
  Authorization: "Bearer " + user.token,
})
  .then(({ data }) => {
    if (data.status === false) {
      toast.error(
        `در این بازه زمانی ${
          Number(data.message.appointment_surgery_count) > 0
            ? data.message.appointment_surgery_count + " نوبت جراحی "
            : ""
        } ${
          Number(data.message.appointment_surgery_count) &&
          Number(data.message.appointment_count)
            ? "و"
            : ""
        } ${
          Number(data.message.appointment_count) > 0
            ? data.message.appointment_count + " نوبت ویزیت "
            : ""
        }وجود دارد`
      );
    } else {
      setDelete("");
      setOpenDelete(false);
      getData();
      toast.success(data.result[0]);
    }
  })
  .catch((err) => {
    if (err.response && err.response.status === 401) {
      userDispatch({
        type: "LOGOUTNOTTOKEN",
      });
    }
    if (err.response) {
      toast.error(err.response.data.message);
    }
  });
// delete day as well
            setDeleteAlert(-20);
            getData();
            toast.success(data.result[0]);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            userDispatch({
              type: "LOGOUTNOTTOKEN",
            });
          }
          if (err.response) {
            toast.error(err.response.data.message);
          }
        });
    }
  
  };
  const deleteHandlerAdd = (id) => {
    let filter = timeFormik.values[selectAdd].filter((item) => item.id !== id);
    timeFormik.setFieldValue([selectAdd], filter);
  };
  const addDaySubmit = () => {
    addDayService(
      {
        doctor_id: query.id,
        clinic_id: query.clinic,
        day: selectAdd,
        times: timeFormik.values[selectAdd],
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setAddLevel(0);
          setAdd("");
          setOpenAdd(false);
          getData();
          toast.success(data.result[0]);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          userDispatch({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (err.response) {
          toast.error(err.response.data.message);
        }
      });
  };
  const addTimeSubmit = () => {
    let filter = doctorTimes.filter((e) => e.day === selected)[0];
    setTimeStatus(1);
    addTimeService(
      {
        doctor_id: query.id,
        clinic_id: query.clinic,
        day_id: filter.id,
        start: addTime.start,
        end: addTime.end,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          getData();
          toast.success(data.result[0]);
        }
        setTimeStatus(0);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          userDispatch({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (err.response) {
          toast.error(err.response.data.message);
        }
        setTimeStatus(0);
      });
  };
  const deleteDaySubmit = (day) => {
    let filetr = doctorTimes.filter((e) => e.day === selectDelete)[0];
    deleteDayService(filetr.id, {
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(
            `در این بازه زمانی ${
              Number(data.message.appointment_surgery_count) > 0
                ? data.message.appointment_surgery_count + " نوبت جراحی "
                : ""
            } ${
              Number(data.message.appointment_surgery_count) &&
              Number(data.message.appointment_count)
                ? "و"
                : ""
            } ${
              Number(data.message.appointment_count) > 0
                ? data.message.appointment_count + " نوبت ویزیت "
                : ""
            }وجود دارد`
          );
        } else {
          setDelete("");
          setOpenDelete(false);
          getData();
          toast.success(data.result[0]);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          userDispatch({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (err.response) {
          toast.error(err.response.data.message);
        }
      });
  };
  const editTimeHandler = () => {
    let filter1 = formik.values[selected].filter(
      (item) =>
        item.start === editedTime.start &&
        item.end === editedTime.end &&
        item.id !== editedTime.id
    );
    let filter2 = formik.values[selected].filter(
      (item) =>
        moment(`02/13/2020 ${item.end}`).unix() <
          moment(`02/13/2020 ${editedTime.start}`).unix() &&
        item.id !== editedTime.id
    );
    let filter3 = formik.values[selected].filter(
      (item) =>
        moment(`02/13/2020 ${item.start}`).unix() ===
        moment(`02/13/2020 ${editedTime.end}`).unix()
    );
    if (filter1.length) {
      toast.error("بازه زمانی تکراری است");
    } else if (filter2.length || filter3.length) {
      toast.error("تداخل زمانی وجود دارد");
    } else {
      EditTimeService(editedTime, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(
              `در این بازه زمانی ${
                Number(data.message.appointment_surgery_count) > 0
                  ? data.message.appointment_surgery_count + " نوبت جراحی "
                  : ""
              } ${
                Number(data.message.appointment_surgery_count) &&
                Number(data.message.appointment_count)
                  ? "و"
                  : ""
              } ${
                Number(data.message.appointment_count) > 0
                  ? data.message.appointment_count + " نوبت ویزیت "
                  : ""
              }وجود دارد`
            );
          } else {
            getData();
            toast.success(data.result[0]);
            setDisableEdit(true);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            userDispatch({
              type: "LOGOUTNOTTOKEN",
            });
          }
          if (err.response) {
            toast.error(err.response.data.message);
          }
        });
    }
  };
  useEffect(() => {
    for (let index = 0; index < daySelected.length; index++) {
      const element = daySelected[index];
      if (!formik.values[element].length) {
        setError(element);
      } else {
        setError("");
      }
    }
  }, [formik.values, daySelected]);
  useEffect(() => {
    if (user && !loading && addTime && addTime.start && addTime.end) {
      addTimeSubmit();
    }
  }, [addTime]);


  return (
    <div className="md:max-w-md bg-white rounded-cs max-w-[80vw]  flex z-50 flex-col items-center justify-start ">
      <div className="bg-primary-700  text-xl md:text-base rounded-b-[46px] rounded-t-cs px-4 py-3 md:py-6 text-white flex flex-col items-center justify-between w-full gap-4">
        <div className="flex flex-row items-center justify-between w-full ">
          <div className="w-[52px]"></div>
          <span>انتخاب روز</span>
          <div className="text-xl flex flex-row items-center gap-3">
            <button onClick={() => setOpenAdd(true)}>
              <FaPlus />
            </button>
            <button onClick={() => setOpenDelete(true)}>
              <RiDeleteBinLine />
            </button>
          </div>
        </div>
        <div className="bg-white flex flex-row items-center gap-5 px-4 py-3 rounded-cs">
          {days.map((item) => (
            <button
              className={`w-9 h-9 rounded-full relative flex items-center justify-center ${
                selected === item.value &&
                "bg-primary-700 text-white border-none"
              } ${
                allDays.length &&
                allDays.includes(item.value) &&
                selected !== item.value
                  ? "bg-white text-primary-700 border border-primary-700  cursor-pointers "
                  : "border border-gray-200 text-gray-200 "
              }`}
              onClick={() => clickHandler(item.id, item.value)}
              disabled={!daySelected.includes(item.value)}
              key={item.id}
              type="button"
            >
              {item.label.slice(0, 1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-row  h-[360px] w-full px-5 py-6 relative">
        <div className="flex flex-col  w-fit  items-start gap-2">
          {daySelected.length ? (
            <HourInput
              status={timeStatus}
              setState={setAddTime}
              day={selected}
              dayFormik={formik}
            />
          ) : null}
          {formik.values[selected] &&
            formik.values[selected].map((item, index) => (
              <div
                key={index}
                className="flex flex-col  h-full max-h-[40px] justify-between"
              >
                <div className="flex  flex-row gap-2 items-center ">
                  <div className="flex flex-row items-center ">
                    <input
                      className={`border-none z-0  h-7 max-w-[78px]  outline-none md:w-24 md:h-7 w-11  text-[10px] md:text-xs bg-[#f5f5f5] md:px-3 md:py-2  rounded-cs tracking-widest disabled:cursor-not-allowed ${
                        edit === item.id ? "opacity-100 " : "opacity-60 "
                      }`}
                      onClick={() => {
                        setEditTime({ type: "start", id: item.id });
                      }}
                      disabled={disableEdit === item.id ? false : true}
                      value={item.start.slice(0, 5)}
                      type={"button"}
                    />
                    <div
                      className={`h-[1px] w-4 opacity-60  mx-1 bg-gray-900`}
                    ></div>
                    <input
                      className={`border-none z-0  h-7 max-w-[78px]  outline-none md:w-24 md:h-7 w-11  text-[10px] md:text-xs bg-[#f5f5f5] md:px-3 md:py-2 rounded-cs tracking-widest disabled:cursor-not-allowed ${
                        edit === item.id ? "opacity-100 " : "opacity-60 "
                      }`}
                      type={"button"}
                      onClick={() => {
                        setEditTime({ type: "end", id: item.id });
                      }}
                      disabled={disableEdit === item.id ? false : true}
                      value={item.end.slice(0, 5)}
                    />
                    {edit && edit.id === item.id && (
                      <button
                        onClick={() => setEdit(0)}
                        type="button"
                        className=" mr-1 flex flex-row items-center justify-center   min-w-fit  text-primary-700 text-lg  duration-200 "
                      >
                        <AiOutlineCheck />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteAlert(item.id)}
                    className="text-xl w-5 h-5 hover:text-primary-700 cursor-pointer"
                  >
                    <RiDeleteBinLine />
                  </button>
                  {disableEdit !== item.id ? (
                    <button
                      type="button"
                      onClick={() => setDisableEdit(item.id)}
                      className="text-xl  w-5 h-5 hover:text-primary-700 cursor-pointer"
                    >
                      <MdEdit />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => editTimeHandler()}
                      className="text-xl w-5 h-5 hover:text-primary-700 cursor-pointer"
                    >
                      <AiOutlineCheck />
                    </button>
                  )}
                </div>
                <div className="text-[12px] text-red-300">
                  {error &&
                    click &&
                    "بازه های انتخابی روز های انتخاب شده را مشخص کنید"}
                </div>
              </div>
            ))}
        </div>
        <div className="w-1/2  ">
          {editTime.id > 0 && (
            <div
              style={{ direction: "ltr" }}
              className="z-[70] w-full absolute bg-[#00000040] md:pb-[7px] max-h-[335px] md:max-h-fit top-[250px] md:top-[0px] left-0"
              onClick={() => setEditTime(0)}
            >
              <TimePicker
                showTime={showTime}
                setShowTime={(e) => setEditTime(e)}
                setTime={TimeHandler}
                time={time}
              />
            </div>
          )}
        </div>
      </div>

      {/* <div className="w-full flex flex-row  justify-end items-center p-3">
        <div className="h-12 w-24 md:w-44 ">
          <PrimaryBtn type="button" text={"ثبت"} />
        </div>
      </div> */}
      {isOpenDelete ? (
        <Modal>
          <div className="relative p-6 bg-white rounded-cs flex flex-col gap-6">
            <CloseBtn onClick={() => setOpenDelete(false)} />
            <span>حذف روز های هفته</span>
            <div className="flex felx-row items-center gap-5">
              {days.map((item) => (
                <button
                  className={`w-9 h-9 rounded-full relative flex items-center justify-center ${
                    selectDelete === item.value &&
                    "bg-primary-700 text-white border-none"
                  } ${
                    allDays.length &&
                    allDays.includes(item.value) &&
                    selectDelete !== item.value
                      ? "bg-white text-primary-700 border border-primary-700  cursor-pointers "
                      : "border border-gray-200 text-gray-200 "
                  }`}
                  onClick={() => setDelete(item.value)}
                  disabled={!allDays.includes(item.value)}
                  key={item.id}
                  type="button"
                >
                  {item.label.slice(0, 1)}
                </button>
              ))}
            </div>
            <div className="w-full h-12 flex flex-row items-center justify-between gap-6">
              <div className="w-1/2 h-12">
                <OutlineBtn
                  text="انصراف"
                  onClick={() => setOpenDelete(false)}
                />
              </div>
              <div className="w-1/2 h-12">
                <PrimaryBtn text="حذف" onClick={() => deleteDaySubmit()} />
              </div>
            </div>
          </div>
        </Modal>
      ) : null}
      {isOpenAdd ? (
        <Modal>
          <div className="relative p-6 bg-white rounded-cs flex flex-col gap-6">
            <CloseBtn
              onClick={() => {
                setAddLevel(0);
                setAdd("");

                setOpenAdd(false);
              }}
            />
            <span>
              {addLevel === 0
                ? "اضافه کردن روز های هفته"
                : convertDay(selectAdd)}
            </span>
            {addLevel === 0 ? (
              <>
                <div className="flex felx-row items-center gap-5">
                  {days.map((item) => (
                    <button
                      className={`w-9 h-9 rounded-full relative flex items-center justify-center  ${
                        allDays.length &&
                        !allDays.includes(item.value) &&
                        selectAdd !== item.value
                          ? "bg-white text-primary-700 border border-primary-700 cursor-pointers"
                          : "border border-gray-200 text-gray-200"
                      } ${
                        selectAdd === item.value &&
                        "bg-primary-700 text-white border-none"
                      }`}
                      onClick={() => setAdd(item.value)}
                      disabled={allDays.includes(item.value)}
                      key={item.id}
                      type="button"
                    >
                      {item.label.slice(0, 1)}
                    </button>
                  ))}
                </div>
                <div className="w-full h-12 flex flex-row items-center justify-between gap-6">
                  <div className="w-1/2 h-12">
                    <OutlineBtn
                      text="انصراف"
                      onClick={() => {
                        setAddLevel(0);
                        setAdd("");
                        setOpenAdd(false);
                      }}
                    />
                  </div>
                  <div className="w-1/2 h-12">
                    <PrimaryBtn text="ادامه" onClick={() => setAddLevel(1)} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 items-start h-[360px] w-full justify-between relative">
                <div className="flex flex-col gap-3 items-start">
                  <span className="text-sm text-gray-900">
                    بازه ی زمانی حضورپزشک در این روز را وارد نمایید
                  </span>
                  <div className="flex flex-col w-1/2  items-start gap-2">
                    <HourInput day={selectAdd} dayFormik={timeFormik} />
                    {timeFormik.values[selectAdd] &&
                      timeFormik.values[selectAdd].map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col h-full max-h-[40px] justify-between"
                        >
                          <div className="flex flex-row gap-2 items-center ">
                            <div className="flex flex-row items-center ">
                              <input
                                className={`border-none z-0 cursor-pointer h-7 max-w-[68px]  outline-none md:w-24 md:h-7 w-11  text-[10px] md:text-xs bg-[#f5f5f5] md:px-3 md:py-2  rounded-cs tracking-widest ${
                                  editAdd === item.id
                                    ? "opacity-100 "
                                    : "opacity-60 "
                                }`}
                                onClick={() => {
                                  setEditTimeAdd({
                                    type: "start",
                                    id: item.id,
                                  });
                                }}
                                value={item.start}
                                type={"button"}
                              />
                              <div
                                className={`h-[1px] w-4 opacity-60  mx-1 bg-gray-900`}
                              ></div>
                              <input
                                className={`border-none z-0 cursor-pointer h-7 max-w-[68px]  outline-none md:w-24 md:h-7 w-11  text-[10px] md:text-xs bg-[#f5f5f5] md:px-3 md:py-2 rounded-cs tracking-widest ${
                                  editAdd === item.id
                                    ? "opacity-100 "
                                    : "opacity-60 "
                                }`}
                                type={"button"}
                                onClick={() => {
                                  setEditTimeAdd({ type: "end", id: item.id });
                                }}
                                value={item.end}
                              />
                              {editAdd === item.id && (
                                <button
                                  onClick={() => setEditAdd(0)}
                                  type="button"
                                  className=" mr-1 flex flex-row items-center justify-center   min-w-fit  text-primary-700 text-lg  duration-200 "
                                >
                                  <AiOutlineCheck />
                                </button>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteHandlerAdd(item.id)}
                              className="text-xl cursor-pointer hover:text-primary-700"
                            >
                              <RiDeleteBinLine />
                            </button>
                          </div>
                          <div className="text-[12px] text-red-300">
                            {errorAdd &&
                              clickAdd &&
                              "بازه های انتخابی روز های انتخاب شده را مشخص کنید"}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="w-full h-12 flex flex-row items-center justify-end gap-6">
                  <div className="w-1/2 h-12">
                    <PrimaryBtn text="ثبت" onClick={() => addDaySubmit()} />
                  </div>
                </div>
                {editTimeAdd.id > 0 && (
                  <div className="w-1/2  ">
                    <div
                      style={{ direction: "ltr" }}
                      className="z-[70] w-full absolute bg-[#00000040] md:pb-[7px] max-h-[335px] md:max-h-fit top-[250px] md:top-[0px] left-0"
                      onClick={() => setEditTimeAdd(0)}
                    >
                      <TimePicker
                        showTime={showTime}
                        setShowTime={(e) => setEditTimeAdd(e)}
                        setTime={TimeHandlerAdd}
                        time={timeAdd}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      ) : null}
      {deleteAlert > 0 ? (
        <DeleteWarning
          deleteHandler={() => deleteTimeHandler()}
          setState={setDeleteAlert}
          title="حذف ساعت"
          text="آیا از حذف بازه زمانی اطمینان دارید؟"
        />
      ) : null}
    </div>
  );
};

export default EditAttendTime;
