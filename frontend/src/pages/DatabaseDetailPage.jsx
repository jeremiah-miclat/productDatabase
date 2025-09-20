import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import NotFound from "../components/NotFound";
import { PackageIcon } from "lucide-react";

const DatabaseDetailPage = () => {
  const { id } = useParams();
  const [database, setDatabase] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dbRes, productRes] = await Promise.all([
          api.get(`/databases/${id}`),
          api.get(`/products?database=${id}`),
        ]);

        setDatabase(dbRes.data);
        setProducts(productRes.data);
      } catch (error) {
        console.error("Error fetching database details:", error);
        toast.error("Failed to load database details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto p-4 mt-6">
          <p className="text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!database) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto p-4 mt-6">
          <p className="text-red-500">Database not found.</p>
          <Link to="/databases" className="text-primary hover:underline block mt-4">
            ← Back to Databases
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 mt-6">
        <Link to="/databases" className="text-primary hover:underline">
          ← Back to Databases
        </Link>

        {/* Database Header */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">{database.name}</h2>
          <p className="mb-4">{database.description}</p>
          <p className="text-sm text-base-content/70 mb-6">
            Created: {new Date(database.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Products */}
        <h3 className="text-xl font-semibold mb-3">Products</h3>

        {products.length === 0 ? (
<NotFound
  icon={PackageIcon}
  title="No products yet"
  description="Add your first product to start filling this database."
  link={`/databases/${id}/products/create`} 
  linkText="Add Product"
/>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseDetailPage;
