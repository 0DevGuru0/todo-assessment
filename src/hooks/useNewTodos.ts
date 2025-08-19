import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { todoApi } from '../services/todoApi';
import { useAppDispatch, useAppSelector } from './redux';
import { setTodos, setLoading, setError } from '../store/newTodoSlice';
import { toast } from 'react-hot-toast';

export const NEW_TODOS_QUERY_KEY = ['new-todos'];

export const useNewTodos = () => {
  const dispatch = useAppDispatch();
  const { todos, loading, error } = useAppSelector((state) => state.newTodo);

  // Fetch todos query using the same API
  const todosQuery = useQuery({
    queryKey: NEW_TODOS_QUERY_KEY,
    queryFn: todoApi.getTodos,
  });

  // Handle query state changes
  React.useEffect(() => {
    if (todosQuery.data) {
      dispatch(setTodos(todosQuery.data.todos));
    }
  }, [todosQuery.data, dispatch]);

  React.useEffect(() => {
    if (todosQuery.error) {
      const errorMessage = todosQuery.error.message || 'Failed to fetch todos';
      dispatch(setError(errorMessage));
      toast.error(`New TodoApp: ${errorMessage}`);
    }
  }, [todosQuery.error, dispatch]);

  React.useEffect(() => {
    dispatch(setLoading(todosQuery.isLoading));
  }, [todosQuery.isLoading, dispatch]);

  return {
    todos,
    loading,
    error,
    refetch: todosQuery.refetch,
    isRefetching: todosQuery.isRefetching,
  };
};
