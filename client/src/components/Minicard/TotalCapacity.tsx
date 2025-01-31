import Minicard from "./Minicard";
import TableIcon from "@components/Icons/TableIcon";
import useQueryTables from "@hooks/useQueryTables";

export default function TotalCapacity() {
    const { data: tablesCount } = useQueryTables<number>(3000, { params: { capacity: true } });

    return <Minicard
        headline="Total Capacity"
        description={tablesCount}
        icon={<TableIcon />}
    />;
}