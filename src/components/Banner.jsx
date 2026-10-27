import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "./Banner.css";
const photos = [
    ["photo-1441974231531-c6227db76b6e", "Leśna ścieżka", "Przyroda"],
    ["photo-1501785888041-af3ef285b470", "Jezioro w górach", "Przyroda"],
    ["photo-1470252649378-9c29740c9fa8", "Poranek na łące", "Przyroda"],
    ["photo-1518837695005-2083093ee35b", "Spokojne morze", "Przyroda"],
    ["photo-1472396961693-142e6e269027", "Dzika przyroda", "Przyroda"],
    ["photo-1487958449943-2429e8be8625", "Dom wśród zieleni", "Architektura"],
    ["photo-1511818966892-d7d671e672a2", "Nowoczesna fasada", "Architektura"],
    ["photo-1518005020951-eccb494ad742", "Miejska geometria", "Architektura"],
    ["photo-1519501025264-65ba15a82390", "Miasto po zmroku", "Architektura"],
    ["photo-1486406146926-c627a92ad1ab", "Szklane wieżowce", "Architektura"],
    ["photo-1464822759023-fed622ff2c3b", "Szczyty górskie", "Podróże"],
    ["photo-1500534623283-312aade485b7", "Droga przez dolinę", "Podróże"],
    ["photo-1500534314209-a25ddb2bd429", "Wyprawa o świcie", "Podróże"],
    ["photo-1470770841072-f978cf4d019e", "Alpejski krajobraz", "Podróże"],
    ["photo-1500530855697-b586d89ba3ee", "Widok z podróży", "Podróże"],
].map(([id, title, category]) => ({ id, title, category }));

const categories = ["Wszystkie", ...new Set(photos.map((photo) => photo.category))];
const photoUrl = (id, width) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;


function Banner(){
    const bannerRef = useRef(null);
    const modalRef = useRef(null);
    const imageRef = useRef(null);
    const isClosingRef = useRef(false);
    const [activeCategory, setActiveCategory] = useState("Wszystkie");
    const [selectedPhotoId, setSelectedPhotoId] = useState(null);

    const filteredPhotos = activeCategory === "Wszystkie"
        ? photos
        : photos.filter((photo) => photo.category === activeCategory);
    const selectedIndex = filteredPhotos.findIndex((photo) => photo.id === selectedPhotoId);
    const selectedPhoto = filteredPhotos[selectedIndex];

    useEffect(() => {
        const $banner = $(bannerRef.current);
        $banner.hide().fadeIn(500);
        return () => {
            $banner.stop(true,true);
        };
    },[]);
    useEffect(() => {
        if (!selectedPhoto) return undefined;
        isClosingRef.current = false;
        const $modal = $(modalRef.current);
        const $image = $(imageRef.current);
        $modal.hide().fadeIn(220);
        $image.hide().fadeIn(280);
        return () => {
            $modal.stop(true, true);
            $image.stop(true, true);
        };
    }, [selectedPhotoId, selectedPhoto]);

    const closeModal = () => {
        if (isClosingRef.current || !modalRef.current) return;
        isClosingRef.current = true;
        $(modalRef.current).stop(true, true).fadeOut(220, () => {
            setSelectedPhotoId(null);
            isClosingRef.current = false;
        });
    };

    const navigatePhoto = (direction) => {
        if (isClosingRef.current || !selectedPhoto || filteredPhotos.length < 2) return;
        const nextIndex = (selectedIndex + direction + filteredPhotos.length) % filteredPhotos.length;
        $(imageRef.current).stop(true, true).fadeOut(140, () => {
            setSelectedPhotoId(filteredPhotos[nextIndex].id);
        });
    };

    useEffect(() => {
        if (!selectedPhoto) return undefined;
        const handleKeyDown = (event) => {
            if (event.key === "Escape") closeModal();
            if (event.key === "ArrowLeft") navigatePhoto(-1);
            if (event.key === "ArrowRight") navigatePhoto(1);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedPhotoId, activeCategory]);


    return (
        <section ref={bannerRef} className="banner">
            <header className="gallery-heading">
                <div>
                    <p className="gallery-kicker">CHWILE ZATRZYMANE W KADRZE</p>
                    <h2>Galeria zdjęć</h2>
                </div>
                <p className="gallery-count">{filteredPhotos.length} zdjęć</p>
            </header>
            <div className="gallery-filters" aria-label="Filtruj zdjęcia według kategorii">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        className={activeCategory === category ? "gallery-filter is-active" : "gallery-filter"}
                        aria-pressed={activeCategory === category}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="photo-grid">
                {filteredPhotos.map((photo, index) => (
                    <button
                        className="photo-tile"
                        key={photo.id}
                        type="button"
                        onClick={() => setSelectedPhotoId(photo.id)}
                        aria-label={`Otwórz zdjęcie: ${photo.title}`}
                    >
                        <img src={photoUrl(photo.id, 500)} alt={photo.title} loading={index < 5 ? "eager" : "lazy"} />
                        <span className="photo-caption">
                            <span>{photo.title}</span>
                            <span className="photo-category">{photo.category}</span>
                        </span>
                    </button>
                ))}
            </div>
            {selectedPhoto && (
                <div
                    className="gallery-lightbox"
                    ref={modalRef}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeModal();
                    }}
                >
                    <section className="lightbox-content" role="dialog" aria-modal="true" aria-label="Podgląd zdjęcia">
                        <button className="lightbox-close" type="button" onClick={closeModal} aria-label="Zamknij podgląd">×</button>
                        <button className="lightbox-arrow lightbox-prev" type="button" onClick={() => navigatePhoto(-1)} aria-label="Poprzednie zdjęcie">‹</button>
                        <img ref={imageRef} src={photoUrl(selectedPhoto.id, 1600)} alt={selectedPhoto.title} />
                        <button className="lightbox-arrow lightbox-next" type="button" onClick={() => navigatePhoto(1)} aria-label="Następne zdjęcie">›</button>
                        <footer className="lightbox-caption">
                            <div>
                                <h3>{selectedPhoto.title}</h3>
                                <p>{selectedPhoto.category}</p>
                            </div>
                            <span>{selectedIndex + 1} / {filteredPhotos.length}</span>
                        </footer>
                    </section>
                </div>
            )}
        </section>
    );
}
export default Banner;

//wyswietlanie 15 zdjec w formie siatki
//powiekszenie wybranego zdjęcia po kliknięciu
//przycisk do zamykania powiększonego zdjęcia
//płynne pojawienie się i znikanie zdjęcia z wykorzystaniem efektów jQuery
//przycisk prev i next
//filtr kategorii zdjęcia. min. 2