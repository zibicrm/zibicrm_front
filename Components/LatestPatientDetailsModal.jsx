import React from "react";
import PrimaryBtn from "../common/PrimaryBtn";
import LoadingBtn from "../utils/LoadingBtn";
import SelectInput from "../common/SelectInput";
import Modal from "./Modal";
import {
  getDocumentDepositService,
  transferRecordClinicService,
} from "../Services/recordServices";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth, useAuthActions } from "../Provider/AuthProvider";
import { getAllClinicService } from "../Services/clinicServices";
import { getLatestDocumentAppointmentService } from "../Services/getLatestDocumentAppointment";
import { useState } from "react";
import { useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import moment from "jalali-moment";

const LatestPatientDetailsModal = ({ id, name ,getData}) => {
  const { loading, user } = useAuth();
  const [allClinic, setAllClinic] = useState([]);
  const [latestAppointmentDetails, setLatestAppointmentDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const userDispatch = useAuthActions();
  const router = useRouter();


  //     if (id) {
  //       await getRecordService(id, {
  //         Authorization: "Bearer " + user.token,
  //       })
  //         .then(({ data }) => {
  //           if (data.status === false) {
  //             toast.error(data.message[0]);
  //           } else {
  //             setData(data.result[0]);
  //             setDiseasesFilter(data.result.sicknessList);
  //           }
  //         })
  //         .catch((err) => {
  //           if (err.response && err.response.status === 401) {
  //             userDispatch({
  //               type: "LOGOUTNOTTOKEN",
  //             });
  //           }
  //           if (err.response) {
  //             toast.error(err.response.data.message);
  //           }
  //         });
  //       getTreatmentByIdService(
  //         { document_id: id },
  //         {
  //           Authorization: "Bearer " + user.token,
  //         }
  //       )
  //         .then(({ data }) => {
  //           if (data.status === false) {
  //             toast.error(data.message[0]);
  //           } else {
  //             setTreatment(data.result);
  //           }
  //         })
  //         .catch((err) => {
  //           if (err.response && err.response.status === 401) {
  //             userDispatch({
  //               type: "LOGOUTNOTTOKEN",
  //             });
  //           }
  //           if (err.response) {
  //             toast.error(err.response.data.message);
  //           }
  //         });
  //     }
  //   };

  const convertDay = (day) => {
    switch (day) {
      case "Saturday":
        return "شنبه";
      case "Sunday":
        return "یکشنبه";
      case "Monday":
        return "دوشنبه";
      case "Tuesday":
        return "سه شنبه";
      case "Wednesday":
        return "چهارشنبه";
      case "Thursday":
        return "پنج شنبه";
      case "Friday":
        return "جمعه";
    }
  };

  useEffect(() => {
    if ((user, id)) {
      setDetailsLoading(true);
      getLatestDocumentAppointmentService(
        { document_id: id },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setLatestAppointmentDetails(data.result);
          }
          clinicFormik.setStatus(0);
          setDetailsLoading(false);
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
          setDetailsLoading(false);
        });
    }
  }, [loading, id]);

  useEffect(() => {
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
    //   if (user && !loading && id) {
    //     getDocumentDepositService(id, {
    //       Authorization: "Bearer " + user.token,
    //     })
    //       .then(({ data }) => {
    //         if (data.status === false) {
    //           // toast.error(data.message[0]);
    //         } else {
    //           setDeposit(data.result.deposit);
    //           if (Number(data.result.deposit) > 0) {
    //             setReduceDeposit(true);
    //           }
    //         }
    //       })
    //       .catch((err) => {
    //         if (err.response && err.response.status === 401) {
    //           userDispatch({
    //             type: "LOGOUTNOTTOKEN",
    //           });
    //         }
    //         if (err.response) {
    //           toast.error(err.response.data.message);
    //         }
    //       });
    //   }
      //   getData();
    }
    if (!user && !loading) {
      router.push("/");
    }
    
  }, [loading, id]);

  const clinicValidationSchema = yup.object({
    clinic_id: yup.string().required("مطب را انتخاب کنید"),
  });

  const clinicInitialValues = {
    clinic_id: "",
  };



  const clinicFormik = useFormik({
    initialValues: clinicInitialValues,
    onSubmit: (values) => {
      clinicFormik.setStatus(1);
      transferRecordClinicService(
        { document_id: id, clinic_id: values.clinic_id },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
              getData()
            toast.success("بیمار با موفقیت انتقال یافت");
            // router.reload({ shallow: true });
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

  return (
    <Modal>
      <div className="w-[508px] bg-white rounded-cs p-6 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xl">
            <span>انتخاب مطب</span>
            <span className="text-primary-900">[{name && name}]</span>
          </div>
          <div className="text-xs">
            <span className="ml-1">شماره پرونده</span>
            {id}
          </div>
        </div>
        <p className="text-sm">
          لطفا با توجه به اطلاعات نوبت های پیشین مشخص کنید بیمار مربوط به کدام
          مطب می باشد
        </p>
        <form
          onSubmit={clinicFormik.handleSubmit}
          className="flex flex-col gap-y-4"
        >
          {allClinic.length > 0 && (
            <SelectInput
              formik={clinicFormik}
              label="مطب"
              name="clinic_id"
              selectOption={allClinic}
              labelOption="title"
              valueOption="id"
            />
          )}
          {latestAppointmentDetails.length > 0 && (
            <div className="border-b-2 border-primary-300 border-dashed mt-2"></div>
          )}
          {detailsLoading && (
            <div className="flex items-center justify-center">
              <LoadingBtn />
            </div>
          )}
          {latestAppointmentDetails.length > 0 && (
            <div className="flex flex-col gap-y-3">
              <h2 className="text-xs">نوبت های پیشین</h2>
              <div className="w-full max-w-full overflow-x-scroll border ">
                <table className="w-full  min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
                  <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
                    <tr className="text-right text-sm">
                      <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                        مطب
                      </th>
                      <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                        نام پزشک
                      </th>
                      <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                        زمان مراجعه
                      </th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto ">
                    {latestAppointmentDetails.map((d, index) => (
                      <tr
                        key={index}
                        className="h-12 text-sm text-gray-600 border-b hover:bg-primary-50 duration-100"
                      >
                        <td
                          className={`w-20 text-right px-3 border-x border-gray-200 `}
                        >
                          {d.clinic?.title}
                        </td>
                        <td className="  text-right px-3 border-x border-gray-200">
                          {d.doctor?.name}
                        </td>

                        <td className="  text-right px-3 border-x border-gray-200">
                          {moment(d.dateOfDay)
                            .locale("fa")
                            .format("YYYY/MM/DD")}{" "}
                          | {convertDay(d.day)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="w-full h-12 mt-2">
            <PrimaryBtn
              text="ثبت"
              type={"submit"}
              status={clinicFormik.status}
              disabled={clinicFormik.status === 1 ? true : false}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default LatestPatientDetailsModal;
