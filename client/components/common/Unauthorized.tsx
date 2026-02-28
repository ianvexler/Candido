import Image from "next/image";
import Police from "@/lib/images/Police.png";

interface UnauthorizedProps {
  title?: string;
  description?: string;
}

const Unauthorized = ({
  title = "Unauthorized",
  description = "Stop there! You are not authorized to access this page.",
}: UnauthorizedProps) => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-col items-center gap-6 text-center mt-15">
        <Image
          src={Police}
          alt="Unauthorized"
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

export default Unauthorized;