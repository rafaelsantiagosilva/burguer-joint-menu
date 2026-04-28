import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Button } from "../../components/Button";
import * as S from "./styles";

export const Route = createFileRoute("/login/")({
    component: LoginPage
});

type LoginFormInputs = {
    phone: string;
    password: string;
}

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormInputs>();

    const onSubmit = (data: LoginFormInputs) => {
        console.table(data);
    }

    return (
        <S.Container>
            <h1>Entrar</h1>

            <S.Form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="tel"
                    id="phone"
                    placeholder="Telefone"
                    {...register("phone", { required: "O telefone é obrigatório" })}
                />
                {errors.phone && <span className='input-error'>! {errors.phone.message}</span>}

                <input
                    type="password"
                    id="password"
                    placeholder="Senha"
                    {...register("password", { required: "A senha é obrigatória" })}

                />
                {errors.password && <span className="input-error">! {errors.password.message}</span>}

                <Button
                    label="Entrar"
                    variant="lg"
                    type="submit"
                />

                <Link className="link" to="/register">
                    Criar conta
                </Link>
            </S.Form>
        </S.Container>
    )
}