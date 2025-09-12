export default function HomeLayout({
    children
} : {
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="flex justify-center items-center my-8 mt-16">
                <img src="/images/big-ben.svg" alt="" className="h-24"/>
                <div className="flex flex-col">
                <h1>Bootham School</h1>
                <h3 className="text-right">Politics Department</h3>
                </div>
            </div>
            <main>{children}</main>
        </div>
    )
}