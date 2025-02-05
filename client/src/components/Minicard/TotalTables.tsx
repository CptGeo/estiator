import Minicard from "./Minicard";
import TableIcon from "@components/Icons/TableIcon";
import useQueryTables from "@hooks/useQueryTables";

export default function TotalTables() {
    const { data: count } = useQueryTables<number>(3000, {}, { count: true } );

    return <Minicard
        headline="Total Tables"
        description={count}
        icon={<TableIcon />}
        indicator={<p className="text-xs text-foreground-400">tables</p>}
    />;
}