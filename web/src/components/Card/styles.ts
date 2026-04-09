import styled from "styled-components";

export const Container = styled.section`
    width: 20rem;
    border-radius: 0.5rem;
    transition: scale 100ms;

  &:hover {
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

  .card_image {
      width: 100%;
      border-radius: 0.5rem;
  }
`;