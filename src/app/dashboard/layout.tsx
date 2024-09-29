import DashboardHeader from "./components/header/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <section>
        <DashboardHeader />
        {children}
    </section>

}