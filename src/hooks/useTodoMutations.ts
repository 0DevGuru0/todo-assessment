import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { todoApi } from '../services/todoApi';
import { addTodo, removeTodo, toggleTodo } from '../store/newTodoSlice';
import { NEW_TODOS_QUERY_KEY } from './useNewTodos';
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

      return { previousTodos };
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(NEW_TODOS_QUERY_KEY, context.previousTodos);
      }
      toast.error('Failed to create todo');
      console.error('Create todo error:', error);
    },
    onSuccess: () => {
      toast.success('Todo created successfully');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: NEW_TODOS_QUERY_KEY });
    },
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: (id: number) => todoApi.deleteTodo(id),
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: NEW_TODOS_QUERY_KEY });
      const previousTodos = queryClient.getQueryData(NEW_TODOS_QUERY_KEY);

      // Optimistically remove from state
      dispatch(removeTodo(todoId));

      return { previousTodos };
    },
    onError: (error, _, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(NEW_TODOS_QUERY_KEY, context.previousTodos);
      }
      toast.error('Failed to delete todo');
      console.error('Delete todo error:', error);
    },
    onSuccess: () => {
      toast.success('Todo deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NEW_TODOS_QUERY_KEY });
    },
  });

  // Toggle todo mutation
  const toggleTodoMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) => 
      todoApi.toggleTodo(id, completed),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: NEW_TODOS_QUERY_KEY });
      const previousTodos = queryClient.getQueryData(NEW_TODOS_QUERY_KEY);

      // Optimistically toggle
      dispatch(toggleTodo(id));

      return { previousTodos };
    },
    onError: (error, _, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(NEW_TODOS_QUERY_KEY, context.previousTodos);
      }
      toast.error('Failed to update todo status');
      console.error('Toggle todo error:', error);
    },
    onSuccess: () => {
      toast.success('Todo status updated');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NEW_TODOS_QUERY_KEY });
    },
  });

  // Update todo mutation (for editing)
  const updateTodoMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: { todo?: string; completed?: boolean } }) => 
      todoApi.updateTodo(id, updates),
    onError: (error) => {
      toast.error('Failed to update todo');
      console.error('Update todo error:', error);
    },
    onSuccess: () => {
      toast.success('Todo updated successfully');
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
