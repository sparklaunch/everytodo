import scorePassword from "../../utils/scorePassword";
import {
    SignupContainer,
    SignupForm,
    FormField,
    Logo,
    PasswordStrength,
    PasswordConfirmationLabel
} from "./styles";
import {
    TextField,
    Button,
    Tooltip,
    LinearProgress,
    Modal,
    Box,
    Typography,
    Fade
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import { createUserThunk, getUsersThunk } from "../../redux/modules/users";
import { useAppDispatch } from "../../redux/config/configStore";
import useInput from "../../hooks/useInput";
import useRedundancyCheck from "../../hooks/useRedundancyCheck";
import useEmailValidation from "../../hooks/useEmailValidation";
import usePasswordScore from "../../hooks/usePasswordScore";
import useValidation from "../../hooks/useValidation";
import { useNavigate } from "react-router-dom";

const boxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 3,
    p: 4
};

const Signup = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getUsersThunk());
    }, [dispatch]);
    const navigator = useNavigate();
    const redundancyChecker = useRedundancyCheck();
    const emailValidator = useEmailValidation();
    const passwordScorer = usePasswordScore();
    const validator = useValidation();

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
            case "redundantEmail":
                return "해당 이메일이 이미 존재합니다.";
            case "emptyPassword":
                return "비밀번호를 입력하세요";
            case "unmatchedPassword":
                return "비밀번호가 일치하지 않습니다.";
            case "okay":
                return "사용 가능한 이메일입니다.";
            case "unknown":
                return "알 수 없는 오류가 발생하였습니다.";
        }
    }, [open.target]);
    const [passwordScore, setPasswordScore] = useState(0);
    const [passwordScoreLabel, setPasswordScoreLabel] = useState("약함");
    const [passwordConfirmationLabel, setPasswordConfirmationLabel] =
        useState("비밀번호 불일치");

    const [email, setEmail, emailChangeHandler] = useInput("");
    const [password, setPassword, passwordChangeHandler] = useInput("");
    const [
        passwordConfirmation,
        setPasswordConfirmation,
        passwordConfirmationChangeHandler
    ] = useInput("");

    useEffect(() => {
        if (password === passwordConfirmation && password.length !== 0) {
            setPasswordConfirmationLabel("비밀번호 일치");
        } else {
            setPasswordConfirmationLabel("비밀번호 불일치");
        }
    }, [password, passwordConfirmation]);
    useEffect(() => {
        const labelString = passwordScorer(password);
        setPasswordScore(Math.min(100, scorePassword(password)));
        setPasswordScoreLabel(labelString);
    }, [password, passwordScorer]);
    const redundancyButtonClickHandler = () => {
        if (email.length === 0) {
            setOpen({
                target: "emptyEmail",
                state: true
            });
        } else if (!emailValidator(email)) {
            setOpen({
                target: "invalidEmail",
                state: true
            });
        } else if (redundancyChecker(email)) {
            setOpen({
                target: "redundantEmail",
                state: true
            });
        } else {
            setOpen({
                target: "okay",
                state: true
            });
        }
    };
    const signupClickHandler = async () => {
        const response = validator({
            email,
            password,
            passwordConfirmation
        });
        if (response === "okay") {
            const newUser = {
                userID: uuidV4(),
                email,
                password
            };
            setEmail("");
            setPassword("");
            setPasswordConfirmation("");
            const response = await dispatch(createUserThunk(newUser));
            if (response.payload === "Signup succeeded.") {
                navigator("/");
            }
        } else {
            switch (response) {
                case "emptyEmail":
                    setOpen({
                        state: true,
                        target: "emptyEmail"
                    });
                    break;
                case "emptyPassword":
                    setOpen({
                        state: true,
                        target: "emptyPassword"
                    });
                    break;
                case "invalidEmail":
                    setOpen({
                        state: true,
                        target: "invalidEmail"
                    });
                    break;
                case "redundantEmail":
                    setOpen({
                        state: true,
                        target: "redundantEmail"
                    });
                    break;
                case "unmatchedPassword":
                    setOpen({
                        state: true,
                        target: "unmatchedPassword"
                    });
                    break;
                default:
                    setOpen({
                        state: true,
                        target: "unknown"
                    });
                    break;
            }
        }
    };
    return (
        <SignupContainer>
            <Logo>
                <img src="/assets/Logo.png" alt="Logo" />
            </Logo>
            <SignupForm>
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
                    <Tooltip title="중복확인">
                        <Button
                            variant="contained"
                            size="large"
                            onClick={redundancyButtonClickHandler}
                        >
                            중복확인
                        </Button>
                    </Tooltip>
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
                    <PasswordStrength>
                        <p>{passwordScoreLabel}</p>
                        <LinearProgress
                            variant="determinate"
                            value={passwordScore}
                            sx={{ height: 20, borderRadius: 5 }}
                        />
                    </PasswordStrength>
                </FormField>
                <FormField>
                    <label htmlFor="password-confirmation">비밀번호 확인</label>
                    <TextField
                        value={passwordConfirmation}
                        onChange={passwordConfirmationChangeHandler}
                        required
                        id="password-confirmation"
                        label="비밀번호 확인"
                        variant="outlined"
                        type="password"
                        autoComplete="current-password"
                        sx={{ width: 300 }}
                    />
                    <PasswordConfirmationLabel>
                        <p>{passwordConfirmationLabel}</p>
                    </PasswordConfirmationLabel>
                </FormField>
            </SignupForm>
            <Button
                variant="contained"
                size="large"
                sx={{ width: 300 }}
                onClick={signupClickHandler}
            >
                회원가입
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
        </SignupContainer>
    );
};

export default Signup;
