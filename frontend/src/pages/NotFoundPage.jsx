import { Link } from "react-router";
import { HomeIcon, FileQuestionIcon } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">

        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-primary/10 p-6">
            <FileQuestionIcon className="size-16 text-primary" />
          </div>
        </div>

        <h1 className="text-7xl font-bold text-primary">
          404
        </h1>

        <h2 className="text-3xl font-bold mt-4">
          Page Not Found
        </h2>

        <p className="mt-4 text-base-content/70">
          The page you're looking for doesn't exist,
          has been moved, or the URL may be incorrect.
        </p>

        <Link
          to="/"
          className="btn btn-primary mt-8"
        >
          <HomeIcon className="size-5" />
          Go to Home
        </Link>

      </div>
    </div>
  );
};

export default NotFoundPage;