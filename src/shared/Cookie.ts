import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (key: string, value: string) => {
    return cookies.set(key, value, {
        path: "/",
        secure: true,
        sameSite: "none"
    });
}

export const getCookie = (key: string) => {
    return cookies.get(key);
}