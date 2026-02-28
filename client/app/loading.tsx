import Loader from "@/components/common/Loader";

// TODO: Replace this with skeleton per page
const Loading = () => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 flex min-h-screen items-center justify-center">
      <Loader />
    </div>
  );
};

export default Loading;
