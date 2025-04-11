import { useRouter } from "next/router";
import {
  MdCallReceived,
  MdCloudUpload,
  MdOutlineLibraryBooks,
  MdSchedule,
} from "react-icons/md";

import Layout from "../../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";

import Error from "next/error";

import Link from "next/link";
import {
  getStatisticPhoneNumberService,
  uploadPhoneNumberService,
} from "../../../Services/phoneNumberServices";
import { toast } from "react-toastify";
import DialogAlert from "../../../Components/Dialog";
import PageLoading from "../../../utils/LoadingPage";
const PatientStatus = () => {
  const [res, serRes] = useState(null);
  const [data, serData] = useState(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();
  const userDispatch = useAuthActions();
  const getData = () => {
    getStatisticPhoneNumberService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          serData(data.result);
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
  const uploadHanlder = async (value) => {
    setStatus(1);
    let formData = new FormData();
    formData.append("file", value);
    value &&
      uploadPhoneNumberService(formData, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            serRes(data.result);
            setOpen(true);
            toast.success("با موفقیت آپلود شد");
            getData();
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
  };
  useEffect(() => {
    if (user && !loading) {
      getData();
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [loading]);
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;

  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">لیست شماره تلفن ها</h1>
        </div>
        <div className="w-full max-w-full overflow-x-scroll flex-row items-center flex  gap-6 px-8 py-6">
          <div className="grid grid-cols-2 max-w-fit gap-6 text-primary-900 ">
            <Link href={"#"}>
              <button className=" w-48 py-5  px-4 iconBox   bg-white shadow-cs rounded-cs hover:shadow-btn cursor-pointer flex flex-col items-center gap-4">
                <div className=" rounded-full w-12 h-12 bg-primary-50 text-2xl flex items-center justify-center duration-300">
                  <MdCallReceived />
                </div>
                <span className=" text-sm">تعداد شماره های دریافتی</span>
                <span>{data && data.entity}</span>
              </button>
            </Link>
            <Link href={"#"}>
              <button className=" w-48 py-5  px-4 iconBox   bg-white shadow-cs rounded-cs hover:shadow-btn cursor-pointer flex flex-col items-center gap-4">
                <div className="rotate-180 rounded-full w-12 h-12 bg-primary-50 text-2xl flex items-center justify-center duration-300">
                  <MdCallReceived />
                </div>
                <span className=" text-sm">شماره های کنسلی </span>
                <span>{data && data.cancel}</span>
              </button>
            </Link>
            <Link href={"#"}>
              <button className=" w-48 py-5  px-4 iconBox   bg-white shadow-cs rounded-cs hover:shadow-btn cursor-pointer flex flex-col items-center gap-4">
                <div className=" rounded-full w-12 h-12 bg-primary-50 text-2xl flex items-center justify-center duration-300">
                  <MdSchedule />
                </div>
                <span className="text-sm text-gray-900">تعداد عدم پاسخ</span>
                <span>{data && data.notAnswer}</span>
              </button>
            </Link>
            <Link href={"#"}>
              <button className=" w-48 py-5  px-4 iconBox   bg-white shadow-cs rounded-cs hover:shadow-btn cursor-pointer flex flex-col items-center gap-4">
                <div className=" rounded-full w-12 h-12 bg-primary-50 text-2xl flex items-center justify-center duration-300">
                  <MdOutlineLibraryBooks />
                </div>
                <span className="text-sm text-gray-900">
                  تعداد تشکیل پرونده
                </span>
                <span>{data && data.documented}</span>
              </button>
            </Link>
          </div>
          <label
            htmlFor="import-phone-numbers"
            className="flex flex-col cursor-pointer items-center gap-4 h-full min-h-[352px] justify-center  border-2 rounded-cs border-dashed border-primary-300 w-[calc(100%-410px)]"
          >
            <div className="text-[150px] text-primary-300">
              <MdCloudUpload />
            </div>
            <span>لیست شماره با پسوند txt</span>
            <div className="h-12 w-96">
              {status === 1 ? (
                <div className="relative">
                  <PageLoading />
                </div>
              ) : (
                <>
                  <input
                    type={"file"}
                    id="import-phone-numbers"
                    className="w-full h-full hidden"
                    onChange={(e) => uploadHanlder(e.target.files[0])}
                    accept=".txt"
                  />
                  <label
                    htmlFor="import-phone-numbers"
                    className="h-12 w-96 bg-primary-900 cursor-pointer border"
                  >
                    <div className="h-full w-full flex items-center justify-center rounded-cs bg-primary-900 text-white text-center">
                      آپلود لیست شماره
                    </div>
                  </label>
                </>
              )}
            </div>
          </label>
        </div>
      </div>
      <DialogAlert title="نتیجه" setIsOpen={setOpen} isOpen={open}>
        <div className="flex flex-col gap-1 ">
          <p>
            تعداد کل شماره ها :{" "}
            {res &&
              Number(res.new) +
                Number(res.old) +
                Number(res.duplicate) +
                Number(res.garbage)}
          </p>
          <p>شماره های جدید : {res && res.new}</p>
          <p>شماره های از قبل موجود : {res && res.old}</p>
          <p>شماره های تکراری : {res && res.duplicate}</p>
          <p>شماره های ناقص : {res && res.garbage}</p>
        </div>
      </DialogAlert>
      {/* {res ?: null} */}
    </Layout>
  );
};

export default PatientStatus;
