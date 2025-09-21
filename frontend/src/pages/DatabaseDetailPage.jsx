import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import NotFound from "../components/NotFound";
import { DatabaseIcon, PackageIcon } from "lucide-react";
import DatabaseCard from "../components/DatabaseCard";
import AddButton from "../components/AddButton";
import RateLimitedUI from "../components/RateLimitedUI";

const DatabaseDetailPage = () => {
  const { id } = useParams();
  const [database, setDatabase] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setRateLimited] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dbRes, productRes] = await Promise.all([
          api.get(`/databases/${id}`),
          api.get(`/products?database=${id}`),
        ]);

        console.log("Products:", productRes.data);

        setDatabase(dbRes.data);
        setProducts(productRes.data);
        setRateLimited(false);
      } catch (error) {
        console.error("Error fetching database details:", error);
        if (error.response?.status === 429) {
          setRateLimited(true);
        } else {
        toast.error("Failed to load database details");
        }




      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen">
  //       <Navbar />
  //       <div className="max-w-7xl mx-auto p-4 mt-6">
  //         <p className="text-primary">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!database) {
  //   return (
  //     <div className="min-h-screen">
  //       <Navbar />
  //       <div className="max-w-7xl mx-auto p-4 mt-6">
  //         <p className="text-red-500">Database not found.</p>
  //         <Link to="/databases" className="text-primary hover:underline block mt-4">
  //           ← Back to Databases
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      {!isRateLimited &&       <div className="max-w-7xl mx-auto p-4 mt-6">
        <Link to="/databases" className="text-primary hover:underline">
          ← Back to Databases
        </Link>

<div className="mt-4 mb-10">
  {database ? (
    <DatabaseCard db={database} />
  ) : (
    <p className="text-primary">Loading database...</p>
  )}
</div>
        {/* Products */}
        <h3 className="text-2xl font-bold flex items-center gap-2 mb-10">Products <AddButton className="scale-75" /></h3>
        {loading && <p className="text-primary">Loading products...</p>}
        {!loading && products.length === 0 ? (
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
  <ProductCard 
    key={product._id} 
    product={product} 
    setProducts={setProducts} 
  />
))}
          </div>
        )}
      </div>}
    </div>
  );
};

export default DatabaseDetailPage;
