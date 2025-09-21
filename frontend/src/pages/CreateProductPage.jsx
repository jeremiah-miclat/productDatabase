import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { ArrowLeftIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";

const CreateEditProductPage = () => {
  const { id, productId } = useParams();
  // id = databaseId for creation
  // productId = product being edited

  const [database, setDatabase] = useState(null);
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isRateLimited, setRateLimited] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = !!productId; 
  const databaseId = isEdit ? null : id;
useEffect(() => {
  const fetchData = async () => {
    console.log("Params:", { id, productId, isEdit,databaseId });
    try {
      let db;

      if (isEdit) {
        // FETCH PRODUCT
        const productRes = await api.get(`/products/${productId}`);
        const product = productRes.data;
        console.log("✅ Product fetched:", product);

        // FETCH DATABASE (from product)
        const dbRes = await api.get(`/databases/${product.database.id}`);
        db = dbRes.data;

        setDatabase(db);

        // Initialize fields with product data
        const initFields = {};
        (db.schema?.fields || []).forEach((f) => {
          initFields[f.name] = product.data?.[f.name] ?? "";
        });
        setFields(initFields);

      } else {
        // CREATING NEW PRODUCT
        const dbRes = await api.get(`/databases/${databaseId}`);
        db = dbRes.data;
        setDatabase(db);

        // Initialize empty fields
        const initFields = {};
        (db.schema?.fields || []).forEach((f) => (initFields[f.name] = ""));
        setFields(initFields);
      }

      setRateLimited(false);
    } catch (error) {
      console.error("Error fetching data", error);
      if (error.response?.status === 429) setRateLimited(true);
      else toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id, productId, isEdit]);


  const handleInputChange = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit && productId) {
        await api.put(`/products/${productId}`, { data: fields });
        toast.success("Product updated successfully!");
        navigate(`/databases/${database._id}/products`);
      } else {
        await api.post("/products", {
          database: database._id,
          data: fields,
        });
        toast.success("Product created successfully!");
        navigate(`/databases/${database._id}/products`);
      }
    } catch (error) {
      console.error("Error saving product", error);
      toast.error("Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      {!isRateLimited && (
        <div className="max-w-2xl mx-auto p-4 mt-6">
          <Link
            to={isEdit ? `/databases/${database?._id}/products` : `/databases/${id}/products`}
            className="btn btn-ghost mb-6 flex items-center gap-2"
          >
            <ArrowLeftIcon className="size-5" />
            Back
          </Link>

          {loading ? (
            <p className="text-primary">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="card bg-base-100 p-4">
              <h2 className="text-2xl font-bold mb-4">
                {isEdit ? "Edit Product" : "Create Product"} in{" "}
                {database?.name ?? "Unknown Database"}
              </h2>

              {(database?.schema?.fields || []).map((f) => (
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
                {submitting
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Product"
                  : "Create Product"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateEditProductPage;
