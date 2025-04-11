import Error from "next/error";
import React from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import Layout from "../../../Layout/Layout";
import FilterSelect from "../../../common/FilterSelect";
import { getAllClinicService } from "../../../Services/clinicServices";
import { useState } from "react";
import { useEffect } from "react";
import PrimaryBtn from "../../../common/PrimaryBtn";
import {
  MdCalendarToday,
  MdOutlineChevronLeft,
  MdOutlineChevronRight,
} from "react-icons/md";
import Modal from "../../../Components/Modal";
import RangePicker from "../../../Components/RangePicker";
import moment from "moment-timezone";
import {
  getAllFinanceReportService,
  getClinicFinanceReportService,
} from "../../../Services/allclinicPayments";
import { toast } from "react-toastify";
import IconBtn from "../../../common/IconBtn";
import { getRecordImageService } from "../../../Services/ImageService";
import {
  getFinanceImages,
  getFinanceImagesForReportsService,
} from "../../../Services/documentServices";
import Image from "next/image";
import { CloseBtn } from "../../../common/CloseBtn";
import Link from "next/link";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import PrismaZoom from "react-prismazoom";
import { useRef } from "react";
import { useCallback } from "react";
import jmoment from "jalali-moment";
import ReactPaginate from "react-paginate";
import PageLoading from "../../../utils/LoadingPage";
import LoadingBtn from "../../../utils/LoadingBtn";

