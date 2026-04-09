import * as S from "./styles";

type ButtonProps = {
    label: string;
    onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
    return <S.Container onClick={onClick}>
        {label}
    </S.Container>
}