import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from "react-hook-form";
import { Button } from '../../components/Button';
import * as S from "./styles";

export const Route = createFileRoute('/register/')({
    component: RegisterPage,
})

type RegisterFormInputs = {
    phone: string;
    password: string;
}

function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormInputs>();

    const onSubmitForm = (data: RegisterFormInputs) => {
        console.table(data);
    };

    return (
        <S.Container>
            <h1>Criar conta</h1>

            <S.Form onSubmit={handleSubmit(onSubmitForm)}>
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
                    {...register(
                        "password",
                        {
                            required: "A senha é obrigatória",
                            minLength: {
                                message: "A senha deve ter no mínimo 6 caracteres",
                                value: 6
                            }
                        })}
                />
                {errors.password && <span className="input-error">! {errors.password.message}</span>}

                <Button
                    label="Entrar"
                    variant="lg"
                    type="submit"
                />

                <Link className="link" to="/login">
                    Já possui uma conta?
                </Link>
            </S.Form>
        </S.Container>
    )
}