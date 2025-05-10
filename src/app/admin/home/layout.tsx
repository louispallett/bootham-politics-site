import AdminControls from "./AdminControls";

export default function UsersLayout({
    children
} : {
    children: React.ReactNode;
}) {
    return (
        <div>
            <AdminControls />
            <main className="my-2.5">{children}</main>
        </div>
    )
}