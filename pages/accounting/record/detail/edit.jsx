import { MdArrowForward, MdSchedule } from "react-icons/md";
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
const EditRecord = () => {
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);
  const [diseases, setDiseases] = useState(null);
  const [diseasesFilter, setDiseasesFilter] = useState([]);
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();

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
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading, id]);

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
            router.push("/accounting/record");
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
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
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
            <h1 className="text-xl text-gray-900">اطلاعات پرونده</h1>
          </div>
          <div className="text-sm text-gray-900">
            کارشناس :{" "}
            {data &&
              data.user &&
              data.user.first_name + " " + data.user.last_name}
          </div>
        </div>
        <div className="w-full flex flex-row items-start h-[850px]">
          <form className="w-full min-h-fit" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-4 gap-x-4 gap-y-8 p-6">
              <div className="flex flex-row items-center gap-3 col-span-2">
                <span className="text-sm text-gray-900">جنسیت:</span>
                <RadioInput
                  formik={formik}
                  radioOptions={genderOption}
                  name="gender"
                  disabled={true}
                />
              </div>

              <div className="col-span-2"></div>
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
                disable={true}
              />
              <Input
                name="name"
                type="text"
                label="نام و نام خانوادگی"
                disable={true}
                formik={formik}
              />
              <Input
                name="tell"
                disable={true}
                type="text"
                label=" تلفن همراه"
                formik={formik}
                onChange={(e) => {
                  formik.setFieldValue("tell", toEnDigit(e.target.value));
                }}
              />
              <Input
                name="homeTell"
                disable={true}
                type="text"
                label=" تلفن ثابت"
                formik={formik}
                onChange={(e) => {
                  formik.setFieldValue("homeTell", toEnDigit(e.target.value));
                }}
              />
              {defualtValue.value !== null && (
                <SelectInput
                  formik={formik}
                  disable={true}
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
                disabled={true}
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
              <Input
                name="job"
                type="text"
                label="شغل"
                formik={formik}
                disable={true}
              />
              <Input
                name="nationalId"
                type="text"
                disable={true}
                label="کد ملی"
                formik={formik}
                onChange={(e) => {
                  formik.setFieldValue("nationalId", toEnDigit(e.target.value));
                }}
              />
              <Input
                name="degree"
                disable={true}
                type="text"
                label="تحصیلات"
                formik={formik}
              />
              <Input
                name="address"
                type="text"
                label="آدرس"
                formik={formik}
                disable={true}
              />
              <Input
                name="reasonReferral"
                type="text"
                disable={true}
                label="علت مراجعه"
                formik={formik}
              />
              <Input
                name="reagent"
                type="text"
                label="معرف"
                formik={formik}
                disable={true}
              />
              <div className="flex flex-row items-center gap-3 ">
                <span className="text-sm text-gray-900">وضعیت تاهل</span>
                <RadioInput
                  formik={formik}
                  radioOptions={maritalOption}
                  name="marital"
                  disabled={true}
                />
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
                          disabled={true}
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
                      disabled={true}
                    />
                  </div>
                  <div className="w-[50%]">
                    <Input
                      name="otherSickness"
                      disable={true}
                      type="text"
                      label="شرح بیماری"
                      formik={formik}
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
                      disabled={true}
                    />
                  </div>
                  <div className="w-[50%]">
                    <Input
                      name="useMedicine"
                      type="text"
                      disable={true}
                      label="دارو"
                      formik={formik}
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
                      disabled={true}
                    />
                  </div>
                  <div className="w-[50%]">
                    <Input
                      name="allergyMedicine"
                      type="text"
                      disable={true}
                      label="دارو"
                      formik={formik}
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
                      disabled={true}
                    />
                  </div>
                  <div className="w-[50%]">
                    <Input
                      name="hospitalization"
                      type="text"
                      label="شرح علت"
                      formik={formik}
                      disable={true}
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
                  disabled={true}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditRecord;
