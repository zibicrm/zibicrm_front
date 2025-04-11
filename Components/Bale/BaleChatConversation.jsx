import moment from "moment-timezone";
import Image from "next/image";
import {
  MdAttachFile,
  MdClose,
  MdMoreHoriz,
  MdMoreVert,
  MdOutlineAssignmentInd,
  MdSend,
} from "react-icons/md";

import ReactTextareaAutosize from "react-textarea-autosize";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { toast } from "react-toastify";
import Link from "next/link";
import { ImageFake } from "../../assets/Images";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useAuth } from "../../Provider/AuthProvider";
import { ReadMessageService } from "../../Services/messageService";
import {
  baleAssignToUser,
  baleChangeConversationToFinishService,
  baleChangeConversationToRead,
  baleDeleteMessage,
  baleReportMessageService,
  baleSendImageService,
} from "../../Services/bale";
import { searchRecordService } from "../../Services/recordServices";
import { CloseBtn } from "../../common/CloseBtn";
import OutlineBtn from "../../common/OutlineBtn";
import SelectInput from "../../common/SelectInput";
import Modal from "../Modal";
import { getAllUsersService } from "../../Services/userServies";
import { useFormik } from "formik";
import * as yup from "yup";
import { useCallback } from "react";
import { RiMore2Fill, RiMore2Line, RiUploadCloud2Line } from "react-icons/ri";

