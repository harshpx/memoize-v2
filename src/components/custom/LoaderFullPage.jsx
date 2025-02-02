import { Loader2 } from "lucide-react";

const LoaderFullPage = () => {

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center bg-black bg-opacity-50 fixed top-0 left-0 z-10">
      <Loader2 className="w-10 h-10 animate-spin text-white" />
    </div>
  );
};

export default LoaderFullPage;