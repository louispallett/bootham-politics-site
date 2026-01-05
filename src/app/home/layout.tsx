export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="main-title-wrapper">
        <img src="/images/big-ben.svg" alt="" className="h-24" />
        <div>
          <h1>Bootham School</h1>
          <h3 className="text-right">Politics Department</h3>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}

