import { MdArrowForward } from "react-icons/md";
import Layout from "../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../common/Input";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SelectInput from "../../../common/SelectInput";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import SetAttendTime from "../../../Components/SetAttendTime";
import { newDoctorService } from "../../../Services/doctorServices";
import { toast } from "react-toastify";
import Error from "next/error";
import toEnDigit from "../../../hooks/ToEnDigit";
import { getAllClinicService } from "../../../Services/clinicServices";

const AddDoctor = () => {
  const [days, setDays] = useState([]);
  const [status, setStatus] = useState(0);
  const [selectOption, setSelectOption] = useState([]);
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const validationSchema = yup.object({
    tell: yup.string().required("شماره تلفن پزشک را وارد کنید"),
    name: yup.string().required("نام پزشک را وارد کنید"),
    speciality: yup.string().required("تخصص پزشک را وارد کنید"),
    clinic_id: yup.string().required("کلینیک را انتخاب کنید"),
    dvs: yup.string().required("میانگین زمان جراحی را وارد کنید"),
    days: yup.string(),
  });
  const initialValues = {
    tell: "",
    name: "",
    speciality: "",
    clinic_id: "",
    days: "",
    dvs: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);

      for (const key in days) {
        days[key].length <= 0 ? delete days[key] : null;
      }
      let finalValue = {
        ...values,
        days: days,
      };
      newDoctorService(finalValue, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("پزشک با موفقیت ثبت شد");
            router.push("/admin/doctor");
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
            setSelectOption(data.result);
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
  }, [user, loading]);
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <button
            onClick={() => router.push("/admin/doctor/")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900">پزشک جدید</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          <Input
            name="tell"
            type="text"
            label="شماره تلفن"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("tell", toEnDigit(e.target.value));
            }}
          />
          <Input
            name="name"
            type="text"
            label="نام و نام خانوادگی"
            formik={formik}
          />
          <Input name="speciality" type="text" label="تخصص" formik={formik} />
          <SelectInput
            formik={formik}
            label="مطب"
            name="clinic_id"
            selectOption={selectOption}
            labelOption="title"
            valueOption="id"
          />
          <SetAttendTime setDays={setDays} name="days" formik={formik} />
          <Input
            name="dvs"
            type="tell"
            label="میانگین زمان جراحی(دقیقه)"
            formik={formik}
          />
        </div>

        <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
          <div className={"col-span-2"}></div>

          <div className="h-12 ">
            <PrimaryBtn
              text="ثبت پزشک"
              type="submit"
              status={formik.status}
              disabled={formik.status === 1}
            />
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default AddDoctor;
