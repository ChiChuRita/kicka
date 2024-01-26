"use client";
import Info from "./info";
import ActionSettings from "./account-settings";

export default function Settings() {
  return (
    <>
      <h1>Settings</h1>
      <ActionSettings />
      <Info />
    </>
  );
}
