import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { IoPerson } from "react-icons/io5";
import {
  MdEventAvailable,
  MdHistory,
  MdNotifications,
  MdOutlineChevronLeft,
  MdOutlineDehaze,
} from "react-icons/md";
import { ImageFake, ImageLogo } from "../assets/Images";
import Search from "../Components/Search";
import { useAuth, useAuthActions } from "../Provider/AuthProvider";
import { getUnreadMessageService } from "../Services/messageService";
import { getEventByDataService } from "../Services/supplierService";
import { FaDollarSign } from "react-icons/fa";
import { IconBale, IconBaleBlackandWhite } from "../assets/Icons";
import { baleNotificationService } from "../Services/bale";
const Header = ({ setOpen, open }) => {
  const [data, setData] = useState();
  const [event, setEvent] = useState();
  const [baleNotification, setBaleNotification] = useState();
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const dropdownRef = useState(null);
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const fetcher = async () => {
    if (user && user.token && !loading) {
      await getUnreadMessageService({
        Authorization: "Bearer " + user.token,
      }).then((res) => {
        setData(res.data.result.unread_message);
      });
      await getEventByDataService({
        Authorization: "Bearer " + user.token,
      }).then((res) => {
        setEvent(res.data.result);
      });
      await baleNotificationService({
        Authorization: "Bearer " + user.token,
      }).then(({ data }) => {
        setBaleNotification(data.result);
      });
    }
  };
  useEffect(() => {
    fetcher();
  }, [user]);
  useEffect(() => {
    const interval = setInterval(() => {
      fetcher();
    }, 60000);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        baleNotificationService({
          Authorization: "Bearer " + user.token,
        }).then(({ data }) => {
          setBaleNotification(data.result);
        });
      }
    }, 60000);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [loading]);

  const notiHandler = () => {
    if (user.user.rule === 1) {
      router.push("/operator/message/conversation/");
    } else if (user.user.rule === 2) {
      router.push("/admin/message/conversation/");
    } else {
      router.push("/clinic/message/conversation/");
    }
  };
  const routerHandler = () => {
    if (user.user.rule === 1) {
      router.push("/operator/?ref=event");
    } else if (user.user.rule === 2) {
      router.push("/admin/?ref=event");
    } else {
      router.push("/clinic/?ref=event");
    }
  };

  return (
    <div className="flex bg-white flex-row items-center justify-between py-4 px-8 w-full h-full border-b border-gray-300">
      <div className="flex flex-row items-center gap-4">
        <button className="p-1" onClick={() => setOpen(!open)}>
          <MdOutlineDehaze />
        </button>
        <div className="h-full  flex items-center justify-center">
          <Image alt="zibident" src={ImageLogo} />
        </div>
        {router.pathname === "/admin" ||
        router.pathname === "/accounting" ||
        router.pathname === "/clinic" ||
        router.pathname === "/operator" ? null : (
          <div className="h-8 rounded-cs border border-gray-300 w-80">
            <Search
              font="text-sm"
              access={
                user && user.user && user.user.rule === 1
                  ? "operator"
                  : user && user.user && user.user.rule === 2
                  ? "admin"
                  : user &&
                    user.user &&
                    user.user.rule === 2 &&
                    user.user.accountant === 1
                  ? "accounting"
                  : user &&
                    user.user &&
                    user.user.rule === 3 &&
                    user.user.doctor !== 1
                  ? "clinic"
                  : "doctor"
              }
              mtop="top-10"
            />
          </div>
        )}
      </div>
      <div className="flex flex-row items-center gap-7">
        {user && user.user && user.user.rule === 2 && (
          <button
            onClick={() => {
              setShowNotificationDropdown(true);
            }}
            className=" bg-gray-50 text-gray-900 relative h-8 rounded-cs flex items-center text-2xl justify-center gap-x-1 px-1"
          >
            <Image
              src={IconBaleBlackandWhite}
              width={20}
              height={20}
              alt="bale"
            />
            {baleNotification && baleNotification.count > 0 && (
              <span className="absolute w-[18px] h-[18px] flex items-center justify-center text-white bg-red-500 text-[10px] -top-1 -right-1 rounded-full">
                <span className="mt-1">{baleNotification.count}</span>
              </span>
            )}
            {showNotificationDropdown && (
              <div
                ref={dropdownRef}
                className="absolute left-4 top-8 z-50 w-[250px] bg-white rounded-cs flex flex-col gap-y-2 px-2 py-2 shadow-[0px_0px_25px_0px_rgba(27,69,141,0.06)]"
              >
                {/* <div
                  onClick={() => router.push("/admin/bale/requests")}
                  className="flex items-center justify-between cursor-pointer whitespace-nowrap h-[30px] text-sm text-gray-500 hover:bg-primary-50 hover:text-gray-900 px-2 rounded-cs"
                >
                  <span>درخواست مشاوره جدید</span>
                  <span>{baleNotification.request}</span>
                </div>
                <div className="w-full h-[2px] bg-primary-50"></div> */}
                <div
                  onClick={() => router.push("/admin/bale/requests")}
                  className="flex items-center justify-between cursor-pointer whitespace-nowrap h-[30px] text-sm text-gray-500 hover:bg-primary-50 hover:text-gray-900 px-2 rounded-cs"
                >
                  <span>درخواست جدید</span>
                  <span>{baleNotification.count}</span>
                </div>
              </div>
            )}
          </button>
        )}
        {user && user.user && user.user.rule === 1 && (
          <button
            onClick={() => setShowNotificationDropdown(true)}
            className="bg-gray-50 text-gray-900 relative h-8 rounded-cs flex items-center text-2xl justify-center gap-x-1 px-1"
          >
            <Image
              src={IconBaleBlackandWhite}
              width={20}
              height={20}
              alt="bale"
            />
            {baleNotification &&
              baleNotification.count + baleNotification.request > 0 && (
                <span className="absolute w-[18px] h-[18px] flex items-center justify-center text-white bg-red-500 text-[10px] -top-1 -right-1 rounded-full">
                  <span className="mt-1">
                    {baleNotification.count + baleNotification.request}
                  </span>
                </span>
              )}
            {showNotificationDropdown && (
              <div
                ref={dropdownRef}
                className="absolute left-4 top-8 z-50 w-[250px] bg-white rounded-cs flex flex-col gap-y-2 px-2 py-2 shadow-[0px_0px_25px_0px_rgba(27,69,141,0.06)]"
              >
                <div
                  onClick={() => router.push("/operator/bale/conversation")}
                  className="flex items-center justify-between cursor-pointer whitespace-nowrap h-[30px] text-sm text-gray-500 hover:bg-primary-50 hover:text-gray-900 px-2 rounded-cs"
                >
                  <span>درخواست مشاوره جدید</span>
                  <span>{baleNotification.request}</span>
                </div>
                <div className="w-full h-[2px] bg-primary-50"></div>
                <div
                  onClick={() => {
                    router.push("/operator/bale/conversation");
                  }}
                  className="flex items-center justify-between cursor-pointer whitespace-nowrap h-[30px] text-sm text-gray-500 hover:bg-primary-50 hover:text-gray-900 px-2 rounded-cs"
                >
                  <span>پیام جدید</span>
                  <span>{baleNotification.count}</span>
                </div>
              </div>
            )}
          </button>
        )}
        <button
          onClick={routerHandler}
          className="bg-gray-50 text-gray-900 relative w-8 h-8 rounded-cs flex items-center text-2xl justify-center"
        >
          <MdEventAvailable />

          <span className="absolute  w-3 h-3 flex items-center justify-center  text-sm top-3 right-2.5 rounded-full  bg-white ">
            <MdHistory />
          </span>
          {event && event != 0 ? (
            <span className="absolute w-[18px] h-[18px] flex items-center justify-center text-white bg-red-500 text-[10px] -top-1 -right-1 rounded-full">
              <span className="mt-1">{event.length}</span>
            </span>
          ) : null}
        </button>
        {user && user.user && user.user.rule !== 3 && (
          <button
            onClick={notiHandler}
            className="bg-gray-50 text-gray-900 relative w-8 h-8 rounded-cs flex items-center text-2xl justify-center"
          >
            <MdNotifications />
            {data && data != 0 ? (
              <span className="absolute w-3 h-3 flex items-center justify-center text-white bg-red-500 text-[10px] top-0 right-0 rounded-full">
                <span className="mt-1">{data}</span>
              </span>
            ) : null}
          </button>
        )}
        {user && user.user && user.user.rule === 2 && user.user.id === 1 && (
          <button
            onClick={() => router.push("/admin/finance/patients-payments")}
            className="bg-gray-50 text-gray-900 relative h-8 rounded-cs flex items-center text-2xl justify-center gap-x-1 px-1"
          >
            <span className="text-sm mt-1">پرداختی بیماران</span>
            <FaDollarSign className="text-xl" />
          </button>
        )}

        <div className=" h-full flex items-center justify-center  min-w-fit">
          <div className="flex flex-row items-center min-w-fit gap-2 rounded-cs p-1">
            <div className="w-9 h-9 min-w-[36px] bg-gray-400 rounded-full flex items-center justify-center text-white min-h-[36px]">
              <IoPerson />
            </div>
            <span className="min-w-fit text-gray-900 text-sm">
              {user && user.user.first_name + " " + user.user.last_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
