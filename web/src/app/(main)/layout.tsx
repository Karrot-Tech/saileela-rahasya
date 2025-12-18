
import Layout from "@/components/layout/Layout";

export default function MainAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Layout>
            {children}
        </Layout>
    );
}
