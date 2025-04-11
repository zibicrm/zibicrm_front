import {
    MdArrowForward,
    MdCheck,
    MdOutlineQrCodeScanner,
    MdQrCodeScanner,
  } from "react-icons/md";
  import Layout from "../../../Layout/Layout";
  import * as yup from "yup";
  import { useFormik } from "formik";
  import Input from "../../../common/Input";
  import PrimaryBtn from "../../../common/PrimaryBtn";
  import RadioInput from "../../../common/RadioBtn";
  import { useEffect, useState } from "react";
  import { useRouter } from "next/router";
  import SelectInput from "../../../common/SelectInput";
  import DatePickerComponent from "../../../common/DatePicker";
  import { toast } from "react-toastify";
  import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
  import { CheckBox } from "../../../common/CheckBox";
  import { newRecordService } from "../../../Services/recordServices";
  import { getAllSystemicService } from "../../../Services/systemicServices";
  import Error from "next/error";
  import toEnDigit from "../../../hooks/ToEnDigit";
  import { FaImages, FaMoneyCheck } from "react-icons/fa";
  import QRCode from "react-qr-code";
  import { CloseBtn } from "../../../common/CloseBtn";
  import Link from "next/link";
  import Modal from "../../../Components/Modal";
  import { useRef } from "react";
  import moment from "jalali-moment";
  import { v1 as uuidv1 } from "uuid";
  
  const AddRecord = () => {
    const [success, setSuccess] = useState(false);
    const [diseases, setDiseases] = useState(null);
    const [diseasesFilter, setDiseasesFilter] = useState([]);
    const [recordImage, setRecordImage] = useState(null);
    const { loading, user } = useAuth();
    const userDispatch = useAuthActions();
    const router = useRouter();
    const tell = router.query.tell;
    const [qrValue, setQrValue] = useState(null);
    const uuidRef = useRef(false);
    let s = moment.now();
    let nowDay = moment(s).format("YYYY/MM/DD");
    const [uuid, setUuid] = useState(null);
    useEffect(() => {
      if (user && !loading) {
        getAllSystemicService({
          Authorization: "Bearer " + user.token,
        })
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              setDiseases(data.result);
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
      if (!user && !loading) {
        router.push("/");
      }
      if (user && user.user.rule !== 3) {
        router.push("/");
      }
    }, [user, loading]);
    const validationSchema = yup.object({
      tell: yup
        .number()
        .typeError("فرمت شماره تلفن صحیح نمی باشد")
        .required("شماره تلفن مراجعه کننده را وارد کنید"),
      name: yup.string().required("نام مراجعه کننده را وارد کنید"),
      gender: yup.string().required("جنسیت را وارد کنید"),
      homeTell: yup.number().typeError("فرمت شماره تلفن صحیح نمی باشد"),
      nationalId: yup.number().typeError("فرمت کد ملی صحیح نمی باشد"),
    });
    const initialValues = {
      tell: tell ? tell : "",
      name: "",
      homeTell: "",
      job: "",
      nationalId: "",
      degree: "",
      birthDay: "",
      reasonReferral: "",
      reagent: "",
      marital: "", // 1=>single    2=>married
      otherSickness: "",
      useMedicine: "",
      allergyMedicine: "",
      hospitalization: "",
      document_id: "",
      referred_name: "",
      address: "",
      money_status: "",
      sickness: "",
      allergyM: "1",
      sicknesss: "1",
      medicine: "1",
      hospitali: "1",
      gender: "",
    };
    const formik = useFormik({
      initialValues,
      onSubmit: (values) => {
        formik.setStatus(1);
        delete values["allergyM"];
        delete values["sicknesss"];
        delete values["medicine"];
        delete values["hospitali"];
        values["sickness"] = diseasesFilter;
        newRecordService(values, {
          Authorization: "Bearer " + user.token,
        })
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              toast.success("پرونده با موفقیت ثبت شد");
              setSuccess(true);
              router.push("/doctor/record");
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
    const radioBtnY = [
      { id: "0", label: "بله", value: "1" },
      { id: "1", label: "خیر", value: "2" },
    ];
    const maritalOption = [
      { id: "1", label: "مجرد", value: "1" },
      { id: "2", label: "متاهل", value: "2" },
    ];
    const genderOption = [
      { id: "1", label: "آقا", value: "1" },
      { id: "2", label: "خانم", value: "2" },
    ];
    const moneyOption = [
      { id: 1, value: "ضعیف" },
      { id: 2, value: "متوسط" },
      { id: 3, value: "خوب" },
    ];
    useEffect(() => {
      if (uuidRef.current === false) {
        uuidRef.current = true;
        setUuid(uuidv1());
      }
    }, []);
    if (user && user.user.rule !== 3) return <Error statusCode={404} />;
    return (
      <Layout>
        <form onSubmit={formik.handleSubmit}>
          <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
            <button
              onClick={() => router.push("/doctor/record/")}
              className="text-2xl text-gray-900"
              type="button"
            >
              <MdArrowForward />
            </button>
            <h1 className="text-xl text-gray-900">پرونده جدید</h1>
          </div>
          <div className="flex flex-row ">
            <div className="w-1/2 grid grid-cols-2 gap-x-4 gap-y-8 p-6">
              <div className="flex flex-row items-center gap-3 col-span-1">
                <span className="text-sm text-gray-900">جنسیت:</span>
                <RadioInput
                  formik={formik}
                  radioOptions={genderOption}
                  name="gender"
                />
              </div>
  
              <Input
                name="document_id"
                type="text"
                label="شماره پرونده پزشکی"
                formik={formik}
                onChange={(e) => {
                  formik.setFieldValue("document_id", toEnDigit(e.target.value));
                }}
              />
              <Input
                name="name"
                type="text"
                label="نام و نام خانوادگی"
                formik={formik}
              />
              <Input
                name="tell"
                type="tell"
                label=" تلفن همراه"
                formik={formik}
                maxLength="11"
                minLength="11"
                onChange={(e) => {
                  formik.setFieldValue("tell", toEnDigit(e.target.value));
                }}
              />
              <Input
                name="homeTell"
                type="text"
                label=" تلفن ثابت"
                formik={formik}
                onChange={(e) => {
                  formik.setFieldValue("homeTell", toEnDigit(e.target.value));
                }}
              />
              <SelectInput
                formik={formik}
                label="وضعیت مالی"
                name="money_status"
                selectOption={moneyOption}
                labelOption="value"
                valueOption="id"
              />
              <DatePickerComponent
                name="birthDay"
                formik={formik}
                label="تاریخ تولد"
                text="تاریخ تولد"
              />
              <Input name="job" type="text" label="شغل" formik={formik} />
              <Input
                name="nationalId"
                type="text"
                label="کد ملی"
                formik={formik}
                onChange={(e) => {
                  formik.setFieldValue("nationalId", toEnDigit(e.target.value));
                }}
              />
              <Input name="degree" type="text" label="تحصیلات" formik={formik} />
              <Input name="address" type="text" label="آدرس" formik={formik} />
              <Input
                name="reasonReferral"
                type="text"
                label="علت مراجعه"
                formik={formik}
              />
              <Input name="reagent" type="text" label="معرف" formik={formik} />
              <div className="flex flex-row items-center gap-2 ">
                <span className="text-sm text-gray-900">وضعیت تاهل</span>
                <RadioInput
                  formik={formik}
                  radioOptions={maritalOption}
                  name="marital"
                />
              </div>
            </div>
            <div className="w-1/2 border-x border-b border-primary-500 p-6 flex flex-col  gap-6">
              <h1 className="text-xl text-gray-900">پرونده مطب</h1>
  
              <div className="h-full flex flex-row items-center text-center gap-4">
                <div className="w-1/2 border-2 text-primary-400 border-primary-400 rounded-[5px] border-dashed h-full flex item items-center justify-center flex-col gap-3">
                  تصویر پرونده
                  <span className="text-7xl">
                    <FaImages />
                  </span>
                </div>
                <div className="w-1/2 text-primary-400 border-2 border-primary-400 rounded-[5px] border-dashed h-full flex item items-center justify-center flex-col gap-3">
                  تصویر پرونده
                  <span className="text-7xl">
                    <FaImages />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-dashed border-primary-100 p-6 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-base ">سوابق بیماری</span>
              <div className="grid grid-auto-fill gap-y-8">
                {diseases &&
                  diseases.map((c) => (
                    <div key={c.id}>
                      <CheckBox
                        setValue={setDiseasesFilter}
                        value={diseasesFilter}
                        label={c.title}
                        name={c.id}
                        id={c.id}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex flex-col  gap-8 ">
              <div className="flex flex-row items-center gap-8">
                <div className="flex flex-row items-center gap-4">
                  <span className="w-40 text-sm text-gray-900">
                    سایر بیماری ها و حساسیت ها :
                  </span>
                  <RadioInput
                    formik={formik}
                    radioOptions={radioBtnY}
                    name="sicknesss"
                  />
                </div>
                <div className="w-[30%]">
                  <Input
                    name="otherSickness"
                    type="text"
                    label="شرح بیماری"
                    formik={formik}
                    disable={formik.values.sicknesss === "1" ? true : false}
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-8">
                <div className="flex flex-row items-center gap-4">
                  <span className="w-40 text-sm text-gray-900">
                    آیا داروی خاصی مصرف میکند؟
                  </span>
                  <RadioInput
                    formik={formik}
                    radioOptions={radioBtnY}
                    name="medicine"
                  />
                </div>
                <div className="w-[30%]">
                  <Input
                    name="useMedicine"
                    type="text"
                    label="دارو"
                    formik={formik}
                    disable={formik.values.medicine === "1" ? true : false}
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-8">
                <div className="flex flex-row items-center gap-4">
                  <span className="w-40 text-sm text-gray-900">
                    آیا به داروی خاصی حساسیت دارد؟
                  </span>
                  <RadioInput
                    formik={formik}
                    radioOptions={radioBtnY}
                    name="allergyM"
                  />
                </div>
                <div className="w-[30%]">
                  <Input
                    name="allergyMedicine"
                    type="text"
                    label="دارو"
                    formik={formik}
                    disable={formik.values.allergyM === "1" ? true : false}
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-8">
                <div className="flex flex-row items-center gap-4">
                  <span className="w-40 text-sm text-gray-900">
                    سابقه بستری در بیمارستان دارد؟
                  </span>
                  <RadioInput
                    formik={formik}
                    radioOptions={radioBtnY}
                    name="hospitali"
                  />
                </div>
                <div className="w-[30%]">
                  <Input
                    name="hospitalization"
                    type="text"
                    label="شرح علت"
                    formik={formik}
                    disable={formik.values.hospitali === "1" ? true : false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
            <div className={"col-span-2"}></div>
  
            <div className="h-12 ">
              <PrimaryBtn
                text="ثبت پرونده"
                type="submit"
                status={formik.status}
                disabled={formik.status === 1 || !formik.isValid || success}
              />
            </div>
          </div>
        </form>
        {qrValue ? (
          <Modal setModal={() => null}>
            <div className="w-96 h-fit bg-white p-6 rounded-cs flex items-center flex-col gap-2">
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
              <div className="h-12 w-36 mt-2">
                <PrimaryBtn
                  text="ثبت تصویر "
                  type="button"
                  onClick={() => setQrValue(`${uuid + "_" + 1}`)}
                />
              </div>
            </div>
          </Modal>
        ) : null}
      </Layout>
    );
  };
  
  export default AddRecord;
  