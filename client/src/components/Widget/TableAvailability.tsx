import { DonutChart } from "@components/DonutChart/DonutChart"
import type { TremorColor } from "@core/tremorTypes"
import type { Color } from "@core/types"
import { allRoutes, Routes } from "@core/utils"
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react"
import useQueryTables from "@hooks/useQueryTables"
import { Link } from "react-router-dom"

type ChartType = {
  name: string,
  amount: string | number,
  /**
   * @tutorial
   * Color[0] is `Chip` compatible
   * Color[1] is `Tremor Chart` compatible
   */
  colors: [Color, TremorColor];
};

export default function TableAvailabilityWidget() {

  const { data: tables } = useQueryTables(3000);

  const chartdata: ChartType[] = [
    {
      name: "Available",
      amount: tables ? tables.filter(table => !table.occupied).length : "-",
      colors: ["primary", "blue"],
    },
    {
      name: "Occupied",
      amount: tables ? tables.filter(table => table.occupied).length : "-",
      colors: ["warning", "amber"]
    }
  ]

  return <Card shadow="sm">
    <CardHeader className="flex flex-col items-start">
      <h4 className="text-foreground-500 font-bold">Table availability</h4>
      <p className="mt-0 text-xs text-slate-400">View the real-time occupied and available tables.</p>
    </CardHeader>
    <CardBody className="py-8 flex gap-5">
      <DonutChart
        className="mx-auto w-48 h-48"
        data={chartdata}
        category="name"
        value="amount"
        showLabel={true}
        colors={chartdata.map(item => item.colors[1])}
        valueFormatter={(number: number) => `${number.toString()} total`}
      />
      <div className="flex flex-row gap-2 justify-center">
        {chartdata.map(item => {
          return <Chip key={item.name} color={item.colors[0]} size="sm" variant="dot">{item.name}: {item.amount}</Chip>
        })}
      </div>
    </CardBody>
    <CardFooter>
      <small><Link className="text-primary px-1" to={allRoutes[Routes.TABLES]}>View tables management</Link></small>
    </CardFooter>
  </Card>

}