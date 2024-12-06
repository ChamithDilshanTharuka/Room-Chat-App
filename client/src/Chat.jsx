/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

export const Chat = ({ socket, username, room }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                id: Date.now(),
                room: room,
                author: username,
                message: currentMessage,
                time: new Date().getHours() +
                    ":" + new Date().getMinutes(),
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]); //To show the sending message with other messages
            setCurrentMessage(""); // Clear input after sending
        }
    };

    // //Listen to any changes in socket server
    useEffect(() => {
        const handleReceiveMessage = (data) => {
            setMessageList((list) => [...list, data]);//After emit or recive message the List with previous messages and the data of new message
        };

        socket.on("receive_message", handleReceiveMessage);

        // Cleanup the event listener on component unmount
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket]);


    return (
        <div className='chat-window'>
            <div className='chat-header'>
                <p>Live Chat</p>
            </div>

            <div className='chat-body'>
                <ScrollToBottom className='message-container'>
                {/* Looping all messages in the Message List array */}
                {messageList.map((messageContent) => {
                    return (
                        <div className='message' key={messageContent.id} id={username === messageContent.author ? "you" : "other"}>
                            <div>
                                <div className='message-content'>
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className='message-meta'>
                                    <p id='time'>{messageContent.time}</p>
                                    <p id='author'>{messageContent.author}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                </ScrollToBottom>
            </div>

            <div className='chat-footer'>
                <input
                    type='text'
                    value={currentMessage}
                    placeholder='Type a message...'
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyDown={(event) => {
                        event.key === 'Enter' && sendMessage();
                    }}
                    />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}
