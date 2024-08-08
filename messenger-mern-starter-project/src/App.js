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
  const [onlineUsers, setOnlineUsers] = useState({});





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
    let name = '';
    while (!name)
    {
      name = prompt('Please enter your name');
      if (name)
      {
        name = name.trim();
      }
    }
    setUsername(name);
    socket.emit('join', { username: name });
    
  }, []);


  useEffect(() =>
  {

    socket.on('user_online', (data) =>
    {
      console.log("user online", data.username)
      setOnlineUsers(prevUsers => ({ ...prevUsers, [data.username]: true }));
      console.log("Online users", onlineUsers)
    });
    
    socket.on("receive_message", (data) => {
      
      setMessages(prevMessages => [...prevMessages, data]);

    })

    socket.on('message_edited', (data) =>
    {
      setMessages(prevMessages =>
        prevMessages.map(msg => msg._id === data._id ? { ...msg, message: data.message, edited: true } : msg)
      );
    });

    socket.on('message_deleted', (data) =>
    {
      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== data.id));
    });


  }, [socket])


  const sendMessage = async (e) =>
  {
    e.preventDefault();

    const message = {
      username: username,
      message: input,
      timestamp: Date.now(),
      delivered: false,
      edited: false,
      online: true
    };

    socket.emit("send_message", message);

    await axios.post('/save/message', message);

    setInput('');
  };

  const editMessage = async (id, newMessage) =>
  {

    console.log(id, newMessage)

    socket.emit('edit_message', { id, message: newMessage, username });

    await axios.put(`/edit/message/${ id }`, { message: newMessage, username });

  };

  const deleteMessage = async (id) =>
  {
    
    socket.emit('delete_message', { id, username });
    
    await axios.delete(`/delete/message/${ id }`, { data: { username } });

    console.log("deleted")
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
            <Message
              key={message._id}
              message={message}
              username={username}
              onEdit={editMessage}              
              onDelete={deleteMessage}
              onlineStatus={onlineUsers[message.username]}
            />
          ))
        }
      </FlipMove>
    </div>
  );
}

export default App;