import Minicard from "./Minicard";
import useQueryTables from "@hooks/useQueryTables";
import { PeopleOutlineTwoTone } from "@mui/icons-material";

export default function TotalCapacity() {
    const { data: tablesCount } = useQueryTables<number>(3000, {}, { capacity: true });

    return <Minicard
        headline="Max occupancy"
        description={tablesCount}
        icon={<PeopleOutlineTwoTone fontSize="small" />}
        indicator={<p className="text-xs text-foreground-400">persons</p>}
    />;
}