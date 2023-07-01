import { AppShell } from "@mantine/core";
import React from "react";
import { Details } from "./components/Details";
import { Faqs } from "./components/Faqs";
import { Footer } from "./components/Footer";
import { Landing } from "./components/Landing";
import { Photos } from "./components/Photos";
import { Registry } from "./components/Registry";
import { Schedule } from "./components/Schedule";
import { Updates } from "./components/Updates";
import { analytics } from "./utils";

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
      <Footer />
    </AppShell>
  );
};
