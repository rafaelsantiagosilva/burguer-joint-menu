import styled from "styled-components";

export const Container = styled.header`
    width: 100dvw;
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => props.theme.colors.red[500]};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0.5rem;

    & > h1 > a {
        font-family: ${(props) => props.theme.fontFamily.rockSalt};
        text-shadow: 0.1rem 0.3rem ${(props) => props.theme.colors.red[800]};
        width: 100%;
        font-size: 1.4rem;
    }

    & ul {
        display: flex;
        gap: 2rem;
        font-weight: bold;
        font-size: 1.6rem;
        padding-right: 1rem;
        
    }

    & li {
        transition-property: all;
        transition-duration: 100ms;
    }

    & ul li:hover {
        rotate: 8deg;
    }

    #cart-container {
        position: relative;
    }

    #cart-items {
        position: absolute;
        font-size: 0.8rem;
        top: 1.2rem;
        left: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
        text-align: center;
        border-radius: 100%;
        background-color: ${(props) => props.theme.colors.white};
        color: ${(props) => props.theme.colors.red[500]};
    }

    @media (min-width: 768px) {
        & > h1 > a {
            font-size: 2rem;
        }
    }
`;