import { createFileRoute } from "@tanstack/react-router";
import * as S from "./styles";

export const Route = createFileRoute("/")({
    component: HomePage
});

function HomePage() {
    return (
        <>
            <S.Hero>
                <h1>Hambúrgueres que fazem história, <br /> um bite de cada vez!</h1>
            </S.Hero>
            
            <S.Menu>
                <h1>Cardápio</h1>
            </S.Menu>
        </>
    )
}