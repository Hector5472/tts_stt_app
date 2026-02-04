export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ background: "#fff", color: "#000" }}>
        {children}
      </body>
    </html>
  );
}
