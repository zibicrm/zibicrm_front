import { useRouter } from "next/router";
import {
  MdAddCircleOutline,
  MdArrowRightAlt,
  MdLoop,
  MdOutlineDeleteSweep,
  MdRemoveRedEye,
  MdSchedule,
  MdSearch,
  MdTune,
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
  deleteClinicService,
  getAllClinicService,
} from "../../../Services/clinicServices";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import FilterSelect from "../../../common/FilterSelect";
import PrimaryBtn from "../../../common/PrimaryBtn";
import SearchBox from "../../../Components/SearchBox";
const Clinic = () => {
  const [clinic, setClinic] = useState(null);
  const [status, setStatus] = useState(0);
  const head = [
    { id: 0, title: "نام مطب", arrow: true },
    { id: 1, title: "شماره تلفن اول", arrow: true },
    { id: 2, title: "شماره تلفن دوم", arrow: true },
    { id: 3, title: "آدرس", arrow: true },
    { id: 4, title: "لوکیشن", arrow: false },
  ];
  const getData = () => {
    getAllClinicService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setClinic(data.result);
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
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const deleteHandler = (id) => {
    deleteClinicService(id, {
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
    if (user && user.user.rule !== 1) {
      router.push("/");
    }
  }, [user, loading]);
  if (user && user.user.rule !== 1) return <Error statusCode={404} />;
  if (!clinic) return <PageLoading />;

  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">مطب ها</h1>
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
              {clinic &&
                clinic.map((item, index) => (
                  <tr
                    key={index}
                    className="h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100"
                  >
                    <td className="w-20  select-text text-right px-3 border-x border-gray-200">
                      {index + 1}
                    </td>
                    <td className=" select-text text-right px-3 border-x border-gray-200">
                      {item.title}
                    </td>
                    <td className="select-text text-right px-3 border-x border-gray-200">
                      {item.tell1}
                    </td>
                    <td className="select-text text-right px-3 border-x border-gray-200">
                      {item.tell2}
                    </td>
                    <td className="select-text text-right px-3 border-x border-gray-200 max-w-[250px]">
                      {item.address}
                    </td>
                    <td className="select-text text-right px-3 border-x border-gray-200">
                      {item.location}
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

export default Clinic;
