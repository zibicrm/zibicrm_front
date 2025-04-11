import Link from "next/link";

const IconBox = ({ text, icon, onClick, link }) => {
  return (
    <Link href={link}>
      <button
        className=" w-[160px] py-5 border iconBox  border-none bg-white primary-svg shadow-cs rounded-cs  hover:shadow-btn  cursor-pointer flex flex-col items-center gap-4  hoverSvg-svg text-primary-900"
        onClick={onClick}
      >
        <div className=" bg-primary-50 rounded-full w-12 h-12 text-primary-900 text-2xl flex items-center justify-center duration-300 ">
          {icon}
        </div>
        <span className=" text-sm ">{text}</span>
      </button>
    </Link>
  );
};

export default IconBox;
