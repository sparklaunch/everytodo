import { getCookie } from "../shared/Cookie";
import { parseJWTToken } from "../utils/JWT";

const useToken = () => {
    return () => {
        const token = getCookie("access_token");
        if (token) {
            const currentUser = parseJWTToken(token);
            return currentUser;
        } else {
            return null;
        }
    }
}

export default useToken;