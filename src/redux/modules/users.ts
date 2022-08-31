import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {removeCookie, setCookie} from "../../shared/Cookie";
import { generateJWTToken } from "../../utils/JWT";

type User = {
    userID: string,
    email: string,
    password: string
}

export interface StateType {
    users: User[],
    isLoading: boolean,
    error: any
}

const initialState: StateType = {
    users: [],
    isLoading: false,
    error: null
}

interface UserInfo {
    email: string;
    password: string;
}

export const logoutUserThunk = createAsyncThunk("users/logoutUser", (_, thunk) => {
    removeCookie("access_token");
    return thunk.fulfillWithValue("Logout succeeded.");
});

export const loginUserThunk = createAsyncThunk("users/loginUser", async (userInfo: UserInfo, thunk) => {
    try {
        const { data } = await axios.get(`http://localhost:3001/users?email=${userInfo.email}`);
        const user = data[0]
        if (user) {
            if (user.password === userInfo.password) {
                const token = generateJWTToken(user.email);
                setCookie("access_token", token);
                return thunk.fulfillWithValue("Login succeeded.");
            } else {
                return thunk.rejectWithValue("Incorrect password.")
            }
        } else {
            return thunk.rejectWithValue("No such user.")
        }
    } catch (error) {
        return thunk.rejectWithValue(error);
    }
})

export const createUserThunk = createAsyncThunk("users/createUser", async (newUser: User, thunk) => {
    try {
        await axios.post("http://localhost:3001/users", newUser);
        const token = generateJWTToken(newUser.email);
        setCookie("access_token", token);
        return thunk.fulfillWithValue("Signup succeeded.");
    } catch (error) {
        return thunk.rejectWithValue(error);
    }
})

export const getUsersThunk = createAsyncThunk(
    "users/getUsers",
    async (_, thunk) => {
        try {
            const { data } = await axios.get("http://localhost:3001/users");
            if (data) {
                return thunk.fulfillWithValue(data);
            } else {
                return thunk.rejectWithValue("No Redundancy");
            }
        } catch (error) {
            return thunk.rejectWithValue(error);
        }
    }
);

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(getUsersThunk.pending, (state) => {
            state.isLoading = true;
        }).addCase(getUsersThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users = action.payload as unknown as User[];
        }).addCase(getUsersThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
        builder.addCase(createUserThunk.pending, (state) => {
            state.isLoading = true;
        }).addCase(createUserThunk.fulfilled, (state) => {
            state.isLoading = false;
        }).addCase(createUserThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        builder.addCase(loginUserThunk.pending, (state) => {
            state.isLoading = true;
        }).addCase(loginUserThunk.fulfilled, (state) => {
            state.isLoading = false;
        }).addCase(loginUserThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        builder.addCase(logoutUserThunk.pending, (state) => {
            state.isLoading = true;
        }).addCase(logoutUserThunk.fulfilled, (state) => {
            state.isLoading = false;
        }).addCase(logoutUserThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export default userSlice.reducer;