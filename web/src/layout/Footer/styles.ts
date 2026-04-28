import styled from "styled-components";

export const Container = styled.footer`
    height: 15rem;
    padding: 3rem 2rem;
    background-color: ${(props) => props.theme.colors.gray[900]};
    color: ${(props) => props.theme.colors.white};
    width: 100dvw;

    margin-top: 15dvh;

    h1 {
        font-family: ${(props) => props.theme.fontFamily.rockSalt};
        margin-bottom: 2rem;
    }

    p {
        font-size: 1.3rem;
        margin-bottom: 0.4rem;
    }
`;