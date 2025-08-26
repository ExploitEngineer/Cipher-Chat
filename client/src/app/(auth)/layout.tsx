import Lightning from "@/components/bits/lightning";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Lightning
          hue={260}
          xOffset={-0.1}
          speed={1}
          intensity={2}
          size={1.2}
        />
      </div>

      <div className="relative flex h-full w-full flex-col items-center justify-center">
        {children}
      </div>
    </section>
  );
}
