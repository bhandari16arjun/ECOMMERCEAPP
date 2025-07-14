import { assets } from "../assets/assets";

export default function Navbar({setToken}){
    const handleLogout=()=>{
         setToken('');
    }
    return(
        <div className="flex items-center justify-between  text-white px-[4%] py-2">
            <img className="w-[max(10%,80px)]" src={assets.logo} alt="" />
            <button onClick={handleLogout} className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer">Logout</button>
        </div>
    )
}