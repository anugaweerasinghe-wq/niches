import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import WikiIndex from "./pages/WikiIndex";
import WikiTerm from "./pages/WikiTerm";
import NicheResult from "./pages/NicheResult";
import SeoAudit from "./pages/SeoAudit";
import AdminValidator from "./pages/AdminValidator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/wiki" element={<WikiIndex />} />
              <Route path="/wiki/:slug" element={<WikiTerm />} />
              <Route path="/niche/:id" element={<NicheResult />} />
              <Route path="/admin/seo-audit" element={<SeoAudit />} />
              <Route path="/admin/validator" element={<AdminValidator />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
