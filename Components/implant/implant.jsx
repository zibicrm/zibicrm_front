import { useRouter } from "next/router";
import {
  MdAddCircleOutline,
  MdArrowRightAlt,
  MdLoop,
  MdOutlineChevronLeft,
  MdOutlineChevronRight,
  MdOutlineDeleteSweep,
  MdOutlineEdit,
  MdRemoveRedEye,
  MdSchedule,
  MdSearch,
  MdTune,
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
  deleteImplantTypeService,
  getAllImplantTypeService,
} from "../../../Services/ImplantTypeServices";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import SearchBox from "../../../Components/SearchBox";
const Implant = () => {
  const [implants, setImplant] = useState(null);
  const head = [
    { id: 0, title: "برند" },
    { id: 1, title: "کشور سازنده" },
    { id: 2, title: "مدت زمان ضمانت" },
    { id: 5, title: "عملیات" },
  ];
  const getData = () => {
    getAllImplantTypeService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setImplant(data.result);
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
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const deleteHandler = (id) => {
    deleteImplantTypeService(id, {
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
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading]);
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  if (!implants) return <PageLoading />;

  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">برند های ایمپلنت</h1>
        </div>
        <div className="w-full flex flex-row items-center justify-between px-6 py-4">
          <div className="w-[40%]">
            <SearchBox />
          </div>
          <div className="flex flex-row items-center gap-3">
            <CountSelect />
            <IconBtn icon={<MdLoop />} onClick={() => getData()} />
            <IconBtn
              onClick={() => router.push("/admin/implant/add")}
              icon={<MdAddCircleOutline />}
            />
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
              {implants &&
                implants.map((item, index) => (
                  <tr
                    key={index}
                    className="h-12 text-سm text-gray-600 hover:bg-primary-50 duration-100"
                  >
                    <td className="w-20 text-right px-3 border-x border-gray-200">
                      {index + 1}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.title}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.country}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.warranty}
                    </td>

                    <td className=" text-right px-3 flex flex-row items-center justify-start text-base lg:text-xl gap-3 h-12 border-x border-gray-200">
                      <IconBtn
                        icon={<MdRemoveRedEye />}
                        onClick={() => router.push(`/admin/implant/${item.id}`)}
                      />
                      <IconBtn
                        icon={<MdOutlineDeleteSweep />}
                        onClick={() => deleteHandler(item.id)}
                      />

                      <IconBtn icon={<MdSchedule />} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination />
      </div>
    </Layout>
  );
};

export default Implant;
