import moment from "moment-timezone";
import Image from "next/image";
import { MdOutlineAssignmentInd, MdSend } from "react-icons/md";
import { ImageFake } from "../assets/Images";
import PrimaryBtn from "../common/PrimaryBtn";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../Provider/AuthProvider";
import {
  answerMessageService,
  ReadMessageService,
} from "../Services/messageService";
import { toast } from "react-toastify";
import Link from "next/link";

const ChatConversation = ({ data, answer, access }) => {
  const router = useRouter();
  const scrollDown = useRef(null);
  const [value, setValue] = useState("");
  const [length, setLength] = useState(0);
  const [now, setNow] = useState(0);
  const { user, loading } = useAuth();


  useEffect(() => {
    scrollDown.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
    if (data) {
      ReadMessageService(
        { document_id: data[0].document[0].id },
        { Authorization: "Bearer " + user.token }
      ).then(({ data }) => null);
    }
  }, [data]);
  return (
    <div>
      <div className="bg-white absolute top-0 w-full px-6 flex flex-row items-center justify-between h-20">
        <div className="flex flex-row items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <Image src={ImageFake} alt="logo" />
          </div>
          <div className="flex items-start flex-col gap-2">
            <span className="text-xs">
              {data &&
                data[0] &&
                data[0].document[0] &&
                data[0].document[0].name}
            </span>
            <span className="text-xs text-textGray">
              {data && data.length > 0 && data[data.length - 1].tell}
            </span>
          </div>
        </div>
        <div>
          <div className="w-36 h-12">
            <Link href={`/${access}/record/detail/?id=${data[0].document_id}`}>
              <a target="_blank" rel="noreferrer">
                <PrimaryBtn>
                  <div className="flex flex-row items-center gap-2">
                    <MdOutlineAssignmentInd />
                    <span className="text-base text-white">پرونده پزشکی</span>
                  </div>
                </PrimaryBtn>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="h-full pt-24 text-gray-900 px-8 min-h-[calc(100vh-190px)]  max-h-[calc(100vh-190px)] overflow-y-auto scrollbar-none flex flex-col gap-4">
        {data &&
          data.map((item) => {
            return (
              <>
                {item.destination == 982100022 ? (
                  <div className=" w-full  flex flex-col items-end">
                    <div className="bg-gray-400 bg-opacity-10 rounded-r-cs leading-6 text-xs rounded-bl-cs p-2 max-w-[230px]">
                      {item.message}
                    </div>
                    <span className="text-[10px] ">
                      {item &&
                        moment(item.created_at)
                          .tz("Asia/Tehran")
                          .format("HH:mm")}
                    </span>
                  </div>
                ) : (
                  <div className=" w-full  max-w-fit flex flex-col items-start">
                    <div className="bg-primary-50 rounded-l-cs leading-6 text-xs rounded-br-cs p-2 max-w-[270px]">
                      {item.message}
                    </div>
                    <span className="text-[10px] ">
                      {item &&
                        moment(item.created_at)
                          .tz("Asia/Tehran")
                          .format("HH:mm")}
                    </span>
                  </div>
                )}
              </>
            );
          })}

        <div ref={scrollDown}></div>
      </div>
      <div className=" bottom-5 h-fit rounded-cs flex flex-row items-end gap-2 mx-8 ">
        <ReactTextareaAutosize
          maxRows={3}
          placeholder="پیام"
          className=" w-full text-gray-900 break-words py-[11px] bg-white border border-primary rounded-cs  px-3 outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          onClick={() => {
            answer(data[0].document_id, value);
            setValue("");
          }}
          className="bg-primary-900 flex items-center justify-center rounded-cs w-12 h-12 text-2xl text-white rotate-180"
        >
          <MdSend />
        </button>
      </div>
    </div>
  );
};

export default ChatConversation;
