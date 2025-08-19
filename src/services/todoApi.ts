import type { Todo, CreateTodoInput, UpdateTodoInput, TodosResponse } from '../types/todo';

const API_BASE_URL = 'https://dummyjson.com';

class TodoApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'TodoApiError';
    this.status = status;
  }
}

const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = 'An error occurred';
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch {
    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
  }
  throw new TodoApiError(errorMessage, response.status);
};

export const todoApi = {
  // Get all todos
  getTodos: async (): Promise<TodosResponse> => {
    const response = await fetch(`${API_BASE_URL}/todos`);
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  // Create a new todo
  createTodo: async (todoData: CreateTodoInput): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  // Update a todo
  updateTodo: async (id: number, updates: UpdateTodoInput): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  // Delete a todo
  deleteTodo: async (id: number): Promise<{ id: number; isDeleted: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  // Toggle todo completion status
  toggleTodo: async (id: number, completed: boolean): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },
};
