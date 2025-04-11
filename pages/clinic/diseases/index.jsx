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
import { toast } from "react-toastify";
import CountSelect from "../../../Components/CountSelect";
import Pagination from "../../../Components/Pagination";
import {
  deleteSystemicService,
  getAllSystemicService,
} from "../../../Services/systemicServices";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import FilterSelect from "../../../common/FilterSelect";
import SearchBox from "../../../Components/SearchBox";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { useRef } from "react";
const Diseases = () => {
  const [diseases, setDiseases] = useState(null);
  const [status, setStatus] = useState(0);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(50);
  const [data, setData] = useState(null);
  const pageRef = useRef(null);

  const head = [
    { id: 0, title: "عنوان بیماری" },
    { id: 1, title: "ملاحظات" },
    { id: 2, title: "شرح" },
    { id: 5, title: "عملیات" },
  ];
  const getData = async () => {
    await getAllSystemicService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setDiseases(data.result);
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
    diseases && pagination();
  }, [diseases]);
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const deleteHandler = (id) => {
    deleteSystemicService(id, {
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
  }, [user, loading]);
  useEffect(() => {
    pageRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [page]);
  const pagination = () => {
    let s = (page - 1) * count;
    let e = page * count;
    setData(diseases && diseases.slice(s, e));
  };
  const searchHandler = (e) => {
    let filterData = diseases.map((item) => {
      delete item.created_at;
      delete item.updated_at;
      delete item.id;
      return item;
    });
    let res = filterData.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(e.toLowerCase())
    );
    setData(res);
  };
  if (user && user.user.rule !== 3) return <Error statusCode={404} />;
  if (!diseases) return <PageLoading />;

  return (
    <Layout>
      <div ref={pageRef}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">بیماری های سیستماتیک</h1>
        </div>
        <div className="w-full flex flex-row items-center justify-between px-6 py-4">
          <div className="w-[40%]">
            <SearchBox
              allData={diseases}
              changeHandler={searchHandler}
              isState={true}
              setFilteredData={setData}
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
                text="افزودن بیماری"
                onClick={() => router.push("/clinic/diseases/add")}
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
            <tbody className="overflow-y-auto ">
              {data &&
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100"
                  >
                    <td className="w-20 text-right px-3 border-x border-gray-200">
                      {(page - 1) * count + index + 1}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.title}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.description}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.detail}
                    </td>

                    <td className=" text-right px-3 flex flex-row items-center justify-start text-base lg:text-xl gap-3 h-12 border-x border-gray-200">
                      <IconBtn
                        icon={<MdRemoveRedEye />}
                        onClick={() =>
                          router.push(`/clinic/diseases/detail/?id=${item.id}`)
                        }
                      />
                      <IconBtn
                        icon={<MdOutlineDeleteSweep />}
                        onClick={() => deleteHandler(item.id)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Diseases;
