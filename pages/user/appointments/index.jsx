import React from "react";
import LayoutUser from "../../../Layout/LayoutUser";
import SelectInput from "../../../common/SelectInput";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { useState } from "react";
import { MdAdb, MdArrowDropDown, MdKeyboardArrowDown } from "react-icons/md";
import { Fragment } from "react";
import PageLoading from "../../../utils/LoadingPage";
import { usePatientAuth } from "../../../Provider/PatientAuthProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getAllAppointments } from "../../../Services/patientRecordService";
import moment from "jalali-moment";
import FilterBtn from "../../../common/FilterBtn";
import { toast } from "react-toastify";

const AppointmentsPage = () => {
  const { user, loading } = usePatientAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState(null);
  const [reserveDropdown, setReserveDropdown] = useState(false);
  const [filterTitle, setFilterTitle] = useState(1);

  const head = [
    { id: 0, title: "زمان مراجعه" },
    { id: 1, title: "نوع نوبت" },
    { id: 2, title: "مطب ها" },
    { id: 3, title: "دکتر" },
    { id: 4, title: "وضعیت" },
  ];

  const filterOption = [
    { id: "0", name: "همه" },
    { id: "1", name: "در حال انتظار" },
    { id: "2", name: "کنسل شده" },
    { id: "3", name: "ویزیت شده" },
  ];

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

  const getAppointments = () => {
    getAllAppointments({
      token: user.user.token,
    })
      .then(({ data }) => {
        // new device
        if (data.status === false && data.statusCode === 403) {
          patientDispatcher({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (data.status === false && data.statusCode !== 403) {
          toast.error(data.message[0],{
            position: "top-right",
          });
        } else {
          setAppointments(data.result);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          patientDispatcher({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (err.response) {
          toast.error(err.response.data.message,{
            position: "top-right",
          });
        }
      });
  };

  useEffect(() => {
    if (!loading && !user && !user?.token) {
      router.push("/user/user-login");
    }
  }, []);

  useEffect(() => {
    if (user && user?.token) {
      getAppointments();
    }
  }, []);

  if (!appointments) {
    return <PageLoading />;
  }

  return (
    <LayoutUser>
      <h1 className="font-bold text-xl md:mt-12">نوبت های جاری</h1>
      {/* Mobile نوبت های شما */}
      <div className="flex justify-between items-center mt-12 md:hidden">
        <h1 className="text-gray-900">نوبت های شما</h1>
        <div>
          <FilterBtn
            label={
              filterTitle === 0
                ? "همه"
                : filterTitle === 1
                ? "در حال انتظار"
                : filterTitle === 2
                ? "کنسل شده"
                : "ویزیت شده"
            }
            name="user"
            selectOption={filterOption}
            labelOption="name"
            valueOption="id"
            onChange={(e) => setFilterTitle(e.id)}
          />
        </div>
      </div>
      <div className="mt-3 md:hidden">
        {appointments &&
          appointments
            .filter((item) =>
              Number(filterTitle) !== 0
                ? item.status === Number(filterTitle)
                : item
            )
            .map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="mt-3 text-gray-600 bg-white rounded-lg shadow-card"
                >
                  <div
                    className={`flex justify-between p-4`}
                    onClick={() => setReserveDropdown(item.id)}
                  >
                    <div className="flex gap-x-4">
                      <span className="w-24">{convertDay(item.day)}</span>
                      <span className="">
                        {" "}
                        {moment(item.dateOfDay, "YYYY/MM/DD")
                          .locale("fa")
                          .format("YYYY/MM/DD")}{" "}
                        |{" "}
                        {`${item.VisitTime.split(":")[0]}:${
                          item.VisitTime.split(":")[1]
                        }`}
                      </span>
                    </div>
                    <MdArrowDropDown
                      className={`text-2xl ${
                        reserveDropdown &&
                        reserveDropdown === item.id &&
                        "rotate-180"
                      }`}
                      onClick={(e) => {
                        setReserveDropdown(reserveDropdown ? null : item.id);
                        e.stopPropagation();
                      }}
                    />
                  </div>
                  {reserveDropdown === item.id && (
                    <div className="text-xs bg-white rounded-b-lg py-4 px-4">
                      <hr />
                      <div className="border border-primary-50 mt-4 flex justify-between p-3 rounded-lg">
                        <div className="flex flex-col justify-between py-2 w-1/2">
                          <span className="text-center">دکتر</span>
                          <span className="text-center">مطب ها</span>
                          <span className="text-center">وضعیت</span>
                        </div>
                        <hr className="h-[100px] bg-primary-50 w-[1px]" />
                        <div className="flex flex-col justify-between py-2 w-1/2">
                          <span className="text-center">
                            {item.doctor.name}
                          </span>
                          <span className="text-center">
                            {item.clinic.title}
                          </span>
                          <span
                            className={`text-center ${
                              item.status === 1
                                ? ""
                                : item.status === 2
                                ? "text-red-700"
                                : "text-green-700"
                            }`}
                          >
                            {item.status === 1
                              ? "در حال انتظار"
                              : item.status === 2
                              ? "کنسل شده"
                              : "ویزیت شده"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
      </div>
      <div className="hidden flex-col gap-6 mt-8 md:flex md:bg-white md:p-6 md:rounded-lg  md:mt-5  desktop:w-full md:shadow-card ">
        <div className="flex items-center justify-between">
          <h1>نوبت های شما</h1>
        </div>
        <div className="w-full overflow-x-auto max-h-[403px] bg-white border rounded-lg shadow-card md:shadow-none lg:max-h-[600px]">
          <table className="w-full rounded-lg ">
            <thead className="">
              <tr className="">
                {head.map((item, index) => (
                  <th
                    key={item.id}
                    className={`font-light text-sm border-b border-l border-gray-200 text-gray-900 py-4 md:bg-gray-50 ${
                      index === head.length - 1 && "border-l-transparent"
                    } `}
                  >
                    {item.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {appointments &&
                appointments.map((item, index) => {
                  return (
                    <tr className="" key={item.id}>
                      <td className="font-light text-xs border-l   border-gray-200  text-center whitespace-nowrap px-4 py-4">
                        {moment(item.dateOfDay, "YYYY/MM/DD")
                          .locale("fa")
                          .format("YYYY/MM/DD")}{" "}
                        |{" "}
                        {`${item.VisitTime.split(":")[0]}:${
                          item.VisitTime.split(":")[1]
                        }`}
                      </td>
                      <td className="font-light text-xs border-l  border-gray-200 text-center whitespace-nowrap px-4 py-4">
                        <span>
                          {item.type && item.type === 2 ? "جراحی" : "ویزیت"}
                        </span>
                        {item.vip ? "-" : ""}
                        <span>{item.vip ? "ویژه" : ""}</span>
                      </td>
                      <td className="font-light text-xs border-l  border-gray-200 text-center whitespace-nowrap px-4 py-4">
                        {item.clinic.title}
                      </td>
                      <td className="font-light text-xs border-l  border-gray-200 text-center whitespace-nowrap px-4 py-4">
                        {item.doctor ? item.doctor.name : ""}
                      </td>
                      <td
                        className={`font-light text-xs ${
                          item.status === 1
                            ? ""
                            : item.status === 2
                            ? "text-red-700"
                            : "text-green-700"
                        }  border-gray-200 text-center whitespace-nowrap px-4 py-4`}
                      >
                        {item.status === 1
                          ? "در حال انتظار"
                          : item.status === 2
                          ? "کنسل شده"
                          : "ویزیت شده"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutUser>
  );
};

export default AppointmentsPage;
