import Image from "next/image";
import React from "react";
import PrimaryBtn from "../../common/PrimaryBtn";
import { QrReader } from "react-qr-reader";
import { MdArrowBackIos, MdCloudUpload } from "react-icons/md";
import { useAuth } from "../../Provider/AuthProvider";
import { useRouter } from "next/router";
import { useState } from "react";
import { CurrencyNum } from "../../hooks/CurrencyNum";
import moment from "jalali-moment";
import { ImageLogoWhite } from "../../assets/Images";
import { useFormik } from "formik";
import * as yup from "yup";
import FormData from "form-data";
import { uploadImageService } from "../../Services/ImageService";
import { toast } from "react-toastify";
import Resizer from "react-image-file-resizer";
const Check = ({}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [imageFinance, setImageFinance] = useState(null);
  const validationSchema = yup.object({
    image1: yup.mixed().required("عکس روی چک را آپلود کنید"),
    document_id: yup.string().required("عکس پشت چک را آپلود کنید"),
    uuid: yup.string().required("عکس پشت چک را آپلود کنید"),
  });
  const initialValues = {
    document_id: data ? data.split("_")[3] : "",
    uuid: data ? data.split("_")[0] : "",
    image1: "",
  };
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        800,
        800,
        "png",
        40,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });
  let formData = new FormData();
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      formData.append("image1", values.image1);
      formData.append("document_id", values.document_id);
      formData.append("uuid", values.uuid);
      uploadImageService(formData, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("با موفقیت ثبت شد");
            router.push("/upload");
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
  const imageFinanceHandler = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      setImageFinance(URL.createObjectURL(file));
      formik.setFieldValue("image1", image);
    }
  };

  return (
    <main
      className={`w-full h-full min-h-screen bg-white flex items-center justify-center   ${
        loading ? "opacity-0" : "opacity-100"
      }`}
    >
      {data ? (
        <form
          className="flex flex-col  min-h-[99vh] pb-10 pt-10 items-center px-6 bg-white
     gap-12 w-full  rounded-cs md:max-w-[400px] h-full shadow-cs"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex  flex-row items-center w-full justify-between">
            <div></div>
            <h1 className="text-base text-gray-900">بارگذاری تصویر سند مالی</h1>
            <button
              className="text-2xl text-gray-900"
              onClick={() => router.push("/upload")}
            >
              <MdArrowBackIos />
            </button>
          </div>
          <div className="h-full w-full gap-12  flex flex-col items-center">
            <div className="flex flex-row items-center w-[90%] min-w-fit h-fit rounded-cs border border-primary-200 p-2 text-sm justify-between">
              <ul className="border-l text-gray-900 border-primary-200 flex flex-col items-center w-1/2 gap-4 ">
                <li>قیمت</li>
                <li>تاریخ </li>
              </ul>
              <ul className="flex gap-4 text-gray-900 flex-col items-center w-1/2">
                <li>
                  {data.split("-")[2]
                    ? CurrencyNum.format(Number(data.split("_")[2]))
                    : ""}
                </li>
                <li>
                  {data.split("_")[1]
                    ? moment(data.split("_")[1])
                        .locale("fa")
                        .format("YYYY/MM/DD")
                    : ""}
                </li>
              </ul>
            </div>
            <div className=" border-2 border-dashed border-primary-200 rounded-cs flex flex-col items-center gap-6 p-6 min-h-fit w-full">
              <p className="text-xs text-gray-900">
                لطفا عکس مورد نظر را بارگذاری کنید{" "}
              </p>
              <div className="w-full h-12">
                <label
                  htmlFor="imageMali"
                  className={`flex cursor-pointer flex-row items-center justify-center rounded-cs  w-full h-full min-w-fit   text-xs xl:text-[13px] hover:shadow-btn duration-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:shadow-none disabled:cursor-not-allowed ${
                    imageFinance
                      ? "bg-white text-primary-900 border border-primary-900"
                      : "bg-primary-900 text-white"
                  }`}
                >
                  بارگذاری {imageFinance ? "مجدد" : ""} سند مالی
                  <span className="mx-2 text-2xl">
                    <MdCloudUpload />
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={imageFinanceHandler}
                  id="imageMali"
                  className="hidden"
                />
              </div>
              {imageFinance ? (
                <div className="h-24 w-56 relative">
                  <Image alt="finance" src={imageFinance} layout="fill" />
                </div>
              ) : null}
            </div>
          </div>
          <div className="w-full h-12 ">
            <PrimaryBtn
              text={"ارسال به سرور"}
              type="submit"
              status={formik.status}
              disabled={formik.status === 1 || !formik.isValid}
            />
          </div>
        </form>
      ) : (
        <section className="flex flex-col  min-h-[99vh] py-10 items-center bg-primary-900 gap-4 w-full  rounded-cs md:max-w-[400px] h-full shadow-cs">
          <div className="flex text-white flex-row items-center w-full justify-between px-5">
            <div></div>
            <h1 className="text-base ">اسکن QR Code</h1>
            <button className="text-2xl" onClick={() => router.push("/upload")}>
              <MdArrowBackIos />
            </button>
          </div>
          <div className="py-12  ">
            <Image src={ImageLogoWhite} alt="login" width={170} height={60} />
          </div>
          <div>
            {/* <div className="bg-white w-48 h-48"></div> */}
            <QrReader
              onResult={(result, error) => {
                if (!!result) {
                  setData(result?.text);
                }

                if (!!error) {
                  console.info(error);
                }
              }}
              constraints={{ facingMode: "environment" }}
              className="border-2 border-primary-50 w-64 h-64  rounded-cs"
              // style={{ width: "100%" }}
            />
          </div>
        </section>
      )}
    </main>
  );
};

export default Check;
