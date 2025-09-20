import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import SchemaCard from "../components/SchemaCard";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NotesNotFound from "../components/NotesNotFound";

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
      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">
            Loading schemas...
          </div>
        )}
        {schemas.length === 0 && !isRateLimited && !loading && (
          <NotesNotFound message="No schemas found. Create one to get started!" />
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
      </div>
    </div>
  );
};

export default SchemasPage;
