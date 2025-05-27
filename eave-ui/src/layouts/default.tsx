import { Navbar } from "@components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col bg-gradient-to-br from-green-300 to-amber-100">
      <Navbar />
      <main className="container mx-auto w-full flex-grow">{children}</main>
      <footer className="w-full flex items-center justify-between py-2">
        <div className="text-default-600 text-xs mx-auto flex flex-col items-center">
          <span>
            &copy;{" "}
            <a
              href="https://www.dfki.de/web/forschung/forschungsbereiche/smart-service-engineering"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              2025 Deutsches Forschungszentrum für Künstliche Intelligenz (DFKI)
            </a>
          </span>
          <span>
            <a
              href="https://forms.office.com/e/A99vxUWW8v"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Contact Us
            </a>
          </span>
          <span>
            Project website:{" "}
            <a
              href="https://www.escade-project.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              www.escade-project.de
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
