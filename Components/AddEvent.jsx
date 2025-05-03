import { CloseBtn } from "../common/CloseBtn";
import DatePickerComponent from "../common/DatePicker";
import PrimaryBtn from "../common/PrimaryBtn";
import RadioInput from "../common/RadioBtn";
import SelectInput from "../common/SelectInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import Calendar from "../common/Calendar";
import { toast } from "react-toastify";
import { useAuth, useAuthActions } from "../Provider/AuthProvider";
import {
  getAllClinicService,
  sendTolaboratory,
} from "../Services/clinicServices";
import { useRouter } from "next/router";
import { getDoctorByClinicService } from "../Services/doctorServices";
import { getServiceByClinic } from "../Services/serviceRequest";
import {
  getDateTableVisit,
  getTimeTableVisit,
} from "../Services/appointmentService";
import Input from "../common/Input";
import {
  getDateTableSurgery,
  getTimeTableSurgery,
} from "../Services/appointmentSurgeryService";
import SetAttendTime from "./SetAttendTime";
import SelectAppoitment from "./SelectAppointment";
import { newEventService } from "../Services/eventsServices";
import { getAllParaclinicService } from "../Services/paraclinicServices";
import CurrencyInput from "react-currency-input-field";
import CurrencyInputComponent from "../common/CurrencyInput";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import QRCode from "react-qr-code";
import Link from "next/link";
import Modal from "./Modal";
import { v1 as uuidv1 } from "uuid";
import moment from "jalali-moment";
import { useRef } from "react";

