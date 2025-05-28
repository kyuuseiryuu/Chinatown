const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
      {children}
    </div>
  );
}

export default Layout;