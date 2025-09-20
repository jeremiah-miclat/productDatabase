import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { ArrowLeftIcon } from "lucide-react";

const CreateProductPage = () => {
  const { id } = useParams(); // passed from /products/create/:databaseId
  const [database, setDatabase] = useState(null);
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatabase = async () => {
      try {
        const res = await api.get(`/databases/${id}`); // populate schema
        setDatabase(res.data);
        console.log("Fetched database:", res.data); // log the fetched database
        // Initialize dynamic fields
        if (res.data.schema?.fields) {
          const initFields = {};
          res.data.schema.fields.forEach((f) => (initFields[f.name] = ""));
          setFields(initFields);
        }
      } catch (error) {
        console.error("Error fetching database", error);
        toast.error("Failed to load database");
      } finally {
        setLoading(false);
      }
    };
    fetchDatabase();
  }, [id]);

  const handleInputChange = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/products", {
        database: database._id,
        data: fields,
      });
      toast.success("Product created successfully!");
      navigate(`/databases/${database._id}`);
    } catch (error) {
      console.error("Error creating product", error);
      toast.error("Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto p-4 mt-6">
        <Link
          to={`/databases/${id}`}
          className="btn btn-ghost mb-6 flex items-center gap-2"
        >
          <ArrowLeftIcon className="size-5" />
          Back
        </Link>

        {loading ? (
          <p className="text-primary">Loading...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="card bg-base-100 p-4"
          >
            <h2 className="text-2xl font-bold mb-4">
              Create Product in {database.name}
            </h2>

            {database.schema?.fields?.map((f) => (
              <div className="form-control mb-4" key={f.name}>
                <label className="label">
                  <span className="label-text">{f.name}</span>
                </label>
                <input
                  type={f.type === "number" ? "number" : "text"}
                  className="input input-bordered"
                  value={fields[f.name]}
                  onChange={(e) => handleInputChange(f.name, e.target.value)}
                />
              </div>
            ))}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Product"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateProductPage;
