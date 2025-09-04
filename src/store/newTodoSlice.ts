import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { arrayMove } from '@dnd-kit/sortable';
import type { Todo } from '../types/todo';

interface TodoWithOrder extends Todo {
  order: number;
}

interface NewTodoState {
  todos: TodoWithOrder[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'completed' | 'incomplete';
  searchQuery: string;
}

const initialState: NewTodoState = {
  todos: [],
  loading: false,
  error: null,
  filter: 'all',
  searchQuery: '',
};

const newTodoSlice = createSlice({
  name: 'newTodo',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      // Convert todos to TodoWithOrder
      // If todo already has order property, preserve it; otherwise assign based on index
      state.todos = action.payload.map((todo, index) => ({
        ...todo,
        order: ('order' in todo && typeof todo.order === 'number') ? todo.order : index,
      }));
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    reorderTodos: (state, action: PayloadAction<{ activeId: number; overId: number }>) => {
      const { activeId, overId } = action.payload;
      
      const activeIndex = state.todos.findIndex(todo => todo.id === activeId);
      const overIndex = state.todos.findIndex(todo => todo.id === overId);
      
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        // Use arrayMove from @dnd-kit/sortable for consistency
        const reorderedTodos = arrayMove(state.todos, activeIndex, overIndex);
        
        // Update the state with reordered todos and fix order values
        state.todos = reorderedTodos.map((todo, index) => ({
          ...todo,
          order: index,
        }));
      }
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todoIndex = state.todos.findIndex(todo => todo.id === action.payload);
      if (todoIndex !== -1) {
        state.todos[todoIndex].completed = !state.todos[todoIndex].completed;
      }
    },
    addTodo: (state, action: PayloadAction<{ id: number; todo: string; userId: number }>) => {
      const newTodo: TodoWithOrder = {
        ...action.payload,
        completed: false,
        order: state.todos.length, // Add at the end
      };
      state.todos.push(newTodo);
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      const todoIndex = state.todos.findIndex(todo => todo.id === action.payload);
      if (todoIndex !== -1) {
        state.todos.splice(todoIndex, 1);
        // Re-assign order values to maintain consistency
        state.todos = state.todos.map((todo, index) => ({
          ...todo,
          order: index,
        }));
      }
    },
    editTodo: (state, action: PayloadAction<{ id: number; text: string }>) => {
      const todoIndex = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (todoIndex !== -1) {
        state.todos[todoIndex].todo = action.payload.text;
      }
    },
    setFilter: (state, action: PayloadAction<'all' | 'completed' | 'incomplete'>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setTodos, setLoading, setError, reorderTodos, toggleTodo, addTodo, removeTodo, editTodo, setFilter, setSearchQuery } = newTodoSlice.actions;
export default newTodoSlice.reducer;
