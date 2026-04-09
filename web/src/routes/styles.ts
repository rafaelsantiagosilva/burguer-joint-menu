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

  .card {
    width: 20rem;
    border-radius: 0.5rem;
    transition: scale 100ms;
  }

  .card:hover {
    scale: 1.02;
  }

  .card_footer {
      margin-top: 0.8rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .card_footer > p {
    font-size: 1.4rem;
    font-weight: bold;
  }

  .card_footer > button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: ${(props) => props.theme.colors.red[500]};
    color: ${(props) => props.theme.colors.white};
    border-radius: 5px;
    transition: color 100ms, background-color 100ms;
    cursor: pointer;
  }

  .card_footer > button:hover {
    background-color: ${(props) => props.theme.colors.red[600]};
  }

  .card_image {
      width: 100%;
      border-radius: 0.5rem;
  }
`;