import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import Projects from "../components/projects/Projects";

export default function Index() {
    return (
        <div className="flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-slate-900 via-gray-900 to-zinc-900" >
            <Navigation isSearch={true} />
            <DndProvider backend={HTML5Backend}>
                <Projects/>
            </DndProvider>
            <Footer/>
        </div>
    );
}
