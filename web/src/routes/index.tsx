import { createFileRoute } from "@tanstack/react-router";
import * as S from "./styles";
import { useState } from "react";
import { Card } from "../components/Card";

export const Route = createFileRoute("/")({
    component: HomePage
});

function HomePage() {
    type ProductType = {
        name: string;
        description: string;
        price: number;
        image: string;
    }

    const [products, setProducts] = useState<ProductType[]>([
        {
            name: "Burguer Clássico",
            description: "Pão, carne, queijo, alface, tomate e molho especial.",
            price: 2999,
            image: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyJTIwY2xhc3NpY298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        },
        {
            name: "Burguer Clássico",
            description: "Pão, carne, queijo, alface, tomate e molho especial.",
            price: 2999,
            image: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyJTIwY2xhc3NpY298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        },{
            name: "Burguer Clássico",
            description: "Pão, carne, queijo, alface, tomate e molho especial.",
            price: 2999,
            image: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyJTIwY2xhc3NpY298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        },{
            name: "Burguer Clássico",
            description: "Pão, carne, queijo, alface, tomate e molho especial.",
            price: 2999,
            image: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyJTIwY2xhc3NpY298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        },
    ]);

    return (
        <>
            <S.Hero>
                <h1>Hambúrgueres que fazem história, <br /> um bite de cada vez!</h1>
            </S.Hero>

            <S.Menu>
                <h1>Cardápio</h1>

                <div className="cards">
                    {products.length === 0 && <p className="no_products">Ainda não há produtos cadastrados :(</p> }
                    {products.length > 0 && products.map((product) => (
                        <Card
                            key={product.name}
                            productName={product.name}
                            productDescription={product.description}
                            productPrice={product.price}
                            productImage={product.image}
                        />
                    ))}
                </div>
            </S.Menu>
        </>
    )
}