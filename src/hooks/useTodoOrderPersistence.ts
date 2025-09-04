import { useEffect, useCallback } from 'react';
import { useAppSelector } from './redux';
import type { Todo, TodoWithOrder } from '../types/todo';

const STORAGE_KEY = 'todoOrder';

export interface TodoOrderItem {
  id: number;
  order: number;
}

export const useTodoOrderPersistence = () => {
  const todos = useAppSelector((state) => state.newTodo.todos);

  // Save order to localStorage whenever todos change
  useEffect(() => {
    if (todos.length > 0) {
      const orderMap: TodoOrderItem[] = todos.map(todo => ({
        id: todo.id,
        order: todo.order
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orderMap));
    }
  }, [todos]);

  // Load saved order when component mounts
  const loadSavedOrder = (): TodoOrderItem[] | null => {
    try {
      const savedOrderStr = localStorage.getItem(STORAGE_KEY);
      if (savedOrderStr) {
        const parsed = JSON.parse(savedOrderStr);
        // Validate the parsed data structure
        if (Array.isArray(parsed) && parsed.every(item => 
          typeof item === 'object' && 
          typeof item.id === 'number' && 
          typeof item.order === 'number'
        )) {
          return parsed as TodoOrderItem[];
        }
      }
    } catch (error) {
      console.error('Failed to load saved todo order:', error);
    }
    return null;
  };

  // Apply saved order to todos
  const applySavedOrder = useCallback((fetchedTodos: Todo[]): TodoWithOrder[] => {
    const savedOrder = loadSavedOrder();
    if (!savedOrder) {
      return fetchedTodos.map((todo, index) => ({
        ...todo,
        order: index
      }));
    }

    // Create a map of id to order
    const orderMap = new Map(savedOrder.map(item => [item.id, item.order]));

    // Sort todos based on saved order
    const sortedTodos = [...fetchedTodos].sort((a, b) => {
      const orderA = orderMap.get(a.id) ?? Infinity;
      const orderB = orderMap.get(b.id) ?? Infinity;
      return orderA - orderB;
    });

    // Assign correct order values
    return sortedTodos.map((todo, index): TodoWithOrder => ({
      ...todo,
      order: index
    }));
  }, []);

  // Clear saved order
  const clearSavedOrder = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    loadSavedOrder,
    applySavedOrder,
    clearSavedOrder
  };
};
