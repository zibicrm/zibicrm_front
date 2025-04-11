import { MdArrowForward, MdOutlineQrCodeScanner } from "react-icons/md";
import Layout from "../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import PrimaryBtn from "../../../common/PrimaryBtn";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SelectInput from "../../../common/SelectInput";
import Calendar from "../../../common/Calendar";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";

import SelectAppoitment from "../../../Components/SelectAppointment";
import Error from "next/error";
import { toast } from "react-toastify";
import { getAllClinicService } from "../../../Services/clinicServices";
import { getDoctorByClinicService } from "../../../Services/doctorServices";
import Search from "../../../Components/Search";
import SearchInPatients from "../../../Components/SearchInPatients";
import { getServiceByClinic } from "../../../Services/serviceRequest";
import {
  getDateTableVisit,
  getTimeTableVisit,
  setNewReserveVisit,
  setNewReserveVisitVip,
} from "../../../Services/appointmentService";
import Input from "../../../common/Input";
import TimePicker from "../../../common/TimePicker";
import moment from "moment-timezone";
import OutlineBtn from "../../../common/OutlineBtn";
import Tabs from "../../../Components/Tabs";
import { setNewReserveSurgeryVip } from "../../../Services/appointmentSurgeryService";
import CurrencyInputComponent from "../../../common/CurrencyInput";
import Modal from "../../../Components/Modal";
import { IoCheckmark } from "react-icons/io5";
import { v1 as uuidv1 } from "uuid";
import Link from "next/link";
import QRCode from "react-qr-code";
import { CloseBtn } from "../../../common/CloseBtn";
import { useRef } from "react";
import LatestPatientDetailsModal from "../../../Components/LatestPatientDetailsModal";
import { searchRecordService } from "../../../Services/recordServices";

