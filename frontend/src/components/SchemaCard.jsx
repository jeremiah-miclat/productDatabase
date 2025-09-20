import { Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const SchemaCard = ({ schema, setSchemas }) => {
  const handleDelete = (e, id) => {
    e.preventDefault();

    toast(
      (t) => (
        <div>
          <p>
            Are you sure you want to delete schema{" "}
            <strong>{schema.schemaName}</strong>?
          </p>
          <div className="flex gap-2 mt-2">
            <button
              className="btn btn-xs btn-error"
              onClick={async () => {
                try {
                  await api.delete(`/schemas/${id}`);
                  setSchemas((prev) => prev.filter((s) => s._id !== id));
                  toast.success("Schema deleted successfully");
                } catch (error) {
                  console.error("Error in handleDelete", error);
                  toast.error("Failed to delete schema");
                }
                toast.dismiss(t.id);
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-xs"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  };

  return (
    <Link
    //   to={`/schemas/${schema._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-l-4 border-solid border-secondary"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">
          {schema.schemaName}
        </h3>

        {/* Render list of fields */}
        <ul className="text-sm text-base-content/70 mb-3">
          {schema.fields.length > 0 ? (
            schema.fields.map((f, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{f.name}</span>
                <span className="badge badge-outline">{f.type}</span>
              </li>
            ))
          ) : (
            <li>No fields defined</li>
          )}
        </ul>

        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(schema.createdAt))}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-xs text-error"
            onClick={(e) => handleDelete(e, schema._id)}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default SchemaCard;
