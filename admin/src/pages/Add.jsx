import Sidebar from "../components/Sidebar";

export default function Add(){
    return(
        <div className="bg-gray-50 min-h-screen">
           <>
            <Navbar />
            <hr />
            <div className="flex w-full">
               <Sidebar />
            </div>
           </>
        </div>
    )
}