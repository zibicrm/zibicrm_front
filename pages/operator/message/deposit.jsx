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
import Error from "next/error";
import { sendMessagePriceService } from "../../../Services/messageService";
import SearchInPatients from "../../../Components/SearchInPatients";
import toEnDigit from "../../../hooks/ToEnDigit";
import CurrencyInputComponent from "../../../common/CurrencyInput";
const AddImplant = () => {
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const id = router.query.id;
  const name = router.query.name;
  const validationSchema = yup.object({
    document_id: yup.string().required("نام بیمار را وارد کنید"),
    price: yup.string().required("بیعانه را انتخاب کنید"),
  });
  const initialValues = {
    document_id: id ? id : "",
    price: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      sendMessagePriceService(values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("آدرس با موفقیت ارسال شد");
            router.push(
              `/operator/message/${id && name ? `?id=${id}&name=${name}` : ""}`
            );
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
    if (user && user.user.rule !== 1) {
      router.push("/");
    }
  }, [user, loading]);
  useEffect(() => {
    userInfo && formik.setFieldValue("document_id", userInfo.id);
  }, [userInfo]);
  if (user && user.user.rule !== 1) return <Error statusCode={404} />;
  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div
          className={`bg-gray-50  px-6 py-3 flex flex-row items-center gap-3 border-b border-primary-900 ${
            name && id ? "justify-between" : "justify-start"
          }`}
        >
          <div className="flex flex-row items-center gap-3">
            <button
              onClick={() =>
                router.push(
                  `/operator/message/${
                    id && name ? `?id=${id}&name=${name}` : ""
                  }`
                )
              }
              className="text-2xl text-gray-900"
              type="button"
            >
              <MdArrowForward />
            </button>
            <h1 className="text-xl text-gray-900">بیعانه</h1>
          </div>
          {name && id ? <div>نام بیمار : {name} </div> : null}
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          {name && id ? null : (
            <div className="w-full h-12">
              <SearchInPatients
                setUser={setUserInfo}
                access="operator"
                placeholder="نام بیمار"
              />
            </div>
          )}
          <CurrencyInputComponent
            name="price"
            label="هزینه (تومان)"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("price", toEnDigit(e.target.value));
            }}
          />
        </div>
        <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
          <div className={"col-span-2"}></div>

          <div className="h-12 ">
            <PrimaryBtn
              text="ارسال"
              type="submit"
              status={formik.status}
              disabled={formik.status === 1 || !formik.isValid}
            />
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default AddImplant;
