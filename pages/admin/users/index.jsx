import { useRouter } from "next/router";
import {
  MdAddCircleOutline,
  MdArrowRightAlt,
  MdLockOutline,
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
import React, { Fragment, useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import CountSelect from "../../../Components/CountSelect";
import { toast } from "react-toastify";
import Pagination from "../../../Components/Pagination";
import {
  deleteUserService,
  getAllUsersService,
} from "../../../Services/userServies";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import SearchBox from "../../../Components/SearchBox";
import PrimaryBtn from "../../../common/PrimaryBtn";
const User = () => {
  const [users, setUsers] = useState(null);

  const [status, setStatus] = useState(0);

  const head = [
    { id: 0, title: "نقش کاربر" },
    { id: 1, title: "نام و نام خانوادگی" },
    { id: 2, title: "تلفن همراه" },
    { id: 3, title: "جنسیت" },
    { id: 4, title: "عملیات" },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const getData = () => {
    getAllUsersService(
      {
        count: 200,
        page: 1,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setUsers(data.result);
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
  const deleteHandler = (id) => {
    deleteUserService(id, {
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
  if (
    (user && user.user.rule !== 2) ||
    (user && user.user && user.user.id !== 1)
  )
    return <Error statusCode={404} />;
  if (!users) return <PageLoading />;

  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">مدیریت کاربران</h1>
        </div>
        <div className="w-full flex flex-row items-center justify-end px-6 py-4">
          <div className="flex flex-row items-center gap-3">
            <div className={status === 1 && "animate-spin"}>
              <IconBtn
                icon={<MdLoop />}
                onClick={() => {
                  getData(), setStatus(1);
                }}
              />
            </div>{" "}
            <div className="w-32 h-12">
              <PrimaryBtn
                text="افزودن کاربر"
                onClick={() => router.push("/admin/users/add")}
              >
                <span className="block mr-2">
                  <MdAddCircleOutline />
                </span>
              </PrimaryBtn>
            </div>
          </div>
        </div>
        <div className="w-full max-w-full overflow-x-scroll border border-gray-200 ">
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
                    <div className="rotate-[270deg] absolute left-1 top-3">
                      <MdArrowRightAlt />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="overflow-y-auto ">
              {users &&
                users.map((item, index) => (
                  <tr
                    key={index}
                    className="h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100"
                  >
                    <td className="w-20 text-right px-3 border-x border-gray-200">
                      {index + 1}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.rules && item.rules.name}
                    </td>

                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.first_name + " " + item.last_name}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.tell}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.gender === 1 ? "مرد" : "زن"}
                    </td>
                    <td className=" text-right flex flex-row items-center justify-start text-base px-3 lg:text-xl gap-3 h-12 border-x border-gray-200">
                      <IconBtn
                        icon={<MdRemoveRedEye />}
                        onClick={() =>
                          router.push(`/admin/users/detail/?id=${item.id}`)
                        }
                      />
                      <IconBtn
                        icon={<MdOutlineDeleteSweep />}
                        onClick={() => deleteHandler(item.id)}
                      />
                      <IconBtn
                        icon={<MdLockOutline />}
                        onClick={() =>
                          router.push(
                            `/admin/users/change-password/?id=${item.id}`
                          )
                        }
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

export default User;
