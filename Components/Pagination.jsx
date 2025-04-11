import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

const Pagination = ({ recordsCount, setPage, count, page }) => {
  return (
    <div
      className={`border-t border-primary-900 flex flex-row  items-center pt-7 px-8 ${
        recordsCount && count >= 0 ? "justify-between" : "justify-center"
      }`}
    >
      {recordsCount ? <div></div> : null}
      <div className="flex justify-center ltr">
        <nav aria-label="Page navigation example ">
          <ul className="flex list-style-none text-sm">
            <li className="page-item">
              <button
                className="page-link relative flex items-center justify-center py-1.5 px-2.5 h-9 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:bg-primary-900 hover:text-white focus:shadow-none"
                aria-label="Previous"
                onClick={() => (page < 1 ? null : setPage(page - 1))}
              >
                <span aria-hidden="true">
                  <MdOutlineChevronLeft />
                </span>
              </button>
            </li>
            <li className="page-item flex items-center justify-center">
              <button
                onClick={() => setPage(1)}
                className="page-link  relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              >
                1
              </button>
            </li>
            <li className="page-item flex items-center justify-center">
              <button
                onClick={() => setPage(2)}
                className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              >
                2
              </button>
            </li>
            <li className="page-item flex items-center justify-center">
              <button
                onClick={() => (page >= 5 ? null : setPage(3))}
                className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              >
                {page >= 5 ? "..." : "3"}
              </button>
            </li>
            {page >= 5 ? (
              <li className="page-item flex items-center justify-center">
                <button className="page-link relative block py-1.5 px-3 bg-primary-300 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none">
                  {page}
                </button>
              </li>
            ) : null}
            {page >= 5 ? (
              <li className="page-item flex items-center justify-center">
                <button
                  onClick={() => (page >= 5 ? null : setPage(4))}
                  className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                >
                  {page >= 5 ? "..." : "4"}
                </button>
              </li>
            ) : null}

            <li className="page-item flex items-center justify-center">
              <button
                onClick={() => (page >= 5 ? setPage(page + 1) : setPage(4))}
                className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              >
                {page >= 5 ? page + 1 : "4"}
              </button>
            </li>
            <li className="page-item flex items-center justify-center">
              <button
                onClick={() => (page >= 5 ? setPage(page + 2) : setPage(5))}
                className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              >
                {page >= 5 ? page + 2 : "5"}
              </button>
            </li>
            <li className="page-item flex items-center justify-center">
              <button
                className="page-link relative flex items-center justify-center py-1.5 px-2.5 h-9 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:bg-primary-900 hover:text-white focus:shadow-none"
                aria-label="Next"
                onClick={() => setPage(page + 1)}
              >
                <span aria-hidden="true">
                  <MdOutlineChevronRight />
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {recordsCount > 0 && (
        <span className="text-xs text-gary-500">
          {" " + recordsCount + " "} از {" " + count + " "}
          رکورد
        </span>
      )}
    </div>
  );
};

export default Pagination;
