import { MantineProvider } from "@mantine/core";
import { Profiler } from "@sentry/react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import calendar from "dayjs/plugin/calendar";
import utc from "dayjs/plugin/utc";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./index.css";
import { store } from "./store";
import { sentry, theme, worker } from "./utils";

sentry.init();
worker.init();

dayjs.extend(utc);
dayjs.extend(calendar);
dayjs.extend(advancedFormat);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <Profiler name="App">
            <App />
          </Profiler>
        </BrowserRouter>
      </ReduxProvider>
    </MantineProvider>
  </React.StrictMode>
);
