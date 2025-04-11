import PrimaryBtn from "../common/PrimaryBtn";
import RadioInput from "../common/RadioBtn";
import SelectInput from "../common/SelectInput";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../common/Input";
import Modal from "./Modal";
import { CloseBtn } from "../common/CloseBtn";
import { useEffect, useState } from "react";
import CheckForm from "./CheckForm";
import { toast } from "react-toastify";
import { treatmentService } from "../Services/treatmentService";
const AddPayment = ({ setOpen }) => {
  const [payment, setPayment] = useState(1);
  const validationSchema = yup.object({
    document_id: yup.string(),
    doctor_id: yup.string().required("پزشک معالج را انتخاب کنید"),
    assist_id: yup.string().required("نام دستیار پزشک را وارد کنید"),
    service_id: yup.string().required("نوع خدمت را وارد کنید"),
    count: yup.string().required("تعداد خدمت را وارد کنید"),
    clinic_id: yup.string().required("مطب را انتخاب کنید"),
    month_count: yup
      .string()
      .test(
        "check",
        "ضرب تعداد اقساط و فاصله اقساط باید کمتر از ۶ باشد",
        function (value) {
          let s =
            Number(formik.values.check_count) *
            Number(formik.values.month_count);
          return s <= 6 ? true : false;
        }
      ),
  });
  const initialValues = {
    document_id: "",
    SumPrice: "",
    discount: "",
    receive_price: "",
    description: "",
    payment_type: "",
    assistant: "",
    doctor_id: "",
    clinic_id: "",
    check_count: "",
    month_count: "",
    checkdate: "",
    treatment_checks: [],
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      let finalValues = {
        ...values,
        document_id: data.id,
        clinic_id: formik.values.clinic_id,
        doctor_id: formik.values.doctor_id,
        assistant: formik.values.assist_id,
        treatment_service: selectService,
      };
      treatmentService(finalValues, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("با موفقیت ثبت شد");
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
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });
  const paymentOption = [
    { id: "1", label: "نقد", value: "1" },
    { id: "2", label: "اقساطی", value: "2" },
    { id: "3", label: "چک", value: "3" },
  ];

  const ghestOption = [
    { id: 1, value: "1" },
    { id: 2, value: "2" },
    { id: 3, value: "3" },
    { id: 3, value: "4" },
    { id: 3, value: "5" },
    { id: 3, value: "6" },
  ];
  const defualtValue = {
    value: "",
    id: 0,
  };
  const renderPayment = (type) => {
    switch (type) {
      case "2":
        return (
          <>
            <div className="col-span-2"></div>
            <SelectInput
              formik={formik}
              label="تعداد اقساط"
              name="check_count"
              selectOption={ghestOption}
              labelOption="value"
              valueOption="id"
              defaultV={defualtValue}
            />
            <SelectInput
              formik={formik}
              label="فاصله هر قسط"
              name="month_count"
              selectOption={ghestOption}
              labelOption="value"
              valueOption="id"
              defaultV={defualtValue}
            />
            <div className="col-span-3 border border-gray-200">
              {[...new Array(Number(formik.values.check_count))].map((x, i) => (
                <div
                  key={i}
                  className="grid border border-gray-200  w-full gap-4 p-6 items-center"
                >
                  <CheckForm formik={formik} />
                </div>
              ))}
            </div>
          </>
        );
      case "3":
        return (
          <>
            <CheckForm formik={formik} />
          </>
        );
      default:
        break;
    }
  };
  useEffect(() => {
    formik.setFieldValue("treatment_checks", []);
  }, [formik.values.payment_type]);
  return (
    <Modal>
      <div className="bg-white p-6 max-w-[90vw] max-h-[90vh] overflow-y-auto rounded-cs">
        <CloseBtn onClick={() => setOpen(false)} />
        <div className="relative flex flex-row justify-start items-center pt-1">
          <span className="text-xl">ثبت پرداختی</span>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-8 grid grid-cols-3 w-full gap-x-4 gap-y-8"
        >
          <Input
            name="SumPrice"
            type="text"
            label="مبلغ کل"
            formik={formik}
            disable={false}
          />
          <Input
            name="discount"
            type="text"
            label="تخفیف (تومان)"
            formik={formik}
          />
          <Input
            name="receive_price"
            type="text"
            label="دریافتی"
            formik={formik}
          />
          <div className="flex flex-row items-center  gap-3 min-w-fit">
            <span className="text-sm ">نوع پرداخت</span>
            <RadioInput
              radioOptions={paymentOption}
              formik={formik}
              name="payment_type"
            />
          </div>
          {renderPayment(formik.values.payment_type)}
          <textarea
            placeholder="توضیحات پرداخت"
            {...formik.getFieldProps("description")}
            className={`p-2 border border-primary-400 rounded-cs text-xs outline-none w-full max-h-72 h-64 col-span-3`}
          />
          <div className="w-full col-span-3 grid grid-cols-3 ">
            <div className="col-span-2"></div>
            <div className="h-12 w-full ">
              <PrimaryBtn text="ثبت درمان" type="submit" />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddPayment;
