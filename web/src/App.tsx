import React from "react";
import { AppShell } from "@mantine/core";
import { Landing } from "./components/Landing";
import { Details } from "./components/Details";
import { Schedule } from "./components/Schedule";
import { Footer } from "./components/Footer";
import { CountDown } from "./components/CountDown";
import { analytics } from "./utils";
import { Updates } from "./components/Updates";
import { Registry } from "./components/Registry";
import { Faqs } from "./components/Faqs";
import { Photos } from "./components/Photos";

analytics.init();

export const App: React.FC = () => {
  return (
    <AppShell padding={0}>
      <Landing />
      <Details />
      <Updates />
      <Schedule />
      <Photos />
      <Faqs />
      <Registry />
      <CountDown />
      <Footer />
    </AppShell>
  );
};
