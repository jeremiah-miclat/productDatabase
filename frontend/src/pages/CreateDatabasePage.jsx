import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, FileSearchIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";
import NotFound from "../components/NotFound";
import api from "../lib/axios";

const CreateDatabasePage = () => {
  const [isRateLimited, setRateLimited] = useState(false);
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [schemaId, setSchemaId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Fetch schemas on mount
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Database name is required");
      return;
    }
    if (!schemaId) {
      toast.error("Please select a schema");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/databases", {
        name,
        description,
        schema: schemaId,
      });

      toast.success("Database created successfully!");
      navigate("/databases");
    } catch (error) {
      console.error("Error creating database", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid request");
      } else if (error.response?.status === 429) {
        toast.error("Slow down! Too many requests", {
          duration: 4000,
          icon: "💀",
        });
        setRateLimited(true);
      } else {
        toast.error("Failed to create database");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-2xl mx-auto p-4 mt-6">
        <Link to="/databases" className="btn btn-ghost mb-6">
          <ArrowLeftIcon className="size-5" />
          Back to Databases
        </Link>

        {loading && (
          <div className="text-center text-primary py-10">
            Loading schemas...
          </div>
        )}

        {!loading && schemas.length === 0 && !isRateLimited && (
          <NotFound
            icon={FileSearchIcon}
            title="No schemas yet"
            description="Define a schema before creating a database."
            link="/schemas/create"
            linkText="Create Schema"
          />
        )}

        {!loading && schemas.length > 0 && !isRateLimited && (
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create a Database</h2>
              <form onSubmit={handleSubmit}>
                {/* Database Name */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Database Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter database name"
                    className="input input-bordered"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Database Description */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    placeholder="Enter description (optional)"
                    className="textarea textarea-bordered h-24"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

{/* Schema Selector */}
<div className="form-control mb-4">
  <label className="label">
    <span className="label-text">Schema</span>
  </label>
  <select
    className="select select-bordered"
    value={schemaId}
    onChange={(e) => setSchemaId(e.target.value)}
  >
    <option value="">Select a schema</option>
    {schemas.map((s) => (
      <option key={s._id} value={s._id}>
        {s.schemaName} {/* ✅ correct field */}
      </option>
    ))}
  </select>
</div>

                {/* Submit Button */}
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Creating..." : "Save Database"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDatabasePage;
