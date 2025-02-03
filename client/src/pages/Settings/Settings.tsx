import { type ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import useQuerySettings from "@hooks/useQuerySettings";
import SettingsList from "@components/Settings/List";
import { isUndefined } from "@core/utils";
import Loading from "@components/Loading/Loading";

export default function SettingsPage(): ReactElement {
  const { data: settings } = useQuerySettings();

  return (
    <>
      <PageHeader
        heading="Settings"
        subheading="Manage your business details and preferences here."
      />
      {!isUndefined(settings) ? <SettingsList settings={settings} /> : <Loading />}
    </>
  );
}
