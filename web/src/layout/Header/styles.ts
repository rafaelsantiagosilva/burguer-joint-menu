import styled from "styled-components";

export const Container = styled.header`
    width: 100dvw;
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => props.theme.colors.red[500]};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0.5rem;

    & ul {
        display: flex;
        gap: 1rem;
        font-weight: bold;
    }

    & ul a:hover {
        text-decoration: underline;
    }
`;