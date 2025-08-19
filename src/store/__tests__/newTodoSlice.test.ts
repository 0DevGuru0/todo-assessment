import { describe, it, expect } from 'vitest';
import newTodoReducer, { setTodos, setLoading, setError, reorderTodos, toggleTodo, addTodo, removeTodo } from '../newTodoSlice';
import type { Todo } from '../../types/todo';

type NewTodoState = ReturnType<typeof newTodoReducer>;

describe('newTodoSlice', () => {
  const initialState: NewTodoState = {
    todos: [],
    loading: false,
    error: null,
    filter: 'all' as const,
    searchQuery: '',
  };

  const mockTodos: Todo[] = [
    { id: 1, todo: 'First todo', completed: false, userId: 1 },
    { id: 2, todo: 'Second todo', completed: true, userId: 1 },
    { id: 3, todo: 'Third todo', completed: false, userId: 1 },
    { id: 4, todo: 'Fourth todo', completed: false, userId: 1 },
  ];

  describe('setTodos', () => {
    it('should set todos with correct order values', () => {
      const action = setTodos(mockTodos);
      const newState = newTodoReducer(initialState, action);

      expect(newState.todos).toHaveLength(4);
      expect(newState.todos[0]).toEqual({ ...mockTodos[0], order: 0 });
      expect(newState.todos[1]).toEqual({ ...mockTodos[1], order: 1 });
      expect(newState.todos[2]).toEqual({ ...mockTodos[2], order: 2 });
      expect(newState.todos[3]).toEqual({ ...mockTodos[3], order: 3 });
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
    });

    it('should handle empty todos array', () => {
      const action = setTodos([]);
      const newState = newTodoReducer(initialState, action);

      expect(newState.todos).toHaveLength(0);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
    });
  });

  describe('setLoading', () => {
    it('should set loading to true', () => {
      const action = setLoading(true);
      const newState = newTodoReducer(initialState, action);

      expect(newState.loading).toBe(true);
    });

    it('should set loading to false', () => {
      const action = setLoading(false);
      const newState = newTodoReducer(initialState, action);

      expect(newState.loading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message and stop loading', () => {
      const loadingState = { ...initialState, loading: true };
      const action = setError('API Error');
      const newState = newTodoReducer(loadingState, action);

      expect(newState.error).toBe('API Error');
      expect(newState.loading).toBe(false);
    });

    it('should clear error when set to null', () => {
      const errorState = { ...initialState, error: 'Previous error' };
      const action = setError(null);
      const newState = newTodoReducer(errorState, action);

      expect(newState.error).toBe(null);
    });
  });

  describe('reorderTodos', () => {
    const stateWithTodos = {
      ...initialState,
      todos: mockTodos.map((todo, index) => ({ ...todo, order: index })),
    };

    it('should reorder todos from top to bottom', () => {
      // Move first todo (id: 1) to third position (after id: 3)
      const action = reorderTodos({ activeId: 1, overId: 3 });
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos.map(t => t.id)).toEqual([2, 3, 1, 4]);
      expect(newState.todos.map(t => t.order)).toEqual([0, 1, 2, 3]);
    });

    it('should reorder todos from bottom to top', () => {
      // Move fourth todo (id: 4) to second position (after id: 2)
      const action = reorderTodos({ activeId: 4, overId: 2 });
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos.map(t => t.id)).toEqual([1, 4, 2, 3]);
      expect(newState.todos.map(t => t.order)).toEqual([0, 1, 2, 3]);
    });

    it('should handle moving to beginning', () => {
      // Move third todo (id: 3) to first position (before id: 1)
      const action = reorderTodos({ activeId: 3, overId: 1 });
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos.map(t => t.id)).toEqual([3, 1, 2, 4]);
      expect(newState.todos.map(t => t.order)).toEqual([0, 1, 2, 3]);
    });

    it('should handle moving to end', () => {
      // Move second todo (id: 2) to last position (after id: 4)
      const action = reorderTodos({ activeId: 2, overId: 4 });
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos.map(t => t.id)).toEqual([1, 3, 4, 2]);
      expect(newState.todos.map(t => t.order)).toEqual([0, 1, 2, 3]);
    });

    it('should not reorder when same item', () => {
      const action = reorderTodos({ activeId: 2, overId: 2 });
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos).toEqual(stateWithTodos.todos);
    });

    it('should handle non-existent IDs gracefully', () => {
      const action = reorderTodos({ activeId: 999, overId: 2 });
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos).toEqual(stateWithTodos.todos);
    });

    it('should preserve todo properties during reorder', () => {
      const action = reorderTodos({ activeId: 1, overId: 3 });
      const newState = newTodoReducer(stateWithTodos, action);

      // Check that all original properties are preserved
      const reorderedFirstTodo = newState.todos.find(t => t.id === 1);
      expect(reorderedFirstTodo).toEqual({
        id: 1,
        todo: 'First todo',
        completed: false,
        userId: 1,
        order: 2, // New order after moving
      });
    });
  });

  describe('toggleTodo', () => {
    const stateWithTodos = {
      ...initialState,
      todos: mockTodos.map((todo, index) => ({ ...todo, order: index })),
    };

    it('should toggle todo from incomplete to complete', () => {
      const action = toggleTodo(1); // First todo is incomplete
      const newState = newTodoReducer(stateWithTodos, action);

      const toggledTodo = newState.todos.find(t => t.id === 1);
      expect(toggledTodo?.completed).toBe(true);
    });

    it('should toggle todo from complete to incomplete', () => {
      const action = toggleTodo(2); // Second todo is complete
      const newState = newTodoReducer(stateWithTodos, action);

      const toggledTodo = newState.todos.find(t => t.id === 2);
      expect(toggledTodo?.completed).toBe(false);
    });

    it('should handle non-existent todo ID gracefully', () => {
      const action = toggleTodo(999);
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos).toEqual(stateWithTodos.todos);
    });

    it('should preserve other todo properties when toggling', () => {
      const action = toggleTodo(1);
      const newState = newTodoReducer(stateWithTodos, action);

      const toggledTodo = newState.todos.find(t => t.id === 1);
      expect(toggledTodo).toEqual({
        id: 1,
        todo: 'First todo',
        completed: true, // Changed
        userId: 1,
        order: 0,
      });
    });
  });

  describe('addTodo', () => {
    it('should add new todo at the end', () => {
      const stateWithTodos = {
        ...initialState,
        todos: mockTodos.map((todo, index) => ({ ...todo, order: index })),
      };

      const newTodoData = { id: 5, todo: 'New todo item', userId: 1 };
      const action = addTodo(newTodoData);
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos).toHaveLength(5);
      expect(newState.todos[4]).toEqual({
        id: 5,
        todo: 'New todo item',
        userId: 1,
        completed: false,
        order: 4,
      });
    });

    it('should add todo to empty state', () => {
      const newTodoData = { id: 1, todo: 'First todo', userId: 1 };
      const action = addTodo(newTodoData);
      const newState = newTodoReducer(initialState, action);

      expect(newState.todos).toHaveLength(1);
      expect(newState.todos[0]).toEqual({
        id: 1,
        todo: 'First todo',
        userId: 1,
        completed: false,
        order: 0,
      });
    });

    it('should assign correct order value when adding multiple todos', () => {
      let state: NewTodoState = initialState;

      // Add first todo
      state = newTodoReducer(state, addTodo({ id: 1, todo: 'First', userId: 1 }));
      expect(state.todos[0].order).toBe(0);

      // Add second todo
      state = newTodoReducer(state, addTodo({ id: 2, todo: 'Second', userId: 1 }));
      expect(state.todos[1].order).toBe(1);

      // Add third todo
      state = newTodoReducer(state, addTodo({ id: 3, todo: 'Third', userId: 1 }));
      expect(state.todos[2].order).toBe(2);

      expect(state.todos).toHaveLength(3);
    });
  });

  describe('removeTodo', () => {
    const stateWithTodos = {
      ...initialState,
      todos: mockTodos.map((todo, index) => ({ ...todo, order: index })),
    };

    it('should remove todo by id', () => {
      const action = removeTodo(2); // Remove second todo
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos).toHaveLength(3);
      expect(newState.todos.map(t => t.id)).toEqual([1, 3, 4]);
      expect(newState.todos.find(t => t.id === 2)).toBeUndefined();
    });

    it('should re-assign order values after removal', () => {
      const action = removeTodo(2); // Remove second todo (order: 1)
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos.map(t => t.order)).toEqual([0, 1, 2]);
      expect(newState.todos[0].id).toBe(1); // order: 0
      expect(newState.todos[1].id).toBe(3); // order: 1 (was 2)
      expect(newState.todos[2].id).toBe(4); // order: 2 (was 3)
    });

    it('should remove first todo correctly', () => {
      const action = removeTodo(1); // Remove first todo
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos).toHaveLength(3);
      expect(newState.todos.map(t => t.id)).toEqual([2, 3, 4]);
      expect(newState.todos.map(t => t.order)).toEqual([0, 1, 2]);
    });

    it('should remove last todo correctly', () => {
      const action = removeTodo(4); // Remove last todo
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos).toHaveLength(3);
      expect(newState.todos.map(t => t.id)).toEqual([1, 2, 3]);
      expect(newState.todos.map(t => t.order)).toEqual([0, 1, 2]);
    });

    it('should handle removing non-existent todo gracefully', () => {
      const action = removeTodo(999);
      const newState = newTodoReducer(stateWithTodos, action);

      expect(newState.todos).toEqual(stateWithTodos.todos);
    });

    it('should handle removing from single todo state', () => {
      const singleTodoState = {
        ...initialState,
        todos: [{ ...mockTodos[0], order: 0 }],
      };

      const action = removeTodo(1);
      const newState = newTodoReducer(singleTodoState, action);

      expect(newState.todos).toHaveLength(0);
    });
  });

  describe('multiple operations with CRUD', () => {
    it('should handle add, toggle, reorder, and remove operations', () => {
      let state: NewTodoState = initialState;

      // Add some todos
      state = newTodoReducer(state, addTodo({ id: 1, todo: 'First', userId: 1 }));
      state = newTodoReducer(state, addTodo({ id: 2, todo: 'Second', userId: 1 }));
      state = newTodoReducer(state, addTodo({ id: 3, todo: 'Third', userId: 1 }));
      expect(state.todos).toHaveLength(3);

      // Toggle first todo
      state = newTodoReducer(state, toggleTodo(1));
      expect(state.todos.find(t => t.id === 1)?.completed).toBe(true);

      // Reorder: Move 1 to position of 3
      state = newTodoReducer(state, reorderTodos({ activeId: 1, overId: 3 }));
      expect(state.todos.map(t => t.id)).toEqual([2, 3, 1]);

      // Remove middle todo
      state = newTodoReducer(state, removeTodo(3));
      expect(state.todos.map(t => t.id)).toEqual([2, 1]);
      expect(state.todos.map(t => t.order)).toEqual([0, 1]);

      // Check that the toggled state is preserved
      expect(state.todos.find(t => t.id === 1)?.completed).toBe(true);
      expect(state.todos.find(t => t.id === 2)?.completed).toBe(false);
    });

    it('should maintain order consistency after multiple adds and removes', () => {
      let state: NewTodoState = initialState;

      // Add todos
      state = newTodoReducer(state, addTodo({ id: 1, todo: 'First', userId: 1 }));
      state = newTodoReducer(state, addTodo({ id: 2, todo: 'Second', userId: 1 }));
      state = newTodoReducer(state, addTodo({ id: 3, todo: 'Third', userId: 1 }));

      // Remove middle
      state = newTodoReducer(state, removeTodo(2));
      expect(state.todos.map(t => t.order)).toEqual([0, 1]);

      // Add new todo
      state = newTodoReducer(state, addTodo({ id: 4, todo: 'Fourth', userId: 1 }));
      expect(state.todos.map(t => t.order)).toEqual([0, 1, 2]);
      expect(state.todos.map(t => t.id)).toEqual([1, 3, 4]);

      // Remove first
      state = newTodoReducer(state, removeTodo(1));
      expect(state.todos.map(t => t.order)).toEqual([0, 1]);
      expect(state.todos.map(t => t.id)).toEqual([3, 4]);
    });
  });

  describe('legacy multiple operations', () => {
    it('should handle multiple reorders correctly', () => {
      let state = {
        ...initialState,
        todos: mockTodos.map((todo, index) => ({ ...todo, order: index })),
      };

      // First reorder: Move 1 to position of 3
      state = newTodoReducer(state, reorderTodos({ activeId: 1, overId: 3 }));
      expect(state.todos.map(t => t.id)).toEqual([2, 3, 1, 4]);

      // Second reorder: Move 4 to position of 2
      state = newTodoReducer(state, reorderTodos({ activeId: 4, overId: 2 }));
      expect(state.todos.map(t => t.id)).toEqual([4, 2, 3, 1]);

      // Check order values are correct
      expect(state.todos.map(t => t.order)).toEqual([0, 1, 2, 3]);
    });

    it('should handle reorder after toggle', () => {
      let state = {
        ...initialState,
        todos: mockTodos.map((todo, index) => ({ ...todo, order: index })),
      };

      // Toggle first todo
      state = newTodoReducer(state, toggleTodo(1));
      expect(state.todos.find(t => t.id === 1)?.completed).toBe(true);

      // Reorder: Move 1 to position of 3
      state = newTodoReducer(state, reorderTodos({ activeId: 1, overId: 3 }));
      expect(state.todos.map(t => t.id)).toEqual([2, 3, 1, 4]);

      // Check that the toggled state is preserved
      expect(state.todos.find(t => t.id === 1)?.completed).toBe(true);
    });
  });
});
