import { MdArrowForward } from "react-icons/md";
import Layout from "../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../common/Input";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import SelectInput from "../../../common/SelectInput";
import { getAllClinicService } from "../../../Services/clinicServices";
import { editService, getService } from "../../../Services/serviceRequest";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import toEnDigit from "../../../hooks/ToEnDigit";
const EditServicePage = (props) => {
  const { loading, user } = useAuth();
  const [data, setData] = useState();
  const [clinic, setClinic] = useState();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const id = router.query.id;
  const validationSchema = yup.object({
    description: yup.string().required("شرح خدمت را وارد کنید"),
    title: yup.string().required("عنوان خدمت را وارد کنید"),
    service_cost: yup
      .number()
      .typeError("عدد وارد کنید")
      .required("هزینه خدمت را وارد کنید"),
    supplier_commission: yup
      .number()
      .typeError("عدد وارد کنید")
      .required("کمیسیون کارشناس را وارد کنید"),
    material_cost: yup
      .number()
      .typeError("عدد وارد کنید")
      .required("هزینه مواد مصرفی را وارد کنید"),
    clinic_id: yup.string().required("کلینیک را انتخاب کنید"),
  });
  const initialValues = {
    title: data && data.title,
    description: data && data.description,
    service_cost: data && data.service_cost,
    material_cost: data && data.material_cost,
    supplier_commission: data && data.supplier_commission,
    clinic_id: data && data.clinic_id,
  };
  useEffect(() => {
    if (user && !loading) {
      getAllClinicService({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setClinic(data.result);
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
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading, id]);
  useEffect(() => {
    if (user && !loading && id) {
      getService(id, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setData(data.result[0]);
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
  }, [id]);
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      editService(router.query.id, values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("برند ایمپلنت با موفقیت ویرایش شد");
            router.push("/admin/service");
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
  const defualtValue = {
    title:
      data && clinic && data.clinic_id
        ? clinic.filter((item) => item.id === data.clinic_id)[0].title
        : null,
    id: 0,
  };
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  if (!data) return <PageLoading />;
  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <button
            onClick={() => router.push("/admin/service/")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900"> ویرایش خدمت</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          <Input name="title" type="text" label="عنوان خدمت" formik={formik} />
          {clinic && clinic[0] && defualtValue.title !== null && (
            <SelectInput
              formik={formik}
              label={defualtValue.title}
              name="clinic_id"
              selectOption={clinic}
              defaultV={clinic[0]}
              labelOption="title"
              valueOption="id"
            />
          )}
          <Input
            name="description"
            type="text"
            label="شرح خدمت"
            formik={formik}
          />
          <Input
            name="service_cost"
            type="text"
            label="هزینه خدمت"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("service_cost", toEnDigit(e.target.value));
            }}
          />
          <Input
            name="material_cost"
            type="text"
            label="هزینه مواد مصرفی"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("material_cost", toEnDigit(e.target.value));
            }}
          />
          <Input
            name="supplier_commission"
            type="text"
            label="کمیسیون کارشناس"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue(
                "supplier_commission",
                toEnDigit(e.target.value)
              );
            }}
          />
        </div>
        <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
          <div className={"col-span-2"}></div>
          <div className="h-12 ">
            <PrimaryBtn
              text="ثبت تغییرات"
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

export default EditServicePage;
