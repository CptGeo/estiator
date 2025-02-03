import { type ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import useQuerySettings from "@hooks/useQuerySettings";
import SettingsList from "@components/Settings/List";
import { isUndefined } from "@core/utils";
import Blank from "@components/Blank/Blank";
import HomeIcon from "@components/Icons/HomeIcon";

export default function SettingsPage(): ReactElement {
  const { data: settings } = useQuerySettings();

  return (
    <>
      <PageHeader
        heading="Settings"
        subheading="Manage your business details and preferences here."
      />
      {!isUndefined(settings) ? <SettingsList settings={settings} /> : <Blank title="Loading" icon={<HomeIcon />} />}
    </>
  );
}
