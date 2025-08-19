import React, { useMemo } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { reorderTodos, setFilter } from "../store/newTodoSlice";
import { useNewTodos } from "../hooks/useNewTodos";
import { NewTodoItem } from "./NewTodoItem";
import { NewAddTodo } from "./NewAddTodo";
import { NewTodoFilters } from "./NewTodoFilters";
import { NewProgressIndicator } from "./NewProgressIndicator";
import { useAppSelector } from "../hooks/redux";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export function NewTodoApp() {
  const { todos, loading, error, refetch } = useNewTodos();
  const dispatch = useDispatch<AppDispatch>();
  const { filter, searchQuery } = useAppSelector((state) => state.newTodo);
  const [activeId, setActiveId] = React.useState<number | null>(null);

  // Create filtered todos that respects both filter and search
  const filteredTodos = useMemo(() => {
    let filtered = [...todos];

    // Apply filter
    if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    } else if (filter === "incomplete") {
      filtered = filtered.filter((todo) => !todo.completed);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter((todo) =>
        todo.todo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by order
    return filtered.sort((a, b) => a.order - b.order);
  }, [todos, filter, searchQuery]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    console.log("🚀 NewTodoApp - Drag started:", event.active.id);
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log("🎯 NewTodoApp - Drag ended:", {
      activeId: active.id,
      overId: over?.id,
    });

    setActiveId(null);

    if (active.id !== over?.id && over?.id) {
      dispatch(
        reorderTodos({
          activeId: active.id as number,
          overId: over.id as number,
        })
      );
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Find the active item for the DragOverlay
  const activeItem = activeId
    ? filteredTodos.find((todo) => todo.id === activeId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Todo Master</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Organize your tasks efficiently with drag-and-drop functionality,
            smart filtering, and seamless synchronization. Built with TDD
            approach.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 animate-slide-up">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Something went wrong
                </h3>
                <p className="mt-1 text-sm text-red-700">{error?.toString()}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 animate-slide-up">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-blue-700">
                Loading todos from API...
              </span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          <NewAddTodo />
          <NewProgressIndicator />
          <NewTodoFilters />

          {/* Todo List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Todos
              </h2>
              <div className="text-sm text-gray-500">
                {filteredTodos.length} of {todos.length} shown
              </div>
            </div>

            {todos.length === 0 && !loading ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircleIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No todos yet
                </h3>
                <p>Create your first todo to get started!</p>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No todos match your current filter or search.</p>
                <button
                  onClick={() => dispatch(setFilter("all"))}
                  className="mt-2 text-blue-600 hover:text-blue-500 underline"
                >
                  View all todos
                </button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
              >
                <SortableContext
                  items={filteredTodos.map((todo) => todo.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {filteredTodos.map((todo) => (
                      <NewTodoItem key={todo.id} todo={todo} />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeItem ? (
                    <NewTodoItem todo={activeItem} isOverlay />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 animate-fade-in">
          <p className="text-sm">
            Built with React, Redux Toolkit, React Query, TypeScript, and
            Tailwind CSS
          </p>
          <p className="text-xs mt-2">
            Featuring drag-and-drop, comprehensive testing, and modern UX
            patterns
          </p>
        </footer>
      </div>
    </div>
  );
}
