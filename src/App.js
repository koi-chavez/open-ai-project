import { useState } from 'react';
import './App.css';
import randomQuestion from './random';
 
function App() {
 const [promptValue, setPromptValue] = useState('');
 const [responseArray, setResponseArray] = useState([]);
 const [promptArray, setPromptArray] = useState([]);
 
 let data = {
   prompt: promptValue,
   temperature: 0.5,
   max_tokens: 64,
   top_p: 1.0,
   frequency_penalty: 0.0,
   presence_penalty: 0.0,
  };
 
  async function fetchResponse() {
   const response = await fetch(
       `https://api.openai.com/v1/engines/text-curie-001/completions`,
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`,
         },
         body: JSON.stringify(data),
        });
 
   let aiResponse;
   try {
     aiResponse = await response.json();
   } catch (err) {
       console.log('Response Error', err);
   }
   setPromptArray(oldArray => [...oldArray, promptValue]);
   setResponseArray(oldArray => [...oldArray, aiResponse?.choices?.[0]?.text]);
 }
 
 async function handleSubmit(event) {
   event.preventDefault();
   await fetchResponse();
 }
 
 async function choosePrompt(event) {
   event.preventDefault();
   let randomNum = Math.floor(Math.random() * 50);
   let randomPrompt = randomQuestion.results[randomNum].question;
   setPromptValue(randomPrompt);
   document.querySelector('#text-input').value = `${randomPrompt}`;
 }
 
 
 const ResponseUI = () => {
   return (
     <div className='listContainer'>
       {
     promptArray.slice(0).reverse().map((item, index) => {
       return (
         <div className='list' key={index}>
           <div className='listItem'>
             <strong>Prompt: </strong>
             {item}
           </div>
           <div className='listItem'>
             <strong>Response: </strong>
             {responseArray[promptArray.indexOf(item)]}
           </div>
         </div>
       );
     }
     )
   }
     </div>
   )
 }
 
 return (
   <div className="App">
     <h1> Fun with AI </h1>
     Please enter a prompt:
     <form id="prompt-form" className="prompt">
       <input type="text" id="text-input" className="textBox" onChange={ (event) => setPromptValue(event.target.value) }/>
       <br />
       <input type="submit" value="Submit" onClick={handleSubmit} className="button" />
       <button className='button' onClick={choosePrompt}>Pick a Prompt for me</button>
     </form>
    
     <h1> Responses </h1>
     <ResponseUI />
   </div>
 );
}
 
export default App;
 

