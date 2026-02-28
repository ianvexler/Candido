import Image from "next/image";
import Spy from "@/lib/images/Spy.png";

interface ServerErrorProps {
  title?: string;
  description?: string;
}

const ServerError = ({
  title = "Something went wrong",
  description = "An unexpected error occurred. We're looking into it.",
}: ServerErrorProps) => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-col items-center gap-6 text-center mt-15">
        <Image
          src={Spy}
          alt="Server error"
          width={240}
          height={180}
          className="object-contain"
        />

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;