import type { Component } from "solid-js";

interface SortableItemProps {
  id: string;
  label: string;
  index: number;
  isActive: boolean;
  dragState: { from: number | null; over: number | null };
  onActive: (id: string) => void;
  onRemove: (id: string) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
}

export const SortableItem: Component<SortableItemProps> = (props) => {
  const isDragging = () => props.dragState.from === props.index;
  const isOver = () =>
    props.dragState.over === props.index &&
    props.dragState.from !== props.index;

  return (
    <div
      draggable={true}
      class={`flex cursor-grab items-center justify-between rounded-sm border px-2.5 py-1 text-sm transition-all active:cursor-grabbing ${
        props.isActive
          ? "border-accent bg-accent text-content-inverse"
          : "border-outline-light bg-[#fbfbfb] hover:bg-gray-100"
      } ${isDragging() ? "border-dashed opacity-50" : ""} ${
        isOver() ? "scale-[1.01] transform ring-2 ring-accent/50" : ""
      }`}
      onclick={() => props.onActive(props.id)}
      ondragstart={(e) => {
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
        props.onDragStart(props.index);
      }}
      ondragover={(e) => {
        e.preventDefault();
        props.onDragOver(props.index);
      }}
      ondrop={(e) => {
        e.preventDefault();
        props.onDrop(props.index);
      }}
      ondragend={props.onDragEnd}
    >
      <span>{props.label}</span>
      <button
        type="button"
        class={`text-xs hover:text-red-500 ${props.isActive ? "text-content-inverse" : "text-content"}`}
        onclick={(e) => {
          e.stopPropagation();
          props.onRemove(props.id);
        }}
      >
        ✕
      </button>
    </div>
  );
};
