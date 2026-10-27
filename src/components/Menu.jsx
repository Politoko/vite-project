import { useEffect, useRef, useState } from "react";
import $ from "jquery";
//1. dodaj efekt podświetlania przycisków menu po najechaniu kursorem myszy, wykorzystując zdarzenia mouseenter i mouseleave oraz metodę animate() z jQuery
//2. po kliknięciu opcji pomoc - instrukcja wyświetl pod menu panel zawierający co najmniej 3 wskazówki dotyczące obsługi Task Managera
//3. panel instrukcji powinien pojawiać się za pomocą slideDown(400) a znikać slideUp(400)
//4. Dodaj przycisk zamknij instrukcję
//5. Zadbaj o to, aby wielokrotnie szybkie klikanie nie powodowało kolejkowania animacji


function Menu() {
    const zadaniaRef = useRef(null);
    const ustawieniaRef = useRef(null);
    const instrukcjaRef = useRef(null);
    const menuRef =useRef(null);

    const [otwarteMenu, setOtwarteMenu] = useState(null);
    const [czyInstrukcjaWidoczna, setCzyInstrukcjaWidoczna] = useState(false);

    useEffect(() => {
        const $przyciski = $(menuRef.current).find(".menu-button");
        const podswietl = function () {
            $(this).stop(true, false).css("backgroundColor", "#dbeafe").animate({ opacity: 0.75 }, 150);
        };
        const przywroc = function () {
            $(this).stop(true, false).animate({ opacity: 1 }, 150, function () {
                $(this).css("backgroundColor", "");
            });
        };

        $przyciski.on("mouseenter.menuHighlight", podswietl);
        $przyciski.on("mouseleave.menuHighlight", przywroc);

        return () => {
            $przyciski.off(".menuHighlight").stop(true, true).css({ opacity: "", backgroundColor: "" });
        };
    }, []);

    useEffect(() => {
        const $zadania = $(zadaniaRef.current);
        const $ustawienia = $(ustawieniaRef.current);

        $zadania.stop(true, true);
        $ustawienia.stop(true, true);

        if (otwarteMenu === "zadania") {
            $zadania.slideDown(300);
            $ustawienia.slideUp(300);
        } else if (otwarteMenu === "ustawienia") {
            $ustawienia.slideDown(300);
            $zadania.slideUp(300);
        } else {
            $zadania.slideUp(300);
            $ustawienia.slideUp(300);
        }

        return () => {
            $zadania.stop(true, true);
            $ustawienia.stop(true, true);
        };
    }, [otwarteMenu]);

    useEffect(() => {
        const $instrukcja = $(instrukcjaRef.current);
        $instrukcja.stop(true, true);

        if (czyInstrukcjaWidoczna) {
            $instrukcja.slideDown(400);
        } else {
            $instrukcja.slideUp(400);
        }

        return () => $instrukcja.stop(true, true);
    }, [czyInstrukcjaWidoczna]);

    const przelaczMenu = (nazwa) => {
        setOtwarteMenu((poprzednie) =>
            poprzednie === nazwa ? null : nazwa
        );
    };

    useEffect(() => {
        const kliknieciePozaMenu = (e) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target)
            ){
                setOtwarteMenu(null);
                setCzyInstrukcjaWidoczna(false);
            }
        };
        document.addEventListener("pointerdown", kliknieciePozaMenu);
        return () => {
            document.removeEventListener("pointerdown",kliknieciePozaMenu);
        };
    },[]);

    return (
        <nav ref={menuRef} className="menu" aria-label="Menu główne">
            <ul>
                <li>
                    <button
                        type="button"
                        className="menu-button"
                        aria-expanded={otwarteMenu === "zadania"}
                        onClick={() => przelaczMenu("zadania")}
                    >
                        Zadania
                    </button>

                    <ul className="submenu" ref={zadaniaRef}>
                        <li>Wszystkie zadania</li>
                        <li>Dodaj zadanie</li>
                        <li>Statystyki</li>
                    </ul>
                </li>

                <li>
                    <button
                        type="button"
                        className="menu-button"
                        aria-expanded={otwarteMenu === "ustawienia"}
                        onClick={() => przelaczMenu("ustawienia")}
                    >
                        Ustawienia
                    </button>

                    <ul className="submenu" ref={ustawieniaRef}>
                        <li>Motyw aplikacji</li>
                        <li>Preferencje</li>
                    </ul>
                </li>
                <li>
                    <button
                        type="button"
                        className="menu-button"
                        aria-expanded={czyInstrukcjaWidoczna}
                        onClick={() => setCzyInstrukcjaWidoczna(true)}
                    >
                        Pomoc - instrukcja
                    </button>
                </li>
            </ul>
            <section ref={instrukcjaRef} style={{ display: "none" }} aria-label="Instrukcja obsługi Task Managera">
                <h2>Instrukcja obsługi</h2>
                <ul>
                    <li>Wybierz „Zadania”, aby przejrzeć zadania, dodać nowe lub zobaczyć statystyki.</li>
                    <li>W formularzu wpisz nazwę zadania i wybierz jego priorytet oraz kategorię.</li>
                    <li>Użyj przycisków przy zadaniu, aby je edytować lub usunąć.</li>
                </ul>
                <button type="button" onClick={() => setCzyInstrukcjaWidoczna(false)}>
                    Zamknij instrukcję
                </button>
            </section>
        </nav>
    );
}

export default Menu;