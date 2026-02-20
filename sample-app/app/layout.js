import "./globals.css";

export const metadata = {
  title: "Lab Sample Intake",
  description: "Sample ID lookup and collection data submission",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
