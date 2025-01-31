import Minicard from "./Minicard";
import TableIcon from "@components/Icons/TableIcon";
import useQueryTables from "@hooks/useQueryTables";

export default function TotalCapacity() {
    const { data: tablesCount } = useQueryTables<number>(3000, { capacity: true });

    return <Minicard
        headline="Max occupancy"
        description={tablesCount}
        icon={<TableIcon />}
        indicator={<p className="text-xs text-foreground-400">persons</p>}
    />;
}