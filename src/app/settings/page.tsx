import ActionSettings from "./account-settings";
import Header from "@kicka/components/header";
import Info from "./info";
import { getSession } from "@kicka/actions/auth";

export default async function Settings() {
  await getSession();

  return (
    <>
      <Header title="Settings" />
      <ActionSettings />
      <Info />
    </>
  );
}
