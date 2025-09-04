import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TodoWithOrder } from "../types/todo";
import { PresentationalTodoItem } from "./PresentationalTodoItem";

interface NewTodoItemProps {
  todo: TodoWithOrder;
  isOverlay?: boolean;
}

export function NewTodoItem({ todo, isOverlay = false }: NewTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <PresentationalTodoItem
      ref={setNodeRef}
      style={style}
      todo={todo}
      isDragging={isDragging}
      isOverlay={isOverlay}
      dragHandleProps={{ ...attributes, ...listeners }}
    />
  );
}
