import { Route, Routes } from "react-router";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import CreateSchemaPage from "./pages/CreateSchemaPage";
import SchemasPage from "./pages/SchemasPage";
import CreateDatabasePage from "./pages/CreateDatabasePage";
import DatabasesPage from "./pages/DatabasePage"; 
import DatabaseDetailPage from "./pages/DatabaseDetailPage"; 
import CreateProductPage from "./pages/CreateProductPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
      <Routes>
        <Route path="/" element={<DatabasesPage />} />
        <Route path="/schemas" element={<SchemasPage />} />
        <Route path="/schemas/create" element={<CreateSchemaPage />} />
        <Route path="/databases/create" element={<CreateDatabasePage />} /> 
        <Route path="/databases/:id/products/create" element={<CreateProductPage />} />
        <Route path="/products/:productId/edit" element={<CreateProductPage />} />
        <Route path="/databases/:id/edit" element={<CreateDatabasePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/product/:id" element={<NoteDetailPage />} />
        <Route path="/databases" element={<DatabasesPage />} /> 
        <Route path="/databases/:id/products" element={<DatabaseDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};
export default App;