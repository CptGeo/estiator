import type { ReactElement } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import TablesGrid from "@components/TablesGrid/TablesGrid";
import config from "@settings";
import TablesProvider from "@context/Tables";

const GRID_SIZE = config.gridSize;

export default function TablesManagementPage(): ReactElement {
  return (
    <TablesProvider>
      <PageHeader
        heading="Tables management"
        subheading="Here you can manage your restaurant tables and layout"
      />
      <TablesGrid size={GRID_SIZE}/>
    </TablesProvider>
  );
}