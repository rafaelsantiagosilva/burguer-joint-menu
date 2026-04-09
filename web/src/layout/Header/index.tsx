import * as S from "./styles";
import { LogIn, ShoppingCart } from "react-feather";
import { useState } from "react";

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
                <a href="#">
                    🍔
                    Burguer Joint
                </a>
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
                        <a href="#">
                            <LogIn size={35} />
                        </a>
                    </li>
                </ul>
            </nav>
        </S.Container>
    )
}