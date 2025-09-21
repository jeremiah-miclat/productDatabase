import { PlusIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const AddButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${location.pathname}/create`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white shadow hover:bg-primary/90 transition"
    >
      <PlusIcon className="w-6 h-6" />
    </button>
  );
};

export default AddButton;