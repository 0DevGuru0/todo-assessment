import { toast } from 'react-hot-toast';

// Enhanced toast configuration with better styling and positioning
export const toastConfig = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    background: '#ffffff',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    maxWidth: '400px',
  },
  success: {
    duration: 3000,
    iconTheme: {
      primary: '#10b981',
      secondary: '#ffffff',
    },
    style: {
      border: '1px solid #d1fae5',
      background: '#f0fdf4',
      color: '#065f46',
    },
  },
  error: {
    duration: 5000,
    iconTheme: {
      primary: '#ef4444',
      secondary: '#ffffff',
    },
    style: {
      border: '1px solid #fecaca',
      background: '#fef2f2',
      color: '#991b1b',
    },
  },
  loading: {
    duration: Infinity,
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#ffffff',
    },
    style: {
      border: '1px solid #dbeafe',
      background: '#eff6ff',
      color: '#1e40af',
    },
  },
};

// Todo-specific toast messages
export const todoToasts = {
  // Create todo toasts
  createSuccess: (todoText: string) => 
    toast.success(`✅ Todo Created Successfully\n"${todoText.length > 40 ? todoText.substring(0, 40) + '...' : todoText}"`, {
      ...toastConfig.success,
      id: 'create-success',
    }),

  createError: (error: unknown, todoText?: string) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const todoInfo = todoText ? `\n"${todoText.length > 30 ? todoText.substring(0, 30) + '...' : todoText}"` : '';
    return toast.error(`❌ Failed to Create Todo${todoInfo}\nReason: ${errorMessage}`, {
      ...toastConfig.error,
      id: 'create-error',
    });
  },


  // Update/Edit todo toasts
  updateSuccess: (todoText: string) =>
    toast.success(`✏️ Todo Updated Successfully\n"${todoText.length > 40 ? todoText.substring(0, 40) + '...' : todoText}"`, {
      ...toastConfig.success,
      id: 'update-success',
    }),

  updateError: (error: unknown, todoText?: string) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const todoInfo = todoText ? `\n"${todoText.length > 30 ? todoText.substring(0, 30) + '...' : todoText}"` : '';
    return toast.error(`❌ Failed to Update Todo${todoInfo}\nReason: ${errorMessage}`, {
      ...toastConfig.error,
      id: 'update-error',
    });
  },


  // Delete todo toasts
  deleteSuccess: (todoText: string) =>
    toast.success(`🗑️ Todo Deleted Successfully\n"${todoText.length > 40 ? todoText.substring(0, 40) + '...' : todoText}"`, {
      ...toastConfig.success,
      id: 'delete-success',
    }),

  deleteError: (error: unknown, todoText?: string) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const todoInfo = todoText ? `\n"${todoText.length > 30 ? todoText.substring(0, 30) + '...' : todoText}"` : '';
    return toast.error(`❌ Failed to Delete Todo${todoInfo}\nReason: ${errorMessage}`, {
      ...toastConfig.error,
      id: 'delete-error',
    });
  },


  // Toggle todo toasts
  toggleSuccess: (todoText: string, completed: boolean) => {
    const action = completed ? 'Marked as Complete' : 'Reopened';
    const icon = completed ? '✅' : '🔄';
    return toast.success(`${icon} Todo ${action}\n"${todoText.length > 35 ? todoText.substring(0, 35) + '...' : todoText}"`, {
      ...toastConfig.success,
      duration: 2500,
      id: 'toggle-success',
    });
  },

  toggleError: (error: unknown, todoText?: string, completed?: boolean) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const action = completed ? 'Mark as Complete' : 'Reopen';
    const todoInfo = todoText ? `\n"${todoText.length > 30 ? todoText.substring(0, 30) + '...' : todoText}"` : '';
    return toast.error(`❌ Failed to ${action} Todo${todoInfo}\nReason: ${errorMessage}`, {
      ...toastConfig.error,
      id: 'toggle-error',
    });
  },

  // Data loading toasts

  loadSuccess: (count: number) =>
    toast.success(`📥 Todos Loaded Successfully\n${count} todo${count !== 1 ? 's' : ''} retrieved from server`, {
      ...toastConfig.success,
      duration: 2000,
      id: 'load-success',
    }),

  loadError: (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return toast.error(`❌ Failed to Load Todos\nReason: ${errorMessage}`, {
      ...toastConfig.error,
      id: 'load-error',
    });
  },

  // Sync and offline toasts
  syncSuccess: () =>
    toast.success('🔄 Todos synced with server', {
      ...toastConfig.success,
      duration: 2000,
      id: 'sync-success',
    }),

  syncError: (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return toast.error(`❌ Sync failed\n${errorMessage}`, {
      ...toastConfig.error,
      id: 'sync-error',
    });
  },

  // Order/drag and drop toasts
  orderSaved: () =>
    toast.success('💾 Todo Order Saved\nYour custom arrangement has been preserved', {
      ...toastConfig.success,
      duration: 1500,
      id: 'order-saved',
    }),

  orderRestored: () =>
    toast.success('🔄 Todo Order Restored\nYour previous arrangement has been applied', {
      ...toastConfig.success,
      duration: 2000,
      id: 'order-restored',
    }),

  // Validation toasts
  validationError: (message: string) =>
    toast.error(`⚠️ ${message}`, {
      ...toastConfig.error,
      duration: 3000,
      id: 'validation-error',
    }),

  // Network status toasts
  networkError: () =>
    toast.error('🌐 Network error - Please check your connection', {
      ...toastConfig.error,
      duration: 6000,
      id: 'network-error',
    }),

  // Bulk operations
  bulkSuccess: (action: string, count: number) =>
    toast.success(`✅ ${action} ${count} todo${count !== 1 ? 's' : ''} successfully`, {
      ...toastConfig.success,
      id: 'bulk-success',
    }),

  bulkError: (action: string, error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return toast.error(`❌ Failed to ${action} todos\n${errorMessage}`, {
      ...toastConfig.error,
      id: 'bulk-error',
    });
  },
};

// Utility function to dismiss specific toasts
export const dismissToast = (id: string) => {
  toast.dismiss(id);
};

// Utility function to dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};
