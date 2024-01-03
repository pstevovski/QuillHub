export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2">
      <section className="flex flex-col justify-center items-center border-r h-screen">
        <h1 className="text-5xl font-bold mb-2">Quillhub</h1>
        <p>Unfold Your Imagination, Share Your Universe</p>
      </section>

      <section className="flex flex-col justify-center items-center h-screen">
        {children}
      </section>
    </div>
  );
}
