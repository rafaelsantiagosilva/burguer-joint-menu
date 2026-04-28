import * as S from "./styles";

type ButtonProps = {
    label: string;
    onClick: () => void;
    variant?: "md" | "lg";
}

export function Button({ label, onClick, variant="md" }: ButtonProps) {
    const fontSizes: Record<typeof variant, string> = {
        "md": "1rem",
        "lg": "1.5rem"
    }


    return <S.Container onClick={onClick} style={{fontSize: fontSizes[variant] }}>
        {label}
    </S.Container>
}