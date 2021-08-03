import {useEffect, useState} from "react";
import {Spring} from "./components/Spring";
import {SimpleModal} from "./components/SimpleModal";

function App() {
    const [open ,setOpen] = useState(false);

    useEffect(() => {
        Spring(setOpen);
    }, [])

    return (
        <div id="app" >
            <SimpleModal openModal={open} handleSetOpen={setOpen}/>
        </div>
    );
}

export default App;
