import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./authContext"
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {

        if (authUser) {
            console.log("hello")
            const socket = io("https://chat-app-ufth.onrender.com", {
                query: {
                    usesrId: authUser._id
                }
            });

            setSocket(socket);

            // socket.on() is used to listen to the events. can be used on both server and client side
            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            })

            return () => socket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>
    )
}
