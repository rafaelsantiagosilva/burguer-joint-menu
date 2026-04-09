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

                <div className="cards">
                    <section className="card">
                        <img className="card_image" src="https://www.assai.com.br/sites/default/files/shutterstock_1806472312.jpg"
                            alt="Classic Burger"
                        />

                        <h2>Burguer Clássico</h2>
                        <main>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quasi voluptas ipsum est. Itaque blanditiis quae, dolorum natus excepturi eius aut minus.
                        </main>

                        <footer className="card_footer">
                            <p className="price">R$ 29,90</p>
                            <button>Adicionar</button>
                        </footer>
                    </section>

                    <section className="card">
                        <img className="card_image" src="https://www.assai.com.br/sites/default/files/shutterstock_1806472312.jpg"
                            alt="Classic Burger"
                        />

                        <h2>Burguer Clássico</h2>
                        <main>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quasi voluptas ipsum est. Itaque blanditiis quae, dolorum natus excepturi eius aut minus.
                        </main>

                        <footer className="card_footer">
                            <p className="price">R$ 29,90</p>
                            <button>Adicionar</button>
                        </footer>
                    </section><section className="card">
                        <img className="card_image" src="https://www.assai.com.br/sites/default/files/shutterstock_1806472312.jpg"
                            alt="Classic Burger"
                        />

                        <h2>Burguer Clássico</h2>
                        <main>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quasi voluptas ipsum est. Itaque blanditiis quae, dolorum natus excepturi eius aut minus.
                        </main>

                        <footer className="card_footer">
                            <p className="price">R$ 29,90</p>
                            <button>Adicionar</button>
                        </footer>
                    </section><section className="card">
                        <img className="card_image" src="https://www.assai.com.br/sites/default/files/shutterstock_1806472312.jpg"
                            alt="Classic Burger"
                        />

                        <h2>Burguer Clássico</h2>
                        <main>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quasi voluptas ipsum est. Itaque blanditiis quae, dolorum natus excepturi eius aut minus.
                        </main>

                        <footer className="card_footer">
                            <p className="price">R$ 29,90</p>
                            <button>Adicionar</button>
                        </footer>
                    </section>
                </div>
            </S.Menu>
        </>
    )
}