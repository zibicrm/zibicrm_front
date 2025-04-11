import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import Select from "react-select";

const SearchBox = ({
  isState,
  placeholder,
  changeHandler,
  setFilteredData,
  allData,
  status = 0,
  tab = 0,
}) => {
  const [value, setValue] = useState("");
  let typingTimer;
  let doneTypingInterval = 5000;
  const searchHandller = (e) => {
    setValue(e.target.value);
    if (!isState) {
      if (e.target.value !== "" && e.target.value.length >= 3) {
        typingTimer = setTimeout(() => changeHandler(e.target.value), 1000);
      } else {
        setFilteredData(allData);
      }
    } else {
      changeHandler(e.target.value.toLowerCase());
    }
  };
  const keyDownHandler = (e) => {
    if (e.keyCode === 13) {
      changeHandler(value);
    } else {
      clearTimeout(typingTimer);
    }
  };
  useEffect(() => {
    setValue("");
  }, [tab]);
  return (
    <div className="flex flex-row items-center h-12 w-full ">
      <div className="flex flex-row items-center h-full w-full bg-primary-50 text-primary-500 rounded-cs">
        <div className="w-10 ">
          {status === 0 ? (
            <label
              htmlFor="SearchInput"
              className="text-2xl cursor-text px-2 block"
            >
              <MdSearch />
            </label>
          ) : (
            <div className="mx-2 w-7 h-7  bg-gradient-to-r from-primary-700 to-white animate-spin rounded-full flex items-center justify-center">
              <div className="w-[90%] h-[90%] bg-gray-100 rounded-full"></div>
            </div>
          )}
        </div>
        <input
          id="SearchInput"
          type="text"
          className="h-full bg-primary-50 text-primary-500 rounded-cs placeholder:text-primary-500 text-sm outline-none w-full"
          placeholder={placeholder ? placeholder : "جست و جو کنید..."}
          value={value}
          onChange={searchHandller}
          onKeyDown={keyDownHandler}
          onKeyUp={() => clearTimeout(typingTimer)}
        />
      </div>
    </div>
  );
};

export default SearchBox;
