import styled from "styled-components";

export const Container = styled.section`
    padding: 4rem 6rem;
    
    h1 {
        font-family: ${({ theme }) => theme.fontFamily.rockSalt};
    }
`;