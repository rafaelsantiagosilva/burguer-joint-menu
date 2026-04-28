import { createFileRoute, Link } from "@tanstack/react-router";
import * as S from "./styles";
import { Button } from "../../components/Button";

export const Route = createFileRoute("/login/")({
    component: LoginPage
});

function LoginPage() {
    return (
        <S.Container>
            <h1>Entrar</h1>

            <S.Form onSubmit={(e) => e.preventDefault()}>
                <input type="tel" id="email" name="phone" placeholder="Telefone" />
                <input type="password" id="password" name="password" placeholder="Senha" />

                <Button
                 label="Entrar"
                 onClick={() => console.log("login")}
                 variant="lg"
                />

                <Link className="link" to="/register">
                    Criar conta
                </Link>
            </S.Form>
        </S.Container>
    )
}