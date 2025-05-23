import {
  MdArrowForward,
  MdChatBubbleOutline,
  MdOutlineAssignment,
  MdOutlineAssignmentInd,
  MdOutlineChat,
  MdOutlineLibraryBooks,
  MdPrint,
  MdClose,
  MdArrowRightAlt,
} from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import AddEvent from "../../../../Components/AddEvent";
import Modal from "../../../../Components/Modal";
import Layout from "../../../../Layout/Layout";
import React, { useState, useEffect, useRef } from "react";
import {
  getRecordService,
  financeDocumentAll,
  financeDocumentAllTransaction,
  financePaymentStore,
} from "../../../../Services/recordServices";
import { useFormik } from "formik";
import { useAuth, useAuthActions } from "../../../../Provider/AuthProvider";
import { useRouter } from "next/router";
import { BsCurrencyDollar } from "react-icons/bs";
import IconBox from "../../../../Components/IconBox";
import { toast } from "react-toastify";
import PageLoading from "../../../../utils/LoadingPage";
import { EventsRender } from "../../../../Components/EventsRender";
import moment from "jalali-moment";
import { CurrencyNum } from "../../../../hooks/CurrencyNum";
import PrimaryBtn from "../../../../common/PrimaryBtn";
import { Transition } from "@headlessui/react";
import Input from "../../../../common/Input";
import SelectInput from "../../../../common/SelectInput";
import { CloseBtn } from "../../../../common/CloseBtn";
import CurrencyInputComponent from "../../../../common/CurrencyInput";
import Pdf from "react-to-pdf";

