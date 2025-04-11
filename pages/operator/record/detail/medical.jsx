import { useRouter } from "next/router";
import {
  MdAddCircleOutline,
  MdArrowForward,
  MdArrowRightAlt,
  MdLoop,
  MdOutlineDeleteSweep,
  MdRemoveRedEye,
  MdSchedule,
  MdSearch,
} from "react-icons/md";
import Select from "react-select";
import IconBtn from "../../../../common/IconBtn";
import Layout from "../../../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../../Provider/AuthProvider";
import CountSelect from "../../../../Components/CountSelect";
import { toast } from "react-toastify";
import Pagination from "../../../../Components/Pagination";
import {
  deleteRecordService,
  getAllRecordService,
  getFinanceRecordService,
  getMedicalRecordService,
} from "../../../../Services/recordServices";
import Error from "next/error";
import PageLoading from "../../../../utils/LoadingPage";
import PrimaryBtn from "../../../../common/PrimaryBtn";
import moment from "jalali-moment";
import { CurrencyNum } from "../../../../hooks/CurrencyNum";
const Medical = () => {
  const [records, setRecords] = useState(null);
  const [status, setStatus] = useState(0);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(50);
  const head = [
    { id: 0, title: "تاریخ" },
    { id: 1, title: "خدمات انجام شده" },
    { id: 2, title: "هزینه کل" },
    { id: 3, title: "دریافتی" },
    { id: 4, title: "باقی مانده" },
    { id: 5, title: "پزشک" },
    { id: 6, title: "دستیار" },
    { id: 7, title: "توضیحات" },
  ];
  const router = useRouter();
  const id = router.query.id;
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const getData = () => {
    getMedicalRecordService(
      {
        count: count,
        page: page,
        document_id: id,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setRecords(data.result);
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

  useEffect(() => {
    if (user && user.token && id) {
      getData();
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 1) {
      router.push("/");
    }
  }, [id, loading]);

  if (user && user.user.rule !== 1) return <Error statusCode={404} />;
  if (!records) return <PageLoading />;
  return (
    <Layout>
      <div>
        <div className="bg-gray-50 px-6 py-3 flex flex-row items-center justify-between gap-3 border-b border-primary-900">
          <div className="flex flex-row items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-2xl text-gray-900"
              type="button"
            >
              <MdArrowForward />
            </button>
            <h1 className="text-xl text-gray-900">پرونده پزشکی</h1>
          </div>
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
            </div>
            <CountSelect setCount={setCount} />
            {/* <div className="w-32 h-12">
              <PrimaryBtn
                text="ثبت درمان"
                onClick={() =>
                  router.push(`/operator/record/detail/health/id=${id}`)
                }
              >
                <span className="block mr-2">
                  <MdAddCircleOutline />
                </span>
              </PrimaryBtn>
            </div> */}
          </div>
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
                    <div className="rotate-[270deg] absolute left-1 top-3">
                      <MdArrowRightAlt />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="overflow-y-auto ">
              {records &&
                records.record &&
                records.record.map((item, index) => (
                  <tr
                    key={index}
                    className="h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100"
                  >
                    <td className="w-20 text-right px-3 border-x border-gray-200">
                      {index + 1}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {moment(item.created_at)
                        .locale("fa")
                        .format("YYYY/MM/DD")}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {item.treatment_service &&
                        item.treatment_service.map((t) => {
                          return t.count + "*" + t.service_title;
                        })}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {CurrencyNum.format(
                        Number(item.SumPrice) - Number(item.discount)
                      )}
                    </td>
                    <td className=" text-right px-3 border-x border-gray-200">
                      {CurrencyNum.format(item.receive_price)}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {CurrencyNum.format(
                        Number(item.SumPrice) -
                          (Number(item.receive_price) + Number(item.discount))
                      )}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.doctor  && item.doctor.name}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.assistant}
                    </td>
                    <td className="  text-right px-3 border-x border-gray-200">
                      {item.description}
                    </td>
                    {/* <td className=" text-right flex flex-row items-center justify-start text-base px-3 lg:text-xl gap-3 h-12 border-x border-gray-200">
                      <IconBtn
                        icon={<MdOutlineDeleteSweep />}
                        onClick={deleteHandler}
                      />
                    </td> */}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination
          records={records && records.record}
          count={records.count}
          page={page}
          setPage={setPage}
        />
      </div>
    </Layout>
  );
};

export default Medical;
