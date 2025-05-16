'use client';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        {/* Sidebar sẽ được thêm vào đây */}
      </div>
      <div className="admin-content">
        <header className="admin-header">
          {/* Header sẽ được thêm vào đây */}
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
} 