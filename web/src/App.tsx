import React from "react";
import { AppShell } from "@mantine/core";
import { Landing } from "./components/Landing";

export const App: React.FC = () => {
  return (
    <AppShell padding={0}>
      <Landing />
    </AppShell>
  );
};
