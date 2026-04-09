import styled from "styled-components";

export const Container = styled.button`
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: ${(props) => props.theme.colors.red[500]};
    color: ${(props) => props.theme.colors.white};
    border-radius: 5px;
    transition: color 100ms, background-color 100ms;
    cursor: pointer;

    &:hover {
        background-color: ${(props) => props.theme.colors.red[600]};
    }
`;