import Start_Screen from "./components/Start_Screen";

function App() {
  return (
    <div className="App">
      {/* 
        Shalom.
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
      */}
      <Start_Screen />
    </div>
  )
}

export default App
