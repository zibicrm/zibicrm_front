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
import { deleteService, getAllService } from "../../../Services/serviceRequest";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import SearchBox from "../../../Components/SearchBox";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { CurrencyNum } from "../../../hooks/CurrencyNum";
import { useRef } from "react";
const Services = () => {
  const [services, setServices] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(0);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(50);
  const pageRef = useRef(null);

  const getData = () => {
    getAllService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setServices(data.result);
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
  const head = [
    { id: 0, title: "عنوان خدمت", arrow: true },
    { id: 1, title: "شرح خدمت", arrow: true },
    { id: 6, title: "مطب", arrow: true },
    { id: 2, title: "هزینه خدمت", arrow: true },
    { id: 3, title: "هزینه مواد مصرفی", arrow: true },
    { id: 7, title: "پورسانت کارشناس", arrow: true },
    { id: 4, title: "مجموع هزینه ها", arrow: true },
    { id: 5, title: "عملیات", arrow: false },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const pagination = () => {
    let s = (page - 1) * count;
    let e = page * count;
    setData(services && services.slice(s, e));
  };
  useEffect(() => {
    services && pagination();
  }, [services, count, page]);
  useEffect(() => {
    pageRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [page]);
  const deleteHandler = (id) => {
    deleteService(id, {
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
  const searchHandler = (e) => {
    let filterData = services.map((item) => {
      delete item.created_at;
      delete item.updated_at;
      delete item.user_id;
      delete item.clinic_id;
      return item;
    });
    let res = filterData.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(e.toLowerCase())
    );
    setData(res);
  };
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
  if (!services) return <PageLoading />;

  return (
    <Layout>
      <div ref={pageRef}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">خدمات</h1>
        </div>
        <div className="w-full flex flex-row items-center justify-between px-6 py-4">
          <div className="w-[40%]">
            <SearchBox
              allData={services}
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
                text="افزودن خدمات"
                onClick={() => router.push("/admin/service/add")}
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
                      {item.clinic?.title}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {CurrencyNum.format(item.service_cost)}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {CurrencyNum.format(item.material_cost)}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {CurrencyNum.format(item.supplier_commission)}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {CurrencyNum.format(item.sum_cost)}
                    </td>
                    <td className=" text-right flex flex-row items-center justify-start text-base px-3 lg:text-xl gap-3 h-12 border-x border-gray-200">
                      <IconBtn
                        icon={<MdRemoveRedEye />}
                        onClick={() =>
                          router.push(`/admin/service/detail/?id=${item.id}`)
                        }
                      />
                      {user && user.user && user.user.id === 1 ? (
                        <IconBtn
                          icon={<MdOutlineDeleteSweep />}
                          onClick={() => deleteHandler(item.id)}
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          count={services.length}
          records={data}
          setPage={setPage}
        />
      </div>
    </Layout>
  );
};

export default Services;
