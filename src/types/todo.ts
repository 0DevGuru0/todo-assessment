import { z } from 'zod';

// Zod schema for todo validation
export const todoSchema = z.object({
  id: z.number(),
  todo: z.string().min(1, 'Todo title is required').trim(),
  completed: z.boolean(),
  userId: z.number(),
});

export const createTodoSchema = z.object({
  todo: z.string().min(1, 'Todo title is required').trim(),
  completed: z.boolean().default(false),
  userId: z.number().default(1),
});

export const updateTodoSchema = z.object({
  todo: z.string().min(1, 'Todo title is required').trim().optional(),
  completed: z.boolean().optional(),
});

// TypeScript types derived from Zod schemas
export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

// API response types
export interface TodosResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

// Filter types for bonus features
export type TodoFilter = 'all' | 'completed' | 'incomplete';

// Local state types for drag and drop
export interface TodoWithOrder extends Todo {
  order: number;
}

// Form types
export interface AddTodoFormData {
  todo: string;
}

// API error type
export interface ApiError {
  message: string;
  status?: number;
}

