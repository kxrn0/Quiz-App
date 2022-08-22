import { useEffect, useState } from "react";
import "./categories.css";
import "./start_screen.css";

export default function Start_Screen(props) {
    const [openCats, set_open_cats] = useState(false);

    function open_cats() {
        set_open_cats(prevCats => !prevCats);
    }

    useEffect(() => {
        document.addEventListener("click", event => {
            const dropDown = document.querySelector(".drop-down");
            const dropDownButton = dropDown.querySelector(".drop-down-button");

            if (event.target == dropDownButton || event.target.closest(".drop-down"))
                return;
            
            set_open_cats(false);
        });
    }, []);

    return (
        <div className="start-screen">
            <div className="content-wrapper">
                <h1 className="hero-title">Quizzical</h1>
                <div className="number-of-questions-input">
                    <label htmlFor="number-of-questions">Number of questions : </label>
                    <input type="number" id="number-of-questions" />
                </div>
                <div className="categories-selector">
                    <p className="title">Categories : </p>
                    <div className={`drop-down ${openCats ? "active" : ''}`}>
                        <button className="drop-down-button" onClick={open_cats}>Select</button>
                        <div className="drop-down-content">
                            <ul>
                                <li className="drop-item">
                                    <input type="checkbox" id="item-1" />
                                    <label htmlFor="item-1">Item 1</label>
                                </li>
                                <li className="drop-item">
                                    <input type="checkbox" id="item-2" />
                                    <label htmlFor="item-2">Item 2</label>
                                </li>
                                <li className="drop-item">
                                    <input type="checkbox" id="item-3" />
                                    <label htmlFor="item-3">Item 3</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <button className="start-quizz">Start</button>
            </div>
        </div>
    );
}