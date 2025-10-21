import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, EffectFade } from 'swiper/modules';

export const CabañaSwiper = ({ cabaña }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    if (!cabaña || !cabaña.imagenPrincipal) {
        return (
            <div className="p-4 bg-gray-100 rounded-lg text-gray-600 text-center">
                No hay imágenes disponibles para mostrar.
            </div>
        );
    }

    const allImages = [cabaña.imagenPrincipal, ...(cabaña.imagenes || [])];

    return (
        <div className="space-y-4 w-full flex flex-col items-center">
            <Swiper
                modules={[Navigation, Thumbs, EffectFade]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                effect="coverflow"
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                speed={800}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className="w-full max-w-6xl h-[250px] sm:h-[350px] md:h-[500px] lg:h-[560px] overflow-hidden px-4 sm:px-12 lg:px-24 py-4"
            >
                {allImages.map((imagen, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-full">
                            <img 
                                src={imagen} 
                                className="absolute w-full h-full object-cover transition-opacity duration-500 rounded-lg"
                                alt={index === 0 ? "Imagen principal de la cabaña" : `Imagen adicional ${index}`}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                spaceBetween={8}
                slidesPerView={3}
                watchSlidesProgress
                freeMode={true}
                centerInsufficientSlides={true}
                breakpoints={{
                    480: { slidesPerView: 4, spaceBetween: 10 },
                    640: { slidesPerView: 5, spaceBetween: 12 },
                    1024: { slidesPerView: 6, spaceBetween: 14 },
                }}
                className="!pb-2 h-[70px] sm:h-[90px] md:h-[100px] w-full max-w-5xl px-4"
            >
                {allImages.map((imagen, index) => (
                    <SwiperSlide 
                        key={index}
                        className={`cursor-pointer rounded-md overflow-hidden transition-all duration-300 border-2 ${
                            activeIndex === index 
                                ? 'border-gray-400 opacity-100 scale-105' 
                                : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                    >
                        <img 
                            src={imagen} 
                            className="w-full h-full object-cover"
                            alt={`Miniatura ${index}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
