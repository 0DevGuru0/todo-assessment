import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../hooks/redux";
import { setFilter, setSearchQuery } from "../store/newTodoSlice";
import type { AppDispatch } from "../store";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const NewTodoFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filter, searchQuery, todos } = useAppSelector((state) => state.newTodo);

  const handleFilterChange = (newFilter: 'all' | 'completed' | 'incomplete') => {
    dispatch(setFilter(newFilter));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const clearSearch = () => {
    dispatch(setSearchQuery(""));
  };

  // Calculate counts for filtering (before search is applied)
  const completedCount = todos.filter((todo) => todo.completed).length;
  const incompleteCount = todos.filter((todo) => !todo.completed).length;

  // Apply filtering and searching for display
  const getFilteredTodos = () => {
    let filtered = [...todos];
    
    // Apply filter
    if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    } else if (filter === 'incomplete') {
      filtered = filtered.filter(todo => !todo.completed);
    }
    
    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(todo => 
        todo.todo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredTodos = getFilteredTodos();

  const filterButtons: { value: 'all' | 'completed' | 'incomplete'; label: string; count: number }[] = [
    { value: "all", label: "All", count: todos.length },
    { value: "incomplete", label: "Active", count: incompleteCount },
    { value: "completed", label: "Completed", count: completedCount },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 space-y-4 animate-slide-up">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search todos..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ value, label, count }) => (
          <button
            key={value}
            onClick={() => handleFilterChange(value)}
            className={`
              inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                filter === value
                  ? "bg-blue-100 text-blue-800 ring-2 ring-blue-500 ring-opacity-50"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {label}
            <span
              className={`
                ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                ${
                  filter === value
                    ? "bg-blue-200 text-blue-800"
                    : "bg-gray-200 text-gray-600"
                }
              `}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-gray-600 animate-fade-in">
          {filteredTodos.length > 0 ? (
            <span>
              Found <strong>{filteredTodos.length}</strong> todo
              {filteredTodos.length !== 1 ? "s" : ""} matching "{searchQuery}"
            </span>
          ) : (
            <span>No todos found matching "{searchQuery}"</span>
          )}
        </div>
      )}
    </div>
  );
};