const AddEvent = ({ setOpen, userInfo, event_type }) => {
  const [select, setSelect] = useState(null);
  const [selectShow, setSelectShow] = useState(null);
  const [status, setStatus] = useState(0);
  const [timeStatus, setTimeStatus] = useState(0);
  const [days, setDays] = useState([]);
  const [allClinic, setAllClinic] = useState([]);
  const [allDoctor, setAllDoctor] = useState([]);
  const [allService, setAllService] = useState([]);
  const [allTimes, setAllTimes] = useState([]);
  const [paraClinic, setParaclinic] = useState([]);
  const [reserve, setReserve] = useState(null);
  const { user, loading } = useAuth();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const [qrValue, setQrValue] = useState(null);
  const uuidRef = useRef(false);

  let s = moment.now();
  let nowDay = moment(s).format("YYYY/MM/DD");
  const [uuid, setUuid] = useState(null);
  const statusList = [
    { id: 0, value: "بیمار جدید" },
    { id: 1, value: "پیگیری" },
    { id: 2, value: "مشاوره و اطلاعات" },
    { id: 3, value: "نوبت ویزیت " },
    { id: 4, value: "نوبت جراحی" },
    { id: 5, value: "عدم پاسخ" },
    { id: 6, value: "ارجاع به پاراکلینیک" },
    { id: 7, value: "تصمیم گیری" },
    { id: 8, value: "انصراف" },
    { id: 11, value: "کنسل نوبت" },
    { id: 13, value: "ارسال به لابراتوار" },
    { id: 14, value: "بیعانه" },
    { id: 12, value: "سایر..." },
  ];

  const renderSelect = (id) => {
    switch (id) {
      case "1":
        return (
          <div className="w-full h-full">
            <DatePickerComponent
              name="follow_up_date"
              formik={formik}
              label="تاریخ پیگیری"
              text="تاریخ پیگیری"
            />
          </div>
        );
      case "6":
        return (
          <div className="h-12 w-full">
            <SelectInput
              formik={formik}
              label="آدرس رادیولوژی"
              name="para_clinic_id"
              selectOption={paraClinic}
              labelOption="title"
              valueOption="id"
            />
          </div>
        );
      case "3":
        return (
          <>
            {userInfo && userInfo.address_id === -1 && (
              <div className="h-12 w-full">
                <SelectInput
                  formik={formik}
                  label="مطب"
                  name="clinic_id"
                  selectOption={allClinic}
                  labelOption="title"
                  valueOption="id"
                />
              </div>
            )}

            <div className="h-12 w-full">
              <SelectInput
                formik={formik}
                label="پزشک"
                name="doctor_id"
                selectOption={allDoctor}
                labelOption="name"
                valueOption="id"
              />
            </div>
            <div className="h-12 w-full">
              <SelectInput
                formik={formik}
                label="نوع خدمت"
                name="service_id"
                selectOption={allService}
                labelOption="title"
                valueOption="id"
              />
            </div>

            {select && select.dateOfDay ? (
              <div className="w-full">
                <SelectAppoitment
                  allTimes={allTimes}
                  select={select}
                  status={timeStatus}
                  reserve={reserve}
                  setReserve={setReserve}
                  back={true}
                  setSelect={setSelect}
                  setSelectShow={setSelectShow}
                />
              </div>
            ) : (
              <div className="w-full">
                <Calendar
                  select={select}
                  setSelect={setSelect}
                  days={days}
                  vip={false}
                />
              </div>
            )}
          </>
        );
      case "4":
        return (
          <>
            {userInfo && userInfo.address_id === -1 && (
              <div className="h-12 w-full">
                <SelectInput
                  formik={formik}
                  label="مطب"
                  name="clinic_id"
                  selectOption={allClinic}
                  labelOption="title"
                  valueOption="id"
                />
              </div>
            )}

            <div className="h-12 w-full">
              <SelectInput
                formik={formik}
                label="پزشک"
                name="doctor_id"
                selectOption={allDoctor}
                labelOption="name"
                valueOption="id"
              />
            </div>
            <div className="h-12 w-full">
              <SelectInput
                formik={formik}
                label="نوع خدمت"
                name="service_id"
                selectOption={allService}
                labelOption="title"
                valueOption="id"
              />
            </div>
            <CurrencyInputComponent
              name="deposit"
              type="text"
              label="بیعانه دریافتی (تومان)"
              formik={formik}
            />
            {formik.values.deposit ? (
              <div className="w-full">
                <div className="w-full h-12">
                  <PrimaryBtn
                    text="آپلود سند مالی"
                    type="button"
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
                {formik.errors.image && formik.touched.price && (
                  <div className="md:text-xs text-[10px] text-red-300 mt-1.5">
                    {formik.errors.image}
                  </div>
                )}
              </div>
            ) : null}
            {select && select.dateOfDay ? (
              <div className="w-full">
                <SelectAppoitment
                  allTimes={allTimes}
                  select={select}
                  status={timeStatus}
                  reserve={reserve}
                  setReserve={setReserve}
                  setSelect={setSelect}
                  back={true}
                  setSelectShow={setSelectShow}
                />
              </div>
            ) : (
              <div className="w-full">
                <Calendar
                  select={select}
                  setSelect={setSelect}
                  days={days}
                  vip={false}
                />
              </div>
            )}
          </>
        );
      case "13":
        return (
          <div className="w-full h-full">
            <DatePickerComponent
              name="follow_up_date"
              formik={formik}
              label="تاریخ پیگیری برای تحویل"
              text="تاریخ  پیگیری برای تحویل"
            />
          </div>
        );
      case "14":
        return (
          <>
            <div className="w-full h-full">
              <CurrencyInputComponent
                name="amount"
                formik={formik}
                label="مبلغ دریافتی"
                text="مبلغ دریافتی"
              />
            </div>
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
              {formik.errors.image && formik.touched.price && (
                <div className="md:text-xs text-[10px] text-red-300 mt-1.5">
                  {formik.errors.image}
                </div>
              )}
            </div>
          </>
        );
      default:
        null;
    }
  };

  const validationSchema = yup.object({
    io_call: yup.string().required("نوع تماس را وارد کنید"),
    event_type_id: yup.string().required("وضعیت را وارد کنید"),
    deposit: yup.number().typeError("عدد وارد کنید"),
  });
  const initialValues = {
    document_id: userInfo && userInfo.id,
    io_call: "",
    event_type_id: event_type ? event_type : "",
    description: "",
    follow_up_date: "",
    para_clinic_id: "",
    cancel_visit_id: "",
    // day: "",
    // dateOfDay: "",
    // VisitTime: "",
    clinic_id: userInfo ? userInfo.address_id : "",
    doctor_id: "",
    service_id: "",
    deposit: "",
    amount: "",
    image: "",
    uuid: uuid,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      let finalValue =
        values.event_type_id === "4"
          ? { VisitTime: reserve, ...select, ...values }
          : values.event_type_id === "3"
          ? { VisitTime: reserve, ...select, ...values }
          : values;

      newEventService(finalValue, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("با موفقیت ثبت شد");
            setOpen(false);
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
  const radioBtn = [
    { id: "1", label: "ورودی", value: "1" },
    { id: "2", label: "خروجی", value: "2" },
  ];
  useEffect(() => {
    if (uuidRef.current === false) {
      uuidRef.current = true;
      setUuid(uuidv1());
    }
  }, []);
  useEffect(() => {
    if (
      formik.values.event_type_id === "3" ||
      formik.values.event_type_id === "4"
    ) {
      getAllClinicService({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
            setAllClinic([]);
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
    if (formik.values.event_type_id === "6") {
      getAllParaclinicService({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setParaclinic(data.result);
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
  }, [formik.values.event_type_id]);
  useEffect(() => {
    if (user && user.token && formik.values.clinic_id) {
      getDoctorByClinicService(formik.values.clinic_id, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
            setAllDoctor([]);
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
    if (user && user.token && formik.values.clinic_id) {
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
      if (formik.values.event_type_id === "3") {
        getDateTableVisit(
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
      } else if (formik.values.event_type_id === "4") {
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
    }
  }, [formik.values.doctor_id]);
  useEffect(() => {
    if (
      user &&
      !loading &&
      formik.values.clinic_id &&
      formik.values.doctor_id &&
      select
    ) {
      setTimeStatus(1);
      if (formik.values.event_type_id == "3") {
        getTimeTableVisit(
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
      } else {
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
      }
    }
  }, [select]);
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="p-6 relative bg-white overflow-y-auto max-h-[95vh] min-w-[510px] flex flex-col items-start gap-8 "
    >
      <CloseBtn onClick={() => setOpen(false)} />
      <div className="text-base flex flex-row items-center gap-1 w-full">
        <span className="text-gray-900">ثبت وقایع</span>
        <span className="text-primary-900 flex flex-row">
          [
          <span className="max-w-[240px]  line-clamp-1">
            {userInfo && userInfo.name}
          </span>
          ]
        </span>
      </div>
      <div className={"flex flex-col items-start gap-8 w-full"}>
        <div className={`flex flex-row items-center gap-6 mt-0`}>
          <span className="text-sm text-gray-900">نوع تماس</span>
          <RadioInput formik={formik} radioOptions={radioBtn} name="io_call" />
        </div>
        <div className="h-12 w-full min-w-[290px]">
          <SelectInput
            formik={formik}
            label="وضعیت"
            name="event_type_id"
            selectOption={statusList}
            labelOption="value"
            valueOption="id"
            defaultV={[{ id: -15, value: "نوع" }]}
          />
        </div>
        {renderSelect(formik.values.event_type_id)}
        <textarea
          placeholder="توضیحات"
          {...formik.getFieldProps("description")}
          className={`p-2 border border-primary-400 bg-white rounded-cs outline-none w-full max-h-72 h-64`}
        />

        <div className="w-full flex items-center justify-end ">
          <div className="h-12 w-full">
            <PrimaryBtn
              text="ثبت وقایع"
              status={formik.status}
              disabled={!formik.isValid || formik.status === 1}
              type="submit"
            />
          </div>
        </div>
      </div>
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
    </form>
  );
};

export default AddEvent;
