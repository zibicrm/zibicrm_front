import {
  MdArrowForward,
  MdCheck,
  MdCloudUpload,
  MdOutlineQrCodeScanner,
  MdQrCodeScanner,
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
import DatePickerComponent from "../../../../common/DatePicker";
import { toast } from "react-toastify";
import { useAuth, useAuthActions } from "../../../../Provider/AuthProvider";
import { CheckBox } from "../../../../common/CheckBox";
import moment from "jalali-moment";
import {
  editRecordService,
  getRecordService,
} from "../../../../Services/recordServices";
import { getAllSystemicService } from "../../../../Services/systemicServices";
import Error from "next/error";
import PageLoading from "../../../../utils/LoadingPage";
import toEnDigit from "../../../../hooks/ToEnDigit";
import QRCode from "react-qr-code";
import Link from "next/link";
import Modal from "../../../../Components/Modal";
import { FaImages, FaMoneyCheck } from "react-icons/fa";
import Image from "next/future/image";
import DeleteWarning from "../../../../Components/DeleteWarning";
import { deleteRecordImageService } from "../../../../Services/ImageService";
import { getAllClinicService } from "../../../../Services/clinicServices";

const EditRecord = () => {
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);
  const [allClinic, setAllClinic] = useState([]);
  const [diseases, setDiseases] = useState(null);
  const [diseasesFilter, setDiseasesFilter] = useState([]);
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const [qrValue, setQrValue] = useState(null);
  let s = moment.now();
  let nowDay = moment(s).format("YYYY/MM/DD");
  const router = useRouter();
  const id = router.query.id;
  const getData = async () => {
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
  };

  // clinic options
  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 1) {
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
    if (router.query.ref === "event") {
      eventRef.current?.scrollIntoView();
    }
  }, [loading]);
  // clinic options end

  useEffect(() => {
    if (qrValue && data && data.paper && data.paper.length) {
      setQrValue(null);
    }
  }, [data]);
  useEffect(() => {
    if (user && !loading && id) {
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
      getData();
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 1) {
      router.push("/");
    }
  }, [loading, id]);

  const validationSchema = yup.object({
    tell: yup
      .string()
      .typeError("فرمت شماره تلفن صحیح نمی باشد")
      .required("شماره تلفن مراجعه کننده را وارد کنید"),
    name: yup.string().required("نام مراجعه کننده را وارد کنید"),
    gender: yup.string().required("جنسیت را وارد کنید"),
    homeTell: yup.number().typeError("فرمت شماره تلفن صحیح نمی باشد"),
    nationalId: yup.number().typeError("فرمت کد ملی صحیح نمی باشد"),
  });
  const initialValues = {
    tell: data && data.tell,
    name: data && data.name,
    homeTell: data && data.homeTell ? data.homeTell : "",
    job: data && data.job,
    nationalId: data && data.nationalId ? data.nationalId : "",
    degree: data && data.degree,
    birthDay:
      (data && data.birthDay === "0000-00-00 00:00:00") ||
      (data && !data.birthDay)
        ? null
        : data && data.birthDay,
    reasonReferral: data && data.reasonReferral,
    reagent: data && data.reagent,
    marital: data && data.marital, // 1=>single    2=>married
    otherSickness: data && data.otherSickness,
    useMedicine: data && data.useMedicine,
    allergyMedicine: data && data.allergyMedicine,
    hospitalization: data && data.hospitalization,
    did: data && data.id,
    document_id: data && data.document_id,
    referred_name: data && data.referred_name,
    address: data && data.address,
    money_status: data && data.money_status,
    sickness: "",
    allergyM: data && data.allergyMedicine ? "0" : "1",
    sicknesss: data && data.otherSickness ? "0" : "1",
    medicine: data && data.useMedicine ? "0" : "1",
    hospitali: data && data.hospitalization ? "0" : "1",
    gender: data && String(data.gender),
    address_id: data && String(data.address_id),
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
      editRecordService(values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("پرونده با موفقیت ثبت شد");
            setSuccess(true);
            router.push("/operator/record");
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
  const defualtValue = {
    value:
      formik.values.money_status == 1
        ? "ضعیف"
        : formik.values.money_status == 2
        ? "متوسط"
        : formik.values.money_status == 2
        ? "خوب"
        : null,
    id: 0,
  };
  if (user && user.user.rule !== 1) return <Error statusCode={404} />;
  if (!data) return <PageLoading />;
  return (
    <Layout>
      <div>
        <div className="bg-gray-50 px-6 py-3 flex w-full flex-row items-center justify-between gap-3 border-b border-primary-900">
          <div className="flex flex-row items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-2xl text-gray-900"
              type="button"
            >
              <MdArrowForward />
            </button>
            <h1 className="text-xl text-gray-900">اطلاعات پرونده</h1>
          </div>
          <div className="text-sm text-gray-900">
            کارشناس :{" "}
            {data &&
              data.user &&
              data.user.first_name + " " + data.user.last_name}
          </div>
        </div>
        <div className="w-full  flex flex-row items-start h-[850px]">
          <form
            className="w-full min-h-fit h-full "
            onSubmit={formik.handleSubmit}
          >
            <div className="flex w-full flex-row items-start p-6 gap-6">
              <div className="w-1/2 grid grid-cols-2 gap-x-4 gap-y-8 ">
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
                    formik.setFieldValue(
                      "document_id",
                      toEnDigit(e.target.value)
                    );
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
                  type="text"
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
                <Input
                  type="text"
                  label="مطب"
                  value={
                    allClinic &&
                    formik.values.address_id &&
                    allClinic.find(
                      (a) => a.id === Number(formik.values.address_id)
                    )
                      ? allClinic.find(
                          (a) => a.id === Number(formik.values.address_id)
                        ).title
                      : "زیبیدنت"
                  }
                  formik={formik}
                  disable
                />
                {defualtValue.value !== null && (
                  <SelectInput
                    formik={formik}
                    label={defualtValue.value}
                    name="money_status"
                    selectOption={moneyOption}
                    labelOption="value"
                    valueOption="id"
                    defaultV={defualtValue}
                  />
                )}
                <DatePickerComponent
                  name="birthDay"
                  formik={formik}
                  label={
                    (data && data.birthDay === "0000-00-00 00:00:00") ||
                    (data && !data.birthDay)
                      ? null
                      : data &&
                        moment(data.birthDay).locale("fa").format("YYYY/MM/DD")
                  }
                  text="تاریخ تولد"
                />
                <Input name="job" type="text" label="شغل" formik={formik} />
                <Input
                  name="nationalId"
                  type="text"
                  label="کد ملی"
                  formik={formik}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "nationalId",
                      toEnDigit(e.target.value)
                    );
                  }}
                />
                <Input
                  name="degree"
                  type="text"
                  label="تحصیلات"
                  formik={formik}
                />
                <Input
                  name="address"
                  type="text"
                  label="آدرس"
                  formik={formik}
                />
                <Input
                  name="reasonReferral"
                  type="text"
                  label="علت مراجعه"
                  formik={formik}
                />
                <Input
                  name="reagent"
                  type="text"
                  label="معرف"
                  formik={formik}
                />
                <div className="flex flex-row items-center gap-3 ">
                  <span className="text-sm text-gray-900">وضعیت تاهل</span>
                  <RadioInput
                    formik={formik}
                    radioOptions={maritalOption}
                    name="marital"
                  />
                </div>
              </div>
              <div className="w-1/2 border rounded-cs border-primary-500 p-6 flex flex-col h-full gap-6">
                <h1 className="text-xl text-gray-900">پرونده مطب</h1>
                <div className="h-full flex flex-row items-center text-center gap-4 ">
                  <div className="w-1/2 relative  border-2 border-primary-400 rounded-[5px] border-dashed h-full flex item items-center justify-center flex-col gap-3">
                    {data && data.paper && data.paper[0] ? (
                      <Image
                        src={`https://radmanit.ir/images/document/${data.paper[0].name}`}
                        alt={data.name}
                        height={100}
                        width={100}
                        className="w-full h-full"
                      />
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center h-80 ">
                          <p className="text-primary-400 m-10 text-sm">
                            تصویر روی پرونده{" "}
                          </p>
                          <div className="text-primary-400 text-7xl flex flex-col items-center justify-center gap-6">
                            <FaImages />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="w-1/2 relative  border-2 border-primary-400 rounded-[5px] border-dashed h-full flex item items-center justify-center flex-col gap-3">
                    {data && data.paper && data.paper[1] ? (
                      <Image
                        src={`https://radmanit.ir/images/document/${data.paper[1].name}`}
                        alt={data.name}
                        height={100}
                        width={100}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-80 ">
                        <p className="text-primary-400 m-10 text-sm">
                          تصویر پشت پرونده{" "}
                        </p>
                        <div className="text-primary-400 text-7xl flex flex-col items-center justify-center gap-6">
                          <FaImages />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-primary-100 p-6 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <span className="text-base ">سوابق بیماری</span>
                <div className="grid grid-auto-fill gap-y-8">
                  {diseasesFilter &&
                    diseases &&
                    diseases.map((c) => (
                      <div key={c.id}>
                        <CheckBox
                          setValue={setDiseasesFilter}
                          value={diseasesFilter}
                          label={c.title}
                          name={c.id}
                          id={c.id}
                          number={true}
                        />
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-col  gap-8 ">
                <div className="flex flex-row items-center gap-8">
                  <div className="flex flex-row items-center gap-4">
                    <span className="w-40 text-sm text-gray-900">
                      {" "}
                      سایر بیماری ها و حساسیت ها :
                    </span>
                    <RadioInput
                      formik={formik}
                      radioOptions={radioBtnY}
                      name="sicknesss"
                    />
                  </div>
                  <div className="w-[50%]">
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
                  <div className="w-[50%]">
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
                  <div className="w-[50%]">
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
                  <div className="w-[50%]">
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
        </div>
      </div>
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
                onClick={() => getData()}
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default EditRecord;
