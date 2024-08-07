import React, { forwardRef, useState } from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core'
import './Message.css'


const Message = forwardRef(({ message, username, onEdit, onDelete, onlineStatus }, ref) =>
{
    
    const isUser = username === message.username;
    const [isEditing, setIsEditing] = useState(false);
    const [editInput, setEditInput] = useState(message.message);

    const handleEdit = () =>
    {
        setIsEditing(true);
    };

    const handleSave = () =>
    {
        console.log("save",message)
        onEdit(message._id, editInput);
        setIsEditing(false);
        console.log("save",message)
    };

    const handleDelete = () =>
    {
        onDelete(message._id);
    };
    return (
        <div ref={ref} className={`message ${ isUser && 'message__user' }`}>
            <Card className={isUser ? 'message__userCard' : 'message__guestCard'}>
                <CardContent>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                        />
                    ) : (
                        <Typography
                            color='white'
                            variant='h5'
                            component='h2'
                        >
                            {!isUser && `${ message.username || 'Unknown user' }:`} {message.message}
                        </Typography>
                    )}
                    {message.edited && <Typography variant='body2' color='textSecondary'>(Edited)</Typography>}
                    {!isUser && (
                        <Typography variant='body2' color='textSecondary'>
                            {onlineStatus ? 'Online' : 'Offline'}
                        </Typography>
                    )}
                </CardContent>
                {isUser && (
                    <div>
                        {isEditing ? (
                            <Button onClick={handleSave}>Save</Button>
                        ) : (
                            <Button onClick={handleEdit}>Edit</Button>
                        )}
                        <Button onClick={handleDelete}>Delete</Button>
                    </div>
                )}

            </Card>
        </div>
    )
})

export default Message