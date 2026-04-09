import { createRootRoute, Outlet } from "@tanstack/react-router";
import { StrictMode } from "react";
import { ThemeProvider } from "styled-components";
import { Header } from "../layout/Header";
import { GlobalStyles } from "../styles/global";
import { defaultTheme } from "../styles/theme";

export const Route = createRootRoute({
    component: RootComponent
});

function RootComponent() {
    return (
        <StrictMode>
            <ThemeProvider theme={defaultTheme}>
                <GlobalStyles />
                <Header />
                <Outlet />
            </ThemeProvider>
        </StrictMode>
    )
}

