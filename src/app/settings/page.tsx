"use client";

import ActionSettings from "./account-settings";
import Header from "@kicka/components/header";
import Info from "./info";

export default function Settings() {
  return (
    <>
      <Header title="Settings" />
      <ActionSettings />
      <Info />
    </>
  );
}
