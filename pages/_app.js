import "abortcontroller-polyfill/dist/polyfill-patch-fetch";

import { ToastContainer } from "react-toastify";
import AuthUserProvider from "../Provider/AuthProvider";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import PageProvider from "../Provider/ChagePage";
import AuthPatientProvider from "../Provider/PatientAuthProvider";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <PageProvider>
        <AuthUserProvider>
          <AuthPatientProvider>
            <ToastContainer
              position="bottom-right"
              theme="light"
              className="text-right"
              rtl={true}
            />
            <Component {...pageProps} />
          </AuthPatientProvider>
        </AuthUserProvider>
      </PageProvider>
    </>
  );
}

export default MyApp;
