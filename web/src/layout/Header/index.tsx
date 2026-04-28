import * as S from "./styles";
import { LogIn, ShoppingCart } from "react-feather";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function Header() {
    const [cartItems, setCartItems] = useState([]);

    /* TODO: implement cart component
    function addItem(item) {
        setCartItems((prev) => [...prev, item]);
    }
    */

    return (
        <S.Container>
            <h1>
                <Link to="/">
                    🍔
                    Burguer Joint
                </Link>
            </h1>

            <nav>
                <ul>
                    <li>
                        <a href="#">
                            <div id="cart-container">
                                <ShoppingCart size={35} />
                                {cartItems.length > 0 && <span id="cart-items">{cartItems.length <= 9 ? cartItems.length : "9+"}</span>}
                            </div>
                        </a>
                    </li>

                    <li>
                        <Link to="/login">
                            <LogIn size={35} />
                        </Link>
                    </li>
                </ul>
            </nav>
        </S.Container>
    )
}