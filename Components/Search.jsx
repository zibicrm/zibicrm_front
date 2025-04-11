import { MdSearch } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { BsArrowUpRight } from "react-icons/bs";
import PrimaryBtn from "../common/PrimaryBtn";
import { searchRecordService } from "../Services/recordServices";
import { useAuth } from "../Provider/AuthProvider";
import PageLoading from "../utils/LoadingPage";
import { useRouter } from "next/router";

const Search = ({
  placeholder,
  access,
  font = "text-base",
  mtop = "top-14",
}) => {
  const [searchData, setSearchData] = useState([]);
  const [searchBox, setSearchBox] = useState(false);
  const [searchMessage,setSearchMessage] = useState('')
  const wrapperRef = useRef(null);
  const [value, setValue] = useState("");
  const [status, setstatus] = useState(0);
  const { user, loading } = useAuth();
  const router = useRouter();
  let typingTimer;
  let doneTypingInterval = 5000;

  const changeHandler = (e) => {
    if (e !== "") {
      searchRecordService(
        { statement: e },
        {
          Authorization: "Bearer " + user.token,
        }
      ).then(({ data }) => {
        setSearchMessage(data.message)
        setSearchData(data.result);
        setstatus(0);
      });
    }
  };
  const searchHandller = (e) => {
    setSearchBox(true);
    setValue(e.target.value);
    if (e.target.value === "") {
      setSearchData([]);
    }
    if (e.target.value !== "" && e.target.value.length >= 3) {
      setstatus(1);
      typingTimer = setTimeout(() => changeHandler(e.target.value), 1000);
    }
  };
  const keyDownHandler = (e) => {
    if (e.keyCode === 13) {
      changeHandler(value);
    } else {
      clearTimeout(typingTimer);
    }
  };
  useOutsideAlerter(wrapperRef);
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setSearchBox(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  return (
    <div
      ref={wrapperRef}
      className="flex flex-row items-center relative h-full w-full bg-primary-50 text-primary-500 rounded-cs"
    >
      <label htmlFor="SearchInput" className="px-2 text-2xl  cursor-text">
        <MdSearch />
      </label>
      <input
        id="SearchInput"
        type="text"
        className={`h-full w-full bg-primary-50 text-primary-500 placeholder:text-primary-500  rounded-cs outline-none ${font} `}
        placeholder={placeholder ? placeholder : "جست و جو کنید..."}
        onChange={searchHandller}
        onKeyDown={keyDownHandler}
        onKeyUp={() => clearTimeout(typingTimer)}
        value={value}
      />
      {searchBox && searchData && value !== "" && (
        <>
          {searchData.documents ? (
            <div
              className={`bg-white rounded-cs absolute search-suggest  w-full max-h-64 overflow-y-auto h-32  shadow-cs border ${mtop} border-primary-100 p-3 z-50`}
            >
              {searchData.documents.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    router.push(`/${access}/record/detail/?id=${item.id}`);
                    setSearchBox(false);
                     setValue("")
                  }}
                  className="w-full h-12 hover:bg-primary-50 hover:text-primary-900 rounded-cs p-4 text-sm cursor-pointer flex flex-row items-center justify-between"
                >
                  <div className="flex flex-row gap-2 items-center ">
                    <span>{item.name}</span>
                    <span className="border-x border-primary-500 px-1">
                      {item.tell}
                    </span>
                    <span>{item.document_id ? item.document_id : "-"}</span>
                  </div>
                  <div className="icon-search-suggest">
                    <BsArrowUpRight />
                  </div>
                </div>
              ))}
            </div>
          ) : status === 1 ? (
            <div
              className={`bg-white rounded-cs absolute search-suggest  w-full max-h-64 overflow-y-auto h-32  shadow-cs border ${mtop} border-primary-100 p-3 z-50`}
            >
              <PageLoading />
            </div>
          ) : value.length < 3 ? (
            <div
              className={`bg-white rounded-cs absolute search-suggest  w-full max-h-64 overflow-y-auto h-32  shadow-cs border ${mtop} border-primary-100 p-3 z-50`}
            >
              <span className="text-primary-500">حداقل ۳ کاراکتر </span>
            </div>
          ) : (
            <div
              className={`bg-white rounded-cs absolute search-suggest  w-full max-h-64 overflow-y-auto h-32  shadow-cs border ${mtop} border-primary-100 p-3 z-50`}
            >
              <span className="text-primary-500">{searchMessage}</span>
              <div className="h-12 w-24">
                <PrimaryBtn
                  text="تشکیل پرونده"
                  onClick={() =>
                    router.push(`/${access}/record/add/?tell=${value}`)
                  }
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
