import { PenSquareIcon, Trash2Icon, PackageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const ProductCard = ({ product, setProducts }) => {
  const navigate = useNavigate();

  const handleDelete = (e, id) => {
    e.preventDefault();

    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this product?</p>
          <div className="flex gap-2 mt-2">
            <button
              className="btn btn-xs btn-error"
              onClick={async () => {
                try {
                  await api.delete(`/products/${id}`);
                  if (setProducts) {
                    setProducts((prev) => prev.filter((p) => p._id !== id));
                  }
                  toast.success("Product deleted successfully");
                } catch (error) {
                  console.error("Error deleting product", error);
                  toast.error("Failed to delete product");
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
    <div
      onClick={() => navigate(`/products/${product._id}/edit`)} // optional: view product page
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-l-4 border-solid border-secondary cursor-pointer"
    >
      <div className="card-body">
        {/* Header */}
        <div className="flex items-center gap-2">
          <PackageIcon className="size-5 text-secondary" />
          <h3 className="card-title text-base-content">
            {product.data?.name ||
              product.data?.Name ||
              product.title ||
              product.Title ||
              product.userSchema?.name ||
              "Untitled Product"}
          </h3>
        </div>

        {/* Dynamic fields */}
        <div className="text-base-content/70 text-sm mt-2 space-y-1">
          {Object.entries(product.data || {}).map(([key, value]) => (
            <p key={key}>
              <span className="font-medium capitalize">{key}:</span>{" "}
              {String(value)}
            </p>
          ))}
        </div>

        {/* Extra Info */}
        <div className="text-base-content/60 text-xs mt-2 italic">
          Schema: {product.userSchema?.name || "Unknown"} | Database:{" "}
          {product.database?.name || "Unknown"}
        </div>

        {/* Footer */}
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(product.createdAt))}
          </span>
          <div className="flex items-center gap-1">
            {/* Edit button links to create/edit page */}
            <Link
              to={`/products/${product._id}/edit`}
              onClick={(e) => e.stopPropagation()} // prevent card click
              className="btn btn-ghost btn-xs"
            >
              <PenSquareIcon className="size-4" />
            </Link>

            {/* Delete button */}
            <button
              type="button"
              className="btn btn-ghost btn-xs text-error"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(e, product._id);
              }}
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
