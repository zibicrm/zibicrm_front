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

import IconBtn from "../../../../common/IconBtn";
import Layout from "../../../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../../Provider/AuthProvider";
import CountSelect from "../../../../Components/CountSelect";
import { toast } from "react-toastify";
import Pagination from "../../../../Components/Pagination";
import {
  deleteParaclinicService,
  getAllParaclinicService,
} from "../../../../Services/paraclinicServices";
import Error from "next/error";
import PageLoading from "../../../../utils/LoadingPage";
const Manage = () => {
  const [paraclinic, setParaclinic] = useState(null);
  const getData = () => {
    getAllParaclinicService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setParaclinic(data.result);
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
  const head = [
    { id: 0, title: "نوع پاراکلینیک" },
    { id: 1, title: "شرح" },
    { id: 2, title: "عملیات" },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const deleteHandler = (id) => {
    deleteParaclinicService(id, {
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
  if (!paraclinic) return <PageLoading />;

  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">مدیریت نوع پاراکلینیک</h1>
        </div>
        <div className="w-full flex flex-row items-center justify-end px-6 py-4">
          <div className="flex flex-row items-center gap-3">
            <IconBtn
              onClick={() => router.push("/admin/paraclinic/manage/add")}
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
              {paraclinic &&
                paraclinic.map((item, index) => (
                  <tr
                    key={index}
                    className="h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100"
                  >
                    <td className="w-20 text-right px-3 border-x border-gray-200">
                      {index + 1}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.title}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.type_id}
                    </td>

                    <td className=" text-right px-3 flex flex-row items-center justify-start text-base lg:text-xl gap-3 h-12 border-x border-gray-200">
                      <IconBtn
                        icon={<MdRemoveRedEye />}
                        onClick={() =>
                          router.push(`/admin/paraclinic/${item.id}`)
                        }
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

export default Manage;
