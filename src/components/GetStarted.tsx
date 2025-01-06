import { BiDish } from "react-icons/bi";
import { FaHandHoldingMedical } from "react-icons/fa";
import { IoIosHourglass } from "react-icons/io";

export default function GetStarted() {
    return(
    <div className="py-10 px-5 bg-gradient-to-r from-slate-50 via-green-50 to-teal-50">
        <h2 className="text-3xl font-bold mb-10">Get Started</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 ">
            <div className="flex items-center flex-col gap-3 p-5 border border-slate-400 rounded-lg">
                <FaHandHoldingMedical className="text-5xl text-green-600" />
                <p>Increase your healt with rillbite</p>
            </div>
            <div className="flex items-center flex-col gap-3 p-5 border border-slate-400 rounded-lg">
                <IoIosHourglass className="text-5xl text-green-600" />
                <p>Save your time with rillbite</p>
            </div>
            <div className="flex items-center flex-col gap-3 p-5 border border-slate-400 rounded-lg">
                <BiDish className="text-5xl text-green-600" />
                <p>Make your own schedule with rillbite</p>
            </div>
        </div>
    </div>
    )
}