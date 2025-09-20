import { PenSquareIcon, Trash2Icon, PackageIcon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const ProductCard = ({ product, setProducts }) => {
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
                  setProducts((prev) => prev.filter((p) => p._id !== id));
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
    <Link
      to={`/product/${product._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-l-4 border-solid border-secondary"
    >
      <div className="card-body">
        <div className="flex items-center gap-2">
          <PackageIcon className="size-5 text-secondary" />
          <h3 className="card-title text-base-content">{product.title}</h3>
        </div>
        <p className="text-base-content/70 line-clamp-3">{product.content}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(product.createdAt))}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              // hook up to edit modal/page later
            >
              <PenSquareIcon className="size-4" />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs text-error"
              onClick={(e) => handleDelete(e, product._id)}
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
