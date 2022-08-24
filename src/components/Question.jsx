import { useState } from "react";

export default function Question({ question, select, isOver }) {
    const [selected, set_selected] = useState('');

    function update(event) {
        select(question.id, event.target.value);
    }

    function handle_input(event) {
        set_selected(event.target.value);
    }

    return (
        <div className={`question ${isOver ? "is-over" : ''}`}>
            <p className="question-head">{question.question}</p>
            <ul>
                {question.choices.map((choice, index) => {
                    return (
                        <li key={`key-${index}-${question.id}`}>
                            <label 
                            htmlFor={`choice-${index}-${question.id}`}
                            className={isOver && choice === question.answer ? "correct" : 
                                isOver && selected == choice && selected != question.answer ? "incorrect" : ''
                            }
                            >
                                <input
                                    id={`choice-${index}-${question.id}`}
                                    type="radio" name={`choice-${question.id}`}
                                    value={choice}
                                    onClick={update}
                                    checked={selected === choice}
                                    disabled={isOver}
                                    onChange={handle_input}
                                     />
                                <span>{choice}</span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}