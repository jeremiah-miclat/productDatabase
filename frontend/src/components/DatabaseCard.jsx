import { PenSquareIcon, Trash2Icon, DatabaseIcon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const DatabaseCard = ({ db, setDatabases }) => {
  const handleDelete = (e, id) => {
    e.preventDefault();

    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this database?</p>
          <div className="flex gap-2 mt-2">
            <button
              className="btn btn-xs btn-error"
              onClick={async () => {
                try {
                  await api.delete(`/databases/${id}`);
                  setDatabases((prev) => prev.filter((d) => d._id !== id));
                  toast.success("Database deleted successfully");
                } catch (error) {
                  console.error("Error deleting database", error);
                  toast.error("Failed to delete database");
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
      to={`/databases/${db._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-l-4 border-solid border-primary"
    >
      <div className="card-body">
        {/* Database Title */}
        <div className="flex items-center gap-2">
          <DatabaseIcon className="size-5 text-primary" />
          <h3 className="card-title text-lg">{db.name}</h3>
        </div>

        {/* Created Date */}
        <p className="text-sm text-base-content/70">
          Created: {formatDate(new Date(db.createdAt))}
        </p>

        {/* Schema Name */}
        <p className="text-sm text-base-content/70">
          schema: {db.schema ? db.schema.schemaName : "Not assigned"}
        </p>

        {/* Actions */}
        <div className="card-actions justify-end items-center mt-4">
          <button type="button" className="btn btn-ghost btn-xs">
            <PenSquareIcon className="size-4" />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-xs text-error"
            onClick={(e) => handleDelete(e, db._id)}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default DatabaseCard;
