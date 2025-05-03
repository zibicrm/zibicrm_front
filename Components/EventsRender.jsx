import axios from "axios";
import moment from "jalali-moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  MdCalendarToday,
  MdEdit,
  MdOutlineCancel,
  MdOutlineChat,
  MdOutlineDeleteSweep,
  MdSchedule,
} from "react-icons/md";
import { toast } from "react-toastify";
import { CloseBtn } from "../common/CloseBtn";
import PrimaryBtn from "../common/PrimaryBtn";
import Tooltip from "../common/tooltip";
import { CurrencyNum } from "../hooks/CurrencyNum";
import { useAuth } from "../Provider/AuthProvider";
import {
  cancelAppointmentService,
  sendMessageAppointment,
  sendRemindMessageAppointment,
} from "../Services/appointmentService";
import {
  cancelAppointmentSurgeryService,
  sendMessageAppointmentSurgery,
  sendRemindMessageAppointmentSurgery,
} from "../Services/appointmentSurgeryService";
import {
  DeleteFollowUpService,
  getAllEventService,
} from "../Services/eventsServices";
import LoadingBtn from "../utils/LoadingBtn";
import AddEvent from "./AddEvent";
import DeleteWarning from "./DeleteWarning";
import Modal from "./Modal";

const EventsRender = ({ data, getData }) => {
  const { user, loading } = useAuth();
  const [add, setAdd] = useState(false);
  const [remindStatus, setRemindStatus] = useState(0);
  const [resendStatus, setResendStatus] = useState(0);
  const [type, setType] = useState(null);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(0);
  const [cancel, setCancel] = useState(-15);
  const [cancelStatus, setCancelStatus] = useState(0);
  const listInnerRef = useRef();
  const [currPage, setCurrPage] = useState(1);
  const [addCount, setAddCount] = useState(0);
  const [lastList, setLastList] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(-20);
  const [event, setEvent] = useState([]);
  const router = useRouter();
  const getDateRef = useRef(null);
  const id = router.query.id;
  const getEvent = async (ids) => {
    setStatus(1);
    await getAllEventService(
      { page: currPage, count: "200", document_id: ids },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then((res) => {
        if (res.data.status === false) {
          toast.error(res.data.message[0]);
        } else {
          if (!res.data.result.length) {
            setLastList(true);
          }
          // setPrevPage(currPage);
          setEvent(res.data.result);
        }
        setStatus(0);
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
        setStatus(0);
      });
  };
  const cancelAppointment = () => {
    setCancelStatus(1);
    if (type === 3) {
      cancelAppointmentService(
        {
          appointment_id: String(cancel),
          description,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then((res) => {
          if (res.data.status === false) {
            toast.error(res.data.message[0]);
          } else {
            toast.success(res.data.result[0]);
            getEvent(id);
          }
          setCancelStatus(0);
          setCancel(-1);
          setDescription("");
          setCurrPage(1);
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
          setCancelStatus(0);
          setCancel(-1);
          setDescription("");
        });
    } else {
      cancelAppointmentSurgeryService(
        {
          appointment_id: String(cancel),
          description,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then((res) => {
          if (res.data.status === false) {
            toast.error(res.data.message[0]);
          } else {
            toast.success(res.data.result[0]);
            getEvent(id);
          }
          setCancelStatus(0);
          setCancel(-1);
          setDescription("");
          setCurrPage(1);
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
          setCancelStatus(0);
          setCancel(-1);
          setDescription("");
        });
    }
  };
  const convertDay = (day) => {
    switch (day) {
      case "Saturday":
        return "شنبه";
      case "Sunday":
        return "یکشنبه";
      case "Monday":
        return "دوشنبه";
      case "Tuesday":
        return "سه شنبه";
      case "Wednesday":
        return "چهارشنبه";
      case "Thursday":
        return "پنج شنبه";
      case "Friday":
        return "جمعه";
    }
  };
  const resendMessage = (id) => {
    setResendStatus(1);
    sendMessageAppointment(
      {
        appointment_id: id,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then((res) => {
        if (res.data.status === false) {
          toast.error(res.data.message[0]);
        } else {
          toast.success(res.data.result[0]);
        }
        setResendStatus(0);
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
        setResendStatus(0);
      });
  };
  const resendMessageSurgery = (id) => {
    setResendStatus(1);

    sendMessageAppointmentSurgery(
      {
        appointment_id: id,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then((res) => {
        if (res.data.status === false) {
          toast.error(res.data.message[0]);
        } else {
          toast.success(res.data.result[0]);
        }
        setResendStatus(0);
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
        setResendStatus(0);
      });
  };
  const remindMessage = (id) => {
    setRemindStatus(1);
    sendRemindMessageAppointment(
      {
        appointment_id: id,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then((res) => {
        if (res.data.status === false) {
          toast.error(res.data.message[0]);
        } else {
          toast.success(res.data.result[0]);
        }
        setRemindStatus(0);
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
        setRemindStatus(0);
      });
  };
  const remindMessageSurgery = (id) => {
    setRemindStatus(1);

    sendRemindMessageAppointmentSurgery(
      {
        appointment_id: id,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then((res) => {
        if (res.data.status === false) {
          toast.error(res.data.message[0]);
        } else {
          toast.success(res.data.result[0]);
        }
        setRemindStatus(0);
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
        setRemindStatus(0);
      });
  };

  const routerHandler = (appo, type) => {
    if (user.user.rule === 1) {
      router.push(
        `/operator/record/detail/health/?id=${id}&appointment=${appo}&type=${type}`
      );
    } else if (user.user.rule === 2) {
      router.push(
        `/admin/record/detail/health/?id=${id}&appointment=${appo}&type=${type}`
      );
    } else if (user.user.rule === 3 && user.user.doctor === 1) {
      router.push(
        `/doctor/record/detail/health/?id=${id}&appointment=${appo}&type=${type}`
      );
    } else if (user.user.rule === 3) {
      router.push(
        `/clinic/record/detail/health/?id=${id}&appointment=${appo}&type=${type}`
      );
    }
  };
  const render = (item, index) => {
    switch (item.event_type.id) {
      case 11:
        return null;
      case 2:
        return (
          <li className="w-full flex flex-row items-start gap-3 relative pb-6">
            {/* <span className="w-2 h-2 border bg-white z-30 border-primary-900 rounded-full"></span> */}
            <div className="w-full -mt-2 flex flex-col gap-4 ">
              {/* <span className="text-base ">
                {moment(item.created_at).locale("fa").format("DD MMMM YYYY")}
              </span> */}
              <div className="w-full bg-primary-50 border border-primary-900 relative rounded-cs  px-4 pt-2 pb-2 flex flex-col gap-4">
                {index === 0 ? (
                  <div className="w-4 rounded-tl-[3px] h-4 bg-primary-50 border-t border-l border-primary-900 absolute -top-[9px] right-4 rotate-45 "></div>
                ) : null}

                <div className="w-full flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-gray-400 text-[13px]    ">
                      {item.user &&
                        item.user.first_name + "  " + item.user.last_name}
                    </span>
                    <span className="text-primary-900 text-[13px]">
                      {item.event_type.title}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    <span>
                      {moment(item.created_at).locale("fa").format("HH:ss")} |{" "}
                    </span>
                    <span
                      className={
                        item.io_call === 1 ? "text-green-700" : "text-red-700"
                      }
                    >
                      {item.io_call === 1 ? "ورودی" : "خروجی"}
                    </span>
                  </div>
                </div>
                <p className="text-[13px] select-text text-justify text-gray-600 leading-6">
                  {item.description}
                </p>
                <div>
                  <span className="text-gray-400 text-[13px]   ">
                    {item.reserve_user &&
                    item.reserve_user_id &&
                    item.reserve_user_id !== item.user_id
                      ? "ثبت کننده: (" +
                        item.reserve_user.first_name +
                        " " +
                        item.reserve_user.last_name +
                        ") "
                      : null}
                  </span>
                </div>
              </div>
            </div>
          </li>
        );
      case 1:
        return (
          <li className="w-full flex flex-row items-start gap-3 relative pb-6">
            <div className="w-full -mt-2 flex flex-col gap-4 ">
              <div className="w-full bg-[#FFF7EA] border border-[#FF9900] rounded-cs relative  px-4 pt-2 pb-2 flex flex-col gap-4">
                {index === 0 ? (
                  <div className="w-4 rounded-tl-[3px] h-4 bg-[#FFF7EA] border-t border-l border-[#FF9900] absolute -top-[9px] right-4 rotate-45 "></div>
                ) : null}

                <div className="w-full flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-gray-400 text-[13px] max-w-[100px]  ">
                      {item.user &&
                        item.user.first_name + " " + item.user.last_name}
                    </span>
                    <div className="flex flex-row items-center gap-1">
                      <span className="text-primary-900 text-[13px]">
                        {item.event_type.title}
                      </span>
                      <button
                        onClick={() => setDeleteAlert(item.id)}
                        className="text-white rounded-cs bg-red-400 text-xl p-0.5"
                      >
                        <MdOutlineDeleteSweep />
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs">
                    <span>
                      {" "}
                      {moment(item.created_at)
                        .locale("fa")
                        .format("HH:ss")}|{" "}
                    </span>
                    <span
                      className={
                        item.io_call === 1 ? "text-green-700" : "text-red-700"
                      }
                    >
                      {item.io_call === 1 ? "ورودی" : "خروجی"}
                    </span>
                  </div>
                </div>
                <p className="text-[13px] select-text text-justify text-gray-600 leading-6">
                  {item.description}
                </p>
                <div className="w-full flex flex-row items-center justify-between">
                  <span className="text-gray-400 text-[13px]   ">
                    {item.reserve_user &&
                    item.reserve_user_id &&
                    item.reserve_user_id !== item.user_id
                      ? "ثبت کننده: (" +
                        item.reserve_user.first_name +
                        " " +
                        item.reserve_user.last_name +
                        ") "
                      : null}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {moment(item.follow_up_date)
                      .locale("fa")
                      .format("YYYY/MM/DD")}
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="bg-primary-900 w-[1px] h-full z-0 absolute top-2.5 right-[3px]"></div> */}
          </li>
        );
      case 3:
        return (
          <li className="w-full flex flex-row items-start gap-3 relative pb-6">
            {/* <span className="w-2 h-2 border bg-white z-30 border-primary-900 rounded-full"></span> */}
            <div className="w-full -mt-2 flex flex-col gap-4 ">
              {/* <span className="text-base ">
                {moment(item.created_at).locale("fa").format("DD MMMM YYYY")}
              </span> */}
              <div
                className={`w-full  relative border  rounded-cs   py-2  flex flex-col gap-4 ${
                  item.appointment && item.appointment.status === 2
                    ? "bg-red-50 border-red-300"
                    : "bg-green-50 border-green-700"
                }`}
              >
                {index === 0 ? (
                  <div
                    className={`w-1 px-2 rounded-tl-[3px] h-4  border-t border-l absolute -top-[8.5px] right-4 rotate-45  ${
                      item.appointment && item.appointment.status === 2
                        ? "bg-red-50 border-red-300"
                        : "bg-green-50 border-green-700"
                    }`}
                  ></div>
                ) : null}

                <div className="w-full px-4 flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2 ">
                    <span className="text-gray-400 text-[13px]   ">
                      {item.user &&
                        item.user.first_name + " " + item.user.last_name}
                    </span>
                    <span className="text-primary-900 text-[13px]">
                      {item.event_type.title}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    <span>
                      {moment(item.created_at).locale("fa").format("HH:ss")}|{" "}
                    </span>
                    <span
                      className={
                        item.io_call === 1 ? "text-green-700" : "text-red-700"
                      }
                    >
                      {item.io_call === 1 ? "ورودی" : "خروجی"}
                    </span>
                  </div>
                </div>
                <div className="flex px-4 flex-col items-end gap-2">
                  <div
                    className={`w-full flex flex-row items-center border  text-xs text-gray-600 rounded-cs 
                      ${
                        item.appointment && item.appointment.status === 2
                          ? " border-red-200"
                          : "border-[#BCDFC9]"
                      }
                    `}
                  >
                    <ul className="w-1/2">
                      <li
                        className={`border-b text-center py-2 text-xs text-gray-600 ${
                          item.appointment && item.appointment.status === 2
                            ? " border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        مطب
                      </li>
                      <li
                        className={`border-b text-center py-2 text-xs text-gray-600 ${
                          item.appointment && item.appointment.status === 2
                            ? " border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        پزشک
                      </li>
                      <li
                        className={`border-b text-center py-2 text-xs text-gray-600 ${
                          item.appointment && item.appointment.status === 2
                            ? " border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        روز
                      </li>
                      <li
                        className={`border-b text-center py-2  text-xs text-gray-600 ${
                          item.appointment && item.appointment.status === 2
                            ? " border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        تاریخ
                      </li>
                      <li
                        className={`border-b text-center py-2  text-xs text-gray-600 ${
                          item.appointment && item.appointment.status === 2
                            ? " border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        ساعت
                      </li>
                      <li
                        className={` text-xs text-gray-600 text-center py-2 ${
                          item.appointment && item.appointment.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        خدمت
                      </li>
                    </ul>
                    <ul className="w-1/2">
                      <li
                        className={`border-b text-center py-2 border-r text-xs text-gray-600 ${
                          item.appointment && item.appointment.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        {item.appointment &&
                          item.appointment.clinic &&
                          item.appointment.clinic.title}
                      </li>
                      <li
                        className={`border-b text-center py-2 border-r text-xs text-gray-600 ${
                          item.appointment && item.appointment.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        {item.appointment &&
                          item.appointment.doctor &&
                          item.appointment.doctor.name}
                      </li>
                      <li
                        className={`border-b text-center py-2 border-r text-xs text-gray-600 ${
                          item.appointment && item.appointment.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        {item.appointment && convertDay(item.appointment.day)}
                      </li>
                      <li
                        className={`border-b text-center py-2 border-r text-xs text-gray-600 ${
                          item.appointment && item.appointment.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        {item.appointment &&
                          moment(item.appointment.dateOfDay, "")
                            .locale("fa")
                            .format("YYYY/MM/DD")}
                      </li>
                      <li
                        className={`border-b border-r text-center py-2  text-xs text-gray-600 ${
                          item.appointment && item.appointment.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        {item.appointment &&
                          item.appointment.VisitTime.slice(0, 5)}
                      </li>
                      <li
                        className={`border-r text-center py-2 border-[#BCDFC9]  text-xs truncate line-clamp-1 text-gray-600 ${
                          item.appointment && item.appointment.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        {item.appointment &&
                          item.appointment.service &&
                          item.appointment.service.title}
                      </li>
                    </ul>
                  </div>
                  <div
                    className={`w-full flex items-center ${
                      item.appointment && item.appointment.status !== 2
                        ? "justify-between"
                        : "justify-start"
                    } `}
                  >
                    <div>
                      <span className="text-gray-400 text-[13px]   ">
                        {item.reserve_user &&
                        item.reserve_user_id &&
                        item.reserve_user_id !== item.user_id
                          ? "ثبت کننده: (" + item.reserve_user &&
                            item.reserve_user.first_name +
                              " " +
                              item.reserve_user &&
                            item.reserve_user.last_name + ") "
                          : null}
                      </span>
                    </div>
                    {String(user && user.user && user.user.rule) === "2" &&
                    String(user && user.user && user.user.accountant) === "1"
                      ? null
                      : item.appointment &&
                        item.appointment.status !== 2 &&
                        !item.appointment.treatment && (
                          <div className="flex flex-row justify-end items-center gap-2">
                            <div className="w-24 h-8">
                              <PrimaryBtn
                                text="ثبت درمان"
                                onClick={() => {
                                  routerHandler(item.appointment.id, "0");
                                }}
                              />
                            </div>
                            <Tooltip text="ارسال یادآوری">
                              <button
                                onClick={() =>
                                  remindMessage(item.appointment.id)
                                }
                                type="button"
                                disabled={remindStatus === 1}
                                className="truncate cursor-pointer w-7 h-7 bg-primary-900  text-3xl flex items-center justify-center rounded-cs font-bold text-black disabled:bg-gray-300 disabled:text-white"
                              >
                                {remindStatus === 1 ? (
                                  <div className="w-5 h-5 bg-gradient-to-r from-primary-700 to-white animate-spin rounded-full flex items-center justify-center">
                                    <div className="w-[90%] h-[90%] bg-gray-300 rounded-full"></div>
                                  </div>
                                ) : (
                                  <span className="text-xl text-white">
                                    <MdOutlineChat />
                                  </span>
                                )}
                              </button>
                            </Tooltip>
                            <Tooltip text="ارسال مجدد ویزیت">
                              <button
                                onClick={() =>
                                  resendMessage(item.appointment.id)
                                }
                                type="button"
                                className=" cursor-pointer w-7 h-7 bg-[#FDAB31]  text-3xl flex items-center justify-center rounded-cs font-bold text-black "
                              >
                                {resendStatus === 1 ? (
                                  <div className="w-5 h-5 bg-gradient-to-r from-primary-700 to-white animate-spin rounded-full flex items-center justify-center">
                                    <div className="w-[90%] h-[90%] bg-gray-300 rounded-full"></div>
                                  </div>
                                ) : (
                                  <div className="text-xl relative text-white">
                                    <MdCalendarToday />
                                    <span className="absolute text-xs -bottom-0.5 right-0 bg-[#FDAB31]">
                                      <MdOutlineChat />
                                    </span>
                                  </div>
                                )}
                              </button>
                            </Tooltip>
                            <Tooltip text="کنسل نوبت">
                              <button
                                onClick={() => {
                                  setCancel(item.visit_id);
                                  setType(item.event_type.id);
                                }}
                                type="button"
                                className=" cursor-pointer w-7 h-7 bg-red-400  text-3xl flex items-center justify-center rounded-cs font-bold text-black "
                              >
                                <div className="relative text-xl text-white">
                                  <MdCalendarToday />
                                  <span className="text-xs absolute -bottom-0.5 -right-0.5 bg-red-400">
                                    <MdOutlineCancel />
                                  </span>
                                </div>
                              </button>
                            </Tooltip>
                          </div>
                        )}
                  </div>
                  <p className="text-[13px] select-text text-justify flex items-center text-gray-600 leading-6 w-full ">
                    {item.description}
                  </p>
                </div>
                {item.appointment && item.appointment.status === 2 ? (
                  <div className="flex px-4 py-2  flex-col items-start gap-2 text-xs border-t-[0.5px] border-red-300">
                    <span className="text-red-700">کنسلی</span>
                    <p className="text-gray-600 select-text">
                      {item.appointment &&
                        item.appointment.cancel_event &&
                        item.appointment.cancel_event[0] &&
                        item.appointment.cancel_event[0].description}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        );
      case 4:
        return (
          <li className="w-full  flex flex-row items-start gap-3 relative pb-6">
            {/* <span className="w-2 h-2 border bg-white z-30 border-primary-900 rounded-full"></span> */}
            <div className="w-full -mt-2 flex flex-col gap-4 ">
              {/* <span className="text-base ">
                {moment(item.created_at).locale("fa").format("DD MMMM YYYY")}
              </span> */}
              <div
                className={`w-full relative border rounded-cs pt-2 pb-2 flex flex-col gap-4 ${
                  item.appointment_surgery &&
                  item.appointment_surgery.status === 2
                    ? "bg-red-50 border-red-300"
                    : "bg-green-100 border-green-700"
                }`}
              >
                {index === 0 ? (
                  <div
                    className={`w-1 px-2 rounded-tl-[3px] h-4  border-t border-l absolute -top-[8.5px] right-4 rotate-45 ${
                      item.appointment_surgery &&
                      item.appointment_surgery.status === 2
                        ? "bg-red-50 border-red-300"
                        : "bg-green-100 border-green-700 "
                    }`}
                  ></div>
                ) : null}

                <div className="w-full px-4 flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-gray-400 text-[13px]   ">
                      {item.user &&
                        item.user.first_name + " " + item.user.last_name}
                    </span>
                    <span className="text-primary-900 text-[13px]">
                      {item.event_type.title}{" "}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    <span>
                      {moment(item.created_at).locale("fa").format("HH:ss")}|{" "}
                    </span>
                    <span
                      className={
                        item.io_call === 1 ? "text-green-700" : "text-red-700"
                      }
                    >
                      {item.io_call === 1 ? "ورودی" : "خروجی"}
                    </span>
                  </div>
                </div>
                <div className="flex px-4 flex-col items-end gap-2">
                  <div
                    className={`w-full flex flex-row items-center border  text-xs text-gray-600 rounded-cs ${
                      item.appointment_surgery &&
                      item.appointment_surgery.status === 2
                        ? "border-red-200"
                        : "border-[#BCDFC9]"
                    }`}
                  >
                    <ul className="w-1/2">
                      <li
                        className={`border-b text-center py-2  text-xs text-gray-600  ${
                          item.appointment_surgery &&
                          item.appointment_surgery.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        مطب
                      </li>
                      <li
                        className={`border-b text-center py-2  text-xs text-gray-600  ${
                          item.appointment_surgery &&
                          item.appointment_surgery.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        پزشک
                      </li>
                      <li
                        className={`border-b text-center py-2  text-xs text-gray-600  ${
                          item.appointment_surgery &&
                          item.appointment_surgery.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        روز
                      </li>
                      <li
                        className={`border-b text-center py-2  text-xs text-gray-600  ${
                          item.appointment_surgery &&
                          item.appointment_surgery.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        تاریخ
                      </li>
                      <li
                        className={`border-b  text-xs text-gray-600 text-center py-2 ${
                          item.appointment_surgery &&
                          item.appointment_surgery.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        ساعت
                      </li>
                      <li
                        className={` text-xs text-gray-600 text-center py-2 ${
                          item.appointment_surgery &&
                          item.appointment_surgery.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        خدمت
                      </li>
                    </ul>
                    <ul className="w-1/2">
                      <li
                        className={`border-b text-center py-2 border-r  text-xs text-gray-600 ${
                          item.appointment_surgery &&
                          item.appointment_surgery.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        {item.appointment_surgery &&
                          item.appointment_surgery.clinic &&
                          item.appointment_surgery.clinic.title}
                      </li>
                      <li
                        className={`border-b text-center py-2 border-r  text-xs text-gray-600 ${
                          item.appointment_surgery &&
                          item.appointment_surgery.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        {item.appointment_surgery &&
                          item.appointment_surgery.doctor &&
                          item.appointment_surgery.doctor.name}
                      </li>
                      <li
                        className={`border-b text-center py-2 border-r  text-xs text-gray-600 ${
                          item.appointment_surgery &&
                          item.appointment_surgery.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        {item.appointment_surgery &&
                          convertDay(item.appointment_surgery.day)}
                      </li>
                      <li
                        className={`border-b text-center py-2 border-r  text-xs text-gray-600 ${
                          item.appointment_surgery &&
                          item.appointment_surgery.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        {item.appointment_surgery &&
                          moment(item.appointment_surgery.dateOfDay, "")
                            .locale("fa")
                            .format("YYYY/MM/DD")}
                      </li>
                      <li
                        className={`border-r border-b text-center py-2  text-xs text-gray-600 ${
                          item.appointment_surgery &&
                          item.appointment_surgery.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        {item.appointment_surgery &&
                          item.appointment_surgery.VisitTime.slice(0, 5)}
                      </li>
                      <li
                        className={`border-r text-center py-2   text-xs truncate line-clamp-1 text-gray-600 ${
                          item.appointment_surgery &&
                          item.appointment_surgery.status === 2
                            ? "border-red-200"
                            : "border-[#BCDFC9]"
                        }`}
                      >
                        {item.appointment_surgery &&
                          item.appointment_surgery.service &&
                          item.appointment_surgery.service.title}
                      </li>
                    </ul>
                  </div>
                  <div
                    className={`w-full flex items-center ${
                      item.appointment_surgery &&
                      item.appointment_surgery.status !== 2
                        ? "justify-between"
                        : "justify-start"
                    } `}
                  >
                    <span className="text-gray-400 text-[13px]   ">
                      {item.reserve_user &&
                      item.reserve_user_id &&
                      item.reserve_user_id !== item.user_id
                        ? "ثبت کننده: (" +
                          item.reserve_user.first_name +
                          " " +
                          item.reserve_user.last_name +
                          ") "
                        : null}
                    </span>
                    {item.appointment_surgery &&
                      item.appointment_surgery.status !== 2 &&
                      !item.appointment_surgery.treatment && (
                        <div className="flex flex-row justify-end items-center gap-2">
                          <div className="w-24 h-8">
                            <PrimaryBtn
                              text="ثبت درمان"
                              onClick={() =>
                                routerHandler(item.appointment_surgery.id, "1")
                              }
                            />
                          </div>
                          <Tooltip text="ارسال یادآوری">
                            <button
                              onClick={() =>
                                remindMessageSurgery(
                                  item.appointment_surgery.id
                                )
                              }
                              type="button"
                              className=" cursor-pointer w-7 h-7 bg-primary-900 px-2 text-3xl flex items-center justify-center rounded-cs font-bol text-black "
                            >
                              {remindStatus === 1 ? (
                                <div className="w-5 h-5 bg-gradient-to-r from-primary-700 to-white animate-spin rounded-full flex items-center justify-center">
                                  <div className="w-[90%] h-[90%] bg-gray-300 rounded-full"></div>
                                </div>
                              ) : (
                                <span className="text-xl text-white">
                                  <MdOutlineChat />
                                </span>
                              )}
                            </button>
                          </Tooltip>
                          <Tooltip text="ارسال مجدد جراحی">
                            <button
                              onClick={() =>
                                resendMessageSurgery(
                                  item.appointment_surgery.id
                                )
                              }
                              type="button"
                              className=" cursor-pointer w-7 h-7 bg-[#FDAB31] text-3xl flex items-center justify-center rounded-cs font-bold text-black "
                            >
                              {resendStatus === 1 ? (
                                <div className="w-5 h-5 bg-gradient-to-r from-primary-700 to-white animate-spin rounded-full flex items-center justify-center">
                                  <div className="w-[90%] h-[90%] bg-gray-300 rounded-full"></div>
                                </div>
                              ) : (
                                <div className="text-xl relative text-white">
                                  <MdCalendarToday />
                                  <span className="absolute text-xs -bottom-0.5 right-0 bg-[#FDAB31]">
                                    <MdOutlineChat />
                                  </span>
                                </div>
                              )}
                            </button>
                          </Tooltip>
                          <Tooltip text="کنسل نوبت">
                            <button
                              onClick={() => {
                                setCancel(item.surgery_id);
                                setType(item.event_type.id);
                              }}
                              type="button"
                              className=" cursor-pointer w-7 h-7 bg-red-400 text-3xl flex items-center justify-center rounded-cs font-bold text-black "
                            >
                              <div className="relative text-xl text-white">
                                <MdCalendarToday />
                                <span className="text-xs absolute -bottom-0.5 -right-0.5 bg-red-400">
                                  <MdOutlineCancel />
                                </span>
                              </div>
                            </button>
                          </Tooltip>
                        </div>
                      )}
                  </div>

                  <p className="text-[13px] select-text text-justify text-gray-600 leading-6 w-full ">
                    {item.description}
                  </p>
                </div>
                {item.appointment_surgery &&
                item.appointment_surgery.status === 2 ? (
                  <div className="flex px-4 py-2  flex-col items-start gap-2 text-xs border-t-[0.5px] border-red-300">
                    <span className="text-red-700">کنسلی</span>
                    <p className="text-gray-600 select-text">
                      {item.appointment_surgery &&
                        item.appointment_surgery.cancel_event &&
                        item.appointment_surgery.cancel_event.description}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
            {/* <div className="bg-primary-900 w-[1px] h-full z-0 absolute top-2.5 right-[3px]"></div> */}
          </li>
        );
      case 13:
        return (
          <li className="w-full flex flex-row items-start gap-3 relative pb-6">
            {/* <span className="w-2 h-2 border bg-white z-30 border-primary-900 rounded-full"></span> */}
            <div className="w-full -mt-2 flex flex-col gap-4 ">
              {/* <span className="text-base ">
                  {moment(item.created_at).locale("fa").format("DD MMMM YYYY")}
                </span> */}
              <div className="w-full bg-[#EDF0F8] border border-primary-900  rounded-cs relative  px-4 pt-2 pb-2 flex flex-col gap-4">
                {index === 0 ? (
                  <div className="w-4 rounded-tl-[3px] h-4 bg-primary-50 border-t border-l border-primary-900 absolute -top-[9px] right-4 rotate-45 "></div>
                ) : null}

                <div className="w-full flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-gray-400 text-[13px] max-w-[100px]  ">
                      {item.user &&
                        item.user.first_name + " " + item.user.last_name}
                    </span>
                    <span className="text-primary-900 text-[13px]">
                      {item.event_type.title}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    <span>
                      {" "}
                      {moment(item.created_at)
                        .locale("fa")
                        .format("HH:ss")}|{" "}
                    </span>
                    <span
                      className={
                        item.io_call === 1 ? "text-green-700" : "text-red-700"
                      }
                    >
                      {item.io_call === 1 ? "ورودی" : "خروجی"}
                    </span>
                  </div>
                </div>
                <p className="text-[13px] text-justify text-gray-600 leading-6">
                  {item.description}
                </p>
                <div>
                  <span className="text-gray-400 text-[13px]   ">
                    {item.reserve_user &&
                    item.reserve_user_id &&
                    item.reserve_user_id !== item.user_id
                      ? "ثبت کننده: (" +
                        item.reserve_user.first_name +
                        " " +
                        item.reserve_user.last_name +
                        ") "
                      : null}
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="bg-primary-900 w-[1px] h-full z-0 absolute top-2.5 right-[3px]"></div> */}
          </li>
        );
      case 14:
        return (
          <li className="w-full flex flex-row items-start gap-3 relative pb-6">
            {/* <span className="w-2 h-2 border bg-white z-30 border-primary-900 rounded-full"></span> */}
            <div className="w-full -mt-2 flex flex-col gap-4 ">
              {/* <span className="text-base ">
                    {moment(item.created_at).locale("fa").format("DD MMMM YYYY")}
                  </span> */}
              <div className="w-full bg-gray-50 border border-primary-900  rounded-cs relative  px-4 pt-2 pb-2 flex flex-col gap-4">
                {index === 0 ? (
                  <div className="w-4 rounded-tl-[3px] h-4 bg-gray-50 border-t border-l border-primary-900 absolute -top-[9px] right-4 rotate-45 "></div>
                ) : null}

                <div className="w-full flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-gray-400 text-[13px] max-w-[100px]  ">
                      {item.user &&
                        item.user.first_name + " " + item.user.last_name}
                    </span>
                    <span className="text-primary-900 text-[13px]">
                      {item.event_type.title}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    <span>
                      {" "}
                      {moment(item.created_at)
                        .locale("fa")
                        .format("HH:ss")}|{" "}
                    </span>
                    <span
                      className={
                        item.io_call === 1 ? "text-green-700" : "text-red-700"
                      }
                    >
                      {item.io_call === 1 ? "ورودی" : "خروجی"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start flex-col gap-3">
                  <div className="w-full h-11 flex flex-row items-center justify-between border-gray-900 border rounded-md">
                    <span className="h-full flex items-center text-sm justify-center border-l border-gray-900 bo w-1/2">
                      بیعانه
                    </span>
                    <span className="h-full text-primary-900    flex items-center justify-center w-1/2">
                      {CurrencyNum.format(item.description.split("&")[1])}
                    </span>
                  </div>
                  <p className="text-[13px] text-justify text-gray-600 leading-6">
                    {item.description.split("&")[0]}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 text-[13px]   ">
                    {item.reserve_user &&
                    item.reserve_user_id &&
                    item.reserve_user_id !== item.user_id
                      ? "ثبت کننده: (" +
                        item.reserve_user.first_name +
                        " " +
                        item.reserve_user.last_name +
                        ") "
                      : null}
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="bg-primary-900 w-[1px] h-full z-0 absolute top-2.5 right-[3px]"></div> */}
          </li>
        );
      default:
        return (
          <li className="w-full flex flex-row items-start gap-3 relative pb-6">
            {/* <span className="w-2 h-2 border bg-white z-30 border-primary-900 rounded-full"></span> */}
            <div className="w-full -mt-2  flex flex-col gap-4">
              {/* <span className="text-base ">
                {moment(item.created_at).locale("fa").format("DD MMMM YYYY")}
              </span> */}
              <div className="w-full bg-gray-50 border border-gray-300 rounded-cs relative px-4 pt-2 pb-2 flex flex-col gap-4">
                {index === 0 ? (
                  <div className="w-4 rounded-tl-[3px] h-4 bg-white border-t border-l border-gray-300 absolute -top-[9px] right-4 rotate-45 "></div>
                ) : null}

                <div className="w-full flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-gray-400 text-[13px]   ">
                      {item.user &&
                        item.user.first_name + " " + item.user.last_name}
                    </span>
                    <span className="text-primary-900 text-[13px]">
                      {item.event_type.title}{" "}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    <span>
                      {moment(item.created_at).locale("fa").format("HH:ss")}|{" "}
                    </span>
                    <span
                      className={
                        item.io_call === 1 ? "text-green-700" : "text-red-700"
                      }
                    >
                      {item.io_call === 1 ? "ورودی" : "خروجی"}
                    </span>
                  </div>
                </div>
                <p className="text-[13px] select-text text-justify text-gray-600 leading-6">
                  {item.description}
                </p>
                <div>
                  <span className="text-gray-400 text-[13px]   ">
                    {item.reserve_user &&
                    item.reserve_user_id &&
                    item.reserve_user_id !== item.user_id
                      ? "ثبت کننده: (" +
                        item.reserve_user.first_name +
                        " " +
                        item.reserve_user.last_name +
                        ") "
                      : null}
                  </span>
                </div>
              </div>
            </div>
          </li>
        );
    }
  };
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setCurrPage(currPage + 1);
      }
    }
  };
  function groupItems(array, property) {
    return array.reduce(function (groups, item) {
      var name = moment(item.created_at).locale("fa").format("YYYY-MM-DD");
      var group = groups[name] || (groups[name] = []);
      group.push(item);
      return groups;
    }, {});
  }
  const deleteEventHandler = () => {
    DeleteFollowUpService(deleteAlert, {
      Authorization: "Bearer " + user.token,
    })
      .then((res) => {
        if (res.data.status === false) {
          toast.error(res.data.message[0]);
        } else {
          setDeleteAlert(-20);
          getEvent(id);
          toast.success(res.data.result[0]);
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
  let groups = groupItems(event, "date");
  function loopOnEvent() {
    let e = [];
    for (var key in groups) {
      var group = groups[key];
      e.push(
        <div className="relative">
          <div className="w-full flex flex-row items-start  pb-4 gap-2.5">
            <span className="w-2 h-2 min-w-[8px] min-h-[8px] border bg-white z-30 border-primary-900 rounded-full"></span>
            <span className="text-base  block">
              {moment
                .from(key, "fa", "YYYY/MM/DD")
                .locale("fa")
                .format("DD MMMM YYYY")}
            </span>
          </div>
          <div className="pr-3">
            <div className="flex flex-col items-center gap-4">
              {group.map((item, index) => render(item, index))}
            </div>
            <div>
              <div className="bg-primary-900 w-[1px] h-full z-0 absolute top-2.5 right-[3px]"></div>
            </div>
          </div>
        </div>
      );
    }
    return e;
  }
  useEffect(() => {
    if (user && !loading && id && getDateRef.current !== id) {
      getEvent(id);
      getDateRef.current = id;
    }
  }, [id]);

  useEffect(() => {
    if (add) {
      setAddCount(addCount + 1);
    }
    if (user && !loading && id && !add && addCount > 0) {
      getEvent(id);
      getData();
    }
  }, [add]);

  return (
    <div className="overflow-hidden">
      <div className="flex px-6 pb-2 flex-row items-center justify-between w-full">
        <h1 className="text-base text-gray-900">تاریخچه وقایع</h1>
        {user &&
        String(user.rule) === "2" &&
        String(user.accountant) === "1" ? null : (
          <div className="h-12 w-28">
            <PrimaryBtn text="ثبت وقایع" onClick={() => setAdd(true)}>
              <MdSchedule />
            </PrimaryBtn>
          </div>
        )}
      </div>
      <div
        className="w-full px-6 min-h-[90%] max-h-[calc(100%-190px)] overflow-y-auto"
        onScroll={onScroll}
        ref={listInnerRef}
      >
        <ul className="w-full flex flex-col select-text mt-4">
          {loopOnEvent()}
        </ul>
        <div className="w-full flex items-center justify-center">
          {status === 1 ? <LoadingBtn white={true} /> : null}
        </div>
      </div>
      {cancel >= 0 ? (
        <Modal
          setModal={() => {
            null;
          }}
        >
          <div className="bg-white p-8 relative rounded-cs max-w-sm gap-4 flex flex-col">
            <CloseBtn onClick={() => setCancel(-1)} />
            <h2 className="text-xl"> کنسل کردن نوبت</h2>
            <p className="text-[#FF9900] text-sm">
              اخطار!
              <br /> اگر قصد ثبت نوبت جدید دارید ابتدا از موجود بودن نوبت مورد
              نظر اطمینان حاصل نمایید همچنین توجه نمایید که در صورت کنسل شدن،
              اجازه ثبت این نوبت برای افراد دیگر ازاد می باشد.
            </p>
            <textarea
              className="w-full h-60 outline-none border border-primary-400 rounded-cs p-4"
              placeholder="توضیحات"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="w-full  h-12">
              <PrimaryBtn
                text="ثبت"
                onClick={() => cancelAppointment()}
                disabled={description.length <= 5 || cancelStatus === 1}
                status={cancelStatus}
              />
            </div>
          </div>
        </Modal>
      ) : null}
      {deleteAlert > 0 ? (
        <DeleteWarning
          deleteHandler={() => deleteEventHandler()}
          setState={setDeleteAlert}
          title="حذف پیگیری"
          text="آیا از حذف پیگیری مورد نظر اطمینان دارید؟"
        />
      ) : null}
      {add ? (
        <Modal setModal={() => {}}>
          <AddEvent setOpen={setAdd} userInfo={data} />
        </Modal>
      ) : null}
    </div>
  );
};

export { EventsRender };
