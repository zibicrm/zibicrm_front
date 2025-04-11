import React, { useEffect, useState } from "react";
import Layout from "../../../Layout/Layout";
import { MdArrowForward } from "react-icons/md";
import SearchBox from "../../../Components/SearchBox";
import { BsPersonFill } from "react-icons/bs";
import { useRouter } from "next/router";
import ChatConversation from "../../../Components/Conversation";
import { useAuth } from "../../../Provider/AuthProvider";
import BaleSearchBox from "../../../Components/Bale/BaleSearchBox";
import BaleChatConversation from "../../../Components/Bale/BaleChatConversation";
import {
  baleChangeConversationToRead,
  baleSendMessageService,
  getBaleConversationService,
  getBaleRequestService,
  getBaleSingleConversationService,
} from "../../../Services/bale";
import moment from "moment-timezone";
import jmoment from "jalali-moment";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useLayoutEffect } from "react";
import PageLoading from "../../../utils/LoadingPage";
import LoadingBtn from "../../../utils/LoadingBtn";

const BaleConversationPage = () => {
  const router = useRouter();
  let queryId = router.query.id;
  const { user, loading } = useAuth();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectId, setSelectId] = useState(queryId && queryId ? queryId : null);
  const [balemessages, setBaleMessages] = useState([]);
  const [baleRequests, setBaleRequests] = useState([]);
  const [baleData, setBaleData] = useState([]);
  const [messages, setMessages] = useState([]);
  const listInnerRef = useRef();
  const [currPage, setCurrPage] = useState(1);
  const [page, setPage] = useState(1);
  const messageRef = useRef();
  const [searchStatus, setSearchStatus] = useState([]);
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
  }, [selectId,dataLoading]);

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
            // setData(data.result[0]);
            // console.log('DATA',data.result.users);
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
  //   function baleFetchAllRequest() {
  //     if (user && !loading) {
  //       getBaleRequestService({
  //         Authorization: "Bearer " + user.token,
  //       })
  //         .then(({ data }) => {
  //           if (data.status === false) {
  //             toast.error(data.message[0]);
  //           } else {
  //             // setData(data.result[0]);
  //             // console.log('DATA',data.result.users);
  //             setBaleRequests(data.result.users);
  //             // setBaleData(data.result.users);
  //           }
  //           //   setStatus(0);
  //         })
  //         .catch((err) => {
  //           if (err.response && err.response.status === 401) {
  //             // userDispatch({
  //             //   type: "LOGOUTNOTTOKEN",
  //             // });
  //           }
  //           if (err.response) {
  //             toast.error(err.response.data.message);
  //           }
  //           //   setStatus(0);
  //         });
  //     }
  //   }

  function baleFetcher(id) {
    if (user && !loading) {
      getBaleSingleConversationService(
        { count: 100, page: page, user_id: id },
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

  //   useEffect(() => {
  //     baleFetchAllRequest();
  //   }, [user, loading]);

  useEffect(() => {
    if (user && !loading && queryId) {
      baleFetcher(queryId);
      setSelectId(queryId);
    }
  }, [queryId, page]);

  //   bale

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

  // console.log(isSearch);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      setScrollPosition(scrollTop);
      if (scrollTop + clientHeight === scrollHeight) {
        setCurrPage(currPage + 1);
        // listInnerRef.current.scrollTo({ top: 5, behavior: "smooth" });
      }
      // if (scrollTop === 0) {
      //   listInnerRef.current.scrollTo({ top: 5, behavior: "smooth" });
      //   currPage > 1 && setCurrPage(currPage - 1);
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
    const interval = setInterval(() => {
      if (user) {
        if (selectId) {
          getBaleSingleConversationService(
            { count: 100, page: 1, user_id: selectId },
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
    }, 10000);

    return () => clearInterval(interval);
  }, [loading, selectId, currPage, isSearch]);

  // useEffect(()=>{

  //   const interval = setInterval(() => {
  //    if(isSearch > 0){
  //     console.log('true');
  //    } else {
  //     console.log('false');
  //    }

  //   },[1000])

  //   return () => clearInterval(interval);
  // },[isSearch])

  useEffect(() => {
    if (user && !loading && queryId) {
      fetcher(queryId);
      setSelectId(queryId);
    }
  }, [queryId]);

  const render = () => {
    if (selectId) {
      if (balemessages) {
        return (
          <BaleChatConversation
            data={messages}
            answer={answer}
            access="admin"
            balemessages={balemessages}
            selectId={selectId}
            baleFetchAll={baleFetchAll}
          />
        );
      }
    }
  };

  if(dataLoading){
    return <Layout>
      <div className="h-full flex items-center justify-center">
        <PageLoading />
        </div>
    </Layout>
  }

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
            <div className="w-full h-12 mt-6">
              <BaleSearchBox
                placeholder="شماره تلفن یا نام را وارد کنید..."
                isState={false}
                allData={data}
                changeHandler={searchHandler}
                setFilteredData={setFilteredData}
              />
            </div>
        
              <div className="w-full flex flex-col items-center gap-6">
                <div
                  ref={listInnerRef}
                  onScroll={onScroll}
                  className="w-full  flex flex-col items-center gap-0 pt-4 max-h-[calc(100vh-218px)] overflow-y-auto scrollbar-none pl-2"
                >
                  {sortNotRead() ? (
                    sortNotRead().map((item, index) => {
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setDataLoading(true);
                            baleFetcher(item.id);
                            setSelectId(item.id);
                          }}
                          className="w-full"
                        >
                          <div
                            className={`relative flex flex-row items-center justify-between w-full border-b border-primary-50 py-3 px-1 rounded-cs cursor-pointer hover:bg-gray-50 group ${
                              item.id === selectId && "bg-primary-50"
                            }`}
                          >
                            <div className="flex flex-row gap-2">
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
                                <div className="flex items-center gap-x-4">
                                  <span className="flex items-center text-gray-900 text-sm text-right">
                                    {!item.name && !item.sname
                                      ? "کاربر ناشناس"
                                      : `${
                                          item.sname ? item.sname : item.name
                                        }`}
                                  </span>
                                  {item.supplier && (
                                    <div className="hidden group-hover:block absolute right-[70%] translate-x-[50%] top-[50%] -translate-y-[50%] bg-white text-gray-900 rounded-cs shadow-cs z-50">
                                      <span className="flex items-center gap-x-1 whitespace-nowrap px-3 py-3 rounded-cs text-xs">
                                        <span>کارشناس :</span>{" "}
                                        <h6>
                                          {item.supplier.first_name &&
                                            item.supplier.first_name}
                                        </h6>
                                        <h6>
                                          {item.supplier.last_name &&
                                            item.supplier.last_name}
                                        </h6>
                                      </span>
                                    </div>
                                  )}
                                  {/* {item.supplier &&  <span className="flex items-center bg-primary-50 px-3 py-3 rounded-cs text-xs"><span>کارشناس :</span> <h6>{item.supplier.first_name && item.supplier.first_name}</h6><h6>{item.supplier.last_name && item.supplier.last_name}</h6></span>} */}
                                </div>
                                <span className="text-sm text-gray-500 text-textGray line-clamp-1">
                                  {item && item.tell}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-xs text-gray-500">
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
            className="w-8/12  min-h-[calc(100vh-190px)] bg-white relative bg-cover h-full max-h-[calc(100vh-120px)]"
          >
            {render()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BaleConversationPage;
