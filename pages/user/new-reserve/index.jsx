import React from "react";
import LayoutUser from "../../../Layout/LayoutUser";
import SelectInput from "../../../common/SelectInput";
import { useFormik } from "formik";
import * as yup from "yup";
import SelectAppoitment from "../../../Components/SelectAppointment";
import Calendar from "../../../common/Calendar";
import { useState } from "react";
import { useEffect } from "react";
import { getAllClinicService } from "../../../Services/clinicServices";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import { getDoctorByClinicService } from "../../../Services/doctorServices";
import { getServiceByClinic } from "../../../Services/serviceRequest";
import PrimaryBtn from "../../../common/PrimaryBtn";
import {
  getDateTableVisit,
  getTimeTableVisit,
  setNewReserveVisit,
} from "../../../Services/appointmentService";
import { toast } from "react-toastify";
import moment from "jalali-moment";
import PageLoading from "../../../utils/LoadingPage";
import { useRouter } from "next/router";
import { usePatientAuth, usePatientAuthActions } from "../../../Provider/PatientAuthProvider";
import Image from "next/image";
import { ImageBuilding } from "../../../assets/Images";

const NewReservePage = () => {
  const {user,loading} = usePatientAuth()
  const patientDispatcher =  usePatientAuthActions()
  const [select, setSelect] = useState(null);
  const [days, setDays] = useState([]);
  const [allClinic, setAllClinic] = useState([]);
  const [allDoctor, setAllDoctor] = useState([]);
  const [allService, setAllService] = useState([]);
  const [allTimes, setAllTimes] = useState([]);
  const [timeStatus, setTimeStatus] = useState(0);
  const [status, setStatus] = useState(0);
  const [reserve, setReserve] = useState(null);
  const userDispatch = useAuthActions();
  const [selectShow, setSelectShow] = useState(null);
  const router = useRouter();
  const [clinic,setClinic] = useState(null)
  const [doctor,setDoctor] = useState(null)
  const [service,setService] = useState(null)
  const [formSubmitted,setFormSubmitted] = useState(false)


  console.log('VISITTIME',select);
  console.log('DAY');
  console.log('DATE');

  let s = moment.now();
  let nowDay = moment(s).format("YYYY/MM/DD");

  const validationSchema = yup.object({
    clinic_id:yup.string().required('مطب را انتخاب کنید.')
    // io_call: yup.string().required("نوع تماس را وارد کنید"),
    // event_type_id: yup.string().required("وضعیت را وارد کنید"),
    // deposit: yup.number().typeError("عدد وارد کنید"),
  });
  const initialValues = {
    // document_id: userInfo && userInfo.id,
    // io_call: "",
    // event_type_id: event_type ? event_type : '',
    description: "",
    // follow_up_date: "",
    // para_clinic_id: "",
    // cancel_visit_id: "",
    // day: "",
    // dateOfDay: "",
    // VisitTime: "",
    clinic_id: "",
    doctor_id: "",
    service_id: "",
    // deposit: "",
    // amount: "",
    // image: "",
    // uuid: uuid,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      setFormSubmitted(true)

      setNewReserveVisit(
        {
          dateOfDay: select.dateOfDay,
          day: select.day,
          VisitTime: reserve,
          doctor_id: values.doctor_id,
          document_id: user.user.id,
          clinic_id: values.clinic_id,
          service_id: values.service_id,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0],{
              position: "top-right",
            });
          } else {
            console.log("new visit");
            toast.success("نوبت ویزیت با موفقیت رزرو شد",{
              position: "top-right",
            });
            // setReserve(null);
            // setReload(!reload);
            router.push({ pathname: window.location.href }, undefined, {
              scroll: false,
            });
          }
          formik.setStatus(0);
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
          formik.setStatus(0);
        });
      // let finalValue =
      //   values.event_type_id === "4"
      //     ? { VisitTime: reserve, ...select, ...values }
      //     : values.event_type_id === "3"
      //     ? { VisitTime: reserve, ...select, ...values }
      //     : values;

      // newEventService(finalValue, {
      //   Authorization: "Bearer " + user.token,
      // })
      //   .then(({ data }) => {
      //     if (data.status === false) {
      //       toast.error(data.message[0]);
      //     } else {
      //       toast.success("با موفقیت ثبت شد");
      //       setOpen(false);
      //     }
      //     formik.setStatus(0);
      //   })
      //   .catch((err) => {
      //     if (err.response && err.response.status === 401) {
      //       userDispatch({
      //         type: "LOGOUTNOTTOKEN",
      //       });
      //     }
      //     if (err.response) {
      //       toast.error(err.response.data.message);
      //     }
      //     formik.setStatus(0);
      //   });
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (user) {
      getAllClinicService({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0],{
              position: "top-right",
            });
            setAllClinic([]);
          } else {
            setAllClinic(data.result);
          }
        })
        .catch((err) => {
          // if (err.response && err.response.status === 401) {
          //   userDispatch({
          //     type: "LOGOUTNOTTOKEN",
          //   });
          // }
          // if (err.response) {
          //   toast.error(err.response.data.message);
          // }
        });
    }
  }, [loading]);

  useEffect(() => {
    if (user && user.token) {
      getDoctorByClinicService(formik.values.clinic_id, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0],{
              position: "top-right",
            });
            setAllDoctor([]);
          } else {
            setAllDoctor(data.result);
          }
        })
        .catch((err) => {
          // if (err.response && err.response.status === 401) {
          //   userDispatch({
          //     type: "LOGOUTNOTTOKEN",
          //   });
          // }
          // if (err.response) {
          //   toast.error(err.response.data.message);
          // }
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
            toast.error(data.message[0],{
              position: "top-right",
            });
            setAllService([]);
          } else {
            setAllService(data.result);
          }
        })
        .catch((err) => {
          // if (err.response && err.response.status === 401) {
          //   userDispatch({
          //     type: "LOGOUTNOTTOKEN",
          //   });
          // }
          // if (err.response) {
          //   toast.error(err.response.data.message);
          // }
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
            toast.error(data.message[0],{
              position: "top-right",
            });
          } else {
            let day = data.result.map((item) => item.day);
            setDays(day);
          }
        })
        .catch((err) => {
          // if (err.response && err.response.status === 401) {
          //   userDispatch({
          //     type: "LOGOUTNOTTOKEN",
          //   });
          // }
          // if (err.response) {
          //   toast.error(err.response.data.message);
          // }
        });

      // else if (formik.values.event_type_id === "4") {
      //   getDateTableSurgery(
      //     {
      //       doctor_id: formik.values.doctor_id,
      //       clinic_id: formik.values.clinic_id,
      //     },
      //     {
      //       Authorization: "Bearer " + user.token,
      //     }
      //   )
      //     .then(({ data }) => {
      //       if (data.status === false) {
      //         toast.error(data.message[0]);
      //       } else {
      //         let day = data.result.map((item) => item.day);
      //         setDays(day);
      //       }
      //     })
      //     .catch((err) => {
      //       if (err.response && err.response.status === 401) {
      //         userDispatch({
      //           type: "LOGOUTNOTTOKEN",
      //         });
      //       }
      //       if (err.response) {
      //         toast.error(err.response.data.message);
      //       }
      //     });
      // }
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
            toast.error(data.message[0],{
              position: "top-right",
            });
          } else {
            setAllTimes(data.result);
          }
          setTimeStatus(0);
        })
        .catch((err) => {
          // if (err.response && err.response.status === 401) {
          //   userDispatch({
          //     type: "LOGOUTNOTTOKEN",
          //   });
          // }
          // if (err.response) {
          //   toast.error(err.response.data.message);
          // }
          // setTimeStatus(0);
        });
    }
    // else {
    //   getTimeTableSurgery(
    //     {
    //       doctor_id: formik.values.doctor_id,
    //       clinic_id: formik.values.clinic_id,
    //       ...select,
    //     },
    //     {
    //       Authorization: "Bearer " + user.token,
    //     }
    //   )
    //     .then(({ data }) => {
    //       if (data.status === false) {
    //         toast.error(data.message[0]);
    //       } else {
    //         setAllTimes(data.result);
    //       }
    //       setTimeStatus(0);
    //     })
    //     .catch((err) => {
    //       if (err.response && err.response.status === 401) {
    //         userDispatch({
    //           type: "LOGOUTNOTTOKEN",
    //         });
    //       }
    //       if (err.response) {
    //         toast.error(err.response.data.message);
    //       }
    //       setTimeStatus(0);
    //     });
    // }
  }, [select]);


  useEffect(() => {
    if (!loading && !user && !user?.token) {
      router.push("/user/user-login");
    }
  }, []);

  if(loading){
    return <PageLoading />
  }

  return (
    <LayoutUser>
      <div className="md:mt-8">
        <h1 className="text-gray-900 md:font-bold md:text-xl md:mt-8 ">ثبت نوبت جدید</h1>
        <div className="mt-24 flex flex-col items-center justify-center ">
          <div className="relative items-center justify-center w-[196px] h-[108px] md:w-[457px] md:h-[257px] ">
            <Image src={ImageBuilding} alt=""  layout="fill"/>
          </div>
          <p className="text-sm md:text-base text-gray-500 text-center mt-6 md:mt-8">
            این صفحه در دست طراحی می باشد
          </p>
        </div>
      </div>
    </LayoutUser>
  );

  return (
    <LayoutUser>
      <h1 className="text-gray-900 md:mt-8">ثبت نوبت جدید</h1>
      <div className="mt-8 md:bg-white md:p-6 md:shadow-card rounded-lg">
        <form onSubmit={formik.handleSubmit}>
          <div className="">
            <div className="flex flex-col gap-y-6 gap-x-4 md:flex-row">
              <div className="h-12 w-full md:w-1/3 ">
                <SelectInput
                  formik={formik}
                  label="مطب"
                  name="clinic_id"
                  selectOption={allClinic}
                  labelOption="title"
                  valueOption="id"
                />
                {/* {formSubmitted && formik.errors.clinic_id && <p>error</p>} */}
              </div>
              <div className="h-12 w-full md:w-1/3">
                <SelectInput
                  formik={formik}
                  label="پزشک"
                  name="doctor_id"
                  selectOption={allDoctor}
                  labelOption="name"
                  valueOption="id"
                />
              </div>
              <div className="h-12 w-full md:w-1/3">
                <SelectInput
                  formik={formik}
                  label="نوع خدمت"
                  name="service_id"
                  selectOption={allService}
                  labelOption="title"
                  valueOption="id"
                />
              </div>
            </div>
            <div className="mt-6 desktop:hidden">
              <h2 className="text-sm text-gray-500 mb-4">
                تاریخ مورد نظر خود را انتخاب نمایید
              </h2>
              {select && select.dateOfDay ? (
                <div className="w-full border border-gray-300 p-6 rounded-lg">
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
                <div className="w-full border border-gray-300 p-6 rounded-lg">
                  <Calendar
                    select={select}
                    setSelect={setSelect}
                    days={days}
                    vip={false}
                  />
                </div>
              )}
              {/* {formSubmitted && !select && <p>error</p>} */}
            </div>
            <div className="hidden col-span-3 border border-gray-300 rounded-lg desktop:flex flex-row items-start mt-8">
              <div className={`w-1/2 border-l border-gray-300 px-6 py-6`}>
                <Calendar
                  select={select}
                  setSelect={setSelect}
                  days={days}
                  vip={false}
                />
              </div>
              <div className={`${select ? "w-1/2 pl-6 py-6" : "hidden"}`}>
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
              className={`p-2 border border-primary-400 bg-white rounded-cs outline-none w-full mt-6 max-h-72 h-32 desktop:h-64`}
            />
          </div>
          <div className="w-full flex items-center justify-end ">
            <div className="h-12 w-full mt-12 md:w-1/2">
              <PrimaryBtn
                text="ثبت نوبت ویزیت"
                status={formik.status}
                // disabled={!formik.isValid || formik.status === 1}
                // disabled={!reserve || !select || !formik.isValid}
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>
    </LayoutUser>
  );
};

export default NewReservePage;
