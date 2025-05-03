import { useRouter } from "next/router";
import {
  MdAddCircleOutline,
  MdArrowRightAlt,
  MdLoop,
  MdOutlineDeleteSweep,
  MdOutlineSms,
  MdRemoveRedEye,
  MdSchedule,
  MdSearch,
} from "react-icons/md";
import Select from "react-select";

import IconBtn from "../../../common/IconBtn";
import Layout from "../../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import CountSelect from "../../../Components/CountSelect";
import { toast } from "react-toastify";
import Pagination from "../../../Components/Pagination";
import {
  deleteParaclinicService,
  getAllParaclinicService,
  getParaclinicTypeService,
} from "../../../Services/paraclinicServices";
import Error from "next/error";
import Modal from "../../../Components/Modal";
import SelectInput from "../../../common/SelectInput";
import { useFormik } from "formik";
import * as yup from "yup";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { CloseBtn } from "../../../common/CloseBtn";
import PageLoading from "../../../utils/LoadingPage";
import SearchBox from "../../../Components/SearchBox";
import { useExcelDownloder } from "react-xls";
const Paraclinic = () => {
  const [paraclinic, setParaclinic] = useState(null);
  const [data, setData] = useState(null);
  const [send, setSend] = useState(false);
  const [status, setStatus] = useState(0);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(50);
  const [types, setTypes] = useState([]);

  const { ExcelDownloder, Type } = useExcelDownloder();

  const [excelData, setExcelData] = useState([]);

  const data1 = {
    files: excelData,
  };

  const getData = () => {
    getAllParaclinicService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setParaclinic(data.result);

          let result = data.result;

          const formattedData = result?.map((item) => ({
            نام: item?.title,
            نوع: typeTitle(item.type_id),
            تلفن: item?.tell,
            آدرس: item?.address,
          }));

          setExcelData(formattedData);
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
  const head = [
    { id: 0, title: "نام پاراکلینیک" },
    { id: 1, title: "نوع" },
    { id: 2, title: "شماره تلفن " },
    { id: 3, title: "آدرس" },
    { id: 4, title: "لوکیشن" },
    { id: 5, title: "عملیات" },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const deleteHandler = (id) => {
    deleteParaclinicService(id, {
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
  const pagination = () => {
    let s = (page - 1) * count;
    let e = page * count;
    setData(paraclinic && paraclinic.slice(s, e));
  };
  const searchHandler = (e) => {
    let filterData = paraclinic.map((item) => {
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
    paraclinic && pagination();
  }, [paraclinic]);
  useEffect(() => {
    if (user && user.token) {
      getData();
      getParaclinicTypeService({
        Authorization: "Bearer " + user.token,
      }).then(({ data }) => setTypes(data.result));
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading]);
  const typeTitle = (id) => {
    let s =
      types &&
      data &&
      types.length &&
      types.filter((item) => Number(item.id) === Number(id))[0];
    return s.title;
  };
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  if (!paraclinic) return <PageLoading />;

  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">پاراکلینیک</h1>
        </div>
        <div className="w-full flex flex-row items-center justify-between px-6 py-4">
          <div className="w-[40%]">
            <SearchBox
              allData={paraclinic}
              changeHandler={searchHandler}
              isState={true}
              setFilteredData={setData}
            />
          </div>

          <div className="flex flex-row items-center gap-3">
            <div className={status === 1 && "animate-spin"}>
              <IconBtn
                icon={<MdLoop />}
                onClick={() => {
                  getData(), setStatus(1);
                }}
              />
            </div>{" "}
            <CountSelect setCount={setCount} />
            <div className="w-36 h-12">
              <PrimaryBtn
                text="افزودن پاراکلینیک"
                onClick={() => router.push("/admin/paraclinic/add")}
              >
                <span className="block mr-2">
                  <MdAddCircleOutline />
                </span>
              </PrimaryBtn>
            </div>
            <div className="flex flex-row items-center justify-center rounded-cs   min-w-fit text-primary-900 text-xs h-12">
              <ExcelDownloder
                key={JSON.stringify(excelData)}
                data={data1}
                filename={"پاراکلینیک"}
                type={Type.Button}
              >
                دانلود اکسل
              </ExcelDownloder>
            </div>
          </div>
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
                    <td className="w-20 select-text text-right px-3 border-x border-gray-200">
                      {index + 1}
                    </td>
                    <td className=" select-text text-right px-3 border-x border-gray-200">
                      {item.title}
                    </td>
                    <td className="select-text text-right px-3 border-x border-gray-200">
                      {typeTitle(item.type_id)}
                    </td>
                    <td className="select-text text-right px-3 border-x border-gray-200">
                      {item.tell}
                    </td>
                    <td className="select-text text-right px-3 border-x border-gray-200 max-w-[250px]">
                      {item.address}
                    </td>
                    <td className="select-text text-right px-3 border-x border-gray-200">
                      {item.location}
                    </td>
                    <td className=" text-right px-3 flex flex-row items-center justify-start text-base lg:text-xl gap-3 h-12 border-x border-gray-200">
                      <IconBtn
                        icon={<MdRemoveRedEye />}
                        onClick={() =>
                          router.push(`/admin/paraclinic/detail/?id=${item.id}`)
                        }
                      />
                      {user && user.user && user.user.id === 1 ? (
                        <IconBtn
                          icon={<MdOutlineDeleteSweep />}
                          onClick={() => deleteHandler(item.id)}
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {send && <SendAddress />}
    </Layout>
  );
};

export default Paraclinic;
const SendAddress = () => {
  const validationSchema = yup.object({
    patient: yup.string().required("شماره تلفن مراجعه کننده را وارد کنید"),
    description: yup.string().required("نام مراجعه کننده را وارد کنید"),
  });
  const initialValues = {
    patient: "",
    description: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      // formik.setStatus(1);
      // newParaclinicService(values, {
      //   Authorization: "Bearer " + user.token,
      // })
      //   .then(({ data }) => {
      //     if (data.status === false) {
      //       toast.error(data.message[0]);
      //     } else {
      //       toast.success("پرونده با موفقیت ثبت شد");
      //       formik.setStatus(0);
      //     }
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
      //     formik.setStatus(0);
      //   });
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });
  const select = [{ value: "1", label: "مریم اکبری" }];
  return (
    <Modal>
      <form className="flex flex-col gap-6 bg-white max-w-sm w-full min-w-[340px] p-8">
        <span className="text-xl">ارسال ادرس پاراکلینیک</span>
        <SelectInput
          formik={formik}
          label="انتخاب بیمار"
          name="patient"
          selectOption={select}
        />
        <textarea
          placeholder="توضیحات"
          {...formik.getFieldProps("description")}
          className={`p-2 border border-primary-400 rounded-cs outline-none w-full max-h-72 h-64`}
        />
        <div className="h-12 w-full">
          <PrimaryBtn text="ارسال" />
        </div>
        <CloseBtn />
      </form>
    </Modal>
  );
};

export { SendAddress };
