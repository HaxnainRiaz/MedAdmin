import "./globals.css";

export const metadata = {
  title: "Medify Admin Panel",
  description: "Complete clinic operations and website management interface",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