const AddAppointment = () => {
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const [select, setSelect] = useState(0);
  const [days, setDays] = useState([
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [allTimes, setAllTimes] = useState([]);
  const [status, setStatus] = useState(0);
  const [allDoctor, setAllDoctor] = useState([]);
  const [allService, setAllService] = useState([]);
  const [allClinic, setAllClinic] = useState();
  const [userInfo, setUserInfo] = useState();
  const [showTime, setShowTime] = useState(0);
  const [qrValue, setQrValue] = useState(null);
  const [time, setTime] = useState("12:34pm");
  const [selectTab, setTab] = useState(null);
  const uuidRef = useRef(false);
  let s = moment.now();
  let nowDay = moment(s).format("YYYY/MM/DD");
  const [uuid, setUuid] = useState(null);
  const TimeHandler = (e) => {
    formik.setFieldValue(
      "VisitTime",
      e === "12:00 am" ? "23:59" : moment(e, "hh:mm:ss A").format("HH:mm")
    );
  };

  const getRefreshData = () => {
    searchRecordService(
      { statement: userInfo.tell },
      {
        Authorization: "Bearer " + user.token,
      }
    ).then(({ data }) => {
      setUserInfo(data.result.documents[0]);
    });
  };

  const validationSchema = yup.object({
    doctor_id: yup.string().required("دکتر را انتخاب کنید"),
    service_id: yup.string().required("خدمت را انتخاب کنید"),
    clinic_id: yup.string().required("کلینیک را انتخاب کنید"),
  });
  const initialValues = {
    doctor_id: "",
    document_id: "",
    service_id: "",
    clinic_id: userInfo ? userInfo.address_id : "",
    VisitTime: "",
    deposit: "",
    description: "",
    sms: "1",
    image: "",
    uuid: uuid,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      if (selectTab === 0) {
        setNewReserveVisitVip(
          { ...select, ...values },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              toast.success("نوبت ویزیت با موفقیت رزرو شد");
              router.push("/admin/appointment");
            }
            formik.setStatus(0);
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
            formik.setStatus(0);
          });
      } else {
        setNewReserveSurgeryVip(
          { ...select, ...values },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              toast.success("نوبت جراحی با موفقیت رزرو شد");
              router.push("/admin/appointment");
            }
            formik.setStatus(0);
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
            formik.setStatus(0);
          });
      }
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });
  useEffect(() => {
    if (uuidRef.current === false) {
      uuidRef.current = true;
      setUuid(uuidv1());
    }
  }, []);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
    if (user && !loading) {
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
  }, [loading]);
  useEffect(() => {
    if (
      user &&
      user.token &&
      formik.values.clinic_id &&
      formik.values.clinic_id !== 7
    ) {
      getDoctorByClinicService(formik.values.clinic_id, {
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
  }, [formik.values.clinic_id]);
  useEffect(() => {
    if (
      user &&
      user.token &&
      formik.values.clinic_id &&
      formik.values.clinic_id !== 7
    ) {
      getServiceByClinic(formik.values.clinic_id, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
            setAllService([]);
          } else {
            setAllService(data.result);
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
  }, [formik.values.clinic_id]);
  useEffect(() => {
    if (userInfo && userInfo.id) {
      formik.setFieldValue("document_id", userInfo.id);
    }
  }, [userInfo]);

  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <button
            onClick={() => router.push("/admin/appointment/")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900">
            ثبت نوبت دهی ویژه{" "}
            {selectTab === 1 ? "جراحی" : selectTab === 0 ? "ویزیت" : null}{" "}
          </h1>
          <div className="w-28 h-10">
            <PrimaryBtn text="تغییر نوع نوبت" onClick={() => setTab(null)} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          <div className="w-full h-12">
            <SearchInPatients
              setUser={setUserInfo}
              access="admin"
              placeholder="نام بیمار"
            />
          </div>

          {/* {userInfo && userInfo.address_id === 7 && (
            <SelectInput
              formik={formik}
              label="مطب"
              name="clinic_id"
              selectOption={allClinic}
              labelOption="title"
              valueOption="id"
            />
          )} */}
          <SelectInput
            formik={formik}
            label="نام پزشک"
            name="doctor_id"
            selectOption={allDoctor}
            labelOption="name"
            valueOption="id"
          />
          <SelectInput
            formik={formik}
            label="نوع خدمات"
            name="service_id"
            selectOption={allService}
            labelOption="title"
            valueOption="id"
          />
          {selectTab === 1 ? (
            <>
              <CurrencyInputComponent
                formik={formik}
                label="بیعانه (تومان)"
                name="deposit"
              />
              {formik.values.deposit ? (
                <div className="w-full">
                  <div className="w-full h-12">
                    <PrimaryBtn
                      text="آپلود سند مالی"
                      type="button"
                      // disabled={!finalFormik.isValid}
                      onClick={() =>
                        setQrValue(
                          `${
                            uuid +
                            "_" +
                            nowDay +
                            "_" +
                            formik.values.deposit +
                            "_" +
                            userInfo.id +
                            "_" +
                            1
                          }`
                        )
                      }
                    >
                      <MdOutlineQrCodeScanner />
                    </PrimaryBtn>
                  </div>
                  {formik.errors.image && formik.touched.deposit && (
                    <div className="md:text-xs text-[10px] text-red-300 mt-1.5">
                      {formik.errors.image}
                    </div>
                  )}
                </div>
              ) : null}
            </>
          ) : null}
          <div className="flex flex-col items-start h-10 md:h-12 mt-4">
            <input
              type="checkbox"
              id={"formikCheckbox" + "sms"}
              name="sms"
              // {...formik.getFieldProps("sms")}
              onClick={(e) =>
                formik.values.sms === "1"
                  ? formik.setFieldValue("sms", "0")
                  : formik.setFieldValue("sms", "1")
              }
              className="hidden"
            />
            <div className="flex flex-row items-center gap-2">
              <label
                htmlFor={"formikCheckbox" + "sms"}
                className={`flex items-center justify-center cursor-pointer rounded-cs w-6 h-6  ${
                  formik.values.sms === "1" && "checked  text-lg  "
                } ${
                  formik.values.sms !== "1" &&
                  "bg-primary-100 text-field   border border-primary-400 "
                } `}
              >
                {formik.values.sms === "1" ? <IoCheckmark /> : null}
              </label>
              <label
                htmlFor={"formikCheckbox" + "sms"}
                className="text-gray-900 text-xs"
              >
                ارسال پیامک
              </label>
            </div>
            {formik.errors.sms && formik.touched.sms && (
              <div className="text-xs text-red-300 text-right mt-0">
                {formik.errors.sms}
              </div>
            )}
          </div>
          {/* <FormikCheckBox label="ارسال پیامک" name="" formik={formik} /> */}
          <div className="col-span-3 flex flex-row items-start">
            <div className={`w-1/2`}>
              <Calendar
                select={select}
                setSelect={setSelect}
                days={days}
                vip={true}
              />
            </div>
            <div
              className={`${
                select ? "w-1/2 flex flex-col items-center gap-4" : "hidden"
              }`}
            >
              <span className="text-gray-900">
                لطفا ساعت ویزیت را انتخاب کنید
              </span>
              <div className=" flex items-end justify-center  relative w-full">
                {showTime > 0 ? (
                  <TimePicker
                    showTime={showTime}
                    setShowTime={(e) => setShowTime(e)}
                    setTime={TimeHandler}
                    time={time}
                  />
                ) : (
                  <div className="w-48 h-12 text-gray-900">
                    <OutlineBtn onClick={() => setShowTime(true)}>
                      {formik.values.VisitTime}
                    </OutlineBtn>
                  </div>
                )}
              </div>
            </div>
          </div>
          <textarea
            placeholder="توضیحات"
            {...formik.getFieldProps("description")}
            className={`p-2 border border-primary-400 bg-white rounded-cs outline-none w-full max-h-56 min-h-[48px] h-56 col-span-3`}
          />
        </div>
        <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
          <div className={"col-span-2"}></div>
          <div className="h-12 ">
            <PrimaryBtn
              text={`ثبت نوبت ${selectTab === 0 ? "ویزیت" : "جراحی"} جدید`}
              type="submit"
              status={formik.status}
              disabled={formik.status === 1 || !formik.isValid}
            />
          </div>
        </div>
      </form>
      {selectTab === null ? (
        <Modal>
          <div className="bg-white w-96 h-48 p-6 rounded-cs flex flex-col items-center gap-6">
            <span className="text-base text-gray-900">نوع نوبت</span>
            <p className="text-gray-900">نوع نوبت ویژه خود را انتخاب نمایید </p>
            <div className="w-full  flex flex-row justify-between gap-6">
              <button
                onClick={() => setTab(0)}
                className="w-1/2 h-12 rounded-cs cursor-pointer  px-2 flex items-center justify-center border border-primary-900 font-normal text-xs xl:text-base text-primary-900 disabled:border-gray-100 disabled:text-gray-100 hover:bg-primary-900 hover:text-white  duration-300 hover:shadow-btn"
              >
                نوبت ویزیت
              </button>
              <button
                onClick={() => setTab(1)}
                className="w-1/2 h-12 rounded-cs cursor-pointer  px-2 flex items-center justify-center border border-primary-900 font-normal text-xs xl:text-base text-primary-900 disabled:border-gray-100 disabled:text-gray-100 hover:bg-primary-900 hover:text-white  duration-300 hover:shadow-btn"
              >
                نوبت جراحی
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
      {qrValue ? (
        <Modal setModal={() => null}>
          <div className="w-96 h-96 bg-white p-6 rounded-cs flex items-center flex-col gap-2">
            <div className="flex flex-col items-start w-full gap-2">
              <h1 className="text-lg">اسکن QR Code</h1>
              <p className="text-xs w-full flex flex-col gap-1">
                لطفا بارکد را در آدرس زیر اسکن کنید
                <br />
                <Link href={"/upload"}>
                  <a
                    target="_blank"
                    rel="nofollow"
                    className="w-full text-sm text-primary-600 text-left"
                  >
                    www.radmanit.ir/upload
                  </a>
                </Link>
              </p>
            </div>
            <div className="w-full flex items-center justify-center py-4 border-2 border-dashed border-primary-200 ">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "70%", width: "70%" }}
                className=""
                value={qrValue}
                viewBox={`0 0 256 256`}
              />
            </div>
          </div>
          <CloseBtn onClick={() => setQrValue(null)} />
        </Modal>
      ) : null}
      {userInfo && userInfo.address_id === 7 && (
        <LatestPatientDetailsModal
          id={userInfo.id}
          name={userInfo.name}
          getData={getRefreshData}
        />
      )}
    </Layout>
  );
};

export default AddAppointment;
