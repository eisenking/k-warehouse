import Navbar from "@/components/Navbar";

export default async function Template({ children }: { children: React.ReactNode }) {

  return (
    <>
        <Navbar />
        {children}
    </>
)};