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
import React, { Fragment, useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import CountSelect from "../../../Components/CountSelect";
import { toast } from "react-toastify";
import Pagination from "../../../Components/Pagination";

import {
  deletePatientStatusService,
  getAllPatientStatusService,
} from "../../../Services/patientStatusServices";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import SearchBox from "../../../Components/SearchBox";
import PrimaryBtn from "../../../common/PrimaryBtn";
const PatientStatus = () => {
  const [patient, setPatient] = useState(null);
  const [status, setStatus] = useState(0);

  const head = [
    { id: 0, title: "عنوان", arrow: true },
    { id: 1, title: "شرح", arrow: true },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const getData = () => {
    getAllPatientStatusService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setPatient(data.result);
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
    deletePatientStatusService(id, {
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
  if (!patient) return <PageLoading />;

  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">وضعیت های بیمار</h1>
        </div>
        <div className="w-full flex flex-row items-center justify-end px-6 py-4">
          {/* <SearchBox /> */}
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
              {patient &&
                patient.map((item, index) => (
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
                      {item.description}
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

export default PatientStatus;
