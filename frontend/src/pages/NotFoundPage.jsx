import React from "react";
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">Page Not Found</p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
