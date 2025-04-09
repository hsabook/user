import AuthGuard from "@/components/AuthGuard";

export default function ActivatedBooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
} 