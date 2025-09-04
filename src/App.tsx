import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import { queryClient } from "./lib/queryClient";
import { NewTodoApp } from "./components/NewTodoApp";
import { toastConfig } from "./utils/toastHelpers";

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NewTodoApp />
        <Toaster
          position={toastConfig.position}
          toastOptions={{
            ...toastConfig,
            success: toastConfig.success,
            error: toastConfig.error,
            loading: toastConfig.loading,
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
