import { useRouter } from "next/router";
import {
  MdAddCircleOutline,
  MdArrowRightAlt,
  MdLoop,
  MdOutlineDeleteSweep,
  MdRemoveRedEye,
  MdSchedule,
  MdSearch,
} from "react-icons/md";
import Select from "react-select";
import IconBtn from "../../../common/IconBtn";
import Layout from "../../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import CountSelect from "../../../Components/CountSelect";
import { toast } from "react-toastify";
import Pagination from "../../../Components/Pagination";
import {
  deleteRecordService,
  getAllRecordService,
  searchRecordService,
} from "../../../Services/recordServices";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import moment from "jalali-moment";
import PrimaryBtn from "../../../common/PrimaryBtn";
import Modal from "../../../Components/Modal";
import AddEvent from "../../../Components/AddEvent";
import SearchBox from "../../../Components/SearchBox";
import Link from "next/link";
import { getAllPatientStatusService } from "../../../Services/patientStatusServices";
import { useRef } from "react";
const Record = () => {
  const [records, setRecords] = useState(null);
  const [statusList, setStatusList] = useState(null);
  const [filterRecord, setFilterRecords] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(50);
  const [status, setStatus] = useState(0);
  const [searchStatus, setSearchStatus] = useState(0);
  const [add, setAdd] = useState(false);
  const [data, setData] = useState(null);
  const pageRef = useRef(null);

  const head = [
    { id: 1, title: "نام و نام خانوادگی", arrow: true },
    { id: 2, title: "تلفن همراه", arrow: true },
    { id: 4, title: "تاریخ تشکیل پرونده", arrow: true },
    { id: 5, title: "کارشناس", arrow: true },
    { id: 6, title: "وضعیت", arrow: true },
    { id: 0, title: "شماره پرونده", arrow: true },
    { id: 7, title: "عملیات", arrow: false },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();
  const userDispatch = useAuthActions();
  const getData = async () => {
    if (user) {
      await getAllPatientStatusService({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setStatusList(data.result);
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
      await getAllRecordService(
        {
          count: count,
          page: page,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setRecords(data.result);
            setFilterRecords(data.result);
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
    }
  };

  const deleteHandler = (id) => {
    deleteRecordService(id, {
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          toast.success("با موفقیت حذف شد");
          getData();
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
  useEffect(() => {
    if (user && user.token) {
      getData();
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 3) {
      router.push("/");
    }
  }, [loading, count, page]);
  useEffect(() => {
    pageRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [page]);
  const searchHandler = (e) => {
    if (e !== "" && e.length >= 3) {
      setSearchStatus(1);
      searchRecordService(
        { statement: e },
        {
          Authorization: "Bearer " + user.token,
        }
      ).then(({ data }) => {
        setFilterRecords(data.result);
        setSearchStatus(0);
      });
    }
  };
  const statusLabel = (id) => {
    let filter = statusList.filter((sta) => Number(sta.id) === Number(id))[0];
    return filter && filter.title && filter.title;
  };
  useEffect(() => {
    if (add === false) {
      getData();
    }
  }, [add]);
  if (user && user.user.rule !== 3) return <Error statusCode={404} />;
  if (!records) return <PageLoading />;
  return (
    <Layout>
      <div ref={pageRef}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">پرونده ها</h1>
        </div>
        <div className="w-full flex flex-row items-center justify-between px-6 py-4">
          <div className="w-[40%]">
            <SearchBox
              isState={false}
              changeHandler={searchHandler}
              setFilteredData={setFilterRecords}
              allData={records}
              status={searchStatus}
              placeholder="جست و جو کنید..."
            />
          </div>
          <div className="flex flex-row items-center gap-3">
            <div className={status === 1 && "animate-spin"}>
              <IconBtn
                icon={<MdLoop />}
                onClick={() => {
                  getData(), setStatus(1);
                }}
              />
            </div>
            <CountSelect setCount={setCount} />
            <div className="w-32 h-12">
              <PrimaryBtn
                text="افزودن پرونده"
                onClick={() => router.push("/doctor/record/add")}
              >
                <span className="block mr-2">
                  <MdAddCircleOutline />
                </span>
              </PrimaryBtn>
            </div>
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
              {filterRecord &&
                filterRecord.documents &&
                filterRecord.documents.map((item, index) => (
                  // <Link shallow={false}>
                  <tr
                    key={index}
                    className="h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100 hover:cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/doctor/record/detail/?id=${item.id}`,
                        undefined,
                        { shallow: false }
                      )
                    }
                  >
                    <td className="w-20 text-right px-3 border-x border-gray-200">
                      {(page - 1) * count + index + 1}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.name}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.tell}
                    </td>

                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.created_at &&
                        moment(item.created_at)
                          .locale("fa")
                          .format("YYYY/MM/DD")}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.user &&
                        item.user.first_name + " " + item.user.last_name}
                    </td>
                    <td
                      className={`text-right px-3 border-x border-gray-200 ${
                        item.status === 11
                          ? "text-red-700"
                          : item.status === 3
                          ? "text-green-500"
                          : item.status === 4
                          ? "text-green-700"
                          : item.status === 1
                          ? "text-warning"
                          : item.status === 2
                          ? "text-primary-900"
                          : "text-gray-900"
                      }`}
                    >
                      {statusLabel(item.status)}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.document_id ? item.document_id : "-"}
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className=" text-right flex flex-row items-center justify-start text-base px-3 lg:text-xl gap-3 h-12 border-x border-gray-200"
                    >
                      <IconBtn
                        icon={<MdRemoveRedEye />}
                        onClick={() =>
                          router.push(`/doctor/record/detail/?id=${item.id}`)
                        }
                      />
                      {user && user.user && user.user.id === 1 ? (
                        <IconBtn
                          icon={<MdOutlineDeleteSweep />}
                          onClick={() => deleteHandler(item.id)}
                        />
                      ) : null}
                      <IconBtn
                        icon={<MdSchedule />}
                        onClick={() => {
                          setData(item);
                          setAdd(true);
                        }}
                      />
                    </td>
                  </tr>
                  // </Link>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination
          setPage={setPage}
          page={page}
          recordsCount={
            Number(page - 1) * Number(count) + records.documents.length
          }
          count={records.count}
        />
      </div>
      {add ? (
        <Modal setModal={() => {}}>
          <AddEvent setOpen={setAdd} userInfo={data} />
        </Modal>
      ) : null}
    </Layout>
  );
};

export default Record;
