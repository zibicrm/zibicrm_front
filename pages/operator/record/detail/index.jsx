import {
  MdArrowForward,
  MdChatBubbleOutline,
  MdOutlineAssignmentInd,
  MdOutlineChat,
  MdOutlineLibraryBooks,
} from "react-icons/md";
import Layout from "../../../../Layout/Layout";
import React, { useState, useEffect } from "react";
import { getRecordService } from "../../../../Services/recordServices";
import { useAuth, useAuthActions } from "../../../../Provider/AuthProvider";
import { useRouter } from "next/router";
import IconBox from "../../../../Components/IconBox";
import { toast } from "react-toastify";
import PageLoading from "../../../../utils/LoadingPage";
import { EventsRender } from "../../../../Components/EventsRender";

const Record = () => {
  const [data, setData] = useState(null);
  const { user, loading } = useAuth();
  const router = useRouter();
  const id = router.query.id;
  const userDispatch = useAuthActions();
  const getData = async () => {
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

  useEffect(() => {
    if (user && !loading && id) {
      getData();
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 1) {
      router.push("/");
    }
  }, [user, loading, id]);

  const iconBoxList = [
    {
      icon: <MdOutlineLibraryBooks />,
      text: "اطلاعات پرونده ",
      link: `/operator/record/detail/edit/?id=${id}`,
      id: 0,
    },
    {
      icon: <MdOutlineAssignmentInd />,
      text: "پرونده پزشکی",
      link: `/operator/record/detail/medical/?id=${id}`,

      id: 1,
    },
    {
      icon: <MdOutlineChat />,
      text: "گفت و گو ها",
      link: `/operator/message/conversation/?id=${id}`,
      id: 3,
    },
    {
      icon: <MdChatBubbleOutline />,
      text: "ارسال پیامک",
      link: `/operator/message/?id=${id}&name=${data && data.name}`,
      id: 5,
    },
  ];
  if (!data || !data.name) return <PageLoading />;
  return (
    <Layout>
      <div className=" flex flex-col  h-full max-h-[calc(100vh-140px)]">
        <div className="bg-gray-50 px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <div className="flex w-full flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-2xl"
                type="button"
              >
                <MdArrowForward />
              </button>
              <h1 className="text-xl text-gray-900">
                پرونده {data && data.name && data.name}
              </h1>
            </div>
            <div className="text-sm text-gray-900">
              کارشناس :
              {data &&
                data.user &&
                data.user &&
                data.user.first_name + " " + data.user.last_name}
            </div>
          </div>
        </div>
        <div className="flex flex-row h-full min-h-full max-h-full ">
          <div className="w-8/12 h-full flex flex-row items-start gap-6 p-6">
            {iconBoxList.map((item) => (
              <IconBox
                key={item.id}
                icon={item.icon}
                text={item.text}
                link={item.link}
              />
            ))}
          </div>
          <div className="w-4/12 py-4 border-r border-gray-200  overflow-y-auto px-6 flex flex-col overflow-auto min-h-full gap-4 ">
            <EventsRender data={data} getData={() => null} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Record;
