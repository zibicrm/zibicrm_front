import { useRouter } from "next/router";
import {
  MdAddCircleOutline,
  MdArrowRightAlt,
  MdLoop,
  MdMoreHoriz,
  MdOutlineDeleteSweep,
  MdRemoveRedEye,
  MdSchedule,
  MdSearch,
} from "react-icons/md";
import Select from "react-select";

import IconBtn from "../../../common/IconBtn";
import Layout from "../../../Layout/Layout";
import React, { Fragment, useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import CountSelect from "../../../Components/CountSelect";
import { toast } from "react-toastify";
import Pagination from "../../../Components/Pagination";

import {
  deletePatientStatusService,
  getAllPatientStatusService,
} from "../../../Services/patientStatusServices";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import SearchBox from "../../../Components/SearchBox";
import PrimaryBtn from "../../../common/PrimaryBtn";
import {
  getPhoneNumberService,
  recivePhoneNumberService,
  setStatusPhoneNumberService,
} from "../../../Services/phoneNumberServices";
import moment from "jalali-moment";
import Modal from "../../../Components/Modal";
import { CloseBtn } from "../../../common/CloseBtn";
import OutlineBtn from "../../../common/OutlineBtn";
import CopyToClipboard from "react-copy-to-clipboard";
const GetPhoneNumber = () => {
  const [phoneNumbers, setPhoneNumbers] = useState(null);
  const [status, setStatus] = useState(0);
  const [statusBtn, setStatusBtn] = useState(0);
  const [statusCell, setStatusCell] = useState(null);
  const [cell, setCell] = useState(null);
  const [copied,setCopied] = useState(null)

  const head = [
    { id: 0, title: "شماره تلفن", arrow: false },
    { id: 1, title: "زمان اختصاص", arrow: false },
    { id: 2, title: "وضعیت", arrow: false },
    { id: 3, title: "عملیات", arrow: false },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      padding: 0,
      color: "#6B7280",
      height: "48px",
      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      border: "none",
      color: "#6B7280",
      height: "42px",
    }),

    option: (provided, state) => ({
      ...provided,
      color: "#6B7280",
      borderRadius: "5px",
      boxShadow: "none",
      backgroundColor: "#fff",

      "&:hover": {
        backgroundColor: "#EDF0F8",
        boxShadow: "none",
        color: "#6B7280",
      },
    }),
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      border: "none",
      outline: "none",
      boxShadow: "none",
      color: "#6B7280",

      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "none",
      },
    }),
  };


  const onCopy = React.useCallback(() => {
    setCopied(true);
    toast.success("شماره تلفن کپی شد.");
  }, []);

  const getData = () => {
    getPhoneNumberService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setPhoneNumbers(data.result);
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
  const getNewPhoneNumber = async () => {
    setStatus(1);
    await recivePhoneNumberService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          toast.success(data.result[0]);
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
  const setStatusPhoneNumber = () => {
    setStatusBtn(1);
    setStatusPhoneNumberService(
      { status: statusCell.id, cell_id: cell },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          toast.success("با موفقیت تغییر یافت");
          getData();
          setCell(null);
        }
        setStatusBtn(0);
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
        setCell(null);
        setStatusBtn(0);
      });
  };
  let statusList = [
    { id: 0, name: "جدید" },
    { id: 1, name: "تشکیل پرونده" },
    { id: 2, name: "عدم پاسخ" },
    { id: 3, name: "کنسل" },
  ];
  useEffect(() => {
    if (user && user.token) {
      getData();
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 1) {
      router.push("/");
    }
  }, [user, loading]);
  if (user && user.user.rule !== 1) return <Error statusCode={404} />;
  if (!phoneNumbers) return <PageLoading />;

  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">لیست شماره تلفن ها</h1>
        </div>
        <div className="w-full flex flex-row items-center justify-end px-6 py-4">
          <div className="h-12 w-52">
            <PrimaryBtn
              text="دریافت شماره تلفن جدید"
              status={status}
              onClick={() => getNewPhoneNumber()}
              disabled={status === 1}
            />
          </div>
        </div>
        <div className="w-full max-w-full overflow-x-scroll ">
          <table className="w-full  min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
            <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
              <tr className="text-right text-sm">
                <th className="w-20 text-center border border-gray-200 relative text-gray-900">
                  ردیف
                </th>
                {head.map((item) => (
                  <th
                    key={item.id}
                    className=" text-right border px-3 border-gray-200 relative text-gray-900"
                  >
                    {item.title}
                    {item.arrow ? (
                      <div className="rotate-[270deg] absolute left-1 top-3">
                        <MdArrowRightAlt />
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="overflow-y-auto ">
              {phoneNumbers &&
                phoneNumbers.map((item, index) => (
                  <tr
                    key={index}
                    className="h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100"
                  >
                    <td className="w-20 text-right px-3 border-x border-gray-200">
                      {index + 1}
                    </td>
                    <CopyToClipboard
                        onCopy={onCopy}
                        text={item.tell}
                    >
                    <td className="  text-right px-3 border-x border-gray-200" >
                      {item.tell}
                    </td>
                    </CopyToClipboard>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {moment(item.created_at)
                        .locale("fa")
                        .format("HH:mm YYYY/MM/DD")}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.status === 0 ? "جدید" : "عدم پاسخ"}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      <IconBtn
                        icon={<MdMoreHoriz />}
                        onClick={() => setCell(item.id)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {cell ? (
        <Modal>
          <div className="w-96 h-54 bg-white rounded-cs p-6 flex flex-col items-center gap-7">
            <CloseBtn onClick={() => setCell(null)} />
            <div className="w-full flex items-center justify-start">
              <span className="text-xl">عملیات </span>
            </div>
            <div className="border border-gray-300 w-full rounded-cs h-12">
              <Select
                className="w-full  text-gray-500 text-sm "
                options={statusList}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                styles={customStyles}
                defaultValue={{
                  id: -1,
                  name: "انتخاب وضعیت",
                }}
                onChange={(e) => {
                  setStatusCell(e);
                }}
                id="statusSelect"
              />
            </div>
            <div className="w-full flex flex-row items-center gap-6">
              <div className="w-1/2 h-12">
                <OutlineBtn text="انصراف" onClick={() => setCell(null)} />
              </div>
              <div className="w-1/2 h-12">
                <PrimaryBtn
                  text="ثبت"
                  onClick={() => setStatusPhoneNumber()}
                  status={statusBtn}
                  disabled={!statusCell || statusBtn === 1}
                />
              </div>
            </div>
          </div>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default GetPhoneNumber;
