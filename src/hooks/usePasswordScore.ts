import scorePassword from "../utils/scorePassword";

const usePasswordScore = () => {
    return (password: string) => {
        const score = scorePassword(password);
        if (score < 30) {
            return "약함";
        } else if (score < 60) {
            return "보통";
        } else {
            return "강함";
        }
    }
}

export default usePasswordScore;