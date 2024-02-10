import Image from "next/image";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="flex flex-row justify-between">
      <h1 className="text-4xl text-white">{title}</h1>
      <Image src="/logo.svg" alt="kicka logo" width={100} height={100} />
    </header>
  );
}
