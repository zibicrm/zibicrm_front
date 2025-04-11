import Link from "next/link";
import React from "react";
import IconBtn from "../../../../common/IconBtn";
import { MdCalendarToday, MdOutlineCancel, MdSchedule } from "react-icons/md";
import PrimaryBtn from "../../../../common/PrimaryBtn";
import PageLoading from "../../../../utils/LoadingPage";
import Tabs from "../../../../Components/Tabs";
import moment from "jalali-moment";
import { useState } from "react";
import {
  eventGetTodayLaboratory,
  eventGetTodayLaboratoryFollowup,
  reportReferAppointmentService,
  reportReferSurgeryAppointmentService,
} from "../../../../Services/reportServices";
import { useEffect } from "react";
import { useAuth } from "../../../../Provider/AuthProvider";
import { getAllClinicService } from "../../../../Services/clinicServices";
import { useRouter } from "next/router";
import { getEventByDataService } from "../../../../Services/supplierService";
import Layout from "../../../../Layout/Layout";
import Modal from "../../../../Components/Modal";
import AddEvent from "../../../../Components/AddEvent";
import { CloseBtn } from "../../../../common/CloseBtn";
import { cancelAppointmentService } from "../../../../Services/appointmentService";
import { cancelAppointmentSurgeryService } from "../../../../Services/appointmentSurgeryService";
const tabs = [
  { id: 0, text: "ویزیت" },
  { id: 1, text: "جراحی" },
];

const tabs2 = [
  { id: 0, text: "ویزیت نشده" },
  { id: 1, text: "جراحی نشده" },
];

const UnregisteredTreatmentsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [tab2, setTab2] = useState(0);
  const [refer, setRefer] = useState([]);
  const [referStatus, setReferStatus] = useState(0);
  const [add, setAdd] = useState(false);
  const [cancel, setCancel] = useState(-1);
  const [description, setDescription] = useState("");

  const tableTwoHead = [
    { id: 15, title: "شماره پرونده" },
    { id: 1, title: "نام بیمار" },
    { id: 2, title: "تلفن همراه" },
    { id: 4, title: "پزشک " },
    { id: 14, title: "مطب" },
    { id: 9, title: "کارشناس" },
    { id: 10, title: "زمان مراجعه" },
    { id: 3, title: "عملیات" },
    { id: 30, title: "ثبت درمان" },
  ];

  const getFollowUp = () => {
    getEventByDataService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setTodayEvent(data.result);
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
  const getDelivery = () => {
    if (user && !loading) {
      eventGetTodayLaboratory({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            let tableData = [];
            data.result.map((item) => {
              tableData.push({
                id: item.id,
                pName: item.document.name,
                date: item.created_at,

                followUp: item.follow_up_date,
                description: item.description,
              });
            });

            setThreeTable(tableData);
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
    }
  };

  const getFollowUpLabratoryData = () => {
    eventGetTodayLaboratoryFollowup({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          // toast.success(data.result[0]);
          setFollowUpDelivery(data.result);
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

  const getRefer = () => {
    if (user && !loading) {
      setReferStatus(1);
      if (tab2 === 0) {
        reportReferAppointmentService({
          Authorization: "Bearer " + user.token,
        })
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              setRefer(data.result);
            }
            setReferStatus(0);
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
            setReferStatus(0);
          });
      } else {
        reportReferSurgeryAppointmentService({
          Authorization: "Bearer " + user.token,
        })
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              setRefer(data.result);
            }
            setReferStatus(0);
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
            setReferStatus(0);
          });
      }
    }
  };

  const cancelAppointment = () => {
    setCancelStatus(1);
    if (tab === 0) {
      cancelAppointmentService(
        {
          appointment_id: cancel,
          description,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success(data.result[0]);
            if (doctor && clinic) {
              getData();
            } else {
              getAllData();
            }
            setCancelStatus(0);
          }
          setCancel(-1);
          setDescription("");
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
          setCancelStatus(0);
          setCancel(-1);
          setDescription("");
        });
    } else {
      cancelAppointmentSurgeryService(
        {
          appointment_id: cancel,
          description,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success(data.result[0]);
            if (doctor && clinic) {
              getData();
            } else {
              getAllData();
            }
            j;
          }
          setCancel(-1);
          setDescription("");
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
          setCancel(-1);
          setDescription("");
        });
    }
  };

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 3) {
      router.push("/");
    }
    if (user && !loading) {
      getAllClinicService({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setAllClinic(data.result);
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
      getFollowUp();
      getRefer();
      getDelivery();
      getFollowUpLabratoryData();
    }
    if (router.query.ref === "event") {
      eventRef.current?.scrollIntoView();
    }
  }, [loading]);

  useEffect(() => {
    getRefer();
  }, [tab2]);

  return (
    <Layout>
      <div className="w-full flex flex-col items-center  rounded-cs">
      <div className="w-full bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
        <div className="w-full flex items-center gap-x-4">
          <span>{tab2 === 0 ? "ویزیت" : "جراحی"} نشده ها</span>
          <Tabs options={tabs2} setTab={setTab2} tab={tab2} />
        </div>
        </div>
        <div className="w-full max-w-full min-h-[380px]  overflow-y-auto">
          <table className="w-full relative min-w-[600px] md:min-w-fit  max-w-full   ">
            <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
              <tr className="text-right text-sm">
                <th className="w-20 text-center border-l border-b border-gray-200 relative">
                  ردیف
                </th>

                {tableTwoHead.map((item) => (
                  <th
                    key={item.id}
                    className=" text-right whitespace-nowrap border-l border-b px-3 border-gray-200 relative"
                    // onClick={() => setSort("date")}
                  >
                    {item.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="overflow-y-auto w-full min-h-[400px] ">
              {refer &&
                referStatus === 0 &&
                refer.map((item, index) => (
                  <tr
                    key={index}
                    className={`h-12 cursor-pointer text-xs  hover:bg-primary-50 duration-100 ${
                      item.status !== 1 ? "text-red-700" : "text-gray-600"
                    }`}
                  >
                    <td className="w-6  text-right px-3 border-x border-gray-200">
                      <Link
                        href={`/clinic/record/detail/?id=${item.document_id}`}
                        rel="noopener noreferrer"
                      >
                        <a target={"_blank"}>{index + 1}</a>
                      </Link>
                    </td>
                    <td className="w-6   text-right px-3 border-x border-gray-200">
                      <Link
                        href={`/clinic/record/detail/?id=${item.document_id}`}
                        rel="noopener noreferrer"
                      >
                        <a target={"_blank"}>
                          {item.document
                            ? item.document.document_id
                            : "ثبت نشده"}
                        </a>
                      </Link>
                    </td>

                    <td className=" text-right px-3 border-x border-gray-200">
                      <Link
                        href={`/clinic/record/detail/?id=${item.document_id}`}
                      >
                        <a target={"_blank"} rel="noopener noreferrer">
                          {item.document && item.document.name}
                        </a>
                      </Link>
                    </td>
                    <td className=" text-right px-3  border-x border-gray-200">
                      <Link
                        href={`/clinic/record/detail/?id=${item.document_id}`}
                      >
                        <a target={"_blank"} rel="noopener noreferrer">
                          {item.document && item.document.tell}
                        </a>
                      </Link>
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      <Link
                        href={`/clinic/record/detail/?id=${item.document_id}`}
                      >
                        <a target={"_blank"} rel="noopener noreferrer">
                          {item.doctor && item.doctor.name}
                        </a>
                      </Link>
                    </td>

                    <td className=" text-right px-3 border-x border-gray-200">
                      <Link
                        href={`/clinic/record/detail/?id=${item.document_id}`}
                      >
                        <a target={"_blank"} rel="noopener noreferrer">
                          {item.clinic && item.clinic.title}
                        </a>
                      </Link>
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      <Link
                        href={`/clinic/record/detail/?id=${item.document_id}`}
                      >
                        <a target={"_blank"} rel="noopener noreferrer">
                          {item.supplier &&
                            item.supplier.first_name +
                              " " +
                              item.supplier.last_name}
                        </a>
                      </Link>
                    </td>

                    <td
                      className={` text-right px-3 border-x border-gray-200 `}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/clinic/record/detail/?id=${item.document_id}`}
                      >
                        <a target={"_blank"} rel="noopener noreferrer">
                          {item.VisitTime.slice(0, 5) +
                            " " +
                            moment(item.dateOfDay)
                              .locale("fa")
                              .format("YYYY/M/D")}
                        </a>
                      </Link>
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className=" text-right flex flex-row items-center justify-start text-base px-3 lg:text-xl gap-3 h-12  border-gray-200"
                    >
                      <IconBtn
                        icon={<MdSchedule />}
                        onClick={() => setAdd(item.document)}
                      />

                      {item.status === 2 ? null : (
                        <IconBtn
                          icon={
                            <div className="relative text-2xl">
                              <MdCalendarToday />
                              <span className="text-[16px] absolute bg-white -bottom-0.5 -right-0.5">
                                <MdOutlineCancel />
                              </span>
                            </div>
                          }
                          onClick={() => setCancel(item.id)}
                        />
                      )}
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className=" text-right items-center justify-start text-base px-3 lg:text-xl gap-3 h-12 border-r border-gray-200"
                    >
                      <Link
                        href={`/clinic/record/detail/health/?id=${item.document_id}`}
                      >
                        <a
                          className="w-28 h-8 block"
                          target={"_blank"}
                          rel="noopener noreferrer"
                        >
                          <PrimaryBtn text="ثبت درمان" />
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))}
              {referStatus === 1 && (
                <div className=" w-full h-80 flex items-center justify-center">
                  <PageLoading />
                </div>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {add ? (
        <Modal setModal={() => {}}>
          <AddEvent setOpen={setAdd} userInfo={add} />
        </Modal>
      ) : null}
      {cancel >= 0 ? (
        <Modal
          setModal={() => {
            null;
          }}
        >
          <div className="bg-white p-8 relative rounded-cs max-w-sm gap-4 flex flex-col">
            <CloseBtn onClick={() => setCancel(-1)} />
            <h2 className="text-xl"> کنسل کردن نوبت</h2>
            <p className="text-[#FF9900] text-sm">
              اخطار!
              <br /> اگر قصد ثبت نوبت جدید دارید ابتدا از موجود بودن نوبت مورد
              نظر اطمینان حاصل نمایید همچنین توجه نمایید که در صورت کنسل شدن،
              اجازه ثبت این نوبت برای افراد دیگر ازاد می باشد.
            </p>
            <textarea
              className="w-full h-60 outline-none border border-primary-400 rounded-cs p-4"
              placeholder="توضیحات"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="w-full  h-12">
              <PrimaryBtn
                text="ثبت"
                onClick={() => cancelAppointment()}
                disabled={description.length <= 5}
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default UnregisteredTreatmentsPage;
