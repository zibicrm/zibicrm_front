import { MdSearch } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { BsArrowUpRight } from "react-icons/bs";
import PrimaryBtn from "../common/PrimaryBtn";
import { searchRecordService } from "../Services/recordServices";
import { useAuth } from "../Provider/AuthProvider";
import PageLoading from "../utils/LoadingPage";
import { useRouter } from "next/router";

const SearchInPatients = ({ setUser, access }) => {
  const [searchData, setSearchData] = useState([]);
  const [searchBox, setSearchBox] = useState(false);
  const [searchMessage,setSearchMessage] = useState('')
  const wrapperRef = useRef(null);
  const [value, setValue] = useState("");
  const [status, setstatus] = useState(0);
  const { user, loading } = useAuth();
  const router = useRouter();

  let typingTimer;
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
    if (e.target.value !== "" && e.target.value.length === 11) {
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
      className="flex flex-row items-center relative h-12 w-full bg-white border border-primary-500 text-gray-900 rounded-cs"
    >
      <label htmlFor="SearchInput" className="px-2 cursor-text">
        <MdSearch />
      </label>
      <input
        id="SearchInput"
        type="text"
        className="h-full w-full bg-white  placeholder:text-gray-900  text-sm rounded-cs outline-none"
        placeholder="نام بیمار"
        onChange={searchHandller}
        onKeyDown={keyDownHandler}
        onKeyUp={() => clearTimeout(typingTimer)}
        value={value}
      />
      {searchBox && searchData && value !== "" && (
        <>
          {searchData.documents ? (
            <div className="bg-white rounded-cs absolute search-suggest  w-full max-h-64 overflow-y-auto h-64  shadow-cs border top-14 border-primary-100 p-3 z-50">
              {searchData.documents.map((item) => (
                <div
                  key={item.id}
                  className="w-full h-12 hover:bg-primary-50 hover:text-primary-900 rounded-cs p-4 text-sm cursor-pointer flex flex-row items-center justify-between"
                  onClick={() => {
                    setUser(item);
                    setSearchBox(false);
                    setValue(item.name);
                  }}
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
            <div className="bg-white rounded-cs absolute flex flex-col justify-center items-center gap-4  w-full max-h-64 overflow-y-auto h-64  shadow-cs border top-14 border-primary-100 p-3 z-50">
              <PageLoading />
            </div>
          ) : value.length < 3 ? (
            <div className="bg-white rounded-cs absolute flex flex-col justify-center items-center gap-4  w-full max-h-64 overflow-y-auto h-64  shadow-cs border top-14 border-primary-100 p-3 z-50">
              <span className="text-primary-500">
                لطفا شماره تلفن را کامل وارد کنید
              </span>
            </div>
          ) : (
            <div className="bg-white rounded-cs absolute flex flex-col justify-center items-center gap-4  w-full max-h-64 overflow-y-auto h-64  shadow-cs border top-14 border-primary-100 p-3 z-50">
              <span className="text-primary-500 text-center">{searchMessage}</span>
              <div className="h-12 w-24">
                <PrimaryBtn
                  text="تشکیل پرونده"
                  onClick={() => router.push(`/${access}/record/add`)}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchInPatients;
