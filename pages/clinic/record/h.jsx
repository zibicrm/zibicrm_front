import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdArrowForward, MdCheck } from "react-icons/md";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { toast } from "react-toastify";
import {
  TeethsBL1,
  TeethsBL2,
  TeethsBL3,
  TeethsBL4,
  TeethsBL5,
  TeethsBL6,
  TeethsBL7,
  TeethsBL8,
  TeethsBR1,
  TeethsBR2,
  TeethsBR3,
  TeethsBR4,
  TeethsBR5,
  TeethsBR6,
  TeethsBR7,
  TeethsBR8,
  TeethsTL1,
  TeethsTL2,
  TeethsTL3,
  TeethsTL4,
  TeethsTL5,
  TeethsTL6,
  TeethsTL7,
  TeethsTL8,
  TeethsTR1,
  TeethsTR2,
  TeethsTR3,
  TeethsTR4,
  TeethsTR5,
  TeethsTR6,
  TeethsTR7,
  TeethsTR8,
} from "../../../assets/teeths";
import { CloseBtn } from "../../../common/CloseBtn";
import PrimaryBtn from "../../../common/PrimaryBtn";
import Modal from "../../../Components/Modal";
import Layout from "../../../Layout/Layout";
import { useAuth } from "../../../Provider/AuthProvider";
import { getAllService } from "../../../Services/serviceRequest";

