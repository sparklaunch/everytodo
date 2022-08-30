import { ChangeEvent, useState } from "react";
import { Dispatch } from "react";

const useInput = <T>(initialValue: T): [T, Dispatch<React.SetStateAction<T>>, (event: ChangeEvent<HTMLInputElement>) => void] => {
    const [value, setValue] = useState<T>(initialValue);
    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value as T);
    }
    return [value, setValue, changeHandler];
}

export default useInput;