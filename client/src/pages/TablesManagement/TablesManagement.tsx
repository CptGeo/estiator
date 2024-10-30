import { ReactElement } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import GridWrapper from "../../components/Grid/GridWrapper";
import TablesGrid from "../../components/TablesGrid/TablesGrid";
import config from "../../settings.json";

const GRID_SIZE = config.gridSize;

export default function TablesManagementPage(): ReactElement {
  return (
    <>
      <PageHeader
        heading="Tables management"
        subheading="Here you can manage your restaurant tables and layout"
      />
      <GridWrapper size={GRID_SIZE}>
        <TablesGrid size={GRID_SIZE}/>
      </GridWrapper>
    </>
  );
}