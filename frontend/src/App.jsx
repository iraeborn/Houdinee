import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "../components/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "./pages/not-found";
import AuthPage from "./pages/auth-page";
import Dashboard from "./pages/dashboard";
import Links from "./pages/links";
import Analytics from "./pages/analytics";
import Subscribe from "./pages/subscribe";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/links" component={Links} />
      <ProtectedRoute path="/analytics" component={Analytics} />
      <ProtectedRoute path="/subscribe" component={Subscribe} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        {/* <Toaster /> */}
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
