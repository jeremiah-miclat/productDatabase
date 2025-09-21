import React, { useEffect, useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import DatabaseCard from "../components/DatabaseCard";
import { FileSearchIcon, DatabaseIcon, PackageIcon } from "lucide-react";
import NotFound from "../components/NotFound";
import RateLimitedUI from "../components/RateLimitedUI";
import AddButton from "../components/AddButton";

const DatabasePage = () => {
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setRateLimited] = useState(false);

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const res = await api.get("/databases");
        setDatabases(res.data);
        setRateLimited(false);
      } catch (error) {
        console.error("Error fetching databases", error);
        if (error.response?.status === 429) {
          setRateLimited(true);
        } else {
          toast.error("Failed to load databases");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDatabases();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      {!isRateLimited &&       <div className="max-w-7xl mx-auto p-4 mt-6">
<h2 className="text-2xl font-bold flex items-center gap-2 mb-10">
  Databases
  <AddButton  className="scale-75" />
</h2>

        {loading && <p className="text-primary">Loading databases...</p>}
        {!loading && databases.length === 0 && 
            <NotFound
  icon={DatabaseIcon}
  title="No databases yet"
  description="Start by creating a database to hold your products and schemas."
  link="/databases/create"
  linkText="Create Database"
/>
        }

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{databases.map((db) => (
  <DatabaseCard key={db._id} db={db} setDatabases={setDatabases} />
))}
        </div>
      </div>}
    </div>
  );
};

export default DatabasePage;
