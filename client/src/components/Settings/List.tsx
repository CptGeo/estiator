import { Tabs, Tab } from "@heroui/react";
import BusinessSettings from "./Business";
import useQuerySettings from "@hooks/useQuerySettings";
import Loading from "@components/Loading/Loading";
import DataVisualizationSettings from "./DataVisualization";

export default function SettingsList() {
  const { data: settings } = useQuerySettings();

  if (!settings) {
    return <Loading />;
  }

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        <Tab key="business" title="Preferences">
          <BusinessSettings settings={settings} />
        </Tab>
        <Tab key="dataVisualization" title="Data Visualization">
          <DataVisualizationSettings settings={settings} />
        </Tab>
      </Tabs>
    </div>
  )
}