import { useRouter } from "next/router";
import {
  MdAddCircleOutline,
  MdArrowRightAlt,
  MdLoop,
  MdOutlineDeleteSweep,
  MdRemoveRedEye,
  MdSearch,
} from "react-icons/md";
import Select from "react-select";

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
import PageLoading from "../../../utils/LoadingPage";
import SearchBox from "../../../Components/SearchBox";
import { toast } from "react-toastify";
import PrimaryBtn from "../../../common/PrimaryBtn";
import ShowTimes from "../../../Components/ShowTimes";
import Modal from "../../../Components/Modal";
const Doctor = () => {
  const [doctor, setDoctor] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(0);
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(50);
  const head = [
    { id: 0, title: "شماره تلفن" },
    { id: 1, title: "نام و نام خانوادگی" },
    { id: 2, title: "مطب" },
    { id: 3, title: "تخصص" },
    { id: 4, title: "زمان حضور در مطب" },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();
  const getData = async () => {
    await getAllDoctorService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setDoctor(data.result);
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
  const pagination = () => {
    let s = (page - 1) * count;
    let e = page * count;
    setData(doctor && doctor.slice(s, e));
  };
  const searchHandler = (e) => {
    let filterData = doctor.map((item) => {
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
  useEffect(() => {
    doctor && pagination();
  }, [doctor]);
  const userDispatch = useAuthActions();

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

  if (user && user.user.rule !== 3) return <Error statusCode={404} />;
  if (!doctor) return <PageLoading />;

  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">پزشکان</h1>
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
                      {index + 1}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.tell}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.name}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.address[0].title}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.speciality}
                    </td>
                    <td
                      onClick={() => {
                        setDays(item.days);
                        setOpen(true);
                      }}
                      className="text-primary-900 cursor-pointer text-right px-3 border-x border-gray-200"
                    >
                      مشاهده
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination
          setPage={setPage}
          records={doctor}
          count={data && data.length}
          page={page}
        />
      </div>
      {open ? (
        <Modal>
          <ShowTimes setOpen={setOpen} data={days} />
        </Modal>
      ) : null}
    </Layout>
  );
};

export default Doctor;
