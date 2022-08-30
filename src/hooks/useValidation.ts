import useEmailValidation from "./useEmailValidation";
import useRedundancyCheck from "./useRedundancyCheck";

interface FormValues {
    email: string;
    password: string;
    passwordConfirmation: string;
}

const useValidation = () => {
    const emailValidator = useEmailValidation();
    const redundancyChecker = useRedundancyCheck();
    return ({ email, password, passwordConfirmation }: FormValues) => {
        if (email.length === 0) {
            return "emptyEmail";
        }
        if (!emailValidator(email)) {
            return "invalidEmail";
        }
        if (redundancyChecker(email)) {
            return "redundantEmail";
        }
        if (password.length === 0) {
            return "emptyPassword";
        }
        if (password !== passwordConfirmation) {
            return "unmatchedPassword";
        }
        return "okay";
    }
}

export default useValidation;