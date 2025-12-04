import { QueryProvider } from './app/providers/QueryProvider';
import AppRouter from './app/router/AppRouter';
import { AuthProvider } from './app/providers/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
    <QueryProvider>
        <AppRouter />
    </QueryProvider>
    </AuthProvider>

  );
}
