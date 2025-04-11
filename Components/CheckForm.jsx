import { useFormik } from "formik";
import DatePickerComponent from "../common/DatePicker";
import * as yup from "yup";
import Input from "../common/Input";
import { useEffect, useState } from "react";
import PrimaryBtn from "../common/PrimaryBtn";
import moment from "jalali-moment";
import CurrencyInputComponent from "../common/CurrencyInput";
import QRCode from "react-qr-code";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import Modal from "./Modal";
import { CloseBtn } from "../common/CloseBtn";
import Link from "next/link";
import { v1 as uuidv1 } from "uuid";

import { useRouter } from "next/router";
import { useRef } from "react";
const CheckForm = ({ finalFormik, index }) => {
  const [edit, setEdit] = useState(0);
  const [qrValue, setQrValue] = useState(null);
  let nowDay = moment(moment.now()).format("YYYY-MM-DD");
  const router = useRouter();
  const id = router.query.id;
  const uuidRef = useRef(false);
  const [uuid, setUuid] = useState(null);

  const validationSchema = yup.object({
    amount: yup.string().required("مبلغ چک را وارد کنید"),
    date: yup.string().required("تاریخ چک را وارد کنید"),
    serial: yup.string().required("سریال چک را وارد کنید"),
  });
  let allRecive =
    finalFormik.values.receive_price + finalFormik.values.discount;
  const initialValues = {
    amount: "",
    date: "",
    serial: "",
    uuid: uuid,
  };
  useEffect(() => {
    if (uuidRef.current === false) {
      uuidRef.current = true;
      setUuid(uuidv1());
    }
  }, []);
  const checkFormik = useFormik({
    initialValues,
    onSubmit: (values) => {
      setEdit(1);
      let res = finalFormik.values.treatment_checks.find((e) => e.id === index);
      if (!res) {
        finalFormik.setFieldValue("treatment_checks", [
          ...finalFormik.values.treatment_checks,
          { ...values, id: index },
        ]);
      } else {
        let filter = finalFormik.values.treatment_checks.filter(
          (e) => e.id !== index
        );
        finalFormik.setFieldValue("treatment_checks", [
          ...filter,
          { ...values, id: index },
        ]);
      }
      // let rest = finalFormik.values.treatment_checks.filter(
      //   (item) => item.id !== index
      // );
      // finalFormik.setFieldValue("treatment_checks", [
      //   ...rest,
      //   { ...values, id: index },
      // ]);
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });
  useEffect(() => {
    checkFormik.resetForm();
    setEdit(0);
    if (finalFormik.values.check_count && finalFormik.values.month_count) {
      let date = moment(
        moment().add((index + 1) * finalFormik.values.month_count, "months")
      );
      checkFormik.setFieldValue("date", date.format("YYYY-MM-DD"));
    }
  }, [finalFormik.values.check_count, finalFormik.values.month_count]);
  return (
    <div className="col-span-3 grid grid-cols-5 gap-4  ">
      <div className="col-span-1">
        <Input
          name="serial"
          type="text"
          label="شماره سریال چک"
          formik={checkFormik}
          disable={edit === 1}
        />
      </div>
      <div className="">
        <CurrencyInputComponent
          formik={checkFormik}
          label="مبلغ چک"
          name="amount"
          disable={edit === 1}
        />
      </div>
      <div className="">
        {edit === 1 ? (
          <div className="relative z-0 w-full md:max-h-[64px] max-h-[64px] input-controll">
            <input
              type={"text"}
              placeholder=""
              disabled={true}
              value={moment(checkFormik.values.date)
                .locale("fa")
                .format("YYYY/MM/DD")}
              className={`pt-3 pb-2 block w-full px-6 mt-0 text-sm text-gray-400 border rounded-cs md:max-h-[48px] h-12 max-h-[48px] bg-white autofill:bg-white  appearance-none focus:outline-none focus:ring-0 focus:bg-white  disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200 disabled:hover:shadow-none `}
            />
            <label className="absolute cursor-text rounded-[90%] text-xs md:text-sm duration-300 top-4 right-5 -z-1 origin-0 label-bg text-gray-500 ">
              تاریخ چک
            </label>
          </div>
        ) : (
          <DatePickerComponent
            name={"date"}
            label={
              checkFormik.values.date
                ? moment(checkFormik.values.date)
                    .locale("fa")
                    .format("YYYY/MM/DD")
                : "تاریخ چک"
            }
            formik={checkFormik}
            text="تاریخ چک"
          />
        )}
      </div>
      <div>
        <PrimaryBtn
          text="آپلود سند مالی"
          type="button"
          disabled={!checkFormik.isValid}
          onClick={() => {
            setQrValue(
              `${
                uuid +
                "_" +
                moment(checkFormik.values.date).format("YYYY/MM/DD") +
                "_" +
                checkFormik.values.amount +
                "_" +
                id +
                "_" +
                3 +
                "_" +
                checkFormik.values.serial
              }`
            );
          }}
        >
          <MdOutlineQrCodeScanner />
        </PrimaryBtn>
      </div>
      <div className="h-12 w-full">
        {edit === 1 ? (
          <button
            onClick={() => setEdit(0)}
            type={"button"}
            disabled={edit === 0}
            className="flex flex-row items-center justify-center rounded-cs bg-primary-900 w-full h-full min-w-fit  text-white text-xs xl:text-[13px] hover:shadow-btn duration-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:shadow-none disabled:cursor-not-allowed"
          >
            ویرایش
          </button>
        ) : (
          <PrimaryBtn
            text="ثبت"
            type="submit"
            disabled={edit === 1 || !checkFormik.isValid}
            onClick={() => checkFormik.submitForm()}
          />
        )}
      </div>
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
    </div>
  );
};

export default CheckForm;