const H = ({}) => {
  const { user, loading } = useAuth();
  const [teeths, setTeeths] = useState([]);
  const [services, setServices] = useState([]);
  const router = useRouter();
  const clickHandler = (e) => {
    let check = teeths.includes(e);
    if (!check) {
      setTeeths([...teeths, e]);
    } else {
      let filter = teeths.filter((item) => item !== e);
      setTeeths(filter);
    }
  };
  const checkInclude = (id) => {
    let r = teeths.includes(id);
    return r;
  };
  const getService = () => {
    getAllService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
          setServices([]);
        } else {
          setServices(data.result);
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
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      padding: 0,
      color: "#6B7280",

      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      border: "none",
      color: "#6B7280",
    }),

    option: (provided, state) => ({
      ...provided,
      color: "#6B7280",
      borderRadius: "5px",
      boxShadow: "none",
      backgroundColor: "#fff",

      "&:hover": {
        backgroundColor: "#EDF0F8",
        boxShadow: "none",
        color: "#6B7280",
      },
    }),
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      outline: "none",
      boxShadow: "none",
      color: "#6B7280",
      border: "1px solid #4267B3",
      minHeight: "48px",
      "&:hover": {
        border: "1px solid #4267B3",
        boxShadow: "none",
      },
    }),
  };
  useEffect(() => {
    if (user && !loading) {
      getService();
    }
  }, [loading]);
  const animatedComponents = makeAnimated();
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
            <h1 className="text-xl text-gray-900">طرح درمان</h1>
          </div>
          <div className="text-sm text-gray-900">نام بیمار : مهدی بهشتی</div>
        </div>
      </div>
      <div className="w-full p-6">
        <div className="w-full flex flex-row gap-20">
          <div className=" bg-gray-900 min-h-[600px] min-w-[600px] rounded-cs flex flex-col items-center">
            <div className="relative  w-full h-1/2">
              <button
                onClick={() => clickHandler("TL1")}
                className={`scale-[1.55] absolute top-12 right-64 max-h-fit max-w-fit ${
                  checkInclude("TL1") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTL1} alt="teeth" />
                  {checkInclude("TL1") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL2")}
                className={`scale-[1.55] absolute top-[3.55rem] right-[14.5rem] ${
                  checkInclude("TL2") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTL2} alt="teeth" />
                  {checkInclude("TL2") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL3")}
                className={`scale-[1.55] absolute top-[4.5rem] right-[13rem] ${
                  checkInclude("TL3") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTL3} alt="teeth" />
                  {checkInclude("TL3") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0.5 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL4")}
                className={`scale-[1.55] absolute top-[6rem] right-[12rem] ${
                  checkInclude("TL4") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTL4} alt="teeth" />
                  {checkInclude("TL4") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0.5 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL5")}
                className={`scale-[1.55] absolute top-[7.75rem] right-[11.5rem] ${
                  checkInclude("TL5") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTL5} alt="teeth" />
                  {checkInclude("TL5") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL6")}
                className={`scale-[1.55] absolute top-[10rem] right-[10.5rem] ${
                  checkInclude("TL6") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTL6} alt="teeth" />
                  {checkInclude("TL6") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL7")}
                className={`scale-[1.55] absolute top-[13rem] right-[10rem] ${
                  checkInclude("TL7") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTL7} alt="teeth" />
                  {checkInclude("TL7") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL8")}
                className={`scale-[1.55] absolute top-[15.75rem] right-[9.5rem] ${
                  checkInclude("TL8") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTL8} alt="teeth" />
                  {checkInclude("TL8") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-2">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR1")}
                className={`scale-[1.55] absolute top-12 left-[18.5rem] max-h-fit max-w-fit ${
                  checkInclude("TR1") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTR1} alt="teeth" />
                  {checkInclude("TR1") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR2")}
                className={`scale-[1.55] absolute top-[3.5rem] left-[16.75rem] ${
                  checkInclude("TR2") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTR2} alt="teeth" />
                  {checkInclude("TR2") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR3")}
                className={`scale-[1.55] absolute top-[4.5rem] left-[15.25rem] ${
                  checkInclude("TR3") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTR3} alt="teeth" />
                  {checkInclude("TR3") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR4")}
                className={`scale-[1.55] absolute top-[6rem] left-[14rem] ${
                  checkInclude("TR4") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTR4} alt="teeth" />
                  {checkInclude("TR4") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR5")}
                className={`scale-[1.55] absolute top-[7.75rem] left-[13.15rem] ${
                  checkInclude("TR5") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTR5} alt="teeth" />
                  {checkInclude("TR5") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR6")}
                className={`scale-[1.55] absolute top-[9.97rem] left-[12.25rem] ${
                  checkInclude("TR6") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTR6} alt="teeth" />
                  {checkInclude("TR6") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR7")}
                className={`scale-[1.55] absolute top-[12.85rem] left-[11.25rem] ${
                  checkInclude("TR7") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTR7} alt="teeth" />
                  {checkInclude("TR7") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("TR8")}
                className={`scale-[1.55] absolute top-[15.65rem] left-[10.65rem] ${
                  checkInclude("TR8") ? "green-filter" : ""
                }`}
              >
                <div className="relative">
                  <Image src={TeethsTR8} alt="teeth" />
                  {checkInclude("TR8") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-3">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
            </div>
            <div className="relative  w-full h-1/2">
              <button
                onClick={() => clickHandler("BL1")}
                className={`scale-[1.55] absolute bottom-[5.55rem] right-[16.5rem] ${
                  checkInclude("BL1") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBL1} alt="teeth" />
                  {checkInclude("BL1") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2.5 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("BL2")}
                className={`scale-[1.55] absolute top-[13.65rem] right-[14.5rem] ${
                  checkInclude("BL2") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBL2} alt="teeth" />
                  {checkInclude("BL2") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("BL3")}
                className={`scale-[1.55] absolute top-[12.65rem] right-52 ${
                  checkInclude("BL3") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBL3} alt="teeth" />
                  {checkInclude("BL3") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0.5 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BL4")}
                className={`scale-[1.55] absolute top-[10.75rem] right-[11.75rem] ${
                  checkInclude("BL4") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBL4} alt="teeth" />
                  {checkInclude("BL4") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0.5 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BL5")}
                className={`scale-[1.55] absolute top-[8.75rem] right-44 ${
                  checkInclude("BL5") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBL5} alt="teeth" />
                  {checkInclude("BL5") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0.5 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BL6")}
                className={`scale-[1.55] absolute top-[5.85rem] right-40 ${
                  checkInclude("BL6") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBL6} alt="teeth" />
                  {checkInclude("BL6") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BL7")}
                className={`scale-[1.55] absolute top-[3.65rem] right-[9.75rem] ${
                  checkInclude("BL7") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBL7} alt="teeth" />
                  {checkInclude("BL7") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BL8")}
                className={`scale-[1.55] absolute top-1.5 right-[9.25rem] ${
                  checkInclude("BL8") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBL8} alt="teeth" />
                  {checkInclude("BL8") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-3 right-3">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR1")}
                className={`scale-[1.55] absolute bottom-[5.75rem] left-[17rem] ${
                  checkInclude("BR1") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBR1} alt="teeth" />
                  {checkInclude("BR1") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-3 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR2")}
                className={`scale-[1.55] absolute bottom-[5.5rem] left-[15rem] ${
                  checkInclude("BR2") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBR2} alt="teeth" />
                  {checkInclude("BR2") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR3")}
                className={`scale-[1.55] absolute bottom-[6.5rem] left-[13.5rem] ${
                  checkInclude("BR3") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBR3} alt="teeth" />
                  {checkInclude("BR3") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR4")}
                className={`scale-[1.55] absolute bottom-[8.25rem] left-[12.75rem] ${
                  checkInclude("BR4") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBR4} alt="teeth" />
                  {checkInclude("BR4") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0.5 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR5")}
                className={`scale-[1.55] absolute bottom-[10.25rem] left-[12rem] ${
                  checkInclude("BR5") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBR5} alt="teeth" />
                  {checkInclude("BR5") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR6")}
                className={`scale-[1.55] absolute bottom-[12.75rem] left-[11.5rem] ${
                  checkInclude("BR6") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBR6} alt="teeth" />
                  {checkInclude("BR6") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1.5 right-1.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR7")}
                className={`scale-[1.55] absolute bottom-[14.95rem] left-[11rem] ${
                  checkInclude("BR7") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0  ">
                  <Image src={TeethsBR7} alt="teeth" />
                  {checkInclude("BR7") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR8")}
                className={`scale-[1]  absolute bottom-[17.25rem] left-[10.25rem] ${
                  checkInclude("BR8") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0 ">
                  <Image
                    src={TeethsBR8}
                    alt="teeth"
                    className="rotate-[155deg]"
                  />
                  {checkInclude("BR8") ? (
                    <div className=" absolute text-2xl text-red-500 bg-opacity-30 top-1 right-1.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
            </div>
          </div>
          <div className="relative w-[calc(100%-680px)] grid grid-cols-2 grid-rows-2 gap-6 pl-8">
            <div className="w-full py-3 px-8 h-full border border-primary-900 rounded-cs shadow-[-4px_4px_0_rgba(66,103,179,1)] flex flex-row items-center">
              <ul className=" h-full  w-1/2 border-l-gr ">
                <li className="h-1/4 w-full border-b-gr-r   flex items-center justify-center">
                  {checkInclude("TL1") ? "L1" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r flex items-center justify-center">
                  {checkInclude("TL3") ? "L3" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r flex items-center justify-center">
                  {checkInclude("TL5") ? "L5" : ""}
                </li>
                <li className="h-1/4 w-full flex items-center justify-center">
                  {checkInclude("TL7") ? "L7" : ""}
                </li>
              </ul>
              <ul className=" h-full w-1/2 ">
                <li className="h-1/4 w-full border-b-gr flex items-center justify-center">
                  {checkInclude("TL3") ? "L3" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr flex items-center justify-center">
                  {checkInclude("TL4") ? "L4" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr flex items-center justify-center">
                  {checkInclude("TL6") ? "L6" : ""}
                </li>
                <li className="h-1/4 w-full flex items-center justify-center">
                  {checkInclude("TL8") ? "L8" : ""}
                </li>
              </ul>
            </div>
            <div className="w-full h-full border border-primary-900 rounded-cs shadow-[4px_4px_0_rgba(66,103,179,1)] flex flex-row items-center">
              <ul className=" h-full  w-1/2 border-l-gr ">
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center ">
                  {checkInclude("TR1") ? "R1" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center">
                  {checkInclude("TR3") ? "R3" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center">
                  {checkInclude("TR5") ? "R5" : ""}
                </li>
                <li className="h-1/4 w-full  flex items-center justify-center">
                  {checkInclude("TR7") ? "R7" : ""}
                </li>
              </ul>
              <ul className=" h-full w-1/2 ">
                <li className="h-1/4 w-full border-b-gr  flex items-center justify-center ">
                  {checkInclude("TR2") ? "R2" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr  flex items-center justify-center">
                  {checkInclude("TR4") ? "R4" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr flex items-center justify-center ">
                  {checkInclude("TR6") ? "R6" : ""}
                </li>
                <li className="h-1/4 w-full flex items-center justify-center">
                  {checkInclude("TR8") ? "R8" : ""}
                </li>
              </ul>
            </div>
            <div className="w-full h-full border border-primary-900 rounded-cs shadow-[-4px_-4px_0_rgba(66,103,179,1)] flex flex-row items-center">
              <ul className=" h-full  w-1/2 border-l-gr ">
                <li className="h-1/4 w-full border-b-gr-r   flex items-center justify-center">
                  {checkInclude("BL1") ? "L1" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center">
                  {checkInclude("BL3") ? "L3" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center">
                  {checkInclude("BL5") ? "L5" : ""}
                </li>
                <li className="h-1/4 w-full  flex items-center justify-center">
                  {checkInclude("BL7") ? "L7" : ""}
                </li>
              </ul>
              <ul className=" h-full w-1/2 ">
                <li className="h-1/4 w-full border-b-gr   flex items-center justify-center">
                  {checkInclude("BL2") ? "L2" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr  flex items-center justify-center">
                  {checkInclude("BL4") ? "L4" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr flex items-center justify-center ">
                  {checkInclude("BL6") ? "L6" : ""}
                </li>
                <li className="h-1/4 w-full  flex items-center justify-center">
                  {checkInclude("BL8") ? "L8" : ""}
                </li>
              </ul>
            </div>
            <div className="w-full h-full border border-primary-900 rounded-cs shadow-[4px_-4px_0_rgba(66,103,179,1)] flex flex-row items-center">
              <ul className=" h-full  w-1/2 border-l-gr ">
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center ">
                  {checkInclude("BR1") ? "R1" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center">
                  {checkInclude("BR3") ? "R3" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center">
                  {checkInclude("BR5") ? "R5" : ""}
                </li>
                <li className="h-1/4 w-full  flex items-center justify-center">
                  {checkInclude("BR7") ? "R7" : ""}
                </li>
              </ul>
              <ul className=" h-full w-1/2 ">
                <li className="h-1/4 w-full border-b-gr   flex items-center justify-center">
                  {checkInclude("BR2") ? "R2" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr  flex items-center justify-center">
                  {checkInclude("BR4") ? "R4" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr flex items-center justify-center ">
                  {checkInclude("BR6") ? "R6" : ""}
                </li>
                <li className="h-1/4 w-full flex items-center justify-center">
                  {checkInclude("BR8") ? "R8" : ""}
                </li>
              </ul>
            </div>
            <span className="absolute top-[calc(50%-8px)] text-primary-900 right-[calc(50%-24px)] w-6 h-6 ">
              All
            </span>
            <span className="absolute top-[calc(50%-8px)] text-primary-900 align-middle -right-12 bg-primary-50 w-10 h-6 text-center rounded ">
              L
            </span>
            <span className="absolute top-[calc(50%-8px)] text-primary-900 -left-4 align-middle text-center w-10 h-6 rounded bg-primary-50">
              R
            </span>
          </div>
        </div>
      </div>
      {
        <Modal>
          <div className="w-fit max-w-md min-h-[320px] h-fit bg-white p-6 rounded-cs flex flex-col items-start gap-6">
            <span>نوع خدمت</span>
            <span>لطفا نوع خدمت خود را برای دندان انتخابی تعیین کنید</span>
            <Select
              className="w-full"
              closeMenuOnSelect={false}
              components={animatedComponents}
              getOptionLabel={(option) => option.title}
              getOptionValue={(option) => option.id}
              // defaultValue={[services[4], services[5]]}
              placeholder="نوع خدمت"
              styles={customStyles}
              isMulti
              options={services}
            />
            <div className="w-full h-12 min-h-[48px] mt-14">
              <PrimaryBtn text="ثبت" />
            </div>
            <CloseBtn />
          </div>
        </Modal>
      }
    </Layout>
  );
};

export default H;
