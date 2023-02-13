import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { theme, worker } from "./utils";
import { MantineProvider } from "@mantine/core";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";

worker.init();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </MantineProvider>
  </React.StrictMode>
);
