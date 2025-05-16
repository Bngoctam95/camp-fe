import UserHeader from "@/components/layouts/user.header";
import UserFooter from "@/components/layouts/user.footer";

type Props = {
  params: { locale: string };
  children: React.ReactNode;
};

export default function UserLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <main className="flex-1">
        {children}
      </main>
      <UserFooter />
    </div>
  );
} 