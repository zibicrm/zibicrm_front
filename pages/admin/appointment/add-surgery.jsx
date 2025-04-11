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
} from "../../../Services/appointmentService";
import {
  getDateTableSurgery,
  getTimeTableSurgery,
  setNewReserveSurgery,
} from "../../../Services/appointmentSurgeryService";
import Input from "../../../common/Input";
import CurrencyInputComponent from "../../../common/CurrencyInput";
import { v1 as uuidv1 } from "uuid";
import Link from "next/link";
import Modal from "../../../Components/Modal";
import QRCode from "react-qr-code";
import { CloseBtn } from "../../../common/CloseBtn";
import { useRef } from "react";
import moment from "jalali-moment";
import LatestPatientDetailsModal from "../../../Components/LatestPatientDetailsModal";
import { searchRecordService } from "../../../Services/recordServices";

const AddAppointment = () => {
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const [select, setSelect] = useState(0);
  const [days, setDays] = useState([]);
  const [allTimes, setAllTimes] = useState([]);
  const [status, setStatus] = useState(0);
  const [allDoctor, setAllDoctor] = useState([]);
  const [allService, setAllService] = useState([]);
  const [allClinic, setAllClinic] = useState();
  const [userInfo, setUserInfo] = useState();
  const [reserve, setReserve] = useState();
  const [qrValue, setQrValue] = useState(null);
  const uuidRef = useRef(false);
  let s = moment.now();
  let nowDay = moment(s).format("YYYY/MM/DD");
  const [uuid, setUuid] = useState(null);


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
    deposit: "",
    description: "",
    image: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      setNewReserveSurgery(
        { ...select, ...values, VisitTime: reserve },
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
    if (user && user.token && formik.values.clinic_id &&
      formik.values.clinic_id !== 7) {
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
    if (user && user.token && formik.values.clinic_id &&
      formik.values.clinic_id !== 7) {
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
    if (
      user &&
      user.token &&
      formik.values.doctor_id &&
      formik.values.clinic_id
    ) {
      getDateTableSurgery(
        {
          doctor_id: formik.values.doctor_id,
          clinic_id: formik.values.clinic_id,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            let day = data.result.map((item) => item.day);
            setDays(day);
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
  }, [formik.values.doctor_id]);
  useEffect(() => {
    if (userInfo && userInfo.id) {
      formik.setFieldValue("document_id", userInfo.id);
    }
  }, [userInfo]);
  useEffect(() => {
    if (
      user &&
      !loading &&
      formik.values.clinic_id &&
      formik.values.doctor_id &&
      select
    ) {
      setStatus(1);

      getTimeTableSurgery(
        {
          doctor_id: formik.values.doctor_id,
          clinic_id: formik.values.clinic_id,
          ...select,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setAllTimes(data.result);
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
  }, [select]);
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
          <h1 className="text-xl text-gray-900">نوبت جراحی جدید</h1>
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
          {/* <Input
            name="deposit"
            type="text"
            label="بیعانه (تومان)"
            formik={formik}
          /> */}
          <CurrencyInputComponent
            formik={formik}
            label="بیعانه (تومان)"
            name="deposit"
          />
          {formik.values.deposit && formik.values.document_id ? (
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
          <div className="col-span-3 flex flex-row items-start">
            <div className={`w-1/2`}>
              <Calendar
                select={select}
                setSelect={setSelect}
                days={days}
                vip={false}
              />
            </div>
            <div className={`${select ? "w-1/2" : "hidden"}`}>
              <SelectAppoitment
                allTimes={allTimes}
                select={select}
                status={status}
                reserve={reserve}
                back={false}
                setSelect={setSelect}
                setReserve={setReserve}
              />
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
              text="ثبت نوبت جدید"
              type="submit"
              status={formik.status}
              disabled={formik.status === 1 || !formik.isValid}
            />
          </div>
        </div>
      </form>
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
