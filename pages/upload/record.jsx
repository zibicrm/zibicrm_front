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
import { uploadRecordImageService } from "../../Services/ImageService";
import { toast } from "react-toastify";
import FormData from "form-data";
import Resizer from "react-image-file-resizer";
const Check = ({}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [imageCheck, setImageCheck] = useState(null);
  const validationSchema = yup.object({
    image: yup.mixed().required("عکس پرونده بیمار را آپلود کنید"),
    document_id: yup.string().required("عکس پشت پرونده بیمار را آپلود کنید"),
  });
  const initialValues = {
    document_id: data && data.split("_")[1] ? data.split("_")[1] : "",
    image: "",
  };
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        600,
        600,
        "png",
        20,
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
      formData.append("image", values.image);
      formData.append("document_id", values.document_id);
      console.log('form data',formData.getAll('image'));
      uploadRecordImageService(formData, {
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
  const imageCheckHandler = async (e) => {
    if (e.target.files[0]) {
      const file = await e.target.files[0];
      const image = await resizeFile(file);
      formik.setFieldValue("image", image);
      setImageCheck(URL.createObjectURL(file));
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
            <h1 className="text-base text-gray-900">
              بارگذاری تصویر پرونده پزشکی
            </h1>
            <button
              className="text-2xl text-gray-900"
              onClick={() => router.push("/upload")}
            >
              <MdArrowBackIos />
            </button>
          </div>
          <div className="h-full w-full gap-12  flex flex-col items-center">
            <div className="flex flex-row items-center w-[90%] min-w-fit h-fit rounded-cs border border-primary-200 p-2 text-sm justify-between">
              <ul className="border-l border-primary-200 flex flex-col items-center w-1/2 gap-4 ">
                <li className="text-gray-900">تاریخ </li>
              </ul>
              <ul className="flex gap-4 flex-col text-gray-900 items-center w-1/2">
                <li>
                  {data.split("_")[0]
                    ? moment(data.split("_")[0])
                        .locale("fa")
                        .format("YYYY/MM/DD")
                    : ""}
                </li>
              </ul>
            </div>

            <div className="w-full border-2 border-dashed border-primary-200 rounded-cs flex flex-col items-center gap-6 p-6">
              <p className="text-xs text-gray-900">
                لطفا عکس پرونده بیمار را بارگذاری کنید
              </p>
              <div className="w-full h-12">
                <label
                  htmlFor="imageCheck"
                  className={`flex cursor-pointer flex-row items-center justify-center rounded-cs  w-full h-full min-w-fit   text-xs xl:text-[13px] hover:shadow-btn duration-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:shadow-none disabled:cursor-not-allowed ${
                    imageCheck
                      ? "bg-white text-primary-900 border border-primary-900"
                      : "bg-primary-900 text-white"
                  }`}
                >
                  بارگذاری {imageCheck ? "مجدد" : ""} عکس پرونده بیمار{" "}
                  <span className="mx-2 text-2xl">
                    <MdCloudUpload />
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  // capture="environment"
                  onChange={imageCheckHandler}
                  id="imageCheck"
                  className="hidden"
                />
              </div>
              {imageCheck ? (
                <div className="h-24 w-56 relative">
                  <Image alt="check" src={imageCheck} layout="fill" />
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
