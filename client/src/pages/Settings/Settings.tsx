import { type ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import SettingsList from "@components/Settings/List";

export default function SettingsPage(): ReactElement {

  return (
    <>
      <PageHeader
        heading="Settings"
        subheading="Manage your business details and preferences here."
      />
      <SettingsList />
    </>
  );
}
