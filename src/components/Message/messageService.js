import axios from "axios";
import { io } from "socket.io-client";
import { URL } from "@/auth/url.js";
const API_URL = `${URL}/messages`;
export const socket = io(`${URL}`);
export const getMessages = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Xabarlarni olishda xatolik:", error);
        return [];
    }
};
export const loadMessages = async () => {
    try {
        return await getMessages();
    } catch (err) {
        console.error("Xabarlarni yuklashda xatolik:", err);
        return [];
    }
};
export const sendMessage = async (message) => {
    try {
        await axios.post(API_URL, message);
        socket.emit("sendMessage", message);
    } catch (error) {
        console.error("Xabar yuborishda xatolik:", error);
        throw new Error("Xabar yuborilmadi");
    }
};

export const onNewMessage = (callback) => {
    socket.on("newMessage", callback);
};
export const markAsRead = async (id) => {
    try {
        await axios.patch(`${API_URL}/${id}/read`);

    } catch (error) {
        console.error("Xabarni o‘qilgan deb belgilashda xatolik:", error);
    }
};