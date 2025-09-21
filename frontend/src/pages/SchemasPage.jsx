import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import SchemaCard from "../components/SchemaCard";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NotesNotFound from "../components/NotesNotFound";
import NotFound from "../components/NotFound";
import { FileSearchIcon } from "lucide-react";
import AddButton from "../components/AddButton";

const SchemasPage = () => {
  const [isRateLimited, setRateLimited] = useState(false);
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const res = await api.get("/schemas");
        setSchemas(res.data);
        setRateLimited(false);
      } catch (error) {
        console.error("Error fetching schemas", error);
        if (error.response?.status === 429) {
          setRateLimited(true);
        } else {
          toast.error("Failed to load schemas");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSchemas();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {isRateLimited && <RateLimitedUI />}
      {!isRateLimited &&       <div className="max-w-7xl mx-auto p-4 mt-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-10">Schemas <AddButton  className="scale-75" /></h2>
        {loading && (
          <div className="text-center text-primary py-10">
            Loading schemas...
          </div>
        )}
        {schemas.length === 0 && !isRateLimited && !loading && (
          <NotFound
  icon={FileSearchIcon}
  title="No schemas yet"
  description="Define your first schema to start structuring products in your system."
  link="/schemas/create"
  linkText="Create Schema"
/>
        )}
        {schemas.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemas.map((schema) => (
              <SchemaCard
                key={schema._id}
                schema={schema}
                setSchemas={setSchemas}
              />
            ))}
          </div>
        )}
      </div>}
    </div>
  );
};

export default SchemasPage;
