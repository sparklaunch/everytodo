import styled from "styled-components";

const LoginContainer = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const LoginForm = styled.div`
    display: grid;
    gap: 20px;
    margin-bottom: 30px;
`;

const FormField = styled.div`
    display: grid;
    grid-template-columns: 100px auto 100px;
    gap: 20px;
    label {
        text-align: center;
        margin: auto;
    }
`;

const Logo = styled.div`
    margin-bottom: 30px;
`;

const PasswordStrength = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
        margin-bottom: 3px;
        text-align: center;
    }
`;

const PasswordConfirmationLabel = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    p {
        font-size: 0.8rem;
    }
`;

export {
    LoginContainer,
    LoginForm,
    FormField,
    Logo,
    PasswordStrength,
    PasswordConfirmationLabel
};
