import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, FormControl, InputLabel, Input } from '@material-ui/core'
import Message from './Message';
import db from './firebase';
import firebase from 'firebase'
import FlipMove from 'react-flip-move'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001");

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')

  // useEffect(() => {
  //   db.collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
  //     setMessages(snapshot.docs.map(doc => ({ id: doc.id, message: doc.data() })))
  //   })
  // }, [])

  useEffect(() =>
  {
    const fetchItems = async () =>
    {
      const items = await getItems();
      setItems(items);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    setUsername(prompt('Please enter your name'))
  }, [])


  useEffect(() =>
  {
    socket.on("receive_message", (data) =>
    {
      console.log("Received",data)
      setMessages(data.input);
      
    })
  }, [socket])
  
  const sendMessage = (e) => {
    
    // db.collection('messages').add({
    //   message: input,
    //   username: username,
    //   timestamp: firebase.firestore.FieldValue.serverTimestamp()
    // })

    
    socket.emit("send_message", {input});
    setInput('')

  }


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
          messages.map(({ id, message }) => (
            <Message key={id} message={message} username={username} />
          ))          
        }        
      </FlipMove>
    </div>
  );
}

export default App;
