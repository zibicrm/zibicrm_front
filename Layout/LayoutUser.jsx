import React from "react";
import { MdDraw, MdExitToApp, MdHomeFilled, MdPerson } from "react-icons/md";
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaCopy,
  FaPeopleArrows,
  FaTeethOpen,
} from "react-icons/fa";
import { ImageBanner, ImageLogoUser } from "../assets/Images";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  usePatientAuth,
  usePatientAuthActions,
} from "../Provider/PatientAuthProvider";


const LayoutUser = ({ children }) => {
  const { user, loading } = usePatientAuth();
  const patientDispatcher = usePatientAuthActions();
  const router = useRouter();

  const menu = [
    { id: 0, title: "خانه", icon: <MdHomeFilled />, link: "/user" },
    {
      id: 1,
      title: "طرح درمان",
      icon: <FaTeethOpen />,
      link: "/user/treatment-plan",
    },
    {
      id: 2,
      title: "نوبت های جاری",
      icon: <FaCalendarAlt />,
      link: "/user/appointments",
    },
    {
      id: 3,
      title: "ثبت نوبت جدید",
      icon: <FaCalendarCheck />,
      link: "/user/new-reserve",
    },
    {
      id: 4,
      title: "معرفی بیمار",
      icon: <FaPeopleArrows />,
      link: "/user/introduce-patient",
    },
    { id: 5, title: "پرونده", icon: <FaCopy />, link: "/user/document" },
    { id: 6, title: "نظر سنجی", icon: <MdDraw />, link: "/user/vote" },
  ];

  const mobileMenu = [
    { id: 0, title: "پرونده", icon: <FaCopy />, link: "/user/document" },
    {
      id: 1,
      title: "معرفی بیمار",
      icon: <FaPeopleArrows />,
      link: "/user/introduce-patient",
    },
    { id: 2, title: "", icon: <MdHomeFilled />, link: "/user" },
    {
      id: 3,
      title: "نوبت های جاری",
      icon: <FaCalendarAlt />,
      link: "/user/appointments",
    },
    {
      id: 4,
      title: "طرح درمان",
      icon: <FaTeethOpen />,
      link: "/user/treatment-plan",
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-[100vh] bg-gray-50 p-5 text-gray-900 pb-[100px] lg:flex-row lg:gap-x-5 lg:items-start lg:px-8">
      <div className="fixed top-0 left-0 right-0 bg-white flex items-center justify-between px-6 py-5 z-50 shadow-card md:justify-center md:h-[90px]">
        <div className="flex items-center gap-x-[2px]  md:hidden">
          <span className="w-8 h-8 flex items-center justify-center bg-gray-50 ring-2 ring-white rounded-full  cursor-pointer">
            <MdPerson className="w-5 h-5 text-zibiPrimary" />
          </span>

          <h2 className="text-[10px] md:text-sm">
            {user && user.user.name.slice(0, 8)}
            {user && user.user.name.length > 7 && "..."}
          </h2>
        </div>
        <div className="absolute w-[62px] h-6 left-[50%] -translate-x-[50%] md:w-[125px] md:h-[50px] ">
          <Image src={ImageLogoUser} alt="" />
        </div>
        <MdExitToApp
          className="w-6 h-6 md:hidden"
          onClick={() => {
            patientDispatcher({
              type: "LOGOUT",
            });
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-[100px] md:gap-x-6 md:items-center lg:items-start  lg:flex-col  lg:w-2/6 desktop:w-3/12">
        <div className="hidden items-center gap-x-3 gap-y-4 md:flex md:flex-col md:justify-center  md:self-center lg:w-full">
          <span className="w-12 h-12 flex items-center justify-center bg-gray-50 ring-2 ring-white rounded-full md:w-[90px] md:h-[90px] cursor-pointer">
            <MdPerson className="w-7 h-7 text-zibiPrimary md:w-12 md:h-12" />
          </span>
          <div className="flex flex-col gap-y-2 md:gap-y-3 md:text-center">
            <h1 className="text-sm font-bold md:text-base">سلام!خوش امدی</h1>
            <h2 className="text-xs md:text-sm">{user ? user.user.name : ""}</h2>
            <div className="hidden text-sm text-zibiPrimary cursor-pointer md:flex">
              {user?.user.document_id && (
                <span>
                  شماره پرونده : <span>{user && user.user.document_id}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="hidden bg-gray-50 mt-8  p-6 items-center justify-center border-[3px] border-white rounded-lg md:flex md:flex-1 lg:self-center ">
          <div className=" grid flex-1 grid-cols-12 gap-x-[2px]  gap-y-[2px] items-center justify-center lg:bg-white ">
            {menu.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`w-full h-full p-2 bg-gray-50 col-span-3 flex flex-col gap-y-4 items-center justify-center group lg:col-span-6`}
                >
                  <div className="flex items-center justify-center w-full h-full  ">
                    <Link href={item.link}>
                      <div
                        className={`flex flex-col items-center justify-center w-[120px] h-[120px] rounded-lg cursor-pointer hover:bg-white hover:shadow-card ${
                          router.pathname === item.link
                            ? "bg-white shadow-card"
                            : ""
                        }`}
                      >
                        <div
                          className={`text-gray-400  w-12  h-12 text-2xl flex items-center justify-center duration-300 group-hover:text-zibiPrimary ${
                            router.pathname === item.link && "text-zibiPrimary"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <h2
                          className={`text-gray-400 text-sm whitespace-nowrap group-hover:text-zibiPrimary  ${
                            router.pathname === item.link && "text-zibiPrimary"
                          }`}
                        >
                          {item.title}
                        </h2>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
            {/* logout */}
            <button
              className={`w-full h-full p-2 bg-gray-50 col-span-3 flex flex-col gap-y-4 items-center justify-center group lg:col-span-6`}
              onClick={() => {
                patientDispatcher({
                  type: "LOGOUT",
                });
              }}
            >
              <div className="flex items-center justify-center w-full h-full  ">
                <div
                  className={`flex flex-col items-center justify-center w-[120px] h-[120px] rounded-lg cursor-pointer hover:bg-white hover:shadow-card`}
                >
                  <div
                    className={`text-gray-400  w-12  h-12 text-2xl flex items-center justify-center duration-300 group-hover:text-zibiPrimary}`}
                  >
                    <MdExitToApp />
                  </div>
                  <h2
                    className={`text-gray-400 text-sm whitespace-nowrap group-hover:text-zibiPrimary`}
                  >
                    خروج
                  </h2>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="hidden relative w-[326px] h-[129px] mt-6 rounded-lg self-center lg:block">
          <Image src={ImageBanner} layout="fill" />
        </div>
      </div>

      <div className="lg:w-4/6 lg:mt-[100px] desktop:w-full">{children}</div>

      <div className="fixed  bottom-0 left-0 right-0 grid grid-cols-5 items-center justify-between bg-white  py-2 shadow-card md:hidden">
        {mobileMenu.map((item) => {
          return (
            <Link href={item.link} key={item.id}>
              <span
                className={`flex flex-col col-span-1 items-center justify-center gap-y-1 p-0 rounded-full ${
                  router.pathname === item.link && ""
                }`}
              >
                <span
                  className={`text-2xl ${
                    item.id === 2 && "bg-zibiPrimary"
                  }  p-2 rounded-full ${
                    router.pathname === item.link && item.id !== 2
                      ? " text-zibiPrimary"
                      : item.id === 2
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                >
                  {item.icon}
                </span>
                <h2
                  className={`text-[10px]  whitespace-nowrap ${
                    router.pathname === item.link && item.id !== 2
                      ? "text-zibiPrimary"
                      : "text-gray-400"
                  }`}
                >
                  {item.title}
                </h2>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LayoutUser;