const Record = () => {
  const [add, setAdd] = useState(false);
  const [data, setData] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [recievePayment, setRecievePayment] = useState(false);
  const [patientAccount, setPatientAccount] = useState([]);
  const { user, loading } = useAuth();
  const router = useRouter();
  const id = router.query.id;
  const userDispatch = useAuthActions();
  const pdfRef = useRef();

  const head = [
    { id: 0, title: "مبلغ تراکنش" },
    { id: 1, title: "تاریخ" },
    { id: 2, title: "نوع پرداختی" },
    { id: 3, title: "کاربر" },
    { id: 4, title: "توضیحات" },
  ];

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
  const patientTransaction = () => {
    financeDocumentAllTransaction(id, {
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setTransaction(data.result);
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
  const patientList = () => {
    financeDocumentAll(id, {
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setPatientAccount(data.result);
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
  const initialValues = {
    document_id: id,
    payment_type: "",
    description: "",
    price: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      financePaymentStore(values, { Authorization: "Bearer " + user.token })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            patientTransaction();
            setRecievePayment(false);
            formik.resetForm();
            toast.success("  پرداخت با موفقیت ثبت شد");
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
    validateOnMount: true,
    enableReinitialize: true,
  });

  const selectOption = [
    { label: "نقد", value: "1" },
    { label: "بیعانه", value: "2" },
    { label: "پوز", value: "3" },
    { label: "کارت به کارت", value: "4" },
    { label: "آنلاین", value: "5" },
    { label: "چک", value: "6" },
  ];
  const paymentTypeChek = (type) => {
    switch (type) {
      case 1:
        return "نقد";
      case 2:
        return "بیعانه";
      case 3:
        return "پوز";
      case 4:
        return "کارت به کارت ";
      case 5:
        return "آنلاین";
      case 6:
        return "چک";

        break;

      default:
        break;
    }
  };
  const defualtValue = {
    value: "",
    id: 0,
  };
  useEffect(() => {
    if (user && !loading && id) {
      getData();
      patientList();
      patientTransaction();
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading, id]);
  const iconBoxList = [
    {
      icon: <MdOutlineLibraryBooks />,
      text: "اطلاعات پرونده ",
      link: `/accounting/record/detail/edit/?id=${id}`,
      id: 0,
    },
    {
      icon: <MdOutlineAssignmentInd />,
      text: "ثبت درمان",
      link: `/accounting/record/detail/medical/?id=${id}`,
      id: 1,
    },
    {
      icon: <BsCurrencyDollar />,
      text: "مدیریت مالی",
      link: `/accounting/record/detail/finance/?id=${id}`,
      id: 3,
    },
  ];
  if (!data || !data.name) return <PageLoading />;
  return (
    <Layout>
      <div className=" flex flex-col  h-full max-h-[calc(100vh-160px)]">
        <div className="bg-gray-50 px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <div className="flex w-full flex-row justify-between items-center h-[50px] ">
            <div className="flex flex-row items-center gap-3">
              <button
                onClick={() => router.push("/accounting/record/")}
                className="text-2xl"
                type="button"
              >
                <MdArrowForward />
              </button>
              <h1 className="text-xl text-gray-900">
                پرونده {data && data.name && data.name}
              </h1>
            </div>
            <div className="text-sm text-gray-900">
              کارشناس :
              {data &&
                data.user &&
                data.user &&
                data.user.first_name + " " + data.user.last_name}
            </div>
          </div>
        </div>
        <div className="flex flex-row h-full min-h-full max-h-full ">
          <div className=" w-8/12 flex flex-col max-h-[calc(100vh-160px)] overflow-y-auto pb-6">
            <div className="w-full  flex flex-row items-start gap-6 p-6">
              {/* h-full */}
              {iconBoxList.map((item) => (
                <IconBox
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  link={item.link}
                />
              ))}{" "}
            </div>
            <h1 className="bg-gray-50 w-full h-20 text-start font-light p-6 border border-x-0 border-gray-300 text-base">
              صورتحساب بیمار
            </h1>
            <div className="bg-white px-4 py-6">
              <div className="  flex items-center justify-center rounded-cs w-full h-72 bg-gray-50  text-base  p-12">
                <div className="bg-white  grid grid-cols-4  w-full py-4  mx-auto rounded-cs">
                  <div className="font-normal flex flex-col justify-around  items-center h-[120px] my-auto ">
                    <p>کل هزینه ها</p>

                    <div className=" flex flex-col justify-around p-22 items-center ">
                      <p className="text-primary-900">
                        {patientAccount &&
                          patientAccount.AllAmount &&
                          CurrencyNum.format(
                            Number(patientAccount.AllAmount.All)
                          )}
                      </p>

                      <p className="text-[#FF9900] text-xs ">
                        {" "}
                        با احتساب{" "}
                        {patientAccount &&
                          patientAccount.AllAmount &&
                          CurrencyNum.format(
                            Number(patientAccount.AllAmount.discount)
                          )}{" "}
                        تخفیف
                      </p>
                    </div>
                  </div>
                  <div className="font-normal flex flex-col justify-around items-center h-[120px] my-auto  border-r-2  ">
                    <p>پرداختی ها </p>

                    <div className=" flex flex-col justify-around p-22 items-center ">
                      <p className="text-[#15803D]">
                        {patientAccount &&
                          patientAccount.AllPayment &&
                          CurrencyNum.format(
                            Number(patientAccount.AllPayment.All)
                          )}
                      </p>
                      <p className="text-[#FF9900] text-xs">
                        {" "}
                        با احتساب{" "}
                        {patientAccount &&
                          patientAccount.AllPayment &&
                          CurrencyNum.format(
                            patientAccount.AllPayment.checks
                          )}{" "}
                        چک
                      </p>
                    </div>
                  </div>
                  <div className="font-normal flex flex-col justify-around items-center h-[120px] my-auto  border-r-2  ">
                    <p> باقی مانده </p>

                    <div className=" flex flex-col justify-around p-22 items-center ">
                      {" "}
                      <p className="text-red-600">
                        {patientAccount &&
                          patientAccount.AllMod &&
                          CurrencyNum.format(Number(patientAccount.AllMod.All))}
                      </p>
                      {patientAccount &&
                      patientAccount.AllMod &&
                      patientAccount.AllMod.All > 0 ? (
                        <p className="text-[#FF9900] text-xs">بدهکار</p>
                      ) : (
                        <p className="text-[#FF9900] text-xs">بستانکار</p>
                      )}
                    </div>
                  </div>
                  <div className="font-normal flex flex-col justify-around items-center h-[120px] my-auto  border-r-2  ">
                    <p> عودت ها </p>

                    <p className="text-[#FF9900]">
                      {patientAccount &&
                        patientAccount.AllRefund &&
                        CurrencyNum.format(
                          Number(patientAccount.AllRefund.All)
                        )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col min-h-fit px-4 gap-6 ">
              <div className="flex w-full items-center flex-row justify-between h-fit  ">
                <p className=" text-base"> تراکنش های بیمار</p>
                <div className="flex glex-row items-center gap-4">
                  <button
                    className="bg-primary-900 w-[160px] h-[50px] rounded-cs text-white flex justify-center p-3 font-thin text-xs"
                    onClick={() => setRecievePayment(true)}
                  >
                    <span className=" p-1"> دریافت وجه</span>
                  </button>

                  <Pdf
                    targetRef={pdfRef}
                    scale={1}
                    filename={`صورتحساب-${data.name.replace(" ", "-")}.pdf`}
                  >
                    {({ toPdf }) => (
                      <button
                        className="bg-primary-900 w-[160px] h-[50px] rounded-cs text-white flex justify-center p-3 font-thin text-xs"
                        onClick={toPdf}
                      >
                        <span className=" p-1"> خروجی pdf</span>
                        <FaFilePdf className="text-2xl" />
                      </button>
                    )}
                  </Pdf>
                  <div className="w-full max-w-full overflow-x-scroll opacity-0 absolute -top-[5000px] -right-[5000px]">
                    <div
                      ref={pdfRef}
                      className="w-full h-full min-w-[790px] max-w-[790px]"
                    >
                      <table className="w-full border-b border-gray-600 min-w-full md:min-w-fit   overflow-x-hidden  ">
                        <thead className="bg-gray-300 h-[42px] min-w-[800px] md:min-w-fit  ">
                          <tr className="text-right text-sm">
                            {head.map((item) => (
                              <th
                                key={item.id}
                                className=" text-right border px-3 border-gray-600 relative"
                              >
                                {item.title}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="overflow-y-auto ">
                          {transaction &&
                            transaction.map((item, index) => (
                              <tr
                                key={item.id}
                                className="h-12 border-l text-sm text-gray-600 hover:bg-primary-50 duration-100"
                              >
                                <td className="  text-right px-3 border-x border-gray-600">
                                  {CurrencyNum.format(item.price)}
                                </td>
                                <td className=" text-right px-3 border-x border-gray-600">
                                  {moment(item.created_at)
                                    .locale("fa")
                                    .format("YYYY/MM/DD")}{" "}
                                </td>
                                <td className="min-w-[105px] text-right px-3 border-x border-gray-600">
                                  {paymentTypeChek(item.payment_type)}
                                </td>
                                <td className=" text-right px-3 border-x border-gray-600">
                                  {item.user &&
                                    item.user.first_name +
                                      " " +
                                      item.user.last_name}
                                </td>

                                <td className="  text-right px-3 border-x border-gray-600">
                                  {item.description ? item.description : "-"}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-full overflow-x-scroll ">
                <table className="w-full border-b min-w-full md:min-w-fit  max-w-full overflow-x-hidden  ">
                  <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
                    <tr className="text-right text-sm">
                      {head.map((item) => (
                        <th
                          key={item.id}
                          className=" text-right border px-3 border-gray-200 relative text-gray-900"
                        >
                          {item.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto ">
                    {transaction &&
                      transaction.map((item, index) => (
                        <tr
                          key={item.id}
                          className="h-12 border-l text-sm text-gray-600 hover:bg-primary-50 duration-100"
                        >
                          <td className="  text-right px-3 border-x border-gray-200">
                            {CurrencyNum.format(item.price)}
                          </td>
                          <td className=" text-right px-3 border-x border-gray-200">
                            {moment(item.created_at)
                              .locale("fa")
                              .format("YYYY/MM/DD")}{" "}
                          </td>
                          <td className="min-w-[105px] text-right px-3 border-x border-gray-200">
                            {paymentTypeChek(item.payment_type)}
                          </td>
                          <td className=" text-right px-3 border-x border-gray-200">
                            {item.user &&
                              item.user.first_name + " " + item.user.last_name}
                          </td>

                          <td className="  text-right px-3 border-x border-gray-200">
                            {item.description ? item.description : "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="w-4/12 py-4 border-r border-gray-200  overflow-y-auto flex flex-col overflow-auto min-h-full gap-4 ">
            <EventsRender data={data} />
          </div>
        </div>
      </div>
      {add ? (
        <Modal setModal={() => {}}>
          <AddEvent setOpen={setAdd} userInfo={data} />
        </Modal>
      ) : null}
      {recievePayment ? (
        <Modal>
          <div className="w-[450px] h-full relative bg-white rounded-cs flex flex-col gap-8 p-6">
            <div className="flex justify-between text-lg ">
              <span className=" text-start font-normal">
                دریافت وجه{" "}
                <span className="text-primary-900">[{[data.name]}]</span>
              </span>
              <CloseBtn onClick={() => setRecievePayment(false)} />
            </div>

            <form
              className="flex flex-col h-full gap-4 w-full"
              onSubmit={formik.handleSubmit}
            >
              <p className="text-sm text-start  ">
                لطفا مبلغ دریافتی را وارد نمایید{" "}
              </p>
              <CurrencyInputComponent
                formik={formik}
                label="مبلغ"
                name="price"
                type="text"
              />

              <SelectInput
                formik={formik}
                label="نوع پرداخت"
                selectOption={selectOption}
                name="payment_type"
                labelOption="label"
                valueOption="value"
                defaultV={defualtValue}
              />

              <textarea
                formik={formik}
                className=" h-44  p-3  rounded  border  border-gray-300 border-solid  focus:outline-none max-w-full max-h-44 "
                rows="4"
                placeholder=" توضیحات "
                name="description"
                {...formik.getFieldProps("description")}
              />

              <div className="w-full h-12">
                <PrimaryBtn
                  text="ثبت"
                  type={"submit"}
                  status={formik.status}
                  disabled={formik.status === 1 ? true : false}
                />
              </div>
            </form>
          </div>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default Record;
