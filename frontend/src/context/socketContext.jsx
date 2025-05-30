import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./authContext";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const socket = io("https://chatty-l4co.onrender.com", {
                withCredentials: true,
                transports: ["websocket", "polling"],
                query: {
                    userId: authUser._id
                },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            socket.on("connect", () => {
                console.log("Socket Connected!", socket.id);
            });

            socket.on("connect_error", (error) => {
                console.log("Socket Connection Error:", error);
            });

            setSocket(socket);

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
