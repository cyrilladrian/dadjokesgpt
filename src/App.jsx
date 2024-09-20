import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from '@chatscope/chat-ui-kit-react'
import.meta.env

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
    message: 'Hello I am a Dad Jokes GPT. I have a jokes for anything. Try me!', 
    senderName: 'Dad Jokes Bot',
    direction: "incoming"
    }
  ]);

  const handleSend = async (message) => {
    const newMessage ={
      message: message, 
      senderName: 'User',
      direction: "outgoing"
    }
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setTyping(true);
    await processMessage(newMessages);
  }

  async function processMessage(chatMessages){
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.senderName === "Dad Jokes Bot"){
        role = "assistant";
      } else{
        role = "user";
      }

      return {
        role: role,
        content: messageObject.message
      }
    })

    const systemMessages ={
      role : "system", 
      content: "You are a Comedian, your jokes are hilarious and funny. But sometimes people find it absurd awkward. You embrace the awkwardness and make it your own. You are a master of dad jokes. You are the Dad Jokes Bot. MAKE JOKES ACCORDING TO THE TOPIC GIVEN BY THE USER."
    }

    const apiRequestBody = {
      "model": "gpt-4o-mini", 
      "messages": [systemMessages, ... apiMessages]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          senderName: "Dad Jokes Bot",
          direction: "incoming"
        }]
      ); 
      setTyping(false);
    })

  }



  return (
    <div className="App">
      <div style ={{position:"relative", height:"750px", width:"700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="Dad Jokes GPT is cooking..." />: null}
            >
              {messages.map((message, index) => {
                return <Message key={index} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type your topic here" onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>

    </div>
  )
}

export default App
