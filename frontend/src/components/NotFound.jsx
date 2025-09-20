import { Link } from "react-router";

const NotFound = ({ icon: Icon, title, description, link, linkText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-primary/10 rounded-full p-8">
        <Icon className="size-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-base-content/70">{description}</p>
      <Link to={link} className="btn btn-primary">
        {linkText}
      </Link>
    </div>
  );
};

export default NotFound;
