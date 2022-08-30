import { LoginContainer, LoginForm, FormField, Logo } from "./styles";
import { TextField, Button, Modal, Box, Typography, Fade } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { getUsersThunk, loginUserThunk } from "../../redux/modules/users";
import { useAppDispatch } from "../../redux/config/configStore";
import useInput from "../../hooks/useInput";
import useEmailValidation from "../../hooks/useEmailValidation";
import { useNavigate } from "react-router-dom";

const boxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "background.paper",
    boxShadow: 24,
    borderRadius: 3,
    p: 4
};

const Login = () => {
    const navigator = useNavigate();
    const dispatch = useAppDispatch();
    const emailValidator = useEmailValidation();
    useEffect(() => {
        dispatch(getUsersThunk());
    }, [dispatch]);

    const [open, setOpen] = useState({
        state: false,
        target: "email"
    });

    const modalMessage = useMemo(() => {
        switch (open.target) {
            case "emptyEmail":
                return "이메일을 입력하세요";
            case "invalidEmail":
                return "올바른 이메일 형식이 아닙니다.";
            case "emptyPassword":
                return "비밀번호를 입력하세요";
            case "noUser":
                return "해당 계정 정보가 존재하지 않습니다.";
            case "incorrectPassword":
                return "비밀번호가 일치하지 않습니다.";
            case "unknown":
                return "알 수 없는 오류가 발생하였습니다.";
        }
    }, [open.target]);

    const [email, setEmail, emailChangeHandler] = useInput("");
    const [password, setPassword, passwordChangeHandler] = useInput("");

    const loginClickHandler = async () => {
        if (email.length === 0) {
            setOpen({
                state: true,
                target: "emptyEmail"
            });
        } else if (!emailValidator(email)) {
            setOpen({
                state: true,
                target: "invalidEmail"
            });
        } else if (password.length === 0) {
            setOpen({
                state: true,
                target: "emptyPassword"
            });
        } else {
            const data = await dispatch(
                loginUserThunk({
                    email,
                    password
                })
            );
            switch (data.payload) {
                case "No such user.":
                    setOpen({
                        state: true,
                        target: "noUser"
                    });
                    break;
                case "Incorrect password.":
                    setOpen({
                        state: true,
                        target: "incorrectPassword"
                    });
                    break;
                case "Login succeeded.":
                    navigator("/");
                    break;
                default:
                    setEmail("");
                    setPassword("");
            }
        }
    };
    return (
        <LoginContainer>
            <Logo>
                <img src="/assets/Logo.png" alt="Logo" />
            </Logo>
            <LoginForm>
                <FormField>
                    <label htmlFor="email">이메일</label>
                    <TextField
                        id="email"
                        label="이메일"
                        required
                        variant="outlined"
                        value={email}
                        onChange={emailChangeHandler}
                        sx={{ width: 300 }}
                    />
                </FormField>
                <FormField>
                    <label htmlFor="password">비밀번호</label>
                    <TextField
                        value={password}
                        onChange={passwordChangeHandler}
                        required
                        id="password"
                        label="비밀번호"
                        variant="outlined"
                        type="password"
                        autoComplete="current-password"
                        sx={{ width: 300 }}
                    />
                </FormField>
            </LoginForm>
            <Button
                variant="contained"
                size="large"
                sx={{ width: 300 }}
                onClick={loginClickHandler}
            >
                로그인
            </Button>
            <Modal
                open={open.state}
                onClose={() => {
                    setOpen((previousState) => {
                        return {
                            state: false,
                            target: previousState.target
                        };
                    });
                }}
                closeAfterTransition
            >
                <Fade in={open.state}>
                    <Box sx={boxStyle}>
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{ textAlign: "center" }}
                        >
                            {modalMessage}
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </LoginContainer>
    );
};

export default Login;
