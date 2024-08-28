import React, { useEffect } from 'react'
import { useSocketContext } from '../context/socketContext.jsx';
import notificationSound from '../assets/notification.mp3';
import useConversation from '../zustand/useConversation.js';

const useListenMessages = () => {
    const {socket} = useSocketContext();
    const {messages, setMessages} = useConversation()

    useEffect(() => {
        socket?.on("newMessage",(newMessage) => {
            newMessage.shouldShake = true;
            const sound = new Audio(notificationSound)
            sound.play();
            setMessages([...messages,newMessage])
        })

        return () => socket?.off("newMessage")
    },[socket,messages,setMessages])
}

export default useListenMessages