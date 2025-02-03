import { Heart } from "lucide-react";

const Branding = ({className}) => {
  return (
    <div className={`text-neutral-400 flex items-center justify-center gap-2 ${className}`}>
      <span>Made with</span>
      <Heart />
      <span>
        <span>by </span>
        <a
          className="text-sky-400 underline"
          href="https://harshpriye.in"
          target="_blank"
        >
          Harsh Priye
        </a>
      </span>
    </div>
  );
};

export default Branding;
