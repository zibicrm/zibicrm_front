import {
    MdArrowForward,
    MdOutlineDeleteSweep,
    MdOutlineEditCalendar,
    MdOutlineQrCodeScanner,
    MdSchedule,
  } from "react-icons/md";
  import Layout from "../../../../Layout/Layout";
  import * as yup from "yup";
  import { useFormik } from "formik";
  import Input from "../../../../common/Input";
  import PrimaryBtn from "../../../../common/PrimaryBtn";
  import RadioInput from "../../../../common/RadioBtn";
  import { useEffect, useState } from "react";
  import { useRouter } from "next/router";
  import SelectInput from "../../../../common/SelectInput";
  import { toast } from "react-toastify";
  import { useAuth, useAuthActions } from "../../../../Provider/AuthProvider";
  
  import {
    getDocumentDepositService,
    getRecordService,
  } from "../../../../Services/recordServices";
  import { getAllSystemicService } from "../../../../Services/systemicServices";
  import Error from "next/error";
  import PageLoading from "../../../../utils/LoadingPage";
  import { getAllClinicService } from "../../../../Services/clinicServices";
  import { getDoctorByClinicService } from "../../../../Services/doctorServices";
  import { getServiceByClinic } from "../../../../Services/serviceRequest";
  import { IoTerminal } from "react-icons/io5";
  import IconBtn from "../../../../common/IconBtn";
  import CheckForm from "../../../../Components/CheckForm";
  import {
    getTreatmentByIdService,
    treatmentService,
  } from "../../../../Services/treatmentService";
  import { CurrencyNum } from "../../../../hooks/CurrencyNum";
  import CurrencyInputComponent from "../../../../common/CurrencyInput";
  import toEnDigit from "../../../../hooks/ToEnDigit";
  import Modal from "../../../../Components/Modal";
  import Tabs from "../../../../Components/Tabs";
  import { CloseBtn } from "../../../../common/CloseBtn";
  import convertDay from "../../../../hooks/ConvertDayToPersian";
  import moment from "jalali-moment";
  import AddEvent from "../../../../Components/AddEvent";
  import InstallmentsForm from "../../../../Components/InstallmentsForm";
  import QRCode from "react-qr-code";
  import { v1 as uuidv1 } from "uuid";
  import Link from "next/link";
  import { useRef } from "react";
  const EditRecord = () => {
    const [data, setData] = useState(null);
    const [add, setAdd] = useState(false);
    const [deposit, setDeposit] = useState(null);
    const [allClinic, setAllClinic] = useState([]);
    const [allDoctor, setAllDoctor] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [selectService, setSelectService] = useState([]);
    const [treatment, setTreatment] = useState([]);
    const [selectAppointment, setSelectAppointment] = useState(null);
    const [selectAppointmentS, setSelectAppointmentS] = useState(null);
    const [select, setSelect] = useState(false);
    const [tab, setTab] = useState(0);
    const [sumCheck, setSumCheck] = useState(0);
    const [reduceDeposit, setReduceDeposit] = useState(false);
    const [useDeposit, setUseDeposit] = useState(false);
    const [qrValue, setQrValue] = useState(null);
    const { loading, user } = useAuth();
    const userDispatch = useAuthActions();
    const router = useRouter();
    const id = router.query.id;
    const appointment = router.query.appointment;
    const type = router.query.type;
    const uuidRef = useRef(false);
    const [uuid, setUuid] = useState(null);
    let s = moment.now();
    let nowDay = moment(s).format("YYYY/MM/DD");
    const getData = async () => {
      if (id) {
        await getRecordService(id, {
          Authorization: "Bearer " + user.token,
        })
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              setData(data.result[0]);
              setDiseasesFilter(data.result.sicknessList);
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
        getTreatmentByIdService(
          { document_id: id },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              setTreatment(data.result);
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
      if (uuidRef.current === false) {
        uuidRef.current = true;
        setUuid(uuidv1());
      }
    }, []);
    useEffect(() => {
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
        if (user && !loading && id) {
          getDocumentDepositService(id, {
            Authorization: "Bearer " + user.token,
          })
            .then(({ data }) => {
              if (data.status === false) {
                // toast.error(data.message[0]);
              } else {
                setDeposit(data.result.deposit);
                if (Number(data.result.deposit) > 0) {
                  setReduceDeposit(true);
                }
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
        getData();
      }
      if (!user && !loading) {
        router.push("/");
      }
      if (user && user.user.rule !== 3) {
        router.push("/");
      }
    }, [loading, id]);
    const validationSchema = yup.object({
      appointment_id: yup.string().required("انتخاب نوبت اجباری است"),
      document_id: yup.string(),
      doctor_id: yup.string().required("پزشک معالج را انتخاب کنید"),
      assist_id: yup.string().required("نام دستیار پزشک را وارد کنید"),
      service_id: yup.string().required("نوع خدمت را وارد کنید"),
      count: yup.string().required("تعداد خدمت را وارد کنید"),
      clinic_id: yup.string().required("مطب را انتخاب کنید"),
    });
    const initialValues = {
      appointment_surgery_id: appointment && type === "1" ? appointment : "0",
      appointment_id: appointment && type === "0" ? appointment : "0",
      document_id: "",
      doctor_id: "",
      assist_id: "",
      service_id: "",
      count: "",
      clinic_id: "",
    };
    const formik = useFormik({
      initialValues,
      onSubmit: (values) => {
        let service = allServices.find(
          (s) => String(s.id) === String(values.service_id)
        );
        setSelectService([
          ...selectService,
          {
            ...values,
            id: Math.floor(Math.random() * 1000),
            unit_price: service.sum_cost,
          },
        ]);
      },
      validationSchema,
      validateOnMount: true,
      enableReinitialize: true,
    });
    const validationSchemaF = yup.object({
      appointment_id: yup.string().required("انتخاب نوبت اجباری است"),
      document_id: yup.string(),
      doctor_id: yup.string(),
      assist_id: yup.string(),
      service_id: yup.string(),
      count: yup.string(),
      clinic_id: yup.string(),
      month_count: yup.string(),
  
      payment_type: yup.string().required("نوع پرداخت را وارد کنید"),
  
      // .test(
      //   "check",
      //   "ضرب تعداد اقساط و فاصله اقساط باید کمتر از ۶ باشد",
      //   function (value) {
      //     let s = Number(finalFormik.values.check_count) * Number(value);
  
      //     // return s <= 6 ? true : false;
      //     if (s <= 6 || !value) {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   }
      // ),
      discount: yup
        .string()
        .test(
          "bigger than sum",
          "مبلغ تخفیف نمی تواند بیشتر از مبلغ کل باشد",
          (value) => {
            if (Number(value) <= renderSum() || !value) {
              return true;
            } else {
              return false;
            }
          }
        ),
      receive_price: yup
        .string()
        .required("مبلغ دریافتی را وارد کنید")
        .test(
          "bigger recive",
          "مبلغ دریافتی نمیتواند بیشتر از مبلغ نهایی باشد",
          () => {
            if (reciveError() === true) {
              return false;
            } else {
              return true;
            }
          }
        ),
      treatment_service: yup.mixed(),
      // .test("exist", "خدمات انجام شده را وارد نمایید", function (value) {
      //   let s = selectService.length;
  
      //   // return s <= 6 ? true : false;
      //   if (s <= 1) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // }),
    });
    const initialValuesF = {
      appointment_surgery_id: appointment && type === "1" ? appointment : "0",
      appointment_id: appointment && type === "0" ? appointment : "0",
      document_id: "",
      SumPrice: "",
      TempSumPrice: "",
      discount: "",
      receive_price: "",
      final_price: "",
      description: "",
      payment_type: "",
      assistant: "",
      doctor_id: "",
      clinic_id: "",
      check_count: "",
      month_count: "",
      checkdate: "",
      SumInstallments: "",
      treatment_checks: [],
      deposit: false,
      image: "",
      uuid: uuid,
    };
    const finalFormik = useFormik({
      initialValues: initialValuesF,
      onSubmit: (values) => {
        finalFormik.setStatus(1);
        let checkUuid = [];
        values.treatment_checks &&
          values.treatment_checks.length > 0 &&
          values.treatment_checks.map((c) => c.uuid && checkUuid.push(c.uuid));
        let finalValues = {
          ...values,
          document_id: data.id,
          clinic_id: formik.values.clinic_id,
          doctor_id: formik.values.doctor_id,
          assistant: formik.values.assist_id,
          treatment_service: selectService,
          uuids:
            Number(values.final_price) > 0 && Number(values.receive_price) > 0
              ? [values.uuid, ...checkUuid]
              : Number(values.final_price) > 0
              ? [...checkUuid]
              : [],
          uuid: Number(values.receive_price) > 0 ? values.uuid : null,
          description: useDeposit
            ? `${values.description} - ${
                "با احتساب  " + useDeposit + " (تومان) بستانکاری"
              }`
            : values.description,
        };
        treatmentService(finalValues, {
          Authorization: "Bearer " + user.token,
        })
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              toast.success("با موفقیت ثبت شد");
              router.push(`/clinic/record/detail/?id=${id}`);
            }
            finalFormik.setStatus(0);
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
            finalFormik.setStatus(0);
          });
      },
      validationSchema: validationSchemaF,
      validateOnMount: true,
      enableReinitialize: true,
    });
    const paymentOption = [
      { id: "1", label: "نقد", value: "1" },
      { id: "2", label: "اقساطی بدون چک", value: "2" },
      { id: "3", label: "اقساطی با چک", value: "3" },
    ];
    const ghestOption = [
      { id: 1, value: "1 قسط" },
      { id: 2, value: "2 قسط" },
      { id: 3, value: "3 قسط" },
      { id: 4, value: "4 قسط" },
      { id: 5, value: "5 قسط" },
      { id: 6, value: "6 قسط" },
    ];
    const monthOption = [
      { id: 1, value: "1 ماه" },
      { id: 2, value: "2 ماه" },
      { id: 3, value: "3 ماه" },
      { id: 4, value: "4 ماه" },
      { id: 5, value: "5 ماه" },
      { id: 6, value: "6 ماه" },
    ];
    const defualtValue = {
      value: "",
      id: 0,
    };
    const renderSum = () => {
      let sum = 0;
      selectService.map((item) => {
        let service = allServices.find(
          (s) => String(s.id) === String(item.service_id)
        );
        let servicePrice = Number(item.count) * Number(service.sum_cost);
        sum = sum + servicePrice;
      });
  
      return String(sum);
    };
    const renderPayment = (type) => {
      switch (type) {
        case "1":
          return (
            <>
              <CurrencyInputComponent
                formik={finalFormik}
                label="مبلغ دریافتی"
                name="receive_price"
                disable={true}
              />
              {Number(finalFormik.values.receive_price) > 0 ? (
                <div>
                  <div className="w-36 h-12">
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
                            finalFormik.values.receive_price +
                            "_" +
                            id +
                            "_" +
                            1
                          }`
                        )
                      }
                    >
                      <MdOutlineQrCodeScanner />
                    </PrimaryBtn>
                  </div>
                  {finalFormik.errors.image &&
                    finalFormik.touched.receive_price && (
                      <div className="md:text-xs text-[10px] text-red-300 mt-1.5">
                        {finalFormik.errors.image}
                      </div>
                    )}
                </div>
              ) : null}
            </>
          );
        case "3":
          return (
            <>
              <CurrencyInputComponent
                formik={finalFormik}
                label="مبلغ پیش پرداخت"
                name="receive_price"
              />
              {Number(finalFormik.values.receive_price) > 0 ? (
                <div>
                  <div className="w-36 h-12">
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
                            finalFormik.values.receive_price +
                            "_" +
                            id +
                            "_" +
                            1
                          }`
                        )
                      }
                    >
                      <MdOutlineQrCodeScanner />
                    </PrimaryBtn>
                  </div>
                  {finalFormik.errors.image &&
                    finalFormik.touched.receive_price && (
                      <div className="md:text-xs text-[10px] text-red-300 mt-1.5">
                        {finalFormik.errors.image}
                      </div>
                    )}
                </div>
              ) : null}
              <div
                className={
                  finalFormik.values.receive_price > 0
                    ? "col-span-2"
                    : "col-span-3"
                }
              ></div>
              <CurrencyInputComponent
                formik={finalFormik}
                label="مبلغ کل اقساط"
                name="SumInstallments"
                disable={true}
              />
              <SelectInput
                formik={finalFormik}
                label="تعداد اقساط"
                name="check_count"
                selectOption={ghestOption}
                labelOption="value"
                valueOption="id"
                defaultV={defualtValue}
              />
              <SelectInput
                formik={finalFormik}
                label="فاصله هر قسط"
                name="month_count"
                selectOption={monthOption}
                labelOption="value"
                valueOption="id"
                defaultV={defualtValue}
              />
              <div className="col-span-4 border border-gray-200">
                {[...new Array(Number(finalFormik.values.check_count))].map(
                  (x, i) => (
                    <div
                      key={i}
                      className="grid border border-gray-200  w-full gap-4 p-6 items-center"
                    >
                      <CheckForm finalFormik={finalFormik} index={i} />
                    </div>
                  )
                )}
              </div>
  
              {Number(sumCheck) != Number(finalFormik.values.SumInstallments) ? (
                <p className="text-xs text-red-500 col-span-3 -my-5">
                  جمع مبلغ اقساط باید برابر مبلغ قابل پرداخت باشد
                </p>
              ) : (
                ""
              )}
            </>
          );
        case "2":
          return (
            <>
              <CurrencyInputComponent
                formik={finalFormik}
                label="مبلغ پیش پرداخت"
                name="receive_price"
              />
              {Number(finalFormik.values.receive_price) > 0 ? (
                <div>
                  <div className="w-36 h-12">
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
                            finalFormik.values.receive_price +
                            "_" +
                            id +
                            "_" +
                            1
                          }`
                        )
                      }
                    >
                      <MdOutlineQrCodeScanner />
                    </PrimaryBtn>
                  </div>
                  {finalFormik.errors.image &&
                    finalFormik.touched.receive_price && (
                      <div className="md:text-xs text-[10px] text-red-300 mt-1.5">
                        {finalFormik.errors.image}
                      </div>
                    )}
                </div>
              ) : null}
              <div
                className={
                  finalFormik.values.receive_price > 0
                    ? "col-span-2"
                    : "col-span-3"
                }
              ></div>
              <CurrencyInputComponent
                formik={finalFormik}
                label="مبلغ کل اقساط"
                name="SumInstallments"
                disable={true}
              />
              <SelectInput
                formik={finalFormik}
                label="تعداد اقساط"
                name="check_count"
                selectOption={ghestOption}
                labelOption="value"
                valueOption="id"
                defaultV={defualtValue}
              />
              <SelectInput
                formik={finalFormik}
                label="فاصله هر قسط"
                name="month_count"
                selectOption={monthOption}
                labelOption="value"
                valueOption="id"
                defaultV={defualtValue}
              />
              <div className="col-span-4 border border-gray-200">
                {[...new Array(Number(finalFormik.values.check_count))].map(
                  (x, i) => (
                    <div
                      key={i}
                      className="grid border border-gray-200  w-full gap-4 p-6 items-center"
                    >
                      <InstallmentsForm finalFormik={finalFormik} index={i} />
                    </div>
                  )
                )}
              </div>
              {Number(sumCheck) != Number(finalFormik.values.SumInstallments) ? (
                <p className="text-xs text-red-500 col-span-3 -my-5">
                  جمع مبلغ اقساط باید برابر مبلغ قابل پرداخت باشد
                </p>
              ) : (
                ""
              )}
            </>
          );
        default:
          break;
      }
    };
    const deleteHandler = (id) => {
      let result = selectService.filter((item) => Number(item.id) !== Number(id));
      setSelectService(result);
    };
    const tabOptions = [
      { text: "ویزیت", id: 0 },
      { text: "جراحی", id: 1 },
    ];
    const reciveError = () => {
      if (
        finalFormik.values.SumPrice !== "0" &&
        finalFormik.values.payment_type !== "1"
      ) {
        if (
          Number(finalFormik.values.receive_price) >
          Number(finalFormik.values.final_price)
        ) {
          return true;
        } else {
          return false;
        }
      }
    };
    const reduceSumPrice = () => {
      if (Number(deposit) < renderSum()) {
        finalFormik.setFieldValue(
          "final_price",
          finalFormik.values.TempSumPrice -
            Number(deposit) -
            Number(finalFormik.values.discount)
        );
        finalFormik.setFieldValue("TempSumPrice", renderSum() - Number(deposit));
        setUseDeposit(renderSum() - Number(deposit));
        setReduceDeposit(false);
      } else if (Number(deposit) > renderSum()) {
        finalFormik.setFieldValue("final_price", "0");
        finalFormik.setFieldValue("TempSumPrice", "0");
        setUseDeposit(renderSum());
        setReduceDeposit(false);
      }
    };
    useEffect(() => {
      if (finalFormik.values.treatment_checks.length > 0) {
        let sum = 0;
        finalFormik.values.treatment_checks.map((i) => {
          sum = Number(i.amount) + Number(sum);
        });
        setSumCheck(sum);
      }
    }, [finalFormik.values.treatment_checks]);
    useEffect(() => {
      if (finalFormik.values.payment_type === "1") {
        finalFormik.setFieldValue(
          "receive_price",
          finalFormik.values.final_price
        );
      }
      if (finalFormik.values.payment_type !== "1") {
        finalFormik.setFieldValue("receive_price", "");
      }
    }, [
      finalFormik.values.payment_type,
      finalFormik.values.discount,
      finalFormik.values.final_price,
    ]);
    useEffect(() => {
      if (finalFormik.values.SumPrice === "0") {
        finalFormik.setFieldValue("payment_type", "1");
      }
    }, [finalFormik.values.SumPrice]);
    useEffect(() => {
      if (selectAppointment) {
        finalFormik.setFieldError("appointment_id", null);
        // formik.setFieldValue("appointment_id", null);
      } else if (selectAppointmentS) {
        finalFormik.setFieldError("appointment_surgery_id", null);
        formik.setFieldError("appointment_surgery_id", null);
      }
    }, [selectAppointment, selectAppointmentS]);
    useEffect(() => {
      if (user && !loading && formik.values.clinic_id) {
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
        getServiceByClinic(formik.values.clinic_id, {
          Authorization: "Bearer " + user.token,
        })
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              setAllServices(data.result);
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
      finalFormik.setFieldValue("SumPrice", renderSum());
      finalFormik.setFieldValue("TempSumPrice", renderSum());
      setUseDeposit(false);
      setReduceDeposit(true);
    }, [selectService]);
    useEffect(() => {
      finalFormik.setFieldValue("treatment_checks", []);
      if (finalFormik.values.payment_type !== "1") {
        finalFormik.setFieldValue(
          "SumInstallments",
          finalFormik.values.final_price - finalFormik.values.receive_price
        );
      }
    }, [finalFormik.values.payment_type]);
    useEffect(() => {
      if (finalFormik.values.payment_type !== "1") {
        finalFormik.setFieldValue(
          "SumInstallments",
          finalFormik.values.final_price - finalFormik.values.receive_price
        );
      }
    }, [finalFormik.values.receive_price]);
    useEffect(() => {
      if (
        !finalFormik.errors.SumPrice &&
        !finalFormik.errors.discount &&
        renderSum() - deposit >= Number(finalFormik.values.discount)
      ) {
        finalFormik.setFieldValue("SumPrice", renderSum());
        // finalFormik.setFieldValue(
        //   "TempSumPrice",
        //   renderSum() - Number(finalFormik.values.discount)
        // );
        finalFormik.setFieldValue(
          "final_price",
          Number(finalFormik.values.TempSumPrice) -
            Number(finalFormik.values.discount)
        );
      } else {
        let sum = renderSum() - deposit;
  
        finalFormik.setFieldValue("SumPrice", renderSum());
        finalFormik.setFieldValue("final_price", useDeposit ? sum : renderSum());
        finalFormik.setFieldValue("TempSumPrice", useDeposit ? sum : renderSum());
      }
    }, [finalFormik.values.discount, finalFormik.values.SumPrice]);
    useEffect(() => {
      finalFormik.setErrors({ ...finalFormik.errors, doctor_id: null });
    }, [finalFormik.values.doctor_id]);
    useEffect(() => {
      finalFormik.setFieldValue("treatment_checks", []);
      let f = finalFormik.values.month_count * finalFormik.values.check_count;
      if (f > 6) {
        finalFormik.setErrors({
          ...finalFormik.errors,
          month_count: "ضرب تعداد اقساط و فاصله اقساط باید کمتر از ۶ باشد",
        });
      } else {
        finalFormik.setErrors({ ...finalFormik.errors, month_count: null });
      }
    }, [finalFormik.values.month_count, finalFormik.values.check_count]);
    useEffect(() => {
      if (user && !loading && !add) {
        getData();
      }
    }, [add]);
    if (user && user.user.rule !== 3) return <Error statusCode={404} />;
    if (!data) return <PageLoading />;
    return (
      <Layout>
        <div>
          <div className="bg-gray-50 px-6 py-3 flex flex-row items-center justify-between gap-3 border-b border-primary-900">
            <div className="flex flex-row items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-2xl text-gray-900"
                type="button"
              >
                <MdArrowForward />
              </button>
              <h1 className="text-xl text-gray-900">ثبت درمان</h1>
            </div>
            <div className="text-sm text-gray-900">
              کارشناس :
              {data &&
                data.user &&
                data.user.first_name + " " + data.user.last_name}
            </div>
          </div>
          <div className="w-full  flex flex-col items-start gap-8 p-6">
            <div className="w-full shadow-cs flex flex-col items-start p-6">
              <form className="w-full min-h-fit" onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-4 gap-x-4 gap-y-8 py-6">
                  {appointment ? null : (
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelect(true);
                          finalFormik.setFieldTouched("appointment_id", true);
                        }}
                        className="rounded-cs relative cursor-pointer w-full h-full px-2 flex items-center justify-start border border-primary-500  text-xs xl:text-sm text-gray-900 disabled:border-gray-100 disabled:text-gray-100 hover:shadow-btn"
                      >
                        {selectAppointment
                          ? convertDay(selectAppointment.day) +
                            "| " +
                            selectAppointment.VisitTime.slice(0, 5) +
                            " " +
                            moment(selectAppointment.dateOfDay)
                              .locale("fa")
                              .format("YYYY/MM/DD")
                          : selectAppointmentS
                          ? convertDay(selectAppointmentS.day) +
                            "| " +
                            selectAppointmentS.VisitTime.slice(0, 5) +
                            " " +
                            moment(selectAppointmentS.dateOfDay)
                              .locale("fa")
                              .format("YYYY/MM/DD")
                          : "انتخاب نوبت"}
  
                        <span className="text-2xl absolute left-2">
                          <MdOutlineEditCalendar />
                        </span>
                      </button>
                      {finalFormik.errors.appointment_id &&
                        finalFormik.touched.appointment_id && (
                          <div className="md:text-xs text-[10px] text-red-300 mt-1.5">
                            {finalFormik.errors.appointment_id}
                          </div>
                        )}
                    </div>
                  )}
                  <SelectInput
                    formik={formik}
                    label="مطب"
                    name="clinic_id"
                    selectOption={allClinic}
                    labelOption="title"
                    valueOption="id"
                  />
                  <SelectInput
                    formik={formik}
                    label="پزشک معالج"
                    name="doctor_id"
                    selectOption={allDoctor}
                    labelOption="name"
                    valueOption="id"
                  />
                  <Input
                    name="assist_id"
                    type="text"
                    label="دستیار پزشک"
                    formik={formik}
                  />
                  <SelectInput
                    formik={formik}
                    label="خدمات"
                    name="service_id"
                    selectOption={allServices}
                    labelOption="title"
                    valueOption="id"
                  />
                  <Input
                    name="count"
                    type="text"
                    label="تعداد"
                    formik={formik}
                    onChange={(e) => {
                      formik.setFieldValue("count", toEnDigit(e.target.value));
                    }}
                  />
                  <div className={appointment ? "col-span-2" : ""}></div>
                  <div className="h-12 ">
                    <PrimaryBtn
                      text="اضافه کردن خدمت"
                      type="submit"
                      status={formik.status}
                      disabled={formik.status === 1 || !formik.isValid}
                    />
                  </div>
                </div>
              </form>
              <div className="w-full max-w-full overflow-x-scroll ">
                <table className="w-full border border-gray-200 min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
                  <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
                    <tr className="text-right text-sm">
                      <th className="px-2 text-right border border-gray-200 relative">
                        خدمات
                      </th>
                      <th className="px-2  text-right border border-gray-200 relative">
                        تعداد
                      </th>
                      <th className="px-2 text-right border border-gray-200 relative">
                        قیمت هر واحد
                      </th>
                      <th className="px-2  text-right border border-gray-200 relative">
                        قیمت کل
                      </th>
                      <th className="px-2  text-right border border-gray-200 relative">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto ">
                    {selectService.map((item, index) => {
                      let service = allServices.find(
                        (s) => String(s.id) === String(item.service_id)
                      );
                      return (
                        <tr
                          key={index}
                          className="h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100"
                        >
                          <td className="w-20 text-right px-3 border-x border-gray-200">
                            {service.title}
                          </td>
  
                          <td className=" text-right px-3 border-x border-gray-200">
                            {item.count}
                          </td>
                          <td className=" text-right px-3 border-x border-gray-200">
                            {CurrencyNum.format(service.sum_cost)}
                          </td>
                          <td className=" text-right px-3 border-x border-gray-200">
                            {CurrencyNum.format(
                              Number(item.count) * Number(service.sum_cost)
                            )}
                          </td>
                          <td className=" text-right px-3 border-x border-gray-200">
                            <IconBtn
                              icon={<MdOutlineDeleteSweep />}
                              onClick={() => deleteHandler(item.id)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 grid grid-cols-3 w-full gap-x-4 gap-y-8">
                <Input
                  name="SumPrice"
                  type="text"
                  label="مبلغ کل"
                  formik={finalFormik}
                  disable={true}
                  currency={true}
                  onChange={(e) => {
                    finalFormik.setFieldValue(
                      "SumPrice",
                      String(toEnDigit(e.target.value))
                    );
                  }}
                />
                <CurrencyInputComponent
                  formik={finalFormik}
                  label="تخفیف (تومان)"
                  name="discount"
                  disable={finalFormik.values.SumPrice === "0" ? true : false}
                />
                <CurrencyInputComponent
                  formik={finalFormik}
                  label="مبلغ نهایی"
                  name="final_price"
                  disable={true}
                />
                <div className="col-span-2"></div>
                {reduceDeposit && deposit > 0 ? (
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-sm ">
                      مبلغ {CurrencyNum.format(deposit)} تومان بستانکار می باشد
                    </p>
                    <div className="h-12 w-full">
                      <PrimaryBtn
                        text="کسر از مبلغ نهایی "
                        onClick={() => reduceSumPrice()}
                        type="button"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
  
            <div className="w-full shadow-cs flex flex-col items-start p-6">
              <form
                onSubmit={finalFormik.handleSubmit}
                className="mt-8 grid grid-cols-3 w-full gap-x-4 gap-y-8"
              >
                <div className="flex flex-row items-center col-span-4 gap-3 min-w-fit">
                  <span className="text-sm ">نوع پرداخت</span>
                  <RadioInput
                    radioOptions={paymentOption}
                    formik={finalFormik}
                    name="payment_type"
                    disabled={finalFormik.values.SumPrice === "0" ? true : false}
                  />
                </div>
                {renderPayment(finalFormik.values.payment_type)}
                <textarea
                  placeholder="توضیحات پرداخت"
                  {...finalFormik.getFieldProps("description")}
                  className={`p-2 border border-primary-400 rounded-cs text-xs outline-none w-full max-h-72 h-64 col-span-4`}
                />
                <div className="w-full col-span-3 grid grid-cols-3 ">
                  <div className="col-span-2"></div>
                  <div className="h-12 w-full ">
                    <PrimaryBtn
                      text="ثبت درمان"
                      type="submit"
                      disabled={
                        finalFormik.status === 1 ||
                        !finalFormik.isValid ||
                        Number(sumCheck) !=
                          Number(finalFormik.values.SumInstallments)
                      }
                      status={finalFormik.status}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {select === true ? (
          <Modal>
            <div className="w-[560px] relative pt-4 h-96 bg-white rounded-cs p-6 flex flex-col items-start justify-start gap-6 ">
              <div className="flex max-w-[90%] flex-row items-center justify-between w-full">
                <span className="">نوبت های فعال بیمار</span>
                <div>
                  <Tabs options={tabOptions} setTab={setTab} tab={tab} />
                </div>
              </div>
              <div className="border-t border-primary-900 w-full">
                {tab === 0 ? (
                  treatment.appointment && treatment.appointment.length ? (
                    treatment.appointment.map((item) => (
                      <button
                        key={item.id}
                        className="py-3 w-full text-right text-sm border-b border-primary-100"
                        onClick={() => {
                          setSelectAppointmentS(null);
                          setSelectAppointment(item);
                          setSelect(false);
                          formik.setFieldValue("appointment_surgery_id", "0");
                          formik.setFieldValue("appointment_id", item.id);
                          finalFormik.setFieldValue(
                            "appointment_surgery_id",
                            "0"
                          );
                          finalFormik.setFieldValue("appointment_id", item.id);
                          // finalFormik.setFieldValue(
                          //   "appointment_surgery_id",
                          //   "0"
                          // );
                          // finalFormik.setFieldError("appointment_surgery_id", "");
                        }}
                      >
                        {convertDay(item.day)} |‌{" "}
                        {item.VisitTime.slice(0, 5) +
                          " " +
                          moment(item.dateOfDay)
                            .locale("fa")
                            .format("YYYY/MM/DD")}{" "}
                        | دکتر {item.doctor && item.doctor.name}
                      </button>
                    ))
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center">
                      <div className="h-12 w-36">
                        <PrimaryBtn
                          text="ثبت وقایع"
                          onClick={() => setAdd(true)}
                        />
                      </div>
                    </div>
                  )
                ) : treatment.appointmentSurgery &&
                  treatment.appointmentSurgery.length ? (
                  treatment.appointmentSurgery.map((item) => (
                    <button
                      key={item.id}
                      className="py-3 w-full text-right text-sm border-b border-primary-100"
                      onClick={() => {
                        setSelectAppointmentS(item);
                        setSelectAppointment(null);
                        setSelect(false);
                        // finalFormik.setFieldValue("appointment_id", "0");
                        finalFormik.setFieldValue(
                          "appointment_surgery_id",
                          item.id
                        );
                        finalFormik.setFieldValue("appointment_id", "0");
                        formik.setFieldValue("appointment_surgery_id", item.id);
                        formik.setFieldValue("appointment_id", "0");
                      }}
                    >
                      {convertDay(item.day)} |‌{" "}
                      {item.VisitTime.slice(0, 5) +
                        " " +
                        moment(item.dateOfDay)
                          .locale("fa")
                          .format("YYYY/MM/DD")}{" "}
                      | دکتر {item.doctor && item.doctor.name}
                    </button>
                  ))
                ) : (
                  <div className="w-full h-48 flex items-center justify-center">
                    <div className="h-12 w-36">
                      <PrimaryBtn text="ثبت وقایع" onClick={() => setAdd(true)} />
                    </div>
                  </div>
                )}
              </div>
              <CloseBtn onClick={() => setSelect(false)} />
            </div>
          </Modal>
        ) : null}
        {add ? (
          <Modal setModal={() => {}}>
            <AddEvent setOpen={setAdd} userInfo={data} />
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
      </Layout>
    );
  };
  
  export default EditRecord;
  