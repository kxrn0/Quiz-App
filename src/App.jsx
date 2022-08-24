import { useEffect, useState } from "react";
import Start_Screen from "./components/Start_Screen";
import { nanoid } from "nanoid";
import Question from "./components/Question";
import "./components/question.css";
import "./lds.css";

function parse_special_chars(string) {
  const parser = new DOMParser();
  const decodedString = parser.parseFromString(`<!doctype html><body>${string}`, 'text/html').body.textContent;

  return decodedString;
}

function App() {
  const [startMounted, set_start_mounted] = useState(true);
  const [startHidden, set_start_hidden] = useState(false);
  const [data, set_data] = useState({ questions: 0, categories: [] });
  const [answers, set_answers] = useState([]);
  const [questions, set_questions] = useState([{ question: "How many books are in Euclid&#039;s Elements of Geometry?", choices: ["yes", "no", "maybe"], answer: "maybe", id: nanoid() }]);
  const [isOver, set_is_over] = useState(false);
  const [numberError, set_number_error] = useState(false);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    async function fun(url) {
      let response;

      response = await fetch(url);
      response = await response.json();
      return response;
    }

    const questions = [];
    for (let i = 0; i < data.questions; i++) {
      const cat = data.categories[~~(Math.random() * data.categories.length)];

      questions.push(fun(`https://opentdb.com/api.php?amount=1&category=${cat}&type=multiple`));
    }

    Promise.all(questions).then(values => {
      const results = [];

      for (let value of values) {
        const { question, correct_answer: answer, incorrect_answers: choices } = value.results[0];
        const result = {
          question: parse_special_chars(question),
          answer: parse_special_chars(answer),
          choices: [...choices.map(choice => parse_special_chars(choice)),
          parse_special_chars(answer)],
          id: nanoid()
        };

        results.push(result);
      }
      set_questions(results);
      set_answers(results.map(({ id, answer }) => ({ id, answer, userAnswer: '' })));
      set_loading(false);
    });
  }, [data]);

  function handle_start_screen(data) {
    set_loading(true);
    set_start_hidden(true);
    set_data(data);
    setTimeout(() => set_start_mounted(false), 330);
  }

  function select_answer(id, answer) {
    set_answers(prevAnswers => {
      const index = prevAnswers.findIndex(answer => answer.id == id);
      const newAnswer = { ...prevAnswers[index], userAnswer: answer };

      return prevAnswers.slice(0, index).concat(newAnswer).concat(prevAnswers.slice(index + 1));
    });
  }

  function quiz() {
    if (answers.some(answer => !answer.userAnswer)) {
      set_number_error(true);
      setTimeout(() => set_number_error(false), 3333);
      return;
    }

    if (isOver) {
      set_is_over(false);
      set_start_mounted(true);
      set_loading(true);
      setTimeout(() => set_start_hidden(false), 0);
    }
    else
      set_is_over(true);
  }

  function compute_correct_answers() {
    let count;

    count = 0;
    for (let i = 0; i < questions.length; i++)
      if (questions[i].answer == answers[i].userAnswer)
        count++;
    return count;
  }

  return (
    <div className="App giorgio">
      <div className={`loading giorgio ${loading ? "shown" : "hidden"}`}>
        <div className="loading-content">
          <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="loading-message">Loding Content...</p>
        </div>
      </div>
      {startMounted && <Start_Screen hidden={startHidden} handle={handle_start_screen} />}
      <main className="main-screen">
        <div className="questions">
          {questions.map(question => <Question key={question.id} question={question} select={select_answer} isOver={isOver} />)}
        </div>
        <div className="controls">
          {isOver && <div className="score">You scored {compute_correct_answers()} / {data.questions} correct answers</div>}
          <div className="quiz-wrapper">
            <button className="play-button debutton" onClick={quiz}>{isOver ? "Play again" : "Check answers"}</button>
            {numberError && <p className="error">Please finish the quiz!</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;