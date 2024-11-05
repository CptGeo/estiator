import { gridSize, gridItemMultiplierHeight, gridItemMultiplierWidth, gridItemGap } from "../../settings.json";

export default function GridTable({ color, label, capacity }: { color: string; label: string; capacity: number }) {
  const buttonStyle = {
    marginLeft: gridItemGap,
    marginRight: gridItemGap,
    marginTop: gridItemGap,
    marginBottom: gridItemGap,
    width: gridSize * gridItemMultiplierWidth - (gridItemGap * 2),
    height: gridSize * gridItemMultiplierHeight - (gridItemGap * 2)
  };
  return (
    <button
      type="button"
      style={buttonStyle}
      className={`rounded-md flex flex-col items-center text-default-50 relative w-[100px] h-[100px] ${color}`}>
      <p className="text-xs top-1 relative">Τραπέζι</p>
      <p className="text-xl font-bold top-[50%] -translate-y-full relative drop-shadow-lg">{label}</p>
      <p className="text-[12px] w-full text-right inline-block drop-shadow-lg absolute right-0 bottom-0 pr-1">Άτομα: {!isNaN(capacity) ? capacity : 0}</p>
    </button>
  )
}