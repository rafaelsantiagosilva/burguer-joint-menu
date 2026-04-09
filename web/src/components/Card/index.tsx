import { Button } from "../Button";
import * as S from "./styles";

type CardProps = {
    productName: string;
    productDescription: string;
    productPrice: number;
    productImage: string; // url
}

export function Card({ productName, productDescription, productPrice, productImage }: CardProps) {
    return (

        <S.Container>


            <img className="card_image" src={productImage}
                alt={productName}
            />

            <h2>Burguer Clássico</h2>
            <main>
                {productDescription}
            </main>

            <footer className="card_footer">
                <p className="price">{(productPrice / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <Button
                    label="Adicionar"
                    onClick={() => {}}
                />
            </footer>
        </S.Container>
    )
}