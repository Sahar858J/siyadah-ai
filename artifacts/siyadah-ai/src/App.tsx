import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { AppProvider } from "@/context/AppContext";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import ChatPage from "@/pages/ChatPage";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] };

function AnimatedRoute({ component: Component }: { component: () => JSX.Element }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ minHeight: "100vh" }}
    >
      <Component />
    </motion.div>
  );
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={() => <AnimatedRoute component={LandingPage} />} />
        <Route path="/login" component={() => <AnimatedRoute component={LoginPage} />} />
        <Route path="/chat" component={() => <AnimatedRoute component={ChatPage} />} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;
