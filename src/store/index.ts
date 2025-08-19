import { configureStore } from '@reduxjs/toolkit';
import newTodoReducer from './newTodoSlice';

export const store = configureStore({
  reducer: {
    newTodo: newTodoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

