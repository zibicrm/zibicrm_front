import { useRouter } from "next/router";
import { MdArrowRightAlt, MdCalendarToday, MdPrint } from "react-icons/md";
import Layout from "../../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import { toast } from "react-toastify";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { getAllUsersService } from "../../../Services/userServies";
import Select from "react-select";
import Modal from "../../../Components/Modal";
import moment from "jalali-moment";
import { reportUserPorsantService } from "../../../Services/reportServices";
import RangePicker from "../../../Components/RangePicker";
import { CurrencyNum } from "../../../hooks/CurrencyNum";
import Link from "next/link";

const Clinic = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectUser, setSelectUser] = useState(null);
  const userDispatch = useAuthActions();
  const [users, setUsers] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(0);
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");
  const head = [
    { id: 0, title: "شماره پرونده", arrow: false },
    { id: 1, title: "نام بیمار", arrow: false },
    { id: 2, title: "شماره تلفن", arrow: false },
    { id: 3, title: "خدمت", arrow: false },
    { id: 4, title: "تعداد خدمت", arrow: false },
    { id: 7, title: "تاریخ ثبت درمان", arrow: false },
    { id: 5, title: "پورسانت", arrow: false },
  ];
  const getData = () => {
    getAllUsersService(
      { page: 1, count: 200 },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          let userList = [];
          data.result.map((item) =>
            userList.push({
              id: item.id,
              name: item.first_name + " " + item.last_name,
            })
          );
          setUsers(userList);
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
  const getPorsantData = (firstLoad) => {
    reportUserPorsantService(
      {
        end: firstLoad
          ? moment
              .from(lastDay, "fa", "YYYY-MM-DD")
              .locale("en")
              .format("YYYY-MM-DD")
          : end,
        start: firstLoad
          ? moment
              .from(firstDay, "fa", "YYYY-MM-DD")
              .locale("en")
              .format("YYYY-MM-DD")
          : start,
        user_id: selectUser,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          // let userList = [];
          // data.result.map((item) =>
          //   userList.push({
          //     id: item.id,
          //     name: item.first_name + " " + item.last_name,
          //   })
          // );
          // setUsers(userList);
          setData(data.result[0].treatment_service);
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
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      padding: 0,
      color: "#6B7280",

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
  const sumCount = () => {
    let sum = 0;
    data.map((i) => {
      sum = sum + i.count;
    });
    return sum;
  };
  const sumCommision = () => {
    let sum = 0;
    data.map((i) => {
      sum = sum + i.count * i.supplier_commission;
    });
    return sum;
  };
  useEffect(() => {
    if (start && end && !calendar && user && selectUser) {
      getPorsantData(false);
    }
    if (!start && !end && !calendar && user && selectUser) {
      getPorsantData(true);
    }
  }, [selectUser]);
  useEffect(() => {
    if (start && end && !calendar && user && selectUser) {
      getPorsantData(false);
    }
    if (!start && !end && !calendar && user && selectUser) {
      getPorsantData(true);
    }
  }, [calendar]);
  useEffect(() => {
    if (user && user.token) {
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
  if (!users) return <PageLoading />;

  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start border-b border-primary-900">
          <h1 className="text-xl text-gray-900">گزارشات پورسانت</h1>
        </div>
        <div className="w-full flex flex-row items-end justify-between px-6 py-4">
          <div className="flex flex-col items-start gap-4">
            <span className="text-sm text-gray-900">
              کارشناس مورد نظر خود را انتخاب نمایید.
            </span>
            <div className="flex flex-row items-center gap-6">
              <div
                className={`w-80  rounded-cs relative h-[42px] md:h-12 text-xs md:text-base border border-primary-500 pr-2 flex items-center justify-center`}
              >
                <Select
                  className="w-full text-gray-500 text-sm"
                  options={users}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  defaultValue={{
                    id: -15,
                    name: "کارشناس",
                  }}
                  onChange={(e) => {
                    setSelectUser(e);
                  }}
                  placeholder="کارشناس"
                  value={selectUser}
                  id="selectUser"
                  styles={customStyles}
                />
              </div>
              <div className="h-12 w-36">
                <PrimaryBtn text="تقویم" onClick={() => setCalendar(!calendar)}>
                  <MdCalendarToday />
                </PrimaryBtn>
              </div>
              <div className="w-32 h-12">
                <PrimaryBtn text="مشاهده نتیجه" />
              </div>
            </div>
          </div>
          <div className="w-36 h-12">
            <PrimaryBtn
              text="گرفتن خروجی pdf"
              //   onClick={() => router.push("/admin/clinic/add")}
            >
              <span className="block mr-2">
                <MdPrint />
              </span>
            </PrimaryBtn>
          </div>
        </div>
        <div className="w-full max-w-full overflow-x-scroll border-b border-gray-200">
          <table className="w-full  min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
            <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
              <tr className="text-right text-sm ">
                <th className="w-20 text-right px-3 border border-gray-200 relative text-gray-900">
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
              {data &&
                data.map((item, index) => (
                  <Link
                    href={`/admin/record/detail/?id=${item.treatment[0].document.id}`}
                    target={"_blank"}
                    rel="noopener noreferrer"
                    key={index}
                    className="table-row "
                  >
                    <tr className="h-12 cursor-pointer text-sm text-gray-600 hover:bg-primary-50 duration-100">
                      <td className="w-20 text-right px-3 border-x border-gray-200">
                        {index + 1}
                      </td>
                      <td className="  text-right px-3 border-x border-gray-200">
                        {item.treatment &&
                          item.treatment[0].document &&
                          item.treatment[0].document.document_id}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {item.treatment &&
                          item.treatment[0].document &&
                          item.treatment[0].document.name}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {item.treatment &&
                          item.treatment[0].document &&
                          item.treatment[0].document.tell}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200 max-w-[250px]">
                        {item.service_title}
                      </td>
                      <td className="select-text text-right px-3 border-x border-gray-200">
                        {item.count}
                      </td>
                      <td className=" text-right px-3 flex flex-row items-center justify-start   gap-3 h-12 border-x border-gray-200">
                        {moment(item.created_at)
                          .locale("fa")
                          .format("YYYY/MM/DD")}
                      </td>
                      <td>
                        {CurrencyNum.format(
                          Number(item.count) * Number(item.supplier_commission)
                        )}
                      </td>
                    </tr>
                  </Link>
                ))}
              <tr className="h-12 text-sm text-gray-600 font-bold bg-gray-50  hover:bg-primary-50 duration-100 ">
                <td
                  colSpan={5}
                  className="  text-right px-3 border border-gray-200"
                >
                  کل
                </td>
                <td className="  text-right px-3 border border-gray-200">
                  {data && sumCount()}
                </td>
                <td className=" text-right px-3 border border-gray-200">
                  {" "}
                  از{" "}
                  {start
                    ? moment(start).locale("fa").format("YYYY/MM/DD")
                    : firstDay}{" "}
                  تا{" "}
                  {end
                    ? moment(end).locale("fa").format("YYYY/MM/DD")
                    : lastDay}
                </td>
                <td className=" text-right px-3 border border-gray-200">
                  {data && CurrencyNum.format(sumCommision())}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {calendar ? (
        <Modal>
          <RangePicker
            end={end}
            setEnd={setEnd}
            setStart={setStart}
            start={start}
            calendar={calendar}
            setCalendar={setCalendar}
          />
        </Modal>
      ) : null}
    </Layout>
  );
};

export default Clinic;
