import React, { useEffect, useState } from "react";
import Layout from "../../../Layout/Layout";
import { MdArrowForward, MdMoreHoriz } from "react-icons/md";
import { useAuth } from "../../../Provider/AuthProvider";
import {
  baleAssignToUser,
  baleAssignToUserService,
  baleDeleteConversation,
  baleRejectConversation,
  getBaleAminConversationService,
  getBaleStatistics,
} from "../../../Services/bale";
import { CheckBox } from "../../../common/CheckBox";
import Modal from "../../../Components/Modal";
import { CloseBtn } from "../../../common/CloseBtn";
import PrimaryBtn from "../../../common/PrimaryBtn";
import OutlineBtn from "../../../common/OutlineBtn";
import SelectInput from "../../../common/SelectInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { getAllUsersService } from "../../../Services/userServies";
import { toast } from "react-toastify";
import Select from "react-select";
import Pagination from "../../../Components/Pagination";
import { IoCheckmark } from "react-icons/io5";

const BaleRequestPage = () => {
  const { user, loading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(-20);
  const dropdownRef = useState(null);
  const [assaign, setAssaign] = useState(-20);
  const [reject, setReject] = useState(-20);
  const [deleted, setDeleted] = useState(-20);
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [conversationsFilter, setConversationsFilter] = useState([]);
  const [filterId, setFilterId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(1);

  const [allRequestsChecked, setAllRequestsChecked] = useState(false);

  const categories = [
    { id: 0, title: "اختصاص به کارشناس" },
    { id: 1, title: "حذف از سامانه" },
    { id: 2, title: "رد درخواست" },
  ];

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      border: "#2C6DD1",
      boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      padding: 0,

      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      border: "none",
    }),
    control: (base, state) => ({
      ...base,
      backgroundColor: "#fff",
      border: "none !important",
      boxShadow: "none !important",

      outline: "none",
      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "none",
      },
    }),
    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
    option: (provided, state) => ({
      ...provided,
      color: "#1A1D20",
      borderRadius: "5px",
      boxShadow: "none",
      backgroundColor: "#fff",

      "&:hover": {
        backgroundColor: "#F5FAFB",
        boxShadow: "none",
      },
    }),
  };

  const validationSchemaGroup = yup.object({
    user_id: yup.string().required("کارشناس را انتخاب کنید"),
  });
  const initialValuesGroup = {
    user_id: "",
  };

  const formikGroup = useFormik({
    initialValues: initialValuesGroup,
    onSubmit: (values) => {
      const array = new Array();
      //   array.push(assaign);
      //   formik.setStatus(1);
      //   baleAssignToUser(
      //     { users_id: array, supplier_id: values.user_id },
      //     {
      //       Authorization: "Bearer " + user.token,
      //     }
      //   )
      //     .then(({ data }) => {
      //       if (data.status === false) {
      //         toast.error(data.message[0]);
      //       } else {
      //         setAssaign(-20);
      //         // router.push("/admin/");
      //       }
      //       formik.setStatus(0);
      //     })
      //     .catch((err) => {
      //       if (err.response && err.response.status === 401) {
      //         userDispatch({
      //           type: "LOGOUTNOTTOKEN",
      //         });
      //       }
      //       if (err.response) {
      //         toast.error(err.response.data.message);
      //       }
      //       formik.setStatus(0);
      //     });
    },
    validationSchema: validationSchemaGroup,
    validateOnMount: true,
    enableReinitialize: true,
  });

  function groupActionHandler() {
    if (conversationsFilter.length > 0) {
      if (filterId === 0) {
        baleAssignToUserService(
          { users_id: conversationsFilter, supplier_id: userId },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              fetchConversationData();
              getStatistics();
              toast.success("با موفقیت منتقل شد");
            }
            formik.setStatus(0);
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
            formik.setStatus(0);
          });
      } else if (filterId === 1) {
        baleDeleteConversation(
          { users_id: conversationsFilter },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              fetchConversationData();
              getStatistics();
              toast.success("با موفقیت حذف شد");
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
      } else if (filterId === 2) {
        baleRejectConversation(
          { users_id: conversationsFilter },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              fetchConversationData();
              getStatistics();
              toast.success("با موفقیت رد شد");
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
    }
  }

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
          let userList = data.result.map((item) => {
            return {
              name: item.first_name + " " + item.last_name,
              id: item.id,
            };
          });
          setUsers(userList);
        }
        // setStatus(0);
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

        // setStatus(0);
      });
  };

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && !loading) {
      getData();
    }
  }, [loading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(-20);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  function fetchConversationData() {
    if (user && !loading) {
      getBaleAminConversationService(
        { count: 30, page: page },
        { Authorization: "Bearer " + user.token }
      ).then(({ data }) => {
        setConversations(data.result.conversation);
      });
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        getBaleAminConversationService(
          { count: 30, page: page },
          { Authorization: "Bearer " + user.token }
        ).then(({ data }) => {
          setConversations(data.result.conversation);
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [loading, page]);

  function getStatistics() {
    if (user && !loading) {
      getBaleStatistics({ Authorization: "Bearer " + user.token }).then(
        ({ data }) => {
          setStatistics(data.result.statistics);
        }
      );
    }
  }

  const validationSchema = yup.object({
    user_id: yup.string().required("کارشناس را انتخاب کنید"),
  });
  const initialValues = {
    user_id: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const array = new Array();
      array.push(assaign);
      formik.setStatus(1);
      baleAssignToUserService(
        { users_id: array, supplier_id: values.user_id },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setAssaign(-20);
            fetchConversationData();
            getStatistics();
            toast.success("با موفقیت منتقل شد");
          }
          formik.setStatus(0);
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
          formik.setStatus(0);
        });
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });

  function deleteHandler() {
    const array = new Array();
    array.push(deleted);
    baleDeleteConversation(
      { users_id: array },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setDeleted(-20);
          fetchConversationData();
          getStatistics();
          toast.success("با موفقیت حذف شد");
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
  function rejectHandler() {
    const array = new Array();
    array.push(reject);
    baleRejectConversation(
      { users_id: array },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setReject(-20);
          fetchConversationData();
          getStatistics();
          toast.success("با موفقیت رد شد");
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

  function groupCheckHandler() {
    setAllRequestsChecked(!allRequestsChecked);
    if (!allRequestsChecked) {
      setConversationsFilter(conversations.map((c) => String(c.id)));
    } else {
      setConversationsFilter([]);
    }
  }

  useEffect(() => {
    fetchConversationData();
    getStatistics();
  }, [user, loading, page]);

  return (
    <Layout>
      <div className="flex flex-col max-h-[calc(100vh-120px)]">
        <div className="bg-gray-50 px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          {/* <button
              onClick={() => router.back()}
              className="text-2xl text-gray-900"
              type="button"
            >
              <MdArrowForward />
            </button> */}

          <h1 className="text-xl text-gray-900">مدیریت درخواست ها</h1>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 p-6 flex gap-x-6">
            <div className="w-1/4 bg-white p-6 min-h-full">
              <h1>اطلاعات کلی</h1>
              <div>
                <div className="flex justify-between mt-8">
                  <span>کل اعضای ربات</span>{" "}
                  <span className="w-[87px] bg-gray-50 text-gray-900 rounded-cs flex items-center justify-center py-[2px]">
                    {statistics && statistics.all_user}
                  </span>
                </div>
                <div className="flex justify-between mt-6">
                  <span>درخواست مشاوره</span>{" "}
                  <span className="w-[87px] bg-green-50 text-green-700 rounded-cs flex items-center justify-center py-[2px]">
                    {statistics && statistics.consultation_request}
                  </span>
                </div>
                <div className="flex justify-between mt-6">
                  <span>درخواست تحویل نشده </span>{" "}
                  <span className="w-[87px] bg-[#F6ECDD] text-warning rounded-cs flex items-center justify-center py-[2px]">
                    {statistics && statistics.Request_not_delivered}
                  </span>
                </div>
                <div className="flex justify-between mt-6">
                  <span>درخواست مشاوره امروز</span>{" "}
                  <span className="w-[87px] bg-[#EDF0F8] text-gray-900 rounded-cs flex items-center justify-center py-[2px]">
                    {statistics && statistics.today_request}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-3/4 bg-white p-6 min-h-full">
              <h1>تعداد مشاوره دریافتی توسط کارشناسان</h1>
              <div className="relative grid grid-cols-12 gap-6 mt-8">
                {statistics &&
                  statistics.supplier?.map((item) => {
                    return (
                      <div className="col-span-3 flex" key={item.id}>
                        <span className="min-w-[160px]">
                          {`${item.first_name && item.first_name} ${
                            item.last_name && item.last_name
                          }`}
                        </span>
                        <span className="w-[87px] bg-[#EDF0F8] text-primary-900 rounded-cs flex items-center justify-center py-[2px]">
                          <span className="mt-1">
                            {item.conversations_count}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                <div className="absolute w-[2px] top-0 bottom-0 left-[26%] bg-primary-50 "></div>
                <div className="absolute w-[2px] top-0 bottom-0 left-[51%] bg-primary-50 "></div>
                <div className="absolute w-[2px] top-0 bottom-0 left-[76%] bg-primary-50 "></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="px-6 flex gap-x-6">
            <div>
              <div className="w-[200px]">
                {/* <Select placeholder='کار های دسته جمعی'/> */}
                <div className=" border border-primary-400 rounded-cs w-full h-11 md:h-12">
                  <Select
                    id="selectService"
                    options={categories}
                    className="bg-primary-700  w-full min-h-11 md:min-h-12  mt-1 text-black rounded-cs placeholder:text-sm text-sm"
                    classNamePrefix="select2-selection"
                    placeholder="کار های دسته جمعی"
                    getOptionLabel={(option) => option.title}
                    getOptionValue={(option) => option.id}
                    value={formik.values.services}
                    onChange={(e) => setFilterId(e.id)}
                    styles={customStyles}
                  />
                </div>
              </div>
            </div>
            {filterId === 0 && (
              <div className="w-[220px]">
                <div className=" border border-primary-400 rounded-cs w-full h-11 md:h-12">
                  <Select
                    id="selectService"
                    options={users}
                    className="bg-primary-700  w-full min-h-11 md:min-h-12  mt-1 text-black rounded-cs placeholder:text-sm text-sm"
                    classNamePrefix="select2-selection"
                    placeholder="کارشناس"
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    value={formik.values.services}
                    onChange={(e) => setUserId(e.id)}
                    styles={customStyles}
                  />
                </div>
              </div>
            )}
            <div className="w-[80px]">
              <PrimaryBtn
                text="اجرا"
                onClick={groupActionHandler}
                disabled={
                  filterId === 0
                    ? filterId === null ||
                      conversationsFilter.length === 0 ||
                      !userId
                    : filterId === null || conversationsFilter.length === 0
                }
              />
            </div>
          </div>
          <div className="w-full max-w-full min-h-[400px] overflow-x-scroll border mt-6">
            <table className="w-full  min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
              <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
                <tr className="text-right text-sm">
                  <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                    {/* custom checkbox */}
                    <div>
                      {/* <CheckBox setValue={setConversationsFilter} value={conversationsFilter}  /> */}
                      <label
                        htmlFor="all-requests-checkbox"
                        className={`flex w-5 h-5 min-w-[20px] min-h-[20px] ${
                          allRequestsChecked
                            ? "checked flex cursor-pointer items-center justify-center text-lg"
                            : "bg-primary-50 text-field rounded-cs border border-primary-400 cursor-pointer"
                        }`}
                      >
                        {allRequestsChecked ? <IoCheckmark /> : " "}
                      </label>
                      <input
                        type="checkbox"
                        id="all-requests-checkbox"
                        className="hidden"
                        value={allRequestsChecked}
                        onChange={() => groupCheckHandler()}
                      />
                    </div>
                    {/* custom checkbox */}
                  </th>
                  <th className=" text-right border px-3 border-gray-200 relative text-gray-900 whitespace-nowrap">
                    نام و نام خوانوادگی
                  </th>
                  <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                    شماره تلفن
                  </th>
                  <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                    درخواست
                  </th>
                  <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto">
                {conversations.length > 0 &&
                  conversations.map((d, index) => (
                    <tr
                      key={index}
                      className="h-12 text-sm text-gray-600 border-b hover:bg-primary-50 duration-100"
                    >
                      <td
                        className={`w-20 text-right px-3 border-x border-gray-200 `}
                      >
                        <CheckBox
                          setValue={setConversationsFilter}
                          value={conversationsFilter}
                          //   label={d.id}
                          name={d.id}
                          id={d.id}
                        />
                      </td>
                      <td className="  text-right px-3 border-x border-gray-200">
                        {!d.name && !d.sname
                          ? "کاربر ناشناس"
                          : `${d.sname ? d.sname : d.name}`}
                      </td>
                      <td className="  text-right px-3 border-x border-gray-200">
                        {d.tell}
                      </td>
                      <td className="  text-right px-3 border-x border-gray-200">
                        {d.description}
                      </td>

                      <td className="relative flex items-center   text-right px-3 border-x border-gray-200">
                        <MdMoreHoriz
                          className="text-2xl cursor-pointer"
                          onClick={() => setShowDropdown(d.id)}
                        />
                        {showDropdown === d.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute left-12 top-8 z-50 bg-white rounded-cs flex flex-col gap-y-2 px-2 py-2 shadow-[0px_0px_25px_0px_rgba(27,69,141,0.06)]"
                          >
                            <div
                              onClick={() => setAssaign(d.id)}
                              className="cursor-pointer whitespace-nowrap h-[30px] text-sm text-gray-500 hover:bg-primary-50 hover:text-gray-900 px-2 rounded-cs flex items-center"
                            >
                              اختصاص به کارشناس
                            </div>
                            <div className="w-full h-[2px] bg-primary-50"></div>
                            <div
                              onClick={() => {
                                setDeleted(d.id);
                              }}
                              className="cursor-pointer whitespace-nowrap h-[30px] text-sm text-gray-500 hover:bg-primary-50 hover:text-gray-900 px-2 rounded-cs flex items-center"
                            >
                              حذف از سامانه
                            </div>
                            <div className="w-full h-[2px] bg-primary-50"></div>
                            <div
                              onClick={() => {
                                setReject(d.id);
                              }}
                              className="cursor-pointer whitespace-nowrap h-[30px] text-sm text-gray-500 hover:bg-primary-50 hover:text-gray-900 px-2 rounded-cs flex items-center"
                            >
                              رد درخواست
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div>
            <Pagination setPage={setPage} page={page} />
          </div>
        </div>
      </div>
      {assaign > 0 && (
        <Modal setModal={() => setDeleted(-20)}>
          <div className="bg-white rounded-cs p-6 min-w-[346px]">
            <form
              className="flex flex-col gap-y-6"
              onSubmit={formik.handleSubmit}
            >
              <h1>انتقال درخواست به مشاور</h1>
              <div>
                <SelectInput
                  formik={formik}
                  label="کارشناس"
                  name="user_id"
                  selectOption={users}
                  labelOption="name"
                  valueOption="id"
                />
              </div>
              <div className="flex items-center gap-x-6">
                <div className="w-1/2 h-10">
                  <OutlineBtn text="انصراف" onClick={() => setAssaign(-20)} />
                </div>
                <div className="w-1/2 h-10">
                  <PrimaryBtn text="انتقال" type="submit" />
                </div>
              </div>
            </form>
          </div>
          <div>
            <CloseBtn onClick={() => setAssaign(-20)} />
          </div>
        </Modal>
      )}
      {deleted > 0 && (
        <Modal setModal={() => setDeleted(-20)}>
          <div className="bg-white rounded-cs p-6 min-w-[346px] flex flex-col gap-y-6">
            <h1>حذف از سامانه</h1>
            <p>آیا از حذف پیام از سامانه اطمینان دارید؟</p>
            <div className="flex items-center gap-x-6">
              <div className="w-1/2 h-10">
                <OutlineBtn text="خیر" onClick={() => setDeleted(-20)} />
              </div>
              <div className="w-1/2 h-10">
                <PrimaryBtn text="بله" onClick={deleteHandler} />
              </div>
            </div>
          </div>
          <div>
            <CloseBtn onClick={() => setDeleted(-20)} />
          </div>
        </Modal>
      )}
      {reject > 0 && (
        <Modal setModal={() => setReject(-20)}>
          <div className="bg-white rounded-cs p-6 min-w-[346px] flex flex-col gap-y-6">
            <h1>رد درخواست</h1>
            <p>آیا از رد درخواست اطمینان دارید؟</p>
            <div className="flex items-center gap-x-6">
              <div className="w-1/2 h-10">
                <OutlineBtn text="خیر" onClick={() => setReject(-20)} />
              </div>
              <div className="w-1/2 h-10">
                <PrimaryBtn text="بله" onClick={rejectHandler} />
              </div>
            </div>
          </div>
          <div>
            <CloseBtn onClick={() => setReject(-20)} />
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default BaleRequestPage;
