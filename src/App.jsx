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


/* 
        I want to make a basic quizz app.
        When the user loads the page, initially there's blood.
        There's a screen prompting the user to select the category, the number 
        of questions, and a button prompting the user to start the quizz.
        The problem is that the API that I'm using only let's you choose one category at a time, 
        and also, I want to avoid certain categories, so I guess what I'll do is make several API
        calls at the beggining with the categories that I sneed.
        
        I wrote a simple component to let the user select the sections that they want. Here it is: https://jsfiddle.net/bey6zfpm/
        For now it's not componentized; it's part of the initial screen component because still have to determine what kind of 
        state the app container will have to keep. Once I've determined that, maybe I'll make it a separate component.

        I guess for now I'll work on the CSS for the initial screen.

        I think I'm done with the CSS for the start screen.
        
        I want the screens to slide like what I did with https://kxrn0.github.io/Tic-tac-toe-game/dist/, but I think that may be 
        a bit difficult, since I'm using React now. I can implement the sliding the same way I did in the link above, but then 
        the start screen would be rendered for every state transition, which doesn't sound like too much of an issue here, but 
        if I were making a more complex app, having to rerender many screens that are out of view every time the state of the
        main app changes may affect performance. What I immediately thing of is this
          1. create a state variable for the main app, that is true when the start screen is being shown
          2. add an event listener to the start button
          3. when the start button is pressed, add a class to the main screen that slides it out
          4. then set a time out equal to how long it takes for the screen to slide out
          5. once the time is over, change the state variable to false
        The start screen will be rendered conditionally based on the state of the main app. I would have to do something similar to bring 
        back the screen.

        What kind of data does the main app hold? Fow now I'll test the main button to show and hide the start screen.
        I will pass a function from the main app to the start screen component. When the start button in the start screen component is 
        pressed, that function will be called. In there, the data of the main app will be set, and the start screen will be hidden.
        how will the main app data be set there? I still have to think about it a bit more, for now I'll focus on hidding the start screen.

        Looks like I will need two state variables for hidding the start screen; the first will be for adding the class to hide the
        component, and the second will be for unmounting the component.
        The mounted state will only be used inside of the main app, the hidden state variable will be passed down to the start screen.

        So what happens when the user clicks the start button? the start screen component calls the function that it's passed down through props,
        inside of this function, a setter function is called, which sets state variables that indicate what kind of questions to query from
        the API. I will set up a useEffect with that data as a dependency, so everytime it's updated, new questions will be generated.
        For now I'll just log the data to the console.

        I can make API calls and I do get the required data, but I need to make it so that the start screen determines the shape of the
        query. For that I need to set the data in the function that hides the start screen. So I will keep variables for the values of the inputs
        in the state of the screen component.

        How do I do this? I have a set of checkboxes, and I want to keep an array in the state of the component, the array holds strings which are 
        the values of the checkboxes that are checked, os whenever I click a checkbox, if the checkbox is checked, I will add its value to the state
        array, otherwise I will set the state array to the result of filtering out the string in the array whose vaule is equal to the value of the
        array.

        I need to keep track of the number of correct answers, for that I guess I'll create a state variable in the main app, then pass a function
        to each question component, so that every time an option is clicked, it calls that function, which updates the number of correct answers in 
        the main app.

        I need a different way to keep track of the number of correct answers. At first it was just a variable that increased each time the user
        selected a correct answer, and decreased each tim the user selected an incorrect one. But this doesn't work, since the user can press the
        correct answer as many times as they want and get a very large number of correct answers. Instead, I'll need to find a better way to
        store the answers. Perhaps the answers variable is an array of objects, each object has the id of the question, the correct answer, and
        the user's answer, then when one choice is clicked, this variable is updated.

        When the quiz is over, I want to display the choices differently. The radio buttons will be disabled, and the correct answer will be 
        given different styling. The incorrect answers will also be given different stylings. So how am I going to do this? There is a state variable 
        in the main app that indicates if the user has finished the quiz or not. I can use that variable in the question components to conditionally
        render a class that applies the necessary styles. What about the correct answer and the user's answer? A question object that is passed to a
        question component has a question field tha holds the string for the question, it also has an array of strings which are the choices, and
        it has a string variable for the correct answer. How will I know the user's answer? I can pass down a variable to the question component to
        the main app, but I think a better way would be to keep a state variable in the question component. This state variable has a value of the value
        of the checked radio button, and only the button with this value will be checked. For this I would need the user to have answered all questions,
        so there should be a way in the parent component to prevent the user from finishing the quiz before all questions have been answered. I think
        the answers variable will serve that purpose; if answers.length < questions.length; show an error message to the user asking them to finish all 
        the questions.
        So now I have all answers, and the correct answer as well, when I'm mapping the question data to create the radio buttons, if the quiz is over,
        and if the current choice value is equal to the value of the selected state variable; then add a class to this particular radio button, which will
        indicate that this one holds the correct answer.
        The correct one is styled correctly, how do I add a class to the wrong one?  If the selected is equal to choice and selected is different from 
        question.answer; then this is the wrong hole.
        I think that's it for this. As always, CSS feels a bit hacky, but I think that's how CSS is s'pposed to be.
        I think I would like to implement another three features before I can consider this as finished. 
          1. I want to force the user to enter a number of questions and select at least one category before submitting.
          2. I would like to force the user to answer all questions before they can finish the quiz. 
          3. Finally, I'd like to add a loading screen before the questions are loaded.
        I know that due how I'm quering the questions sometimes I may get repeated questions, but that's a result of selecting too few categories, so for
        now I'll overlook that.
        I wanted to add the loading spinner that I used in https://github.com/kxrn0/TODO/blob/main/src/empty_period.js#L78, but it looked a bit complicated,
        so I decided to go for a premade one that I found online.
        I think I may be done with this. It looks a bit squished on mobile, and I think I need to learn more stuff, but all in all it's quite decent for my
        first solo React app.
  */