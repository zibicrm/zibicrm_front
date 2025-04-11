import { Disclosure } from "@headlessui/react";
import Image from "next/image";
import Router from "next/router";
import React from "react";
import { MdArrowDropDown } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { useAuth, useAuthActions } from "../Provider/AuthProvider";
import Link from "next/link";
import { useSelect, useSelectActions } from "../Provider/ChagePage";
import {
  AccountingAccess,
  AdminAccess,
  ClinicAccess,
  DoctorAccess,
  OperatorAccess,
  SuperAdminAccess,
} from "../data/SidebarOption";
import { IconBale, IconBaleBlackandWhite } from "../assets/Icons";

const Sidebar = ({}) => {
  const { user, loading } = useAuth();
  const userDispatch = useAuthActions();
  const { select } = useSelect();
  const dispatcher = useSelectActions();
  const setSelect = (id) => {
    dispatcher({
      type: "CHANGE",
      payload: id,
    });
  };

  const sidebarOption =
    user && user.user && user.user.rule === 1
      ? OperatorAccess
      : user &&
        user.user &&
        user.user.rule === 2 &&
        user.user.id !== 1 &&
        user.user.id !== 24 &&
        user.user.accountant !== 1
      ? AdminAccess
      : user &&
        user.user &&
        user.user.rule === 2 &&
        user.user.id === 1 &&
        user.user.accountant !== 1
      ? SuperAdminAccess
      : user &&
        user.user &&
        user.user.rule === 2 &&
        user.user.id === 24 &&
        user.user.accountant !== 1
      ? SuperAdminAccess
      : user && user.user && user.user.rule === 2 && user.user.accountant === 1
      ? AccountingAccess
      : user && user.user && user.user.rule === 3 && user.user.doctor !== 1
      ? ClinicAccess
      : user && user.user && user.user.rule === 3 && user.user.doctor === 1
      ? DoctorAccess
      : null;


  return (
    <div className="h-full bg-white flex flex-col items-start w-60 border-l border-gray-200 min-h-full max-h-screen overflow-y-auto">
      {sidebarOption &&
        sidebarOption.map((item, index) => {
          return (
            <div key={index} className="w-full">
              <button
                className={`text-2xl flex flex-row items-center justify-between gap-3 px-4 py-2 hover:bg-primary-50 w-full ${
                  item.id === select && item.icon !== 'bale' && "text-primary-900 primary-svg"
                }`}
                onClick={() => {
                  if (item.link) {
                    Router.push(item.link);
                  } else if (select === item.id) {
                    setSelect(null);
                  } else {
                    setSelect(item.id);
                  }
                }}
              >
                <div
                  className={`flex text-gray-900 flex-row items-center gap-3 text-[13px]`}
                >
                  <div className={`text-xl ${item.icon === 'bale' && 'mt-[0px]'}`}>{item.icon === 'bale' ? <Image src={IconBaleBlackandWhite} alt="bale" className="" width={20} height={20} /> : item.icon}</div>
                  <span className={`${item.icon === 'bale' && 'mb-[6px]'}`}>{item.label}</span>
                </div>
                {item.child.length > 0 ? (
                  <span
                    className={`text-gray-900 ${
                      select === item.id && "rotate-180"
                    }`}
                  >
                    <MdArrowDropDown />
                  </span>
                ) : null}
              </button>
              {select === item.id && item.child.length > 0 && (
                <ul
                  className="list-disc w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.child.map((c, i, row) => {
                    if (i + 1 === row.length) {
                      return (
                        <Link key={i} href={c.link}>
                          <li
                            className={` relative cursor-pointer w-full flex flex-row items-center gap-4 px-6 h-10 hover:bg-primary-50 ${
                              Router.pathname === c.link && "text-primary-900"
                            }`}
                          >
                            <span
                              className={`w-2 h-2  rounded-cs z-[5] ${
                                Router.pathname === c.link
                                  ? "bg-primary-900"
                                  : "bg-primary-200"
                              }`}
                            ></span>
                            <p className="text-gray-900 text-[11px]">
                              {c.label}
                            </p>
                          </li>
                        </Link>
                      );
                    } else {
                      return (
                        <Link key={i} href={c.link}>
                          <li
                            className={`text-2xl relative cursor-pointer w-full flex flex-row items-center gap-4 px-6 h-10 hover:bg-primary-50 ${
                              Router.pathname === c.link && "text-primary-900 "
                            }`}
                          >
                            <span
                              className={`w-2 h-2  rounded-cs z-[5] ${
                                Router.pathname === c.link
                                  ? "bg-primary-900"
                                  : "bg-primary-200"
                              }`}
                            ></span>
                            <p className="text-[11px] text-gray-900">
                              {c.label}
                            </p>
                            <div className="absolute z-[4] h-full bg-primary-200 w-[1px] top-5 right-[1.72rem]"></div>
                          </li>
                        </Link>
                      );
                    }
                  })}
                </ul>
              )}
            </div>
          );
        })}
      <button
        className={`text-2xl flex flex-row items-center justify-between gap-3 px-4 py-2 hover:bg-primary-50 w-full`}
        onClick={() => {
          userDispatch({
            type: "LOGOUT",
            payload: { Authorization: "Bearer " + user.token },
          });
        }}
      >
        <div
          className={`flex flex-row items-center text-gray-900 gap-3 text-[13px]`}
        >
          <div className="text-xl">
            <AiOutlineLogout />
          </div>
          <span>خروج</span>
        </div>
      </button>
    </div>
  );
};

export default Sidebar;
