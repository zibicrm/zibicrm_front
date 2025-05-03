import { useRouter } from "next/router";
import {
  MdAddCircleOutline,
  MdArrowRightAlt,
  MdCalendarToday,
  MdLoop,
  MdOutlineCancel,
  MdOutlineDeleteSweep,
  MdRemoveRedEye,
} from "react-icons/md";

import IconBtn from "../../../common/IconBtn";
import Layout from "../../../Layout/Layout";
import React, { Fragment, useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import CountSelect from "../../../Components/CountSelect";
import { toast } from "react-toastify";
import Pagination from "../../../Components/Pagination";
import { deleteRecordService } from "../../../Services/recordServices";
import Modal from "../../../Components/Modal";
import { CloseBtn } from "../../../common/CloseBtn";
import PrimaryBtn from "../../../common/PrimaryBtn";
import DeleteWarning from "../../../Components/DeleteWarning";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import FilterSelect from "../../../common/FilterSelect";
import Tabs from "../../../Components/Tabs";
import moment from "jalali-moment";
import { getDoctorByClinicService } from "../../../Services/doctorServices";
import { getAllClinicService } from "../../../Services/clinicServices";
import {
  getAppointmentSurgeryUserService,
  getAppointmentUserService,
} from "../../../Services/supplierService";
import { Menu, Transition } from "@headlessui/react";
import SearchBox from "../../../Components/SearchBox";
import {
  cancelAppointmentSurgeryService,
  getAllAppointmentSurgeryService,
  seacrhAppointmentSurgery,
  searchAppointmentSurgeryService,
} from "../../../Services/appointmentSurgeryService";
import {
  cancelAppointmentService,
  getAllAppointmentService,
  seacrhAppointment,
  searchAppointmentService,
} from "../../../Services/appointmentService";
import LoadingBtn from "../../../utils/LoadingBtn";
import Link from "next/link";
import { useRef } from "react";
import { useExcelDownloder } from "react-xls";
const Appointment = () => {
  const [appointment, setAppointment] = useState(null);
  const [filterData, setFilteredData] = useState(null);
  const [cancel, setCancel] = useState(-1);
  const [status, setStatus] = useState(0);
  const [cancelStatus, setCancelStatus] = useState(0);
  const [tab, setTab] = useState(0);
  const [allClinic, setAllClinic] = useState([]);
  const [allDoctor, setAllDoctor] = useState([]);
  const [clinic, setClinic] = useState(null);
  const [description, setDescription] = useState("");
  const [searchStatus, setSearchStatus] = useState(0);
  const pageRef = useRef(null);

  const { ExcelDownloder, Type } = useExcelDownloder();

  const [excelData, setExcelData] = useState([]);

  const data1 = {
    files: excelData,
  };

  const [doctor, setDoctor] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(50);
  const [sort, setSort] = useState("");
  const [desc, setDesc] = useState(null);
  const head = [
    { id: 1, title: "نام و نام خانوادگی" },
    { id: 2, title: "تلفن همراه" },
    { id: 4, title: "زمان مراجعه", arrow: true },
    { id: 9, title: "مطب" },
    { id: 10, title: "پزشک معالج" },
    { id: 6, title: "کارشناس" },
    { id: 11, title: "تاریخ ثبت" },
    { id: 7, title: "وضعیت" },
    { id: 8, title: "عملیات" },
  ];
  const headSurgery = [
    { id: 1, title: "نام و نام خانوادگی" },
    { id: 2, title: "تلفن همراه" },
    { id: 4, title: "زمان مراجعه" },
    { id: 10, title: "مطب" },
    { id: 12, title: "پزشک معالج" },
    { id: 6, title: "کارشناس" },
    { id: 9, title: "بیعانه" },
    { id: 11, title: "تاریخ ثبت" },
    { id: 7, title: "وضعیت" },
    { id: 8, title: "عملیات" },
  ];

  const router = useRouter();
  const { user, loading } = useAuth();
  const userDispatch = useAuthActions();
  const getData = async () => {
    setStatus(1);
    if (tab === 0) {
      await getAppointmentUserService(
        {
          count: count,
          page: page,
          doctor_id: doctor,
          clinic_id: clinic,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
            setAppointment([]);
            setFilteredData([]);
          } else {
            setAppointment(data.result);
            setFilteredData(data.result);

            let result = data.result;

            const formattedData = result?.map((item) => ({
              نام: item.document && item.document.name,
              تلفن: item.document && item.document.tell,
              "زمان مراجعه":
                item.VisitTime.slice(0, 5) |
                moment(item.dateOfDay).locale("fa").format(" YYYY/MM/DD"),
              مطب:
                allClinic &&
                allClinic.length &&
                allClinic.filter(
                  (i) => Number(i.id) === Number(item.clinic_id)
                )[0]?.title,
              "پزشک معالج": item.doctor && item.doctor.name,
              کارشناس:
                item.supplier &&
                item.supplier.first_name + " " + item.supplier.last_name,
              "تاریخ ثبت": moment(item.created_at)
                .locale("fa")
                .format("YYYY/MM/DD"),
              وضعیت: item.status === 1 ? "ثبت شده" : "کنسل شده",
            }));
            setExcelData(formattedData);
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
    } else {
      await getAppointmentSurgeryUserService(
        {
          count: count,
          page: page,
          doctor_id: doctor,
          clinic_id: clinic,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
            setAppointment([]);
            setFilteredData([]);
          } else {
            setAppointment(data.result);
            setFilteredData(data.result);
            let result = data.result;

            const formattedData = result?.map((item) => ({
              نام: item.document && item.document.name,
              تلفن: item.document && item.document.tell,
              "زمان مراجعه":
                item.VisitTime.slice(0, 5) |
                moment(item.dateOfDay).locale("fa").format(" YYYY/MM/DD"),
              مطب:
                allClinic &&
                allClinic.length &&
                allClinic.filter(
                  (i) => Number(i.id) === Number(item.clinic_id)
                )[0]?.title,
              "پزشک معالج": item.doctor && item.doctor.name,
              کارشناس:
                item.supplier &&
                item.supplier.first_name + " " + item.supplier.last_name,
              "تاریخ ثبت": moment(item.created_at)
                .locale("fa")
                .format("YYYY/MM/DD"),
              وضعیت: item.status === 1 ? "ثبت شده" : "کنسل شده",
              بیعانه: item?.deposit,
            }));
            setExcelData(formattedData);
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
    }
  };
  const getAllData = async () => {
    setStatus(1);
    if (tab === 0) {
      await getAllAppointmentService(
        {
          count: count,
          page: page,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
            setAppointment([]);
            setFilteredData([]);
          } else {
            setAppointment(data.result);
            setFilteredData(data.result);

            let result = data.result;

            const formattedData = result?.map((item) => ({
              نام: item.document && item.document.name,
              تلفن: item.document && item.document.tell,
              "زمان مراجعه":
                item.VisitTime.slice(0, 5) |
                moment(item.dateOfDay).locale("fa").format(" YYYY/MM/DD"),
              مطب:
                allClinic &&
                allClinic.length &&
                allClinic.filter(
                  (i) => Number(i.id) === Number(item.clinic_id)
                )[0]?.title,
              "پزشک معالج": item.doctor && item.doctor.name,
              کارشناس:
                item.supplier &&
                item.supplier.first_name + " " + item.supplier.last_name,
              "تاریخ ثبت": moment(item.created_at)
                .locale("fa")
                .format("YYYY/MM/DD"),
              وضعیت: item.status === 1 ? "ثبت شده" : "کنسل شده",
            }));

            setExcelData(formattedData);
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
    } else {
      await getAllAppointmentSurgeryService(
        {
          count: count,
          page: page,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
            setAppointment([]);
            setFilteredData([]);
          } else {
            setAppointment(data.result);
            setFilteredData(data.result);

            let result = data.result;

            const formattedData = result?.map((item) => ({
              نام: item.document && item.document.name,
              تلفن: item.document && item.document.tell,
              "زمان مراجعه":
                item.VisitTime.slice(0, 5) |
                moment(item.dateOfDay).locale("fa").format(" YYYY/MM/DD"),
              مطب:
                allClinic &&
                allClinic.length &&
                allClinic.filter(
                  (i) => Number(i.id) === Number(item.clinic_id)
                )[0]?.title,
              "پزشک معالج": item.doctor && item.doctor.name,
              کارشناس:
                item.supplier &&
                item.supplier.first_name + " " + item.supplier.last_name,
              "تاریخ ثبت": moment(item.created_at)
                .locale("fa")
                .format("YYYY/MM/DD"),
              وضعیت: item.status === 1 ? "ثبت شده" : "کنسل شده",
              بیعانه: item?.deposit,
            }));
            setExcelData(formattedData);
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
    }
  };
  const cancelAppointment = () => {
    setCancelStatus(1);
    if (tab === 0) {
      cancelAppointmentService(
        {
          appointment_id: cancel,
          description,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success(data.result[0]);
            if (doctor && clinic) {
              getData();
            } else {
              getAllData();
            }
            setCancelStatus(0);
          }
          setCancel(-1);
          setDescription("");
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
          appointment_id: cancel,
          description,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success(data.result[0]);
            if (doctor && clinic) {
              getData();
            } else {
              getAllData();
            }
            j;
          }
          setCancel(-1);
          setDescription("");
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
          setCancel(-1);
          setDescription("");
        });
    }
  };
  const searchHandler = (e) => {
    if (e !== "" && e.length === 11) {
      setSearchStatus(1);
      if (tab === 0) {
        seacrhAppointment(
          { statement: e },
          {
            Authorization: "Bearer " + user.token,
          }
        ).then(({ data }) => {
          setFilteredData(data.result.appointment);
          setSearchStatus(0);
        });
      } else {
        seacrhAppointmentSurgery(
          { statement: e },
          {
            Authorization: "Bearer " + user.token,
          }
        ).then(({ data }) => {
          setFilteredData(data.result.appointment);
          setSearchStatus(0);
        });
      }
    }
  };
  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
    if (user && !loading) {
      getAllData();
      getAllClinicService({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setAllClinic(data.result);
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
  }, [user, loading]);
  useEffect(() => {
    pageRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [page]);
  useEffect(() => {
    if (user && user.token && clinic) {
      getDoctorByClinicService(clinic, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setAllDoctor(data.result);
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
  }, [clinic]);
  useEffect(() => {
    if (sort === "date" && appointment) {
      let s = appointment.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.date) - new Date(a.date);
      });
    }
  }, [sort]);
  useEffect(() => {
    if (user && user.token && doctor && clinic) {
      getData();
    }
    if (user && !loading && !doctor && !clinic) {
      getAllData();
    }
  }, [tab, doctor, count, page, clinic]);
  useEffect(() => {}, [tab]);
  const tabs = [
    { id: 0, text: "ویزیت" },
    { id: 1, text: "جراحی" },
  ];
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  if (!appointment) return <PageLoading />;


  return (
    <Layout>
      <div ref={pageRef} className="h-full w-full ">
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <div className="flex flex-row items-center gap-5">
            <h1 className="text-xl text-gray-900">نوبت دهی</h1>
            <div>
              <Tabs options={tabs} setTab={setTab} tab={tab} />
            </div>
          </div>
          <div>
            <div className="flex flex-row gap-3">
              <div className="w-36 ">
                <FilterSelect
                  selectOption={allClinic}
                  name="searchSelect"
                  label="مطب"
                  labelOption="title"
                  valueOption="id"
                  value={clinic}
                  changeHandler={(e) => setClinic(e.id)}
                />
              </div>
              <div className="w-36">
                <FilterSelect
                  selectOption={allDoctor}
                  name="searchSelect"
                  label="پزشک"
                  labelOption="name"
                  valueOption="id"
                  changeHandler={(e) => setDoctor(e.id)}
                  value={doctor}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row items-center justify-between px-6 py-4">
          <div className="w-[40%]">
            <SearchBox
              allData={appointment}
              changeHandler={searchHandler}
              isState={false}
              setFilteredData={setFilteredData}
              status={searchStatus}
              tab={tab}
            />
          </div>
          <div className="flex flex-row items-center gap-3">
            <div className={status === 1 ? "animate-spin" : ""}>
              <IconBtn
                icon={<MdLoop />}
                onClick={() => {
                  setStatus(1);
                  if (doctor && clinic) {
                    getData();
                  } else {
                    getAllData();
                  }
                }}
              />
            </div>
            <CountSelect setCount={setCount} count={count} />
            <div className="w-32 h-12">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="w-32 h-12 flex flex-row items-center justify-center rounded-cs bg-primary-900 text-[13px] min-w-fit  text-white text-xs xl:text-[13px] hover:shadow-btn duration-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:shadow-none disabled:cursor-not-allowed">
                    نوبت جدید
                    <span className="block mr-2 text-2xl">
                      <MdAddCircleOutline />
                    </span>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-32 z-50 text-center origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() =>
                              router.push("/admin/appointment/add")
                            }
                            className="py-2 border-b border-primary-500 w-full"
                          >
                            نوبت ویزیت
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() =>
                              router.push("/admin/appointment/add-surgery")
                            }
                            className="py-2"
                          >
                            نوبت جراحی
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            <div className="flex flex-row items-center justify-center rounded-cs   min-w-fit text-primary-900 text-xs h-12">
              <ExcelDownloder
                key={tab + JSON.stringify(excelData)}
                data={{ files: excelData }}
                filename={tab == 1 ? "نوبت جراحی" : "نوبت ویزیت"}
                type={Type.Button}
              >
                دانلود اکسل
              </ExcelDownloder>
            </div>
          </div>
        </div>
        <div className="w-full max-w-full overflow-x-scroll ">
          <table className="w-full  min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
            <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
              <tr className="text-right text-sm">
                <th className="w-20 text-center border border-gray-200 relative text-gray-900">
                  ردیف
                </th>
                {tab === 0
                  ? head.map((item) => (
                      <th
                        key={item.id}
                        className=" text-right border px-3 border-gray-200 relative text-gray-900"
                        onClick={() => setSort("date")}
                      >
                        {item.title}
                        {item.arrow ? (
                          <div className="rotate-[270deg] absolute left-1 top-3">
                            <MdArrowRightAlt />
                          </div>
                        ) : null}
                      </th>
                    ))
                  : headSurgery.map((item) => (
                      <th
                        key={item.id}
                        className=" text-right border px-3 border-gray-200 relative text-gray-900"
                      >
                        {item.title}
                        {item.arrow ? (
                          <div className="rotate-[270deg] absolute left-1 top-3">
                            <MdArrowRightAlt />
                          </div>
                        ) : null}
                      </th>
                    ))}
              </tr>
            </thead>
            <tbody className="overflow-y-auto ">
              {filterData &&
                filterData.map((item, index) => (
                  <tr
                    key={index}
                    className="h-12 cursor-pointer text-sm text-gray-600 hover:bg-primary-50 duration-100"
                    onClick={() =>
                      router.push(
                        `/admin/record/detail/?id=${item.document_id}`
                      )
                    }
                  >
                    <td className="w-20 text-right px-3 border-x border-gray-200">
                      {(page - 1) * count + index + 1}
                    </td>

                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.document && item.document.name}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.document && item.document.tell}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.VisitTime.slice(0, 5)} |
                      {moment(item.dateOfDay)
                        .locale("fa")
                        .format(" YYYY/MM/DD")}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {allClinic &&
                        allClinic.length &&
                        allClinic.filter(
                          (i) => Number(i.id) === Number(item.clinic_id)
                        )[0]?.title}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.doctor && item.doctor.name}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.supplier &&
                        item.supplier.first_name +
                          " " +
                          item.supplier.last_name}
                    </td>
                    {tab === 1 && (
                      <td className=" text-right px-3 border-x border-gray-200">
                        {item.deposit}
                      </td>
                    )}
                    <td
                      className={` text-right px-3 border-x border-gray-200 ${
                        item.status !== 1 ? "text-red-700" : "text-gray-900"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {moment(item.created_at)
                        .locale("fa")
                        .format("YYYY/MM/DD")}
                    </td>
                    <td
                      className={` text-right px-3 border-x border-gray-200 ${
                        item.status !== 1 ? "text-red-700" : "text-gray-900"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.status === 1 ? (
                        "ثبت شده"
                      ) : (
                        <button
                          className="underline underline-offset-2"
                          onClick={() => setDesc(item.description)}
                        >
                          کنسل شده
                        </button>
                      )}
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className=" text-right flex flex-row items-center justify-start text-base px-3 lg:text-xl gap-3 h-12 border-x border-gray-200"
                    >
                      {item.status === 1 ? (
                        <IconBtn
                          icon={
                            <div className="relative text-2xl">
                              <MdCalendarToday />
                              <span className="text-[16px] absolute bg-white -bottom-0.5 -right-0.5">
                                <MdOutlineCancel />
                              </span>
                            </div>
                          }
                          onClick={() => setCancel(item.id)}
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {appointment && (
          <Pagination
            recordsCount={false}
            count={appointment.length}
            setPage={setPage}
            page={page}
          />
        )}
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
      {desc ? (
        <Modal
          setModal={() => {
            setDesc(null);
          }}
        >
          <div className="bg-white p-8 relative rounded-cs max-w-sm gap-8 min-w-[350px] flex flex-col ">
            <CloseBtn onClick={() => setDesc(null)} />
            <h2 className="text-xl"> علت کنسلی</h2>

            <p className="border border-primary-500 p-4 rounded-cs w-full">
              {desc}
            </p>
          </div>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default Appointment;
