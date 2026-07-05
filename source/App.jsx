import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <nav className="bg-gray-900 text-white p-4 shadow-md">
          <div className="container mx-auto flex gap-6">
            <h1 className="font-bold text-lg">📦 Inventory MS</h1>
            <Link to="/" className="hover:text-gray-300">Dashboard</Link>
            <Link to="/products" className="hover:text-gray-300">Products</Link>
          </div>
        </nav>
        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </main>
      </BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
    </QueryClientProvider>
  );
}
export default App;