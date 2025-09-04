import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { todoApi } from '../services/todoApi';
import { addTodo, removeTodo, toggleTodo } from '../store/newTodoSlice';
import { NEW_TODOS_QUERY_KEY } from './useNewTodos';
import { todoToasts } from '../utils/toastHelpers';
import type { CreateTodoInput } from '../types/todo';
import type { AppDispatch } from '../store';

export const useTodoMutations = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  // Create todo mutation
  const createTodoMutation = useMutation({
    mutationFn: (todoData: CreateTodoInput) => todoApi.createTodo(todoData),
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: NEW_TODOS_QUERY_KEY });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(NEW_TODOS_QUERY_KEY);

      // Optimistically update the local state
      const optimisticTodo = {
        id: Date.now(), // Temporary ID
        todo: newTodo.todo,
        completed: newTodo.completed || false,
        userId: newTodo.userId,
      };
      dispatch(addTodo(optimisticTodo));

      return { previousTodos, todoText: newTodo.todo };
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(NEW_TODOS_QUERY_KEY, context.previousTodos);
      }
      
      todoToasts.createError(error, context?.todoText);
      console.error('Create todo error:', error);
    },
    onSuccess: (_data, variables) => {
      todoToasts.createSuccess(variables.todo);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: NEW_TODOS_QUERY_KEY });
    },
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: ({ id }: { id: number; todoText: string }) => todoApi.deleteTodo(id),
    onMutate: async ({ id: todoId, todoText }) => {
      await queryClient.cancelQueries({ queryKey: NEW_TODOS_QUERY_KEY });
      const previousTodos = queryClient.getQueryData(NEW_TODOS_QUERY_KEY);

      // Optimistically remove from state
      dispatch(removeTodo(todoId));

      return { previousTodos, todoText };
    },
    onError: (error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(NEW_TODOS_QUERY_KEY, context.previousTodos);
      }
      
      todoToasts.deleteError(error, context?.todoText);
      console.error('Delete todo error:', error);
    },
    onSuccess: (_data, variables) => {
      todoToasts.deleteSuccess(variables.todoText);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NEW_TODOS_QUERY_KEY });
    },
  });

  // Toggle todo mutation
  const toggleTodoMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean; todoText: string }) => 
      todoApi.toggleTodo(id, completed),
    onMutate: async ({ id, todoText, completed }) => {
      await queryClient.cancelQueries({ queryKey: NEW_TODOS_QUERY_KEY });
      const previousTodos = queryClient.getQueryData(NEW_TODOS_QUERY_KEY);

      // Optimistically toggle
      dispatch(toggleTodo(id));

      return { previousTodos, todoText, completed };
    },
    onError: (error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(NEW_TODOS_QUERY_KEY, context.previousTodos);
      }
      
      todoToasts.toggleError(error, context?.todoText, context?.completed);
      console.error('Toggle todo error:', error);
    },
    onSuccess: (_data, variables) => {
      todoToasts.toggleSuccess(variables.todoText, variables.completed);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NEW_TODOS_QUERY_KEY });
    },
  });

  // Update todo mutation (for editing)
  const updateTodoMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: { todo?: string; completed?: boolean }; todoText: string }) => 
      todoApi.updateTodo(id, updates),
    onError: (error, variables) => {
      todoToasts.updateError(error, variables.todoText);
      console.error('Update todo error:', error);
    },
    onSuccess: (_data, variables) => {
      todoToasts.updateSuccess(variables.updates.todo || variables.todoText);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NEW_TODOS_QUERY_KEY });
    },
  });

  return {
    createTodo: createTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
    toggleTodo: toggleTodoMutation.mutate,
    updateTodo: updateTodoMutation.mutate,
    isCreating: createTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
    isToggling: toggleTodoMutation.isPending,
    isUpdating: updateTodoMutation.isPending,
  };
};
