import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Logo"
        width={116}
        height={116}
        className="rounded-full max-sm:scale-x-75 max-sm:scale-y-75"
      />
    </div>
  );
};

export default Logo;
