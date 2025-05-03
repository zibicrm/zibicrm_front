import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsPersonFill } from "react-icons/bs";
import { toast } from "react-toastify";
import SearchBox from "../../../Components/SearchBox";
import Layout from "../../../Layout/Layout";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import {
  answerMessageService,
  getConversationService,
  getRecivedMessageService,
  searchMessageService,
} from "../../../Services/messageService";
import PageLoading from "../../../utils/LoadingPage";
import moment from "moment-timezone";
import { IoReturnDownBack } from "react-icons/io5";
import Image from "next/image";
import { MdArrowForward, MdOutlineAssignmentInd, MdSend } from "react-icons/md";
import { ImageFake } from "../../../assets/Images";
import PrimaryBtn from "../../../common/PrimaryBtn";
import ChatConversation from "../../../Components/Conversation";
import BaleChatConversation from "../../../Components/Bale/BaleChatConversation";
import BaleSearchBox from "../../../Components/Bale/BaleSearchBox";
import {
  baleChangeConversationToRead,
  baleSendMessageService,
  getBaleConversationService,
  getBaleRequestService,
  getBaleSingleConversationService,
} from "../../../Services/bale";
import LoadingBtn from "../../../utils/LoadingBtn";

const Conversation = () => {
  const router = useRouter();
  let queryId = router.query.id;
  const [data, setData] = useState([]);
  const [baleData, setBaleData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [balemessages, setBaleMessages] = useState([]);
  const [baleRequests, setBaleRequests] = useState([]);
  const [status, setStatus] = useState([]);
  const [searchStatus, setSearchStatus] = useState([]);
  const { user, loading } = useAuth();
  const userDispatch = useAuthActions();
  const [selectId, setSelectId] = useState(queryId && queryId ? queryId : null);
  const listInnerRef = useRef();
  const [currPage, setCurrPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0);
  const [lastList, setLastList] = useState(false);
  const [page, setPage] = useState(1);
  const messageRef = useRef();
  const [isSearch, setIsSearch] = useState(0);
  const [dataLoading, setDataLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (listInnerRef && listInnerRef.current && !dataLoading) {
      listInnerRef.current.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [selectId, dataLoading]);

  const answer = (bale_id, client_id, message) => {
    baleSendMessageService(
      { bale_id: bale_id, client_id: client_id, message: message },
      { Authorization: "Bearer " + user.token }
    ).then(({ data }) => {
      if (data.status === true) {
        // toast.success("با موفقیت ارسال شد");
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
      } else {
        toast.error(data.message[0]);
      }
      baleFetcher(bale_id);
    });
  };

  //   bale

  function baleFetchAll() {
    if (user && !loading) {
      getBaleConversationService(
        { count: 20 * currPage, page: 1 },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setBaleData((prev) => [...data.result.users]);
          }
          //   setStatus(0);
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
          //   setStatus(0);
        });
    }
  }
  function baleFetchAllRequest() {
    if (user && !loading) {
      getBaleRequestService({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setBaleRequests(data.result.users);
            // setBaleData(data.result.users);
          }
          //   setStatus(0);
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
          //   setStatus(0);
        });
    }
  }

  function baleFetcher(id) {
    if (user && !loading) {
      // setDataLoading(true)
      getBaleSingleConversationService(
        { count: 100, page: 1, user_id: id },
        { Authorization: "Bearer " + user.token }
      ).then((res) => {
        setDataLoading(false);
        res.data.result && setBaleMessages(res.data.result.conversation);
        // data.result && setNow(data.result[0].length);
      });
    }
  }

  useEffect(() => {
    baleFetchAll();
  }, [user, loading, currPage]);

  useEffect(() => {
    baleFetchAllRequest();
  }, [user, loading]);

  useEffect(() => {
    if (user && !loading && queryId) {
      baleFetcher(queryId);
      setSelectId(queryId);
    }
  }, [queryId, page]);

  //   bale

  function fetcher(id) {
    if (user && !loading) {
      getConversationService(
        { count: 50, page: 1, document_id: id },
        { Authorization: "Bearer " + user.token }
      ).then((res) => {
        res.data.result && setMessages(res.data.result[0]);
        // data.result && setNow(data.result[0].length);
      });
    }
  }
  function fetchALL() {
    if (user && !loading) {
      getRecivedMessageService(
        { count: 20, page: currPage },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setData(data.result[0]);
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
    }
  }
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      setScrollPosition(scrollTop);
      if (scrollTop + clientHeight === scrollHeight) {
        setCurrPage(currPage + 1);
        // listInnerRef.current.scrollTo({ top: 600, behavior: "smooth" });
      }
      // if (scrollTop === 0) {
      //   listInnerRef.current.scrollTo({ top: 5, behavior: "smooth" });
      //   currPage > 0 && setCurrPage(currPage - 1);
      // }
    }
  };

  const onScrollMessages = () => {
    if (messageRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setPage(page + 1);
      }
    }
  };

  useEffect(() => {
    if (!lastList && prevPage !== currPage) {
      fetchALL();
    }
  }, [currPage, lastList, prevPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user && isSearch <= 0) {
        getBaleConversationService(
          { count: 20 * currPage, page: 1 },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              setBaleData(data.result.users);
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
        baleFetchAllRequest();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [loading, selectId, currPage, isSearch]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        if (selectId) {
          getBaleSingleConversationService(
            { count: 100, page: page, user_id: selectId },
            { Authorization: "Bearer " + user.token }
          ).then((res) => {
            res.data.result && setBaleMessages(res.data.result.conversation);
            // data.result && setNow(data.result[0].length);
          });
        }
        // getRecivedMessageService(
        //   { count: 10, page: 1 },
        //   {
        //     Authorization: "Bearer " + user.token,
        //   }
        // )
        //   .then(({ data }) => {
        //     if (data.status === false) {
        //       toast.error(data.message[0]);
        //     } else {
        //       setData(data.result[0]);
        //     }
        //     setStatus(0);
        //   })
        //   .catch((err) => {
        //     if (err.response && err.response.status === 401) {
        //       userDispatch({
        //         type: "LOGOUTNOTTOKEN",
        //       });
        //     }
        //     if (err.response) {
        //       toast.error(err.response.data.message);
        //     }
        //     setStatus(0);
        //   });
      }
    }, 3000);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [loading, selectId]);

  useEffect(() => {
    setStatus(1);
    if (user && !loading) {
      fetchALL();
    }
  }, [loading]);
  useEffect(() => {
    if (user && !loading && queryId) {
      fetcher(queryId);
      setSelectId(queryId);
    }
  }, [queryId]);

  useEffect(() => {
    baleData && setFilteredData(baleData);
  }, [baleData]);
  const sortNotRead = () => {
    return (
      filteredData &&
      filteredData.length > 0 &&
      filteredData.sort((a, b) => {
        return b.count_count - a.count_count;
      })
    );
  };

  const searchHandler = (e) => {
    setSearchStatus(1);
    // setCurrPage(1);
    if (e.length > 0) {
      setIsSearch(e.length);
      getBaleConversationService(
        { count: 200, page: 1, search: e },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (!data.status) {
            toast.error(data.message[0]);
          } else {
            setFilteredData(data.result.users);
          }
          setSearchStatus(0);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            toast.error("لطفا مجددا وارد شوید");
            userDispatch({
              type: "LOGOUTNOTTOKEN",
            });
          }
          setSearchStatus(0);
        });
    } else {
      getBaleConversationService(
        { count: 20, page: currPage },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (!data.status) {
            toast.error(data.message[0]);
          } else {
            setFilteredData(data.result.users);
          }
          setSearchStatus(0);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            toast.error("لطفا مجددا وارد شوید");
            userDispatch({
              type: "LOGOUTNOTTOKEN",
            });
          }
          setSearchStatus(0);
        });
      setIsSearch(-10);
    }
  };

  const render = () => {
    if (selectId) {
      if (balemessages) {
        return (
          <BaleChatConversation
            data={messages}
            answer={answer}
            access="operator"
            balemessages={balemessages}
            selectId={selectId}
            baleFetchAll={baleFetchAll}
          />
        );
      }
    }
  };

  if (dataLoading) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          {/* <LoadingBtn /> */}
          <PageLoading />
        </div>
      </Layout>
    );
  }

  // useEffect(() => {
  //   if (selectId) {
  //     messageRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [selectId]);

  if (status === 1)
    return (
      <Layout>
        <div className="w-full flex items-center justify-center">
          <PageLoading />
        </div>
      </Layout>
    );
  return (
    <Layout>
      <div className="flex flex-col max-h-[calc(100vh-120px)]">
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          {queryId && queryId >= 0 ? (
            <button
              onClick={() => router.back()}
              className="text-2xl text-gray-900"
              type="button"
            >
              <MdArrowForward />
            </button>
          ) : (
            ""
          )}
          <h1 className="text-xl text-gray-900">گفت و گو ها</h1>
        </div>
        <div
          className={`flex  relative flex-row w-full  h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] justify-start  items-start `}
        >
          <div className="w-4/12 border-l min-h-full border-gray-200 py-4 px-6 max-h-[calc(100vh-120px)] flex flex-col items-center">
            <div className={`w-full max-h-[300px]`}>
              <h2>درخواست مشاوره</h2>
              <div className="overflow-hidden">
                <div className="mt-6  max-h-[300px]  overflow-y-auto pb-10">
                  {baleRequests.length > 0 ? (
                    baleRequests.map((item, index) => {
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            baleFetcher(item.id);
                            setSelectId(item.id);
                            setDataLoading(true);
                          }}
                          className="w-full"
                        >
                          <div className="flex flex-row items-center justify-between w-full border-b border-primary-50 py-3 cursor-pointer">
                            <div className="flex flex-row items-center gap-2">
                              <div
                                className={`w-10 h-10 flex items-center justify-center text-white bg-gradient-to-r from-[#2E2F74] to-[#73C7A6] rounded-full text-2xl`}
                              >
                                <BsPersonFill />
                              </div>
                              <div className="flex flex-col items-start gap-3 ">
                                <span className="text-gray-900 text-sm text-right">
                                  {!item.name && !item.sname
                                    ? "ناشناس"
                                    : `${item.sname ? item.sname : item.name}`}
                                </span>
                                <span className="text-sm text-gray-500 text-textGray line-clamp-1">
                                  {item && item.tell}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {/* {item &&
                              moment(item.updated_at)
                                .tz("Asia/Tehran")
                                .format("HH:mm")} */}
                                {item && item.last_update}
                              </span>

                              {item.messages_not_view > 0 ? (
                                <div className="w-6 h-6 text-xs rounded-full bg-[#238FF3] pt-1 text-white  flex items-center justify-center">
                                  {item.messages_not_view}
                                </div>
                              ) : null}

                              {/* <div className="text-xs rounded-cs bg-[#DCFAF5] pt-1 text-gray-500  flex items-center justify-center px-1">
                            مشاوره
                          </div> */}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="h-[150px] text-gray-500 text-sm w-full flex items-center justify-center">
                      درخواستی ندارید
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full h-12 mt-6 z-50 bg-white">
              <div className="w-full h-[8px] bg-white pl-16"></div>
              <div className="w-full h-[2px] bg-gradient-to-r from-[#2E2F74] to-[#73C7A6] mb-6"></div>

              <div className="pl-7">
                <BaleSearchBox
                  placeholder=""
                  isState={false}
                  allData={baleData}
                  changeHandler={searchHandler}
                  setFilteredData={setFilteredData}
                />
              </div>
            </div>
            <div className="w-full flex flex-col items-center gap-6 mt-10 max-h-[400px]">
              <div
                ref={listInnerRef}
                onScroll={onScroll}
                className="w-full flex flex-col items-center gap-0 pt-4 max-h-[calc(100vh-418px)] overflow-y-auto scrollbar-none pl-2"
              >
                {sortNotRead() ? (
                  sortNotRead().map((item, index) => {
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          baleFetcher(item.id);
                          setSelectId(item.id);
                          setDataLoading(true);
                        }}
                        className="w-full"
                      >
                        <div
                          className={`flex flex-row items-center justify-between w-full border-b border-primary-50 py-3 px-1 rounded-cs cursor-pointer ${
                            selectId === item.id && "bg-primary-50"
                          }`}
                        >
                          <div className="flex flex-row items-center gap-2">
                            <div
                              className={`w-10 h-10 flex items-center justify-center text-white ${
                                index % 4 === 0
                                  ? `bg-[#FCA5A5]`
                                  : index % 4 === 1
                                  ? "bg-[#AAD4C8]"
                                  : index % 4 === 2
                                  ? "bg-[#C5BCF3]"
                                  : "bg-[#FFB902]"
                              } rounded-full text-2xl`}
                            >
                              <BsPersonFill />
                            </div>
                            <div className="flex flex-col items-start gap-3 ">
                              <span className="text-gray-900 text-sm text-right">
                                {!item.name && !item.sname
                                  ? "کاربر ناشناس"
                                  : `${item.sname ? item.sname : item.name}`}
                              </span>
                              <span className="text-sm text-gray-500 text-textGray line-clamp-1">
                                {item && item.tell}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {/* {item &&
                                moment(item.updated_at)
                                  .tz("Asia/Tehran")
                                  .format("HH:mm")} */}
                              {item && item.last_update}
                            </span>
                            {item.messages_not_view > 0 ? (
                              <div className="w-6 h-6 text-xs rounded-full bg-[#238FF3] pt-1 text-white  flex items-center justify-center">
                                {item.messages_not_view}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <span className="text-gray-500 text-sm mt-[100px]">
                    گفت و گویی وجود ندارد
                  </span>
                )}
              </div>
            </div>
          </div>
          <div
            ref={messageRef}
            onScroll={onScrollMessages}
            className="w-8/12  min-h-[calc(100vh-190px)] bg-white relative bg- h-full max-h-[calc(100vh-120px)]"
          >
            {render()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Conversation;
