import { useEffect, useCallback } from 'react';
import { useAppSelector } from './redux';

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
  const loadSavedOrder = () => {
    try {
      const savedOrderStr = localStorage.getItem(STORAGE_KEY);
      if (savedOrderStr) {
        const savedOrder: TodoOrderItem[] = JSON.parse(savedOrderStr);
        return savedOrder;
      }
    } catch (error) {
      console.error('Failed to load saved todo order:', error);
    }
    return null;
  };

  // Apply saved order to todos
  const applySavedOrder = useCallback((fetchedTodos: any[]) => {
    const savedOrder = loadSavedOrder();
    if (!savedOrder) {
      return fetchedTodos;
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
    return sortedTodos.map((todo, index) => ({
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
