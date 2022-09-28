
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import Teams from "../components/team/Teams";

export default function Team() {
    return (
        <div className="flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-slate-900 via-gray-900 to-zinc-900" >
            <Navigation />
            <Teams/>
            <Footer/>
        </div>
    );
}
