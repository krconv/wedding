import React from "react";
import { AppShell } from "@mantine/core";
import { Landing } from "./components/Landing";
import { Details } from "./components/Details";
import { Schedule } from "./components/Schedule";
import { Footer } from "./components/Footer";
import { CountDown } from "./components/CountDown";
import { analytics } from "./utils";

analytics.init();

export const App: React.FC = () => {
  return (
    <AppShell padding={0}>
      <Landing />
      <Details />
      <Schedule />
      <CountDown />
      <Footer />
    </AppShell>
  );
};
