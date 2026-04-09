import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "../components/Hero";
import { MenuSection } from "../components/MenuSection";

export const Route = createFileRoute("/")({
    component: HomePage
});

function HomePage() {
    return (
        <>
            <Hero />
            <MenuSection />
        </>
    )
}