import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { sentry, theme, worker } from "./utils";
import { MantineProvider } from "@mantine/core";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Profiler } from "@sentry/react";

sentry.init();
worker.init();

dayjs.extend(advancedFormat);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <ReduxProvider store={store}>
        <Profiler name="App">
          <App />
        </Profiler>
      </ReduxProvider>
    </MantineProvider>
  </React.StrictMode>
);
