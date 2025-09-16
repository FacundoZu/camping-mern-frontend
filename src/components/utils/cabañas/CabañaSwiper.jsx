import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, EffectFade } from 'swiper/modules';

export const CabañaSwiper = ({ cabaña }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    if (!cabaña || !cabaña.imagenPrincipal) {
        return <div className="p-4 bg-gray-100 rounded-lg text-gray-600">No hay imágenes disponibles para mostrar.</div>;
    }
    const allImages = [cabaña.imagenPrincipal, ...(cabaña.imagenes || [])];

    return (
        <div className='space-y-4'>
            <Swiper
                modules={[Navigation, Pagination, Thumbs, EffectFade]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ 
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet ',
                    bulletActiveClass: 'swiper-pagination-bullet-active',
                }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                effect='coverflow'
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                speed={800}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className='h-[500px] md:h-[560px] overflow-hidden px-24 py-6'
            >
                {allImages.map((imagen, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-full">
                            <img 
                                src={imagen} 
                                className='absolute object-cover transition-opacity duration-500 rounded-lg'
                                alt={index === 0 ? "Imagen principal de la cabaña" : `Imagen adicional ${index}`}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                spaceBetween={12}
                slidesPerView={4}
                watchSlidesProgress
                freeMode={true}
                centerInsufficientSlides={true}
                breakpoints={{
                    640: {
                        slidesPerView: 5,
                    },
                    1024: {
                        slidesPerView: 6,
                    }
                }}
                className='!pb-2 h-[90px] md:h-[100px] w-5/6'
            >
                {allImages.map((imagen, index) => (
                    <SwiperSlide 
                        key={index}
                        className={`cursor-pointer rounded-md overflow-hidden transition-all duration-300 border-2 ${
                            activeIndex === index 
                                ? 'border-gray-400 opacity-100 scale-110' 
                                : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                    >
                        <img 
                            src={imagen} 
                            className='w-full h-full object-cover'
                            alt={`Miniatura ${index}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};