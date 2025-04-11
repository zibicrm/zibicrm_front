import {
  MdAddLocation,
  MdArrowForward,
  MdLocationCity,
  MdOutlineAttachMoney,
  MdOutlineChat,
  MdSchedule,
} from "react-icons/md";
import PrimaryBtn from "../../../common/PrimaryBtn";
import AddEvent from "../../../Components/AddEvent";
import Modal from "../../../Components/Modal";
import Layout from "../../../Layout/Layout";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../Provider/AuthProvider";
import { useRouter } from "next/router";
import IconBox from "../../../Components/IconBox";
import { toast } from "react-toastify";
const Record = () => {
  const [add, setAdd] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const id = router.query.id;
  const name = router.query.name;
  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 3) {
      router.push("/");
    }
  }, [user, loading]);

  const iconBoxList = [
    {
      icon: (
        <div className="relative text-2xl rounded-full">
          <MdLocationCity />
          <span className="text-xs absolute top-0 -right-1">
            <MdAddLocation />
          </span>
        </div>
      ),
      text: "آدرس مطب",
      link: `/clinic/message/clinic/${id ? `?id=${id}&name=${name}` : ""}`,
      id: 0,
    },
    {
      icon: <MdOutlineAttachMoney />,
      text: " پیامک بیعانه",
      link: `/clinic/message/deposit/${id ? `?id=${id}&name=${name}` : ""}`,

      id: 1,
    },
  ];
  return (
    <Layout>
      <div className=" flex flex-col  h-full max-h-[calc(100vh-140px)]">
        <div className="bg-gray-50 px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <div className="flex w-full flex-row justify-between items-center">
            <h1 className="text-xl text-gray-900">ارسال پیامک</h1>
          </div>
        </div>
        <div className="flex flex-row h-full min-h-full max-h-full ">
          <div className="w-full h-full flex flex-row items-start gap-6 p-6">
            {iconBoxList.map((item) => (
              <IconBox
                key={item.id}
                icon={item.icon}
                text={item.text}
                link={item.link}
              />
            ))}
          </div>
        </div>
      </div>
      {add ? (
        <Modal setModal={() => {}}>
          <AddEvent setOpen={setAdd} userInfo={data} />
        </Modal>
      ) : null}
    </Layout>
  );
};

export default Record;
