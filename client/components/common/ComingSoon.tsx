import Image from "next/image";
import WorkingOnThis from "@/lib/images/WorkingOnThis.png";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

const ComingSoon = ({
  title = "Coming soon",
  description = "We're building more features to help you track and land your dream job.",
}: ComingSoonProps) => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-col items-center gap-6 text-center mt-15">
        <Image
          src={WorkingOnThis}
          alt="Work in progress"
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

export default ComingSoon;