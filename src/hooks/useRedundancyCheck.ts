import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/config/configStore";
import { getUsersThunk } from "../redux/modules/users";

const useRedundancyCheck = () => {
    const { users } = useAppSelector(state => state.users);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getUsersThunk());
    }, [dispatch]);
    return (email: string) => {
        const foundUser = users.find(user => user.email === email);
        return !!foundUser;
    }
}

export default useRedundancyCheck;