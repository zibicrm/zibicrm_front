import { useRouter } from "next/router";
import {
  MdAddCircleOutline,
  MdArrowRightAlt,
  MdCalendarToday,
  MdLoop,
  MdManageAccounts,
  MdOutlineDeleteSweep,
  MdRemoveRedEye,
  MdSearch,
} from "react-icons/md";
import PageLoading from "../../../utils/LoadingPage";

import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import IconBtn from "../../../common/IconBtn";
import Layout from "../../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import CountSelect from "../../../Components/CountSelect";
import Pagination from "../../../Components/Pagination";
import {
  deleteDoctorService,
  getAllDoctorService,
} from "../../../Services/doctorServices";
import Error from "next/error";
import SearchBox from "../../../Components/SearchBox";
import { toast } from "react-toastify";
import PrimaryBtn from "../../../common/PrimaryBtn";
import ShowTimes from "../../../Components/ShowTimes";
import Modal from "../../../Components/Modal";
import DeleteWarning from "../../../Components/DeleteWarning";
import FilterBtn from "../../../common/FilterBtn";
import { getAllUsersService } from "../../../Services/userServies";
import DatePickerComponent from "../../../common/DatePicker";
import { useFormik } from "formik";
import { Calendar } from "react-multi-date-picker";
import { reportUserEventService } from "../../../Services/reportServices";
import moment from "jalali-moment";
import { useRef } from "react";
import dynamic from "next/dynamic";
import CopyToClipboard from "react-copy-to-clipboard";
const Event = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(0);
  const [open, setOpen] = useState(false);
  const [randomUser, setRandomUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [value, setValue] = useState({
    format: "DD/MM/YYYY",
    date: new Date(),
  });
  const [copied, setCopied] = React.useState(false);
  const userRef = useRef(null);
  const userRef2 = useRef(null);
  const router = useRouter();
  const { user, loading } = useAuth();
  const head = [
    { id: 0, title: "نام بیمار" },
    { id: 1, title: "تلفن همراه" },
    { id: 2, title: "توضیحات" },
    { id: 3, title: "وضعیت" },
  ];
  const getData = async () => {
    setStatus(1);
    await reportUserEventService(
      { date: moment(value.date).format("YYYY-MM-DD"), user_id: selectedUser },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setData(data.result);
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
  const convert = (date, format = value.format) => {
    let object = { date, format };
    if (date) {
      setValue({
        date: date.toDate(),
      });
    } else {
      setValue({ date: "" });
    }
  };
  const onCopy = React.useCallback(() => {
    setCopied(true);
    toast.success("شماره تلفن کپی شد.");
  }, []);
  const userDispatch = useAuthActions();
  useEffect(() => {
    if (userList && userList.length && userRef2.current !== 1) {
      let random = Math.floor(Math.random() * userList.length);
      setSelectedUser(userList[random].id);
      setRandomUser(userList[random]);
      userRef2.current = 1;
    }
  }, [userList]);
  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
    if (user && !loading && userRef.current !== 1) {
      getAllUsersService(
        { page: 1, count: 100 },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
          } else {
            let result = data.result;
            let users = [];
            result.map((u) => {
              users.push({
                id: u.id,
                name: u.last_name,
                color: u.color,
              });
            });
            setUserList(users);
          }
          userRef.current = 1;
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
  }, [loading]);
  useEffect(() => {
    if (user && user.token && selectedUser && value.date) {
      getData();
    }
  }, [selectedUser, value.date]);
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  //   if (!doctor) return <PageLoading />;

  return (
    <Layout>
      <div className="pb-8">
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">گزارش پیگیری ها</h1>
        </div>
        <div className="w-full flex flex-row items-center justify-between px-6 py-4">
          <div className="w-fit flex flex-row items-center gap-3 ">
            {data && data.length ? (
              <>
                <span className="text-gray-900">تعداد وقایع </span>
                <div className="bg-primary-50 text-gray-900 rounded-cs py-2 px-4">
                  {data && data.length}
                </div>
              </>
            ) : null}
          </div>
          <div className="flex flex-row items-center gap-3">
            {randomUser && randomUser.name && (
              <FilterBtn
                label={randomUser.name}
                name="user"
                selectOption={userList}
                labelOption="name"
                valueOption="id"
                onChange={(e) => setSelectedUser(e.id)}
              />
            )}
            <div className="w-32 h-10">
              <PrimaryBtn
                text={
                  value && value.date
                    ? moment(value.date).locale("fa").format("YYYY/MM/DD")
                    : "تقویم"
                }
                onClick={() => {
                  setOpen(true);
                }}
              >
                <span className="block mr-1  mb-1">
                  <MdCalendarToday />
                </span>
              </PrimaryBtn>
            </div>
          </div>
        </div>
        <div className="w-full relative min-h-[400px] max-w-full  overflow-x-scroll border-b border-gray-200">
          <table className="w-full  min-w-[600px]   md:min-w-fit  max-w-full overflow-x-scroll  ">
            <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
              <tr className="text-right text-sm ">
                <th className="w-20 text-right px-3 border border-gray-200 relative text-gray-900">
                  ردیف
                </th>
                {head.map((item) => (
                  <th
                    key={item.id}
                    className=" text-right px-3 border border-gray-200 relative text-gray-900"
                  >
                    {item.title}
                    <div className="rotate-[270deg] absolute left-1 top-3">
                      <MdArrowRightAlt />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="overflow-y-auto  min-h-[400px]">
              {status === 0 ? (
                data &&
                data.map((item, index) => (
                  <tr
                    key={index}
                    title="کپی شماره تلفن"
                    className="h-12  text-sm text-gray-600 hover:bg-primary-50 duration-100"
                  >
                    <td className="w-20 text-right px-3 border-x border-gray-200">
                      {index + 1}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.document && item.document.name}
                    </td>
                    <CopyToClipboard
                      onCopy={onCopy}
                      text={item.document && item.document.tell}
                    >
                      <td
                        title="کپی شماره تلفن"
                        className="cursor-pointer text-right px-3 border-x border-gray-200"
                      >
                        {item.document && item.document.tell}
                      </td>
                    </CopyToClipboard>

                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.description}
                    </td>
                    <td
                      className={`text-right px-3 border-x border-gray-200 ${
                        item.status === 0 ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {item.status === 0 ? "در انتظار پیگیری" : "پیگیری شده"}
                    </td>
                  </tr>
                ))
              ) : (
                <PageLoading />
              )}
            </tbody>
          </table>
        </div>
      </div>
      {open ? (
        <Modal>
          <Calendar
            value={value && value.date && value.date}
            onChange={convert}
            calendar={persian}
            locale={persian_fa}
          >
            <div className="w-full p-4 flex flex-row-reverse items-center justify-between">
              <div className="w-24 h-10">
                <PrimaryBtn
                  onClick={() => {
                    setOpen(false);
                  }}
                  text="انصراف"
                />
              </div>
              <div className="w-24 h-10">
                <PrimaryBtn onClick={() => setOpen(false)} text="ثبت" />
              </div>
            </div>
          </Calendar>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default Event;
