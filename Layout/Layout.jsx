import React, { Children, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [openSidebar, setOpenSidebar] = useState(true);
  return (
    <main className="flex flex-col items-center w-full h-full min-h-screen ">
      <Header open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-row items-start justify-start w-full h-[calc(100vh-85px)]">
        {openSidebar ? <Sidebar /> : null}
        <div
          className={` max-h-full bg-white overflow-y-auto h-[calc(100vh-85px)] z-10 ${
            openSidebar ? "w-[calc(100vw-240px)]" : "w-[100vw]"
          }`}
        >
          {children}
        </div>
      </div>
    </main>
  );
};

export default Layout;
