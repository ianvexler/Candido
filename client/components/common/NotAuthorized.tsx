import Image from "next/image";
import Police from "@/lib/images/Police.png";

interface NotAuthorizedProps {
  title?: string;
  description?: string;
}

const NotAuthorized = ({
  title = "Unauthorized",
  description = "Stop there! You are not authorized to access this page.",
}: NotAuthorizedProps) => {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="flex flex-col items-center gap-6 text-center">
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

export default NotAuthorized;