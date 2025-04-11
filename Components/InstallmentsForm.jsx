import { useFormik } from "formik";
import DatePickerComponent from "../common/DatePicker";
import * as yup from "yup";
import Input from "../common/Input";
import { useEffect, useState } from "react";
import PrimaryBtn from "../common/PrimaryBtn";
import moment from "jalali-moment";
import CurrencyInputComponent from "../common/CurrencyInput";

const InstallmentsForm = ({ finalFormik, index }) => {
  const [edit, setEdit] = useState(0);
  const validationSchema = yup.object({
    amount: yup.string().required("مبلغ چک را وارد کنید"),
    date: yup.string().required("تاریخ چک را وارد کنید"),
  });
  let allRecive =
    finalFormik.values.receive_price + finalFormik.values.discount;
  const initialValues = {
    serial: "1",
    amount: "",
    date: "",
  };
  // const nowDate = moment(Date.now()).locale("fa").format("YYYY/MM/DD");

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
    <div className="col-span-3 grid grid-cols-3 gap-4 ">
      <div className="">
        <CurrencyInputComponent
          formik={checkFormik}
          label="مبلغ پرداختی"
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
              تاریخ پرداخت
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
            text="تاریخ پرداخت"
          />
        )}
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
    </div>
  );
};

export default InstallmentsForm;
