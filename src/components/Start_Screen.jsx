import { useEffect, useId, useState } from "react";
import "./categories.css";
import "./start_screen.css";

export default function Start_Screen({ hidden, handle }) {
    const [openCats, set_open_cats] = useState(false);
    const [state, set_state] = useState({ questions: 0, categories: [] });
    const [numberError, set_number_error] = useState(false);
    const [catsError, set_cats_error] = useState(false);
    const data = [
        {
            topic: "Science & Nature",
            category: 17
        },
        {
            topic: "Science : Computers",
            category: 18
        },
        {
            topic: "Science : Mathematics",
            category: 19
        },
        {
            topic: "History",
            category: 23
        },
        {
            topic: "Animals",
            category: 27
        },
        {
            topic: "Entertainment: Japanese Anime & Manga",
            category: 31
        },
    ];

    function open_cats() {
        set_open_cats(prevCats => !prevCats);
    }

    function add_listener(event) {
        const dropDown = document.querySelector(".drop-down");
        const dropDownButton = dropDown.querySelector(".drop-down-button");

        if (event.target == dropDownButton || event.target.closest(".drop-down"))
            return;

        set_open_cats(false);
    }

    function handle_input(event) {
        if (event.target.type == "number")
            set_state(prevState => ({ ...prevState, [event.target.name]: event.target.value }));
        else {
            if (event.target.checked)
                set_state(prevState => ({ ...prevState, categories: [...prevState.categories, event.target.value] }));
            else
                set_state(prevState => ({ ...prevState, categories: prevState.categories.filter(cat => cat != event.target.value) }));
        }
    }

    function start_quizz() {
        if (!state.questions || !state.categories.length) {
            if (!state.questions) {
                set_number_error(true);
                setTimeout(() => set_number_error(false), 3333);
            }
            if (!state.categories.length) {
                set_cats_error(true);
                setTimeout(() => set_cats_error(false), 3333);
            }
        }
        else
            handle(state);
    }

    useEffect(() => {
        document.addEventListener("click", add_listener)

        return () => document.removeEventListener("click", add_listener);
    }, []);

    return (
        <div className={`start-screen giorgio ${hidden ? "hidden" : "shown"}`}>
            <div className="content-wrapper">
                <h1 className="hero-title">Quizzical</h1>
                <div className="number-of-questions-input">
                    {numberError && <p className="error">Please enter a valid number</p>}
                    <label htmlFor="number-of-questions">Number of questions : </label>
                    <input type="number" id="number-of-questions" name="questions" value={state.questions} onChange={handle_input} />
                </div>
                <div className="cats-wrapper">
                    {catsError && <p className="error">Please select at least one category</p>}
                    <div className="categories-selector">
                        <label htmlFor="me" className="title">Categories : </label>
                        <div className={`drop-down ${openCats ? "active" : ''}`}>
                            <button id="me" className="drop-down-button" onClick={open_cats}>{openCats ? "Close" : "Select"}</button>
                            <div className="drop-down-content">
                                <ul>
                                    {data.map(item => {
                                        return (
                                            <li key={useId()} className="drop-item">
                                                <input type="checkbox" id={`category-${item.category}`} value={item.category} onClick={handle_input} />
                                                <label htmlFor={`category-${item.category}`}>{item.topic}</label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="start-quizz debutton" onClick={start_quizz}>Start</button>
            </div>
        </div>
    );
}