const BaleChatConversation = ({
  data,
  answer,
  access,
  balemessages,
  test,
  selectId,
  baleFetchAll,
}) => {
  const router = useRouter();
  const scrollDown = useRef(null);
  const [value, setValue] = useState("");
  const [length, setLength] = useState(0);
  const [now, setNow] = useState(0);
  const { user, loading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [existedPatient, setExistedPatient] = useState(false);
  const [assaign, setAssaign] = useState(-20);
  const [sendReport, setSendReport] = useState(-20);
  const [endConversation, setEndConversation] = useState(-20);
  const [users, setUsers] = useState([]);
  const [documentId, setDocumentId] = useState(null);
  const prevBalemessages = useRef(JSON.stringify(balemessages));
  const scrollToBottom = useRef(null);
  const [moreMessage, setMoreMessage] = useState(-20);
  const moreMessageRef = useRef(null);
  const [messageId, setMessageId] = useState(null);
  const [sendImage, setSendImage] = useState(false);
  const [baleImage, setBaleImage] = useState(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    // const currentBalemessagesString = JSON.stringify(balemessages);
    // if (prevBalemessages.current !== currentBalemessagesString) {
    //   prevBalemessages.current = currentBalemessagesString;

    if ((scrollToBottom, scrollToBottom.current)) {
      scrollToBottom.current.scrollTo({
        top: scrollToBottom.current.scrollHeight,
        behavior: "smooth",
      });
    }

    // }
  }, [scrollToBottom]);

  useEffect(() => {
    if (balemessages && balemessages.tell) {
      searchRecordService(
        { statement: balemessages.tell },
        {
          Authorization: "Bearer " + user.token,
        }
      ).then(({ data }) => {
        if (!data.status) {
        } else {
          if (data.result?.documents?.length > 0) {
            setExistedPatient(true);
            setDocumentId(data.result.documents[0].id);
          } else {
            setExistedPatient(false);
          }
        }
      });
    } else {
      setExistedPatient(false);
    }
  }, [balemessages, existedPatient]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreMessageRef.current &&
        !moreMessageRef.current.contains(event.target)
      ) {
        setMoreMessage(-20);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [moreMessageRef]);

  const reportValidationSchema = yup.object({
    message: yup.string().required("توضیحات را وارد کنید"),
  });
  const reportInitialValues = {
    message: "",
  };

  const reportFormik = useFormik({
    initialValues: reportInitialValues,
    onSubmit: (values) => {
      reportFormik.setStatus(1);
      baleReportMessageService(
        { bale_id: sendReport, message: values.message },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setSendReport(-20);
            reportFormik.values.message = "";
            toast.success("با موفقیت گزارش شد");
          }
          reportFormik.setStatus(0);
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
          reportFormik.setStatus(0);
        });
    },
    validationSchema: reportValidationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });

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
      baleAssignToUser(
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
            baleFetchAll();
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
    if (selectId) {
      baleChangeConversationToRead(
        { user_id: selectId },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (!data.status) {
          } else {
            baleFetchAll();
          }
        })
        .catch();
    }
  }, [selectId]);

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      // this.myFormRef.submit();
      answer(balemessages.id, balemessages.chat_id, value);
      // baleChangeConversationToRead(
      //   { user_id: selectId },
      //   {
      //     Authorization: "Bearer " + user.token,
      //   }
      // )
      //   .then(({ data }) => {
      //     if (!data.status) {
      //     } else {
      //       baleFetchAll();
      //     }
      //   })
      //   .catch();
      setValue("");
    }
  };

  const handleSendImage = (e) => {
    // URL.createObjectURL(e.target.files[0]);
    setBaleImage(e.target.files[0]);
  };

  const sendBaleImageHandler = () => {
    if (caption.length > 0) {
      const formData = new FormData();
      formData.append("image", baleImage);
      formData.append("client_id", balemessages.chat_id);
      formData.append("caption", caption);
      formData.append("bale_id", selectId);
      baleSendImageService(formData, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("عکس با موفقیت ارسال شد");
            baleFetchAll();
            setCaption('')
            setSendImage(false);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            // userDispatch({
            //   type: "LOGOUTNOTTOKEN",
            // });
          }
          if (err.response) {
            toast.error(err.response.data.message);
          }
        });
    } else {
      const formData = new FormData();
      formData.append("image", baleImage);
      formData.append("client_id", balemessages.chat_id);
      formData.append("bale_id", selectId);
      baleSendImageService(formData, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error("ارسال عکس با مشکل مواجه شد");
          } else {
            toast.success("عکس با موفقیت ارسال شد");
            baleFetchAll();
            setSendImage(false);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            // userDispatch({
            //   type: "LOGOUTNOTTOKEN",
            // });
          }
          if (err.response) {
            toast.error(err.response.data.message);
          }
        });
    }
  };

  const endConversationHandler = () => {
    baleChangeConversationToFinishService(
      { bale_id: endConversation },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message.message);
          setEndConversation(-20);
        } else {
          setSendReport(-20);
          toast.success("گفت و گو با موفقیت اتمام یافت");
          setEndConversation(-20);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          // userDispatch({
          //   type: "LOGOUTNOTTOKEN",
          // });
        }
        if (err.response) {
          toast.error(err.response.data.message);
        }
      });
  };

  const deleteMessageHandler = () => {
    baleDeleteMessage(
      {
        message_id: messageId,
        client_id: balemessages.chat_id,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          toast.success("پیام با موفقیت حذف شد");
          baleFetchAll();
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          // userDispatch({
          //   type: "LOGOUTNOTTOKEN",
          // });
        }
        if (err.response) {
          toast.error(err.response.data.message);
        }
      })
      .finally(() => {
        setMoreMessage(-20);
      });
  };

  useEffect(() => {
    const currentBalemessagesString = JSON.stringify(balemessages);
    if (prevBalemessages.current !== currentBalemessagesString) {
      prevBalemessages.current = currentBalemessagesString;

      scrollDown.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [balemessages, scrollDown]);

  return (
    <div>
      <div className="bg-gray-50 border-b border-primary-50 absolute top-0 w-full px-6 flex flex-row items-center justify-between h-20">
        <div className="flex items-center justify-between w-full bg-gray-50 z-[50] h-full">
          <div className="flex flex-row items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Image src={ImageFake} alt="logo" />
            </div>
            <div className="flex items-start flex-col gap-2">
              <span className="text-xs">
                {!balemessages.name && !balemessages.sname
                  ? "ناشناس"
                  : `${
                      balemessages.sname
                        ? balemessages.sname
                        : balemessages.name
                    }  `}
              </span>
              <span className="text-xs text-textGray">{balemessages.tell}</span>
            </div>
          </div>
          {balemessages?.supplier && (
            <div className="absolute left-24 flex items-center gap-x-1 text-sm mr-[300px] bg-gray-100 p-2 rounded-cs">
              <span>کارشناس :</span>
              <div>
                {" "}
                <span>{balemessages?.supplier.first_name}</span>{" "}
                <span>{balemessages?.supplier.last_name}</span>
              </div>
            </div>
          )}
          <div className="absolute left-8">
            <MdMoreHoriz
              className="text-2xl cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
            />
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute left-4 top-8 z-50 bg-white min-w-[150px] rounded-cs flex flex-col gap-y-2 px-2 py-2 shadow-[0px_0px_25px_0px_rgba(27,69,141,0.06)]"
              >
                {existedPatient && (
                  <Link href={`/${access}/record/detail/?id=${documentId}`}>
                    <div className="cursor-pointer whitespace-nowrap h-[30px] text-sm text-gray-500 hover:bg-primary-50 hover:text-gray-900 px-2 rounded-cs flex items-center">
                      مشاهده پرونده بیمار
                    </div>
                  </Link>
                )}
                {/* <div className="w-full h-[2px] bg-primary-50"></div> */}
                {!existedPatient && (
                  <Link
                    href={{
                      pathname: `/${access}/record/add/`,
                      query: {
                        name: balemessages.name,
                        tell: balemessages.tell,
                      }, // the data
                    }}
                  >
                    <div
                      onClick={() => {}}
                      className="cursor-pointer whitespace-nowrap h-[30px] text-sm text-gray-500 hover:bg-primary-50 hover:text-gray-900 px-2 rounded-cs flex items-center"
                    >
                      تشکیل پرونده
                    </div>
                  </Link>
                )}
                {user &&
                  user.user.rule === 2 &&
                  (user.user.id === 1 || user.user.id === 24) && (
                    <div className="w-full h-[2px] bg-primary-50"></div>
                  )}
                {user &&
                  user.user.rule === 2 &&
                  (user.user.id === 1 || user.user.id === 24) && (
                    <div
                      onClick={() => {
                        setAssaign(selectId);
                        setShowDropdown(false);
                      }}
                      className="cursor-pointer whitespace-nowrap h-[30px] text-sm text-gray-500 hover:bg-primary-50 hover:text-gray-900 px-2 rounded-cs flex items-center"
                    >
                      انتقال بیمار
                    </div>
                  )}
                <div className="w-full h-[2px] bg-primary-50"></div>
                <div
                  onClick={() => {
                    setSendReport(selectId);
                    setShowDropdown(false);
                  }}
                  className="cursor-pointer whitespace-nowrap h-[30px] text-sm text-gray-500 hover:bg-primary-50 hover:text-gray-900 px-2 rounded-cs flex items-center"
                >
                  ارسال گزارش
                </div>
                <div className="w-full h-[2px] bg-primary-50"></div>
                <div
                  onClick={() => {
                    setEndConversation(selectId);
                    setShowDropdown(false);
                  }}
                  className="cursor-pointer whitespace-nowrap h-[30px] text-sm text-gray-500 hover:bg-primary-50 hover:text-gray-900 px-2 rounded-cs flex items-center"
                >
                  اتمام گفت و گو
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="w-36 h-12">
            {/* <Link href={`/${access}/record/detail/?id=${data[0].document_id}`}>
              <a target="_blank" rel="noreferrer">
                <PrimaryBtn>
                  <div className="flex flex-row items-center gap-2">
                    <MdOutlineAssignmentInd />
                    <span className="text-base text-white">پرونده پزشکی</span>
                  </div>
                </PrimaryBtn>
              </a>
            </Link> */}
          </div>
        </div>
      </div>
      <div
        ref={scrollToBottom}
        className="h-full pt-24 text-gray-900 px-8 min-h-[calc(100vh-190px)]  max-h-[calc(100vh-190px)] overflow-y-auto scrollbar-none flex flex-col gap-4"
      >
        {balemessages.description ? (
          <div className=" w-full  flex flex-col items-end">
            <div className="bg-[#F4F5F7] rounded-r-cs leading-6 text-xs rounded-bl-cs p-2 max-w-[230px]">
              {balemessages.description}
            </div>
            <span className="text-[10px] "></span>
          </div>
        ) : (
          <div className=" w-full  flex flex-col items-end">
            <div className="bg-[#F4F5F7] rounded-r-cs leading-6 text-xs rounded-bl-cs p-2 max-w-[230px]">
              {"من درخواست مشاوره دارم"}
            </div>
            <span className="text-[10px] "></span>
          </div>
        )}

        {balemessages.conversation &&
          balemessages.conversation.length > 0 &&
          balemessages.conversation
            .sort(
              (a, b) =>
                moment(a.created_at).tz("Asia/Tehran") -
                moment(b.created_at).tz("Asia/Tehran")
            )

            .map((item) => {
              return (
                <>
                  {item.io == 1 ? (
                    <div className=" w-full  flex flex-col items-end">
                      <div className="bg-[#F4F5F7]  rounded-r-cs leading-6 text-xs rounded-bl-cs p-2 max-w-[230px] select-text">
                        {item.message}
                      </div>
                      <span className="text-[10px] ">
                        {/* {item &&
                          moment(item.updated_at)
                            .tz("Asia/Tehran")
                            .format("HH:mm")} */}
                        {item && item.last_update}
                      </span>
                    </div>
                  ) : item.is_delete === 0 ? (
                    <div className=" w-full max-w-fit flex flex-col items-start">
                      <div className="relative flex  rounded-cs">
                        <div
                          className={` ${
                            item.type === 2
                              ? "bg-transparent  rounded-cs overflow-hidden"
                              : "bg-[#DCFAF5] rounded-l-cs rounded-br-cs p-2 pl-12"
                          }   leading-6 text-xs  max-w-[270px] select-text `}
                        >
                          {item.type === 2 ? (
                            <div className="relative min-w-[200px] bg-[#DCFAF5] min-h-full ">
                              <Image
                                src={`${item.message}`}
                                alt="image"
                                layout="responsive"
                                width={200}
                                height={200}
                                objectFit="cover"
                                className="rounded-cs"
                              />
                              {item.caption && (
                                <div className="bg-[#DCFAF5] rounded-b-cs px-3 py-2 border-t max-h-fit border-gray-200">
                                  {item.caption}
                                </div>
                              )}
                            </div>
                          ) : (
                            item.message
                          )}
                        </div>
                        <div className="absolute z-50 top-2 left-[2px]">
                          <MdMoreVert
                            onClick={() => {
                              setMoreMessage(item.id);
                              setMessageId(item.message_id);
                            }}
                            className="text-lg cursor-pointer"
                          />
                          {moreMessage === item.id && (
                            <div
                              ref={moreMessageRef}
                              className="absolute right-2 bg-white rounded-cs shadow-cs min-w-[120px] overflow-hidden"
                            >
                              <div
                                className="text-xs px-6 py-2 cursor-pointer hover:bg-primary-50"
                                onClick={deleteMessageHandler}
                              >
                                حذف
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] ">
                        {/* {item &&
                      moment(item.updated_at)
                        .tz("Asia/Tehran")
                        .format("HH:mm")} */}
                        {item && item.last_update}
                      </span>
                    </div>
                  ) : access === "admin" ? (
                    <div className=" w-full max-w-fit flex flex-col items-start">
                      <div className="flex items-start">
                        <div
                          className={`${
                            item.type === 2
                              ? "bg-transparent rounded-cs overflow-hidden pb-2"
                              : "bg-[#DCFAF5] p-2"
                          }  rounded-l-cs leading-6 text-xs rounded-br-cs max-w-[270px] select-text opacity-50`}
                        >
                          {item.type === 2 ? (
                            <div className="relative min-w-[200px] bg-[#DCFAF5] min-h-full">
                              <Image
                                src={`${item.message}`}
                                alt="image"
                                layout="responsive"
                                width={200}
                                height={200}
                                objectFit="cover"
                                className="rounded-cs"
                              />
                              {item.caption && <div className="bg-[#DCFAF5] rounded-b-cs px-3 py-2 border-t border-gray-200">{item.caption}</div>}
                            </div>
                          ) : (
                            item.message
                          )}
                        </div>
                        <div className="bg-red-50 mr-4 mt-1 p-1 rounded-cs">
                          <p className="text-[10px] text-red-700">
                            پیام حذف شد
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] opacity-40">
                        {/* {item &&
                  moment(item.updated_at)
                    .tz("Asia/Tehran")
                    .format("HH:mm")} */}
                        {item && item.last_update}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              );
            })}

        <div ref={scrollDown}></div>
      </div>
      <div className="relative bottom-8 h-fit rounded-cs flex flex-row items-end gap-2 mx-8 mt-6">
        <div className="absolute flex items-center gap-x-2 top-[50%] -translate-y-[50%] right-4">
          <MdAttachFile
            className="text-2xl rotate-45  opacity-50 cursor-pointer"
            onClick={() => setSendImage(true)}
          />
          <div className="bg-black opacity-50 h-[20px] w-[1px]"></div>
        </div>
        <ReactTextareaAutosize
          maxRows={3}
          placeholder="پیام"
          className=" w-full text-gray-900 break-words py-[11px] pl-[100px] bg-white border border-primary rounded-cs  px-3 outline-none pr-14"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onEnterPress}
        />
        <button
          onClick={() => {
            answer(balemessages.id, balemessages.chat_id, value);
            // baleChangeConversationToRead(
            //   { user_id: selectId },
            //   {
            //     Authorization: "Bearer " + user.token,
            //   }
            // )
            //   .then(({ data }) => {
            //     if (!data.status) {
            //     } else {
            //       baleFetchAll();
            //     }
            //   })
            //   .catch();
            setValue("");
          }}
          className="absolute left-0 bottom-0 flex items-center justify-center rounded-cs w-12 h-12 text-2xl text-primary-900 rotate-180"
        >
          <MdSend />
        </button>
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
      {sendReport > 0 && (
        <Modal setModal={() => setSendReport(-20)}>
          <div className="bg-white rounded-cs p-8 min-w-[456px]">
            <form
              className="flex flex-col gap-y-6"
              onSubmit={reportFormik.handleSubmit}
            >
              <h1>ثبت گزارش</h1>
              <p className="text-sm">
                لطفا گزارش مربوط به گفت و گوی خود را با بیمار بنویسید
              </p>
              <textarea
                placeholder="توضیحات"
                {...reportFormik.getFieldProps("message")}
                className={`p-2 border border-primary-400 rounded-cs text-xs outline-none w-full max-h-72 h-64 col-span-3 resize-none`}
              />
              <div className="">
                <div className="w-full h-10">
                  <PrimaryBtn
                    text="ثبت"
                    type="submit"
                    disabled={!reportFormik.isValid}
                  />
                </div>
              </div>
            </form>
          </div>
          <div>
            <CloseBtn onClick={() => setSendReport(-20)} />
          </div>
        </Modal>
      )}
      {endConversation > 0 && (
        <Modal setModal={() => setEndConversation(-20)}>
          <div className="bg-white rounded-cs p-8 min-w-[456px]">
            <h1>اتمام گفت و گو</h1>
            <p className="text-sm mt-6">
              ایا از اتمام گفت و گوی خود اطمینان دارید؟
            </p>
            <div className="flex items-center gap-x-6 mt-8">
              <div className="w-1/2 h-11">
                <OutlineBtn
                  text="انصراف"
                  type="submit"
                  onClick={() => setEndConversation(-20)}
                />
              </div>
              <div className="w-1/2 h-11">
                <PrimaryBtn
                  text="اتمام گفت و گو"
                  type="submit"
                  onClick={endConversationHandler}
                />
              </div>
            </div>
          </div>
          <div>
            <CloseBtn onClick={() => setEndConversation(-20)} />
          </div>
        </Modal>
      )}
      {sendImage && (
        <Modal setModal={() => setSendImage(false)}>
          <div className="flex flex-col gap-y-6 bg-white rounded-cs p-6">
            <h2 className="text-base">ارسال عکس</h2>
            <div className="min-w-[350px]">
              {baleImage ? (
                <div className="border-2 border-dashed  rounded-cs mt-4 p-6">
                  <div className="relative w-full h-[230px]">
                    <Image
                      src={URL.createObjectURL(baleImage)}
                      alt="image"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-cs"
                    />
                    <span className="absolute -top-3 -right-3 border border-gray-400 p-[1px] rounded-full">
                      <MdClose
                        className="text-2xl text-gray-400 cursor-pointer"
                        onClick={() => setBaleImage(null)}
                      />
                    </span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed  rounded-cs mt-4 p-6">
                  <label
                    className="flex flex-col items-center justify-center "
                    htmlFor="baleImage"
                  >
                    <h2 className="text-center text-primary-400">
                      بارگذاری عکس
                    </h2>
                    <RiUploadCloud2Line className="text-8xl text-primary-400 mt-9" />
                    {/* <div className="mt-6 h-12 w-40">
                    <PrimaryBtn text="بارگذاری عکس" />
                  </div> */}
                    <div className="mt-6">
                      <div className="min-w-40 min-h-12 bg-primary-900 text-white text-sm px-10 py-4 rounded-cs cursor-pointer   xl:text-[13px] hover:shadow-btn duration-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:shadow-none disabled:cursor-not-allowed">
                        بارگذاری عکس
                      </div>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="baleImage"
                    className="hidden"
                    onChange={handleSendImage}
                    accept="image/png, image/jpg, image/jpeg"
                  />
                </div>
              )}
            </div>
            <div>
              <textarea
                placeholder="توضیحات"
                className={`p-2 border border-primary-400 bg-white rounded-cs outline-none w-full max-h-32 h-20 resize-none text-sm`}
                onChange={(e) => setCaption(e.target.value)}
                value={caption}
              />
            </div>
            <div className="h-12 w-full">
              <PrimaryBtn
                text="ارسال"
                disabled={!baleImage}
                onClick={sendBaleImageHandler}
              />
            </div>
          </div>

          <div>
            <CloseBtn onClick={() => setSendImage(false)} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BaleChatConversation;
