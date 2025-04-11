import { MdClose } from "react-icons/md";
import { CloseBtn } from "../common/CloseBtn";
import OutlineBtn from "../common/OutlineBtn";
import PrimaryBtn from "../common/PrimaryBtn";
import Modal from "./Modal";

const DeleteWarning = ({
  deleteHandler,
  setState,
  title,
  text,
  status = 0,
}) => {
  return (
    <Modal>
      <div className="w-[400px] bg-white p-6">
        <div className="flex flex-row justify-between w-full  ">
          <h2 className="text-xl">{title}</h2>
          <button
            type="button"
            className="text-2xl"
            onClick={() => setState(-1)}
          >
            <MdClose />
          </button>
        </div>
        <p className="pt-6 pb-9 text-sm">{text}</p>
        <div className="flex flex-row items-center justify-between gap-6">
          <div className="w-full h-12">
            <OutlineBtn text="انصراف" onClick={() => setState(-1)} />
          </div>
          <div className="w-full h-12">
            <PrimaryBtn
              text="حذف"
              onClick={deleteHandler}
              status={status}
              disabled={status === 1}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteWarning;
