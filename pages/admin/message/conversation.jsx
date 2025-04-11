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


const Conversation = () => {
  const router = useRouter();
  let queryId = router.query.id;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState([]);
  const [searchStatus, setSearchStatus] = useState([]);
  const { user, loading } = useAuth();
  const userDispatch = useAuthActions();
  const [selectId, setSelectId] = useState(queryId && queryId ? queryId : null);
  const listInnerRef = useRef();
  const [currPage, setCurrPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0);
  const [lastList, setLastList] = useState(false);


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
        { count: 10, page: currPage },
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
      if (scrollTop + clientHeight === scrollHeight) {
        setCurrPage(currPage + 1);
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
      if (user) {
        if (selectId) {
          getConversationService(
            { count: 100, page: 1, document_id: selectId },
            { Authorization: "Bearer " + user.token }
          ).then((res) => {
            res.data.result && setMessages(res.data.result[0]);
            // data.result && setNow(data.result[0].length);
          });
        }
        getRecivedMessageService(
          { count: 10, page: 1 },
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
    }, 8000);

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
    data && setFilteredData(data);
  }, [data]);
  const sortNotRead = () => {
    return (
      filteredData &&
      filteredData.length &&
      filteredData.sort((a, b) => {
        return b.count_count - a.count_count;
      })
    );
  };
  const answer = (document_id, message) => {
    answerMessageService(
      { document_id: document_id, message: message },
      { Authorization: "Bearer " + user.token }
    ).then(({ data }) => {
      if (data.status === true) {
        toast.success("با موفقیت ارسال شد");
      } else {
        toast.error(data.message[0]);
      }
      fetcher(document_id);
    });
  };


  const searchHandler = (e) => {
    setSearchStatus(1);
    searchMessageService(
      { content: e },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (!data.status) {
          toast.error(data.message[0]);
        } else {
          setFilteredData(data.result);
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
  };


  const render = () => {
    if (selectId) {
      if (messages.length) {
        return (
          <ChatConversation data={messages} answer={answer} access="admin" />
        );
      }
    }
  };

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
            <div className="w-full h-12">
              <SearchBox
                placeholder="شماره تلفن یا نام را وارد کنید..."
                isState={false}
                allData={data}
                changeHandler={searchHandler}
                setFilteredData={setFilteredData}
              />
            </div>
            <div className="w-full flex flex-col items-center gap-6 ">
              <div className="w-full flex flex-col items-center gap-0 pt-4 max-h-[calc(100vh-218px)] overflow-y-auto scrollbar-none">
                {sortNotRead() &&
                  sortNotRead().map((item) => {
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          fetcher(item.document_id);
                          setSelectId(item.document_id);
                        }}
                        className="w-full"
                      >
                        <div className="flex flex-row items-center justify-between w-full border-b border-primary-50 py-3 cursor-pointer">
                          <div className="flex flex-row items-center gap-2">
                            <div className="w-10 h-10 flex items-center justify-center text-white bg-primary-900 rounded-full text-2xl">
                              <BsPersonFill />
                            </div>
                            
                            <div className="flex flex-col items-start gap-3 ">
                              <span className="text-gray-900 text-sm text-right">
                                {item.document && item.document[0]
                                  ? item.document[0].name
                                  : "-"}
                              </span>
                              <span className="text-sm text-gray-500 text-textGray line-clamp-1">
                                {item &&
                                  item.document &&
                                  item.document.length > 0 &&
                                  item.document[0].tell}
                                  
                              </span>
                              
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-gray-500">
                              {item &&
                                moment(item.created_at)
                                  .tz("Asia/Tehran")
                                  .format("HH:mm")}
                            </span>
                            {item.count_count > 0 ? (
                              <div className="w-6 h-6 text-xs rounded-full bg-primary-600 text-white  flex items-center justify-center">
                                {item.count_count}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="w-8/12  min-h-[calc(100vh-190px)] bg-chat-bg relative bg-cover h-full max-h-[calc(100vh-120px)]">
            {render()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Conversation;
