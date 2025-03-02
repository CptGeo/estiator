import { useCallback } from "react";
import type { CSSProperties, ReactElement } from "react";
import { isUndefined, normalize } from "@core/utils";
import { Spinner } from "@heroui/react";
import type { TableData } from "@core/types";
import { GridTableReadonly } from "@components/Grid/GridTableReadonly";
import React from "react";
import { Controller } from "react-hook-form";

type Props = {
  name: string,
  size: number;
  isRequired?: boolean;
  tables: TableData[] | undefined;
}

export default function TablesGridSelect(props: Props): ReactElement {
  const { size, tables, name, isRequired } = props;

  const getNormalizedTable = useCallback((data: TableData[] | null | undefined) => normalize<TableData>(data), [tables]);
  const data = getNormalizedTable(tables);

  if (!tables) {
    return <Spinner />;
  }

  return (
    <Controller
    rules={{ required: isRequired}}
    name={name}
    render={({ field: { onChange, value } }) => (
        <div className="flex flex-col gap-4">
        {!isUndefined(tables) ?
          <div className="relative grid-outer-bg rounded-large w-full overflow-auto max-h-[300px] md:max-h-[450px]">
            <div
              style={{ "--grid-size": `${size}px` } as CSSProperties}
              className="relative h-[1500px] w-[1500px] overflow-hidden grid-bg z-0 justify-between bg-content2 shadow-inner">
              {data && Object.entries(data).map(([key]) => {
                return data[key] && (
                  <React.Fragment key={key}>
                    <GridTableReadonly value={data[key]} onPress={onChange} selectedId={value} />
                  </React.Fragment>
                );
              })}
            </div>
          </div> : <div className="p-4 w-full flex justify-center"><Spinner /></div>}
      </div>
    )}
/>
  )
}