import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, FormControl, InputLabel, Input } from '@material-ui/core'
import Message from './Message';

import FlipMove from 'react-flip-move'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import io from 'socket.io-client'
import axios from './axios';



const socket = io.connect("http://localhost:3001");

function App()
{
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')

  
  

  
  useEffect(() =>
  {
    const sync = async () =>
    {
      console.log("axios")
      await axios.get('/retreieve/conversation').then((res =>
      {
        setMessages(res.data);
        console.log(res)
      }))
    }
    sync()
  }, [input])



  useEffect(() =>
  {
    setUsername(prompt('Please enter your name'))
  }, [])


  useEffect(() =>
  {
    console.log("this is receiving")
    socket.on("receive_message", (data) =>
    {
      console.log("Received", data)
      setMessages(prevMessages => [...prevMessages, data]);
      

    })
  }, [socket])


  const sendMessage = async (e) =>
  {
    e.preventDefault();

    const message = {
      username: username,
      message: input,
      timestamp: Date.now()
    };

    socket.emit("send_message", message);

    await axios.post('/save/message', message);

    setInput('');
  };


  return (
    <div className="App">
      <img src="https://play.google.com/store/apps/details?id=world.mnetplus.talk.aos&hl=en_US" alt="messenger logo" />
      <h2>Welcome {username}</h2>

      <form className='app__form' >
        <FormControl className='app__formControl' >
          <Input className='app__input' placeholder='Enter a message...' value={input} onChange={(e) => setInput(e.target.value)} />
          <IconButton className='app__iconButton' variant='text' color='primary' disabled={!input} onClick={sendMessage} type="submit" >
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>

      <FlipMove>
        {
          messages.map(message => (
            <Message key={message._id} message={message} username={username} />
          ))
        }
      </FlipMove>
    </div>
  );
}

export default App;
