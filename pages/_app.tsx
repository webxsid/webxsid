import "../styles/globals.scss";
import React, { FC } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
// * Import redux store
import { wrapper } from "@store/index";
import { Provider as StoreProvider } from "react-redux";
import ControlCenter from "@/components/control-center";
import ThemeWrapper from "@/components/ThemeWrapper";

const App: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <StoreProvider store={store}>
      <ThemeWrapper>
        <ToastContainer />
        <ControlCenter />
        <Component {...props.pageProps} />
      </ThemeWrapper>
    </StoreProvider>
  );
};

export default App;
