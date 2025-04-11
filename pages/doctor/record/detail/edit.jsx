import {
    MdAddCircleOutline,
    MdArrowForward,
    MdOutlineDeleteSweep,
  } from "react-icons/md";
  import Layout from "../../../../Layout/Layout";
  import * as yup from "yup";
  import { useFormik } from "formik";
  import Input from "../../../../common/Input";
  import PrimaryBtn from "../../../../common/PrimaryBtn";
  import RadioInput from "../../../../common/RadioBtn";
  import { useEffect, useState } from "react";
  import { useRouter } from "next/router";
  import SelectInput from "../../../../common/SelectInput";
  import DatePickerComponent from "../../../../common/DatePicker";
  import { toast } from "react-toastify";
  import { useAuth, useAuthActions } from "../../../../Provider/AuthProvider";
  import { CheckBox } from "../../../../common/CheckBox";
  import moment from "jalali-moment";
  import {
    editRecordService,
    getRecordService,
  } from "../../../../Services/recordServices";
  import { getAllSystemicService } from "../../../../Services/systemicServices";
  import Error from "next/error";
  import PageLoading from "../../../../utils/LoadingPage";
  import toEnDigit from "../../../../hooks/ToEnDigit";
  import QRCode from "react-qr-code";
  import Link from "next/link";
  import Modal from "../../../../Components/Modal";
  import { useRef } from "react";
  import { v1 as uuidv1 } from "uuid";
  import { FaImages, FaMoneyCheck, FaPlus, FaRegEye } from "react-icons/fa";
  import { TfiZoomIn } from "react-icons/tfi";
  import Image from "next/future/image";
  import DeleteWarning from "../../../../Components/DeleteWarning";
  import { deleteRecordImageService } from "../../../../Services/ImageService";
  import OutlineBtn from "../../../../common/OutlineBtn";
  import { CloseBtn } from "../../../../common/CloseBtn";
  import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
  import PrismaZoom from "react-prismazoom";
  import { useCallback } from "react";
  import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
  const EditRecord = () => {
    const [success, setSuccess] = useState(false);
    const [data, setData] = useState(null);
    const [diseases, setDiseases] = useState(null);
    const [diseasesFilter, setDiseasesFilter] = useState([]);
    const { loading, user } = useAuth();
    const userDispatch = useAuthActions();
    const [qrValue, setQrValue] = useState(null);
    const [deleteImage, setDeleteImage] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState(0);
    const [getDataStatus, setGetDataStatus] = useState(0);
    const zoomCounterRef = useRef("100%");
    const prismaZoom = useRef(null);
    let s = moment.now();
    let nowDay = moment(s).format("YYYY/MM/DD");
    const router = useRouter();
    const id = router.query.id;
    const getData = async () => {
      setGetDataStatus(1);
      await getRecordService(id, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setData(data.result[0]);
            setDiseasesFilter(data.result.sicknessList);
          }
          setGetDataStatus(0);
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
          setGetDataStatus(0);
        });
    };
    useEffect(() => {
      if (qrValue && data && data.paper && data.paper.length) {
        setQrValue(null);
      }
    }, [data]);
    useEffect(() => {
      if (user && !loading && id) {
        getAllSystemicService({
          Authorization: "Bearer " + user.token,
        })
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              setDiseases(data.result);
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
        getData();
      }
      if (!user && !loading) {
        router.push("/");
      }
      if (user && user.user.rule !== 3) {
        router.push("/");
      }
    }, [loading, id]);
    const deleteImageHandler = () => {
      setDeleteStatus(1);
      deleteRecordImageService(deleteImage, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success(data.result);
            setDeleteImage(false);
            getData();
            setDeleteStatus(0);
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
          setDeleteStatus(0);
        });
    };
    const validationSchema = yup.object({
      tell: yup
        .string()
        .typeError("فرمت شماره تلفن صحیح نمی باشد")
        .required("شماره تلفن مراجعه کننده را وارد کنید"),
      name: yup.string().required("نام مراجعه کننده را وارد کنید"),
      gender: yup.string().required("جنسیت را وارد کنید"),
      homeTell: yup.number().typeError("فرمت شماره تلفن صحیح نمی باشد"),
      nationalId: yup.number().typeError("فرمت کد ملی صحیح نمی باشد"),
    });
    const initialValues = {
      tell: data && data.tell,
      name: data && data.name,
      homeTell: data && data.homeTell ? data.homeTell : "",
      job: data && data.job,
      nationalId: data && data.nationalId ? data.nationalId : "",
      degree: data && data.degree,
      birthDay:
        (data && data.birthDay === "0000-00-00 00:00:00") ||
        (data && !data.birthDay)
          ? null
          : data && data.birthDay,
      reasonReferral: data && data.reasonReferral,
      reagent: data && data.reagent,
      marital: data && data.marital, // 1=>single    2=>married
      otherSickness: data && data.otherSickness,
      useMedicine: data && data.useMedicine,
      allergyMedicine: data && data.allergyMedicine,
      hospitalization: data && data.hospitalization,
      did: data && data.id,
      document_id: data && data.document_id,
      referred_name: data && data.referred_name,
      address: data && data.address,
      money_status: data && data.money_status,
      sickness: "",
      allergyM: data && data.allergyMedicine ? "0" : "1",
      sicknesss: data && data.otherSickness ? "0" : "1",
      medicine: data && data.useMedicine ? "0" : "1",
      hospitali: data && data.hospitalization ? "0" : "1",
      gender: data && String(data.gender),
    };
    const formik = useFormik({
      initialValues,
      onSubmit: (values) => {
        formik.setStatus(1);
        delete values["allergyM"];
        delete values["sicknesss"];
        delete values["medicine"];
        delete values["hospitali"];
        values["sickness"] = diseasesFilter;
        editRecordService(values, {
          Authorization: "Bearer " + user.token,
        })
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              toast.success("پرونده با موفقیت ثبت شد");
              setSuccess(true);
              router.push("/doctor/record");
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
    const radioBtnY = [
      { id: "0", label: "بله", value: "1" },
      { id: "1", label: "خیر", value: "2" },
    ];
    const maritalOption = [
      { id: "1", label: "مجرد", value: "1" },
      { id: "2", label: "متاهل", value: "2" },
    ];
    const genderOption = [
      { id: "1", label: "آقا", value: "1" },
      { id: "2", label: "خانم", value: "2" },
    ];
    const moneyOption = [
      { id: 1, value: "ضعیف" },
      { id: 2, value: "متوسط" },
      { id: 3, value: "خوب" },
    ];
    const defualtValue = {
      value:
        formik.values.money_status == 1
          ? "ضعیف"
          : formik.values.money_status == 2
          ? "متوسط"
          : formik.values.money_status == 2
          ? "خوب"
          : null,
      id: 0,
    };
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
  
    if (user && user.user.rule !== 3) return <Error statusCode={404} />;
    if (!data) return <PageLoading />;
    return (
      <Layout>
        <div className="overflow-hidden h-[calc(100vh-85px)]">
          <div className=" bg-gray-50 px-6 py-3 flex w-full flex-row items-center justify-between gap-3 border-b border-primary-900">
            <div className="flex flex-row items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-2xl text-gray-900"
                type="button"
              >
                <MdArrowForward />
              </button>
              <h1 className="text-xl text-gray-900">اطلاعات پرونده</h1>
            </div>
            <div className="text-sm text-gray-900">
              کارشناس :{" "}
              {data &&
                data.user &&
                data.user.first_name + " " + data.user.last_name}
            </div>
          </div>
          <div className="w-full  flex flex-row items-start ">
            <form
              className="w-full min-h-fit h-full "
              onSubmit={formik.handleSubmit}
            >
              <div className="flex w-full flex-row items-start  gap-6">
                <div className="w-2/3 border-l border-gray-200 grid grid-cols-2 gap-x-4 gap-y-8 p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
                  <div className="flex flex-row items-center gap-3 col-span-1">
                    <span className="text-sm text-gray-900">جنسیت:</span>
                    <RadioInput
                      formik={formik}
                      radioOptions={genderOption}
                      name="gender"
                    />
                  </div>
  
                  <Input
                    name="document_id"
                    type="text"
                    label="شماره پرونده پزشکی"
                    formik={formik}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "document_id",
                        toEnDigit(e.target.value)
                      );
                    }}
                  />
                  <Input
                    name="name"
                    type="text"
                    label="نام و نام خانوادگی"
                    formik={formik}
                  />
                  <Input
                    name="tell"
                    type="text"
                    label=" تلفن همراه"
                    formik={formik}
                    onChange={(e) => {
                      formik.setFieldValue("tell", toEnDigit(e.target.value));
                    }}
                  />
                  <Input
                    name="homeTell"
                    type="text"
                    label=" تلفن ثابت"
                    formik={formik}
                    onChange={(e) => {
                      formik.setFieldValue("homeTell", toEnDigit(e.target.value));
                    }}
                  />
                  {defualtValue.value !== null && (
                    <SelectInput
                      formik={formik}
                      label={defualtValue.value}
                      name="money_status"
                      selectOption={moneyOption}
                      labelOption="value"
                      valueOption="id"
                      defaultV={defualtValue}
                    />
                  )}
                  <DatePickerComponent
                    name="birthDay"
                    formik={formik}
                    label={
                      (data && data.birthDay === "0000-00-00 00:00:00") ||
                      (data && !data.birthDay)
                        ? null
                        : data &&
                          moment(data.birthDay).locale("fa").format("YYYY/MM/DD")
                    }
                    text="تاریخ تولد"
                  />
                  <Input name="job" type="text" label="شغل" formik={formik} />
                  <Input
                    name="nationalId"
                    type="text"
                    label="کد ملی"
                    formik={formik}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "nationalId",
                        toEnDigit(e.target.value)
                      );
                    }}
                  />
                  <Input
                    name="degree"
                    type="text"
                    label="تحصیلات"
                    formik={formik}
                  />
                  <Input
                    name="address"
                    type="text"
                    label="آدرس"
                    formik={formik}
                  />
                  <Input
                    name="reasonReferral"
                    type="text"
                    label="علت مراجعه"
                    formik={formik}
                  />
                  <Input
                    name="reagent"
                    type="text"
                    label="معرف"
                    formik={formik}
                  />
                  <div className="flex flex-row items-center gap-3 ">
                    <span className="text-sm text-gray-900">وضعیت تاهل</span>
                    <RadioInput
                      formik={formik}
                      radioOptions={maritalOption}
                      name="marital"
                    />
                  </div>
                  <div className="border-t border-dashed border-primary-100  flex flex-col py-6 gap-8 col-span-2">
                    <div className="flex flex-col gap-4">
                      <span className="text-base ">سوابق بیماری</span>
                      <div className="grid grid-auto-fill gap-y-8">
                        {diseasesFilter &&
                          diseases &&
                          diseases.map((c) => (
                            <div key={c.id}>
                              <CheckBox
                                setValue={setDiseasesFilter}
                                value={diseasesFilter}
                                label={c.title}
                                name={c.id}
                                id={c.id}
                                number={true}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="flex flex-col  w-full gap-8 ">
                      <div className="flex flex-row items-center  w-full gap-8">
                        <div className="flex flex-row items-center gap-4 w-[370px]">
                          <span className="w-56 text-sm text-gray-900">
                            {" "}
                            سایر بیماری ها و حساسیت ها :
                          </span>
                          <RadioInput
                            formik={formik}
                            radioOptions={radioBtnY}
                            name="sicknesss"
                          />
                        </div>
                        <div className="w-[calc(100%-400px)] ">
                          <Input
                            name="otherSickness"
                            type="text"
                            label="شرح بیماری"
                            formik={formik}
                            disable={
                              formik.values.sicknesss === "1" ? true : false
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-8">
                        <div className="flex flex-row items-center w-[370px] gap-4">
                          <span className="w-56 text-sm text-gray-900">
                            آیا داروی خاصی مصرف میکند؟
                          </span>
                          <RadioInput
                            formik={formik}
                            radioOptions={radioBtnY}
                            name="medicine"
                          />
                        </div>
                        <div className="w-[calc(100%-400px)]">
                          <Input
                            name="useMedicine"
                            type="text"
                            label="دارو"
                            formik={formik}
                            disable={
                              formik.values.medicine === "1" ? true : false
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-8">
                        <div className="flex flex-row items-center gap-4 w-[370px]">
                          <span className="w-56 text-sm text-gray-900">
                            آیا به داروی خاصی حساسیت دارد؟
                          </span>
                          <RadioInput
                            formik={formik}
                            radioOptions={radioBtnY}
                            name="allergyM"
                          />
                        </div>
                        <div className="w-[calc(100%-400px)]">
                          <Input
                            name="allergyMedicine"
                            type="text"
                            label="دارو"
                            formik={formik}
                            disable={
                              formik.values.allergyM === "1" ? true : false
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-8">
                        <div className="flex flex-row items-center gap-4 w-[370px]">
                          <span className="w-56 text-sm text-gray-900">
                            سابقه بستری در بیمارستان دارد؟
                          </span>
                          <RadioInput
                            formik={formik}
                            radioOptions={radioBtnY}
                            name="hospitali"
                          />
                        </div>
                        <div className="w-[calc(100%-400px)]">
                          <Input
                            name="hospitalization"
                            type="text"
                            label="شرح علت"
                            formik={formik}
                            disable={
                              formik.values.hospitali === "1" ? true : false
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full mt-10 gap-x-4 gap-y-8 grid grid-cols-2">
                      <div className={"col-span-1"}></div>
  
                      <div className="h-12 ">
                        <PrimaryBtn
                          text="ثبت تغییرات"
                          type="submit"
                          status={formik.status}
                          disabled={
                            formik.status === 1 || !formik.isValid || success
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/3  p-6 flex flex-col h-full gap-6 max-h-[calc(100vh-120px)] overflow-y-auto">
                  <div className="w-full flex flex-row items-center justify-between">
                    <h1 className="text-xl text-gray-900">پرونده مطب</h1>
                    <div className="h-12 w-36">
                      <PrimaryBtn
                        text="اضافه کردن عکس"
                        type="button"
                        onClick={() => setQrValue(`${nowDay + "_" + id} `)}
                      >
                        <FaPlus />
                      </PrimaryBtn>
                    </div>
                  </div>
                  {data && data.paper && data.paper[0] ? null : (
                    <p className="text-sm text-gray-900">
                      لطفا تصویر پشت و روی پرونده مطب را بارگذاری کنید
                    </p>
                  )}
  
                  {data && data.paper && data.paper[0] ? (
                    data.paper.map((i, index) => (
                      <div
                        key={index}
                        className="w-full relative  border-2 border-primary-400 rounded-[5px] border-dashed h-full flex item items-center justify-center flex-col gap-3"
                      >
                        <Image
                          src={`https://radmanit.ir/images/document/${i.name}`}
                          alt={data.name}
                          height={100}
                          width={100}
                          className="w-full h-full"
                        />
  
                        <button
                          type="button"
                          onClick={() => setShowImage(i.name)}
                          className="text-2xl bg-white text-primary-900 left-2 top-2 p-1 rounded-cs absolute"
                        >
                          <FaRegEye />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteImage(i.id)}
                          className="text-2xl bg-white text-red-400 left-12 top-2 p-1 rounded-cs absolute"
                        >
                          <MdOutlineDeleteSweep />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="w-full relative  border-2 border-primary-400 rounded-[5px] border-dashed h-60 flex item items-center justify-center flex-col gap-3">
                      <div className="flex flex-col items-center gap-4 py-6 ">
                        <p className="text-primary-400 text-sm">تصویر پرونده </p>
                        <div className="text-primary-400 text-7xl flex flex-col items-center justify-center gap-6">
                          <FaImages />
                        </div>
                      </div>
                    </div>
                  )}
  
                  <div className="h-full flex flex-row items-center text-center gap-4 "></div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {qrValue ? (
          <Modal setModal={() => null}>
            <div className="w-96 h-fit bg-white p-6 rounded-cs flex items-center flex-col gap-2">
              <div className="flex flex-col items-start w-full gap-2">
                <h1 className="text-lg">اسکن QR Code</h1>
                <p className="text-xs w-full flex flex-col gap-1">
                  لطفا بارکد را در آدرس زیر اسکن کرده پس از بارگذاری روی دکمه ثبت
                  تصویر کلیک نمایید
                  <br />
                  <Link href={"/upload"}>
                    <a
                      target="_blank"
                      rel="nofollow"
                      className="w-full text-sm text-primary-600 text-left"
                    >
                      www.radmanit.ir/upload
                    </a>
                  </Link>
                </p>
              </div>
              <div className="w-full flex items-center justify-center py-4 border-2 border-dashed border-primary-200 ">
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "70%", width: "70%" }}
                  className=""
                  value={qrValue}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <div className="flex flex-row items-center justify-between w-full">
                <div className="h-12 w-36 mt-2">
                  <OutlineBtn
                    text="انصراف"
                    type="button"
                    onClick={() => setQrValue(null)}
                  />
                </div>
                <div className="h-12 w-36 mt-2">
                  <PrimaryBtn
                    text="ثبت تصویر "
                    type="button"
                    onClick={() => getData()}
                    disabled={getDataStatus === 1}
                    status={getDataStatus}
                  />
                </div>
              </div>
            </div>
          </Modal>
        ) : null}
        {deleteImage ? (
          <DeleteWarning
            text="آیا از حذف نمودن تصویر پرونده اطمینان دارید؟"
            title="حذف تصویر پرونده"
            setState={() => setDeleteImage(false)}
            deleteHandler={deleteImageHandler}
            status={deleteStatus}
          />
        ) : null}
        {showImage ? (
          <Modal setModal={() => null}>
            <div className="relative rounded-cs bg-white w-fit h-fit max-h-[90vh] p-4 flex flex-col gap-6">
              <CloseBtn onClick={() => setShowImage(null)} />
              <h1>تصویر پرونده بیمار</h1>
              <div className=" w-full max-w-[300px]  overflow-hidden flex items-center justify-center max-h-[90vh]">
                {/* <Magnifier
                  imageSrc={`https://radmanit.ir/images/document/${showImage}`}
                  imageAlt="Example"
                  mouseActivation={MOUSE_ACTIVATION.CLICK} // Optional
                  touchActivation={TOUCH_ACTIVATION.TAP} // Optional
                  className="img-unset"
                  dragToMove={false}
                />
                 */}
                <PrismaZoom
                  className="z-20"
                  onZoomChange={onZoomChange}
                  ref={prismaZoom}
                >
                  <Image
                    src={`https://radmanit.ir/images/document/${showImage}`}
                    alt="receipt"
                    className="w-full h-full max-h-[calc(90vh-80px)] object-scale-down rounded-cs"
                    width={100}
                    height={100}
                  />{" "}
                  {/* <p>A text that can be zoomed and dragged</p> */}
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
  
  export default EditRecord;
  