const PatientsPaymentsPage = () => {
  const { user, loading } = useAuth();
  const userDispatch = useAuthActions();
  const [allClinic, setAllClinic] = useState([]);
  const [clinic, setClinic] = useState(null);
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(
    moment(moment.now()).locale("fa").format("YYYY-MM-DD")
  );
  const [end, setEnd] = useState(
    moment(moment.now()).locale("fa").format("YYYY-MM-DD")
  );
  const [results, setResults] = useState([]);
  const [documentId, setDocumentId] = useState(-20);
  const [imageDetails, setImageDetails] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const zoomCounterRef = useRef("100%");
  const prismaZoom = useRef(null);
  const [page, setPage] = useState(1);
  const [getDataLoading, setGetDataLoading] = useState(false);
  const [maxPage, setMaxPage] = useState(0);
  const [statistics, setStatistics] = useState(null);

  const head = [
    { id: 0, title: "ردیف" },
    { id: 1, title: "نام بیمار" },
    { id: 2, title: "کارشناس" },
    { id: 3, title: "مطب" },
    { id: 9, title: "تاریخ" },
    { id: 4, title: "هزینه خدمت" },
    { id: 5, title: "دریافتی" },

    { id: 7, title: "سهم زیبیدنت" },
    { id: 8, title: "عملیات" },
  ];

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
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
    }
  }, [loading]);

  const getClinicFinanceReport = () => {
    setGetDataLoading(true);
    getClinicFinanceReportService(
      {
        clinic_id: clinic,
        start_date: start,
        end_date: end,
        count: 100,
        page: page,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
          setGetDataLoading(false);
        } else {
          setMaxPage(Math.floor(data.result.count / 100) + 1);
          setResults(data.result.documents);

          setGetDataLoading(false);
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
        setGetDataLoading(false);
      });
  };

  const getAllFinanceReport = () => {
    getAllFinanceReportService(
      {
        clinic_id: clinic,
        start_date: start,
        end_date: end,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setStatistics(data.result.statistics);
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
    if (documentId > 0) {
      getFinanceImagesForReportsService(
        { document_id: documentId, start_date: start, end_date: end },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setImageDetails(data.result);
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
  }, [documentId]);

  useEffect(() => {
    if (user && user.token && start && end) {
      getClinicFinanceReport();
      getAllFinanceReport();
      const interval = setInterval(() => {
        getClinicFinanceReport();
        getAllFinanceReport();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [loading, clinic, calendar, page]);

  const onZoomChange = useCallback((zoom) => {
    if (!zoomCounterRef.current) return;
    zoomCounterRef.current.innerText = `${Math.round(zoom * 100)}%`;
  }, []);

  const onClickOnZoomOut = () => {
    prismaZoom.current?.zoomOut(1);
  };

  const onClickOnZoomIn = () => {
    prismaZoom.current?.zoomIn(1);
  };

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  if (user && user.user.rule !== 2 && user.user.id !== 1)
    return <Error statusCode={404} />;

  return (
    <Layout>
      <div className="flex items-center justify-between bg-gray-50 border-b border-primary-900 px-6 py-4">
        <div className="flex items-center gap-x-4">
          <h1 className="text-xl">پرداختی بیماران</h1>
          <div className="w-36 ">
            <FilterSelect
              selectOption={[{ id: null, title: "همه" }, ...allClinic]}
              name="searchSelect"
              label="مطب"
              labelOption="title"
              valueOption="id"
              value={clinic}
              changeHandler={(e) => {
                setClinic(e.id);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="bg-white p-[10px] rounded-cs">
            {start && end && (
              <div>
                <span className="ml-2">از</span>
                {jmoment(start).locale("fa").format("YYYY/MM/DD")}
                <span className="mr-2">|</span>
                <span className="mx-2">تا</span>
                {jmoment(end).locale("fa").format("YYYY/MM/DD")}
              </div>
            )}
          </div>
          <div className="h-10 w-24">
            <PrimaryBtn
              text={"تقویم"}
              onClick={() => {
                setCalendar(true);
                // setType(0);

                // setUserListId(userList.id)
              }}
            >
              <span className="block mr-1  mb-1">
                <MdCalendarToday />
              </span>
            </PrimaryBtn>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-gray-50 rounded-cs px-8 py-5">
          <div className="flex items-center justify-between gap-x-4 bg-white rounded-cs px-6 py-8">
            <div className="flex flex-col items-center justify-center gap-y-8 flex-1 h-28 rounded-cs">
              <h2>کل هزینه خدمت</h2>
              <h3 className="text-xl text-primary-900">
                {statistics
                  ? statistics.totalSumPrice.toLocaleString("en-US")
                  : 0}
                <span className="mr-1">تومان</span>
              </h3>
            </div>
            <div className="bg-gray-200 h-28 w-[1px]"></div>
            <div className="flex flex-col items-center justify-center gap-y-8 flex-1 h-28 rounded-cs">
              <h2>دریافتی</h2>
              <h3 className="text-xl text-primary-900">
                {statistics
                  ? statistics.totalReceivePrice.toLocaleString("en-US")
                  : 0}
                <span className="mr-1">تومان</span>
              </h3>
            </div>
            <div className="bg-gray-200 h-28 w-[1px]"></div>

            <div className="flex flex-col items-center justify-center gap-y-8 flex-1 h-28 rounded-cs bg-primary-50">
              <h2>سهم زیبیدنت</h2>
              <h3 className="text-xl text-primary-900">
                {statistics
                  ? statistics.totalCommission.toLocaleString("en-US")
                  : 0}
                <span className="mr-1">تومان</span>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-full overflow-x-scroll border ">
        <table className="w-full  min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
          <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
            <tr className="text-right text-sm">
              {head.map((item) => (
                <th
                  key={item.id}
                  className={`text-right border px-3 border-gray-200 relative text-gray-900 ${
                    clinic && item.id === 3 && "hidden"
                  }`}
                >
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="overflow-y-auto ">
            {results &&
              results.map((r, index) => (
                <Link
                  key={index}
                  href={`/admin/record/detail/?id=${r.document_id}`}
                  passHref
                >
                  <tr
                    className="h-12 text-sm text-gray-600 border-b hover:bg-primary-50 duration-100 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        `/admin/record/detail/?id=${r.document_id}`,
                        "_blank"
                      );
                    }}
                  >
                    <td
                      className={`w-20 text-right px-3 border-x border-gray-200 `}
                    >
                      {(page - 1) * 100 + (index + 1)}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {r.document?.name}
                    </td>

                    <td className="  text-right px-3 border-x border-gray-200">
                      {r.user?.first_name} {r.user?.last_name}
                    </td>
                    {!clinic && (
                      <td className="  text-right px-3 border-x border-gray-200">
                        {r.clinic?.title}
                      </td>
                    )}
                    <td className="  text-right px-3 border-x border-gray-200">
                      {jmoment(r.updated_at).locale("fa").format("YYYY/MM/DD")}{" "}
                      | {jmoment(r.updated_at).locale("fa").format("HH:mm")}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {r.totalSumPrice.toLocaleString("en-US")}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {r.totalReceivePrice.toLocaleString("en-US")}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {r.commission.toLocaleString("en-US")}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {r.totalSumPrice && r.totalSumPrice !== 0 ? (
                        <div className="w-full max-w-[180px] h-10">
                          <PrimaryBtn
                            text={"مشاهده عکس پرداختی"}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDocumentId(r.document_id);
                            }}
                          />
                        </div>
                      ) : null}
                    </td>
                  </tr>
                </Link>
              ))}
          </tbody>
        </table>
      </div>
      {getDataLoading && (
        <div className="w-full h-[100px] flex items-center justify-center">
          <LoadingBtn />
        </div>
      )}
      <div
        className={`${getDataLoading && "mt-14"}`}
        style={{
          direction: "ltr",
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          marginBottom: "20px",
          width: "100%",
          height: "30px",
        }}
      >
        <ReactPaginate
          forcePage={page - 1}
          activeClassName={"paginate-item paginate-active "}
          breakClassName={"paginate-item paginate-break-me "}
          breakLabel={"..."}
          containerClassName={"paginate-pagination"}
          disabledClassName={"paginate-disabled-page"}
          marginPagesDisplayed={2}
          nextClassName={"paginate-item paginate-next "}
          nextLabel={<MdOutlineChevronRight style={{ fontSize: 18 }} />}
          onPageChange={handlePageClick}
          pageCount={maxPage}
          pageClassName={"paginate-item paginate-pagination-page "}
          pageRangeDisplayed={2}
          previousClassName={"paginate-item paginate-previous"}
          previousLabel={<MdOutlineChevronLeft style={{ fontSize: 18 }} />}
        />
      </div>

      {documentId > 0 && (
        <Modal>
          <div className="w-[936px] min-h-[250px] bg-white rounded-cs p-8">
            <h1>اسناد مالی</h1>
            <div className="w-full h-full max-h-[750px] grid grid-cols-12 gap-x-6 mt-4 overflow-y-auto">
              {imageDetails.length > 0 &&
                imageDetails.map((image) => {
                  return (
                    <div key={image.id} className="col-span-3">
                      <div
                        className="w-full rounded-cs"
                        onClick={() => setShowImage(image.name)}
                      >
                        <Image
                          src={`https://radmanit.ir/images/${image.name}`}
                          className="rounded-cs"
                          alt="finance image"
                          width={200}
                          height={124}
                          objectFit="cover"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span>کارشناس:</span>
                          <span>
                            {image.user?.first_name
                              ? image.user?.first_name
                              : ""}{" "}
                            {image.user?.last_name ? image.user?.last_name : ""}
                          </span>
                        </div>
                        <div className="flex items-center justify-center mt-1">
                          {jmoment(image.updated_at)
                            .locale("fa")
                            .format("YYYY/MM/DD")}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <CloseBtn
              onClick={() => {
                setDocumentId(-20);
                setImageDetails([]);
              }}
            />
          </div>
        </Modal>
      )}
      {calendar ? (
        <Modal>
          <RangePicker
            end={end}
            setEnd={setEnd}
            setStart={setStart}
            start={start}
            calendar={calendar}
            setCalendar={setCalendar}
          />
        </Modal>
      ) : null}
      {showImage ? (
        <Modal setModal={() => null}>
          <div className="relative rounded-cs h-[400px] w-[400px] bg-white   max-h-[90vh] p-4 flex flex-col gap-6">
            <CloseBtn onClick={() => setShowImage(null)} />
            <div className=" w-full   overflow-hidden flex items-center justify-center max-h-[90vh]">
              <PrismaZoom
                className="z-20 w-[400px] h-[400px]"
                onZoomChange={onZoomChange}
                ref={prismaZoom}
              >
                <Image
                  src={`https://radmanit.ir/images/${showImage}`}
                  alt="receipt"
                  className="w-full h-full max-h-[calc(90vh-80px)] object-scale-down rounded-cs"
                  layout="fill"
                />
              </PrismaZoom>
              <div className="absolute z-50 bottom-6 right-[calc(50%-60px)] rounded-2xl bg-gray-900 flex flex-row items-center gap-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-[50%] text-white text-2xl "
                  onClick={onClickOnZoomIn}
                >
                  <FiPlusCircle />
                </button>
                <span
                  className=" text-center align-middle text-white w-10"
                  ref={zoomCounterRef}
                >
                  {String(zoomCounterRef.current)}%
                </span>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-[50%] text-white text-2xl "
                  onClick={onClickOnZoomOut}
                >
                  <FiMinusCircle />
                </button>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default PatientsPaymentsPage;
