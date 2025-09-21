import { ArrowLeftIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";

const CreateSchemaPage = () => {
  const [schemaName, setSchemaName] = useState("");
  const [fields, setFields] = useState([{ name: "", type: "" }]);
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setRateLimited] = useState(false);

  const navigate = useNavigate();

  const handleFieldChange = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const addField = () => {
    setFields([...fields, { name: "", type: "" }]);
  };

  const removeField = (index) => {
    const updated = fields.filter((_, i) => i !== index);
    setFields(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!schemaName.trim()) {
      toast.error("Schema name is required");
      return;
    }

    const validFields = fields.filter((f) => f.name.trim() && f.type.trim());
    if (validFields.length === 0) {
      toast.error("At least one field is required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/schemas", {
        schemaName,
        fields: validFields,
      });

      toast.success("Schema created successfully!");
      setRateLimited(false);
      navigate("/schemas"); // go back to schemas list
    } catch (error) {
      console.error("Error creating schema", error);
      if (error.response?.status === 429) {
        setRateLimited(true);
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Bad request");
      } else {
        toast.error("Failed to create schema");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      {!isRateLimited && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Link to={"/schemas"} className="btn btn-ghost mb-6">
              <ArrowLeftIcon className="size-5" />
              Back to Schemas
            </Link>

            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Create New Schema</h2>

                <form onSubmit={handleSubmit}>
                  {/* Schema Name */}
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Schema Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Electronics"
                      className="input input-bordered"
                      value={schemaName}
                      onChange={(e) => setSchemaName(e.target.value)}
                    />
                  </div>

                  {/* Fields */}
                  <div className="mb-4">
                    <label className="label">
                      <span className="label-text">Fields</span>
                    </label>
                    {fields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 mb-2"
                      >
                        <input
                          type="text"
                          placeholder="Field name (e.g. price)"
                          className="input input-bordered flex-1"
                          value={field.name}
                          onChange={(e) =>
                            handleFieldChange(index, "name", e.target.value)
                          }
                        />
                        <select
                          className="select select-bordered"
                          value={field.type}
                          onChange={(e) =>
                            handleFieldChange(index, "type", e.target.value)
                          }
                        >
                          <option value="">Select Type</option>
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                        </select>
                        <button
                          type="button"
                          className="btn btn-error btn-sm"
                          onClick={() => removeField(index)}
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm mt-2"
                      onClick={addField}
                    >
                      <PlusCircleIcon className="size-4 mr-2" />
                      Add Field
                    </button>
                  </div>

                  <div className="card-actions justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Save Schema"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSchemaPage;
