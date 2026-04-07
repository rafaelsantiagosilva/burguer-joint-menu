import * as S from "./styles";

export function Header() {
    return (
        <S.Container>
                <h1>
                    <a href="#">
                        🍔
                        Burguer Joint
                    </a>
                </h1>

                <nav>
                    <ul>
                        <li>
                            <a href="#">Cardápio</a>
                        </li>

                        <li>
                            <a href="#">Entrar</a>
                        </li>
                    </ul>
                </nav>
        </S.Container>
    )
}