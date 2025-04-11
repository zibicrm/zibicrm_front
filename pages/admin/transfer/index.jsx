import { MdArrowForward } from "react-icons/md";
import Layout from "../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import Error from "next/error";
import SearchInPatients from "../../../Components/SearchInPatients";
import SelectInput from "../../../common/SelectInput";
import { getAllUsersService } from "../../../Services/userServies";
import {
  transferRecordClinicService,
  transferRecordService,
} from "../../../Services/recordServices";
import Tabs from "../../../Components/Tabs";
import { getAllClinicService } from "../../../Services/clinicServices";
const AddImplant = () => {
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [allClinic, setAllClinic] = useState();
  const [status, setStatus] = useState([]);
  const [tab, setTab] = useState(0);
  const [userInfo, setUserInfo] = useState(null);

  const tabOptions = [
    { text: "مطب", id: 0 },
    { text: "کارشناس", id: 1 },
  ];

  const validationSchema = yup.object({
    document_id: yup.string().required("نام بیمار را وارد کنید"),
    user_id: yup.string().required("کارشناس را انتخاب کنید"),
  });
  const initialValues = {
    document_id: "",
    user_id: "",
  };
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
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      transferRecordService(values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("بیمار با موفقیت انتقال یافت");
            router.push("/admin/");
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

  const clinicValidationSchema = yup.object({
    document_id: yup.string().required("نام بیمار را وارد کنید"),
    clinic_id: yup.string().required("مطب را انتخاب کنید"),
  });

  const clinicInitialValues = {
    document_id: "",
    clinic_id: "",
  };

  const clinicFormik = useFormik({
    initialValues: clinicInitialValues,
    onSubmit: (values) => {
      clinicFormik.setStatus(1);
      transferRecordClinicService(values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("بیمار با موفقیت انتقال یافت");
            router.push("/admin/");
          }
          clinicFormik.setStatus(0);
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
          clinicFormik.setStatus(0);
        });
    },
    validationSchema: clinicValidationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user && user.user.rule !== 2) {
      router.push("/");
    }
    if (user && !loading) {
      getData();
    }
  }, [loading]);

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

  useEffect(() => {
    userInfo && formik.setFieldValue("document_id", userInfo.id);
    userInfo && clinicFormik.setFieldValue("document_id", userInfo.id);
  }, [userInfo]);

  if (
    (user && user.user && user.user.rule !== 2)
  )
    return <Error statusCode={404} />;

    // if (
    //   (user && user.user && user.user.rule !== 2) ||
    //   (user &&
    //     user.user &&
    //     user.user.id !== 1 &&
    //     user &&
    //     user.user &&
    //     user.user.id !== 24)
    // )

   


  return (
    <Layout>
      <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between  border-b border-primary-900">
        <div className="flex flex-row items-center justify-start gap-3">
          <button
            onClick={() => router.back()}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900">انتقال بیمار {user && user.user && user.user.id !== 10 && <span>به</span>}</h1>
          {user && user.user && user.user.id !== 10 && <Tabs options={tabOptions} setTab={setTab} tab={tab} />}
          
        </div>
        
        <div className="text-gray-900">
          {tab === 0 ? "مطب" : "کارشناس"} :
          {tab === 0
            ? userInfo && userInfo.clinic && userInfo.clinic.title
            : userInfo &&
              userInfo.user &&
              userInfo.user.first_name + " " + userInfo.user.last_name}
        </div>
      </div>

      {tab === 0 ? (
        <form onSubmit={clinicFormik.handleSubmit}>
          <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
            <div className="w-full h-12">
              <SearchInPatients
                setUser={setUserInfo}
                access="admin"
                placeholder="نام بیمار"
              />
            </div>
            <SelectInput
              formik={clinicFormik}
              label="مطب"
              name="clinic_id"
              selectOption={
                allClinic && [{ id: 7, title: "زیبیدنت" }, ...allClinic]
              }
              labelOption="title"
              valueOption="id"
            />
          </div>
          <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
            <div className={"col-span-2"}></div>

            <div className="h-12 ">
              <PrimaryBtn
                text="ثبت تغییرات"
                type="submit"
                status={clinicFormik.status}
                disabled={clinicFormik.status === 1 || !clinicFormik.isValid}
              />
            </div>
          </div>
        </form>
      ) : (
        user.user.id === 10 ? (null) : (  <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
            <div className="w-full h-12">
              <SearchInPatients
                setUser={setUserInfo}
                access="admin"
                placeholder="نام بیمار"
              />
            </div>
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
          </div>
          <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
            <div className={"col-span-2"}></div>

            <div className="h-12 ">
              <PrimaryBtn
                text="ثبت تغییرات"
                type="submit"
                status={formik.status}
                disabled={formik.status === 1 || !formik.isValid}
              />
            </div>
          </div>
        </form>)
      
      )}
    </Layout>
  );
};

export default AddImplant;
