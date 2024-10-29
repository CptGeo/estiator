import { ReactElement, useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { createSnapModifier, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { DraggableStory } from "../../components/DragNDrop/DraggableStory";

export default function TablesManagementPage(): ReactElement {

  return (
    <>
      <PageHeader
        heading="Tables management"
        subheading="Here you can manage your restaurant tables and layout"
      />
      <div className="w-full overflow-auto max-h-[400px] md:max-h-[650px]"> {/* !important rules because grid background needs a wrapper for the pattern to remain fixed to position */}
        <div className="relative h-[1500px] w-[1500px] overflow-hidden grid-bg z-0 justify-between bg-content2 rounded-large shadow-small">
          <Example />
        </div>
      </div>
    </>
  );
}

const Example = () => {
  const [gridSize] = useState(20);
  const gap = 1;

  const style = {
    alignItems: "flex-start"
  }

  const buttonStyle = {
    marginLeft: gridSize - 20 + gap,
    marginTop: gridSize - 20 + gap,
    width: gridSize * 5 - gap,
    height: gridSize * 4 - gap,
  };

  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);
  const activationConstraint = {
    delay: 250,
    tolerance: 5
  };

  return (
    <>
      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-success text-white"}
        defaultCoordinates={{ x: 200, y: 480 }}
        label={"A1"}
        style={style}
        key={"table-A1"}
        />
      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-success text-white"}
        defaultCoordinates={{ x: 200, y: 280 }}
        label={"A2"}
        style={style}
        key={"table-A2"}
        />

      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-success text-white"}
        defaultCoordinates={{ x: 200, y: 80 }}
        label={"A3"}
        style={style}
        key={"table-A3"}
        />

      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-success text-white"}
        defaultCoordinates={{ x: 200, y: -120 }}
        label={"A4"}
        style={style}
        key={"table-A4"}
      />

      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-danger text-white"}
        defaultCoordinates={{ x: 360, y: 160 }}
        label={"B1"}
        style={style}
        key={"table-B1"}
        />
      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-danger text-white"}
        defaultCoordinates={{ x: 360, y: -40 }}
        label={"B2"}
        style={style}
        key={"table-B2"}
        />

      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-danger text-white"}
        defaultCoordinates={{ x: 360, y: -240 }}
        label={"B3"}
        style={style}
        key={"table-B3"}
      />

      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-danger text-white"}
        defaultCoordinates={{ x: 360, y: -440 }}
        label={"B4"}
        style={style}
        key={"table-B4"}
      />

    <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-warning text-white"}
        defaultCoordinates={{ x: 520, y: -160 }}
        label={"C1"}
        style={style}
        key={"table-C1"}
        />
      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-warning text-white"}
        defaultCoordinates={{ x: 520, y: -360 }}
        label={"C2"}
        style={style}
        key={"table-C2"}
        />

      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-warning text-white"}
        defaultCoordinates={{ x: 520, y: -560 }}
        label={"C3"}
        style={style}
        key={"table-C3"}
      />
      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-secondary text-white"}
        defaultCoordinates={{ x: 680, y: -400 }}
        label={"D1"}
        style={style}
        key={"table-D1"}
        />
      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-secondary text-white"}
        defaultCoordinates={{ x: 680, y: -600 }}
        label={"D2"}
        style={style}
        key={"table-D2"}
        />

      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-secondary text-white"}
        defaultCoordinates={{ x: 680, y: -800 }}
        label={"D3"}
        style={style}
        key={"table-D3"}
      />

      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-success text-white"}
        defaultCoordinates={{ x: 1040, y: -1040 }}
        label={"Πίσω 1"}
        style={style}
        key={"table-back-1"}
      />

      <DraggableStory
        activationConstraint={activationConstraint}
        modifiers={[snapToGrid, restrictToFirstScrollableAncestor]}
        buttonStyle={buttonStyle}
        buttonClassName={"!bg-success text-white"}
        defaultCoordinates={{ x: 1040, y: -1020 }}
        label={"Πίσω 2"}
        style={style}
        key={"table-back-2"}
      />
    </>
  );
}