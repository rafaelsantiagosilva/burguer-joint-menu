import styled from "styled-components";

export const Hero = styled.section`
    width: 100%;
    height: 65dvh;
    width: 100dvw;
    background: url(/home-hero-section-background.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.5);

    & > h1 {
      text-align: center;
      color: ${(props) => props.theme.colors.white};
      padding-top: 0.8rem;
      font-size: 2.4rem;
      font-family: ${(props) => props.theme.fontFamily.rockSalt};
      text-shadow: 0.2rem 0.3rem rgba(0, 0, 0, 0.5);
    }
`;

export const Menu = styled.section`
  padding: 4rem 6rem;
  
  h1 {
    font-family: ${({ theme }) => theme.fontFamily.rockSalt};
  }

  .cards {
    padding-top: 1.5rem;
    display: flex; 
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    width: 100%;
  }

  .cards > .no_products {
    font-size: 2rem;
  }
`;