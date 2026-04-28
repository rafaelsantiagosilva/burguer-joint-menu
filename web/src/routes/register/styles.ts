import styled from "styled-components";

export const Container = styled.main`
  padding: 5rem;

  h1 {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.red[500]};
    font-family: ${({theme}) => theme.fontFamily.rockSalt};
    text-align: center;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-size: 1.4rem;

  & input {
    border: 2px solid ${({ theme }) => theme.colors.gray[600]};
    border-radius: 5px;
      font-size: 1.4rem;
      margin-top: 1rem;
      width: 20rem;
      padding: 0.5rem 1rem;
  }

  & .link {
    color: ${({theme}) => theme.colors.red[500]};
    text-decoration: underline;
  }

  .input-error {
    color: ${({theme}) => theme.colors.white};
    background-color: ${({theme}) => theme.colors.red[500]};
    padding: 0.2rem 0.5rem;
    border: 2px solid ${({theme}) => theme.colors.red[800]};
    border-radius: 5px;
  }
`;