import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <WebsiteHeader />
      <main className="flex-grow">
        {children}
      </main>
      <WebsiteFooter />
    </div>
  );
}