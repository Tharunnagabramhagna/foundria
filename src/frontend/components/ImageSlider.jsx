const { useState, useEffect } = React;

function ImageSlider({ images }) {
    if (!images || images.length === 0) return <div className="w-full h-64 bg-slate-200 rounded-2xl animate-pulse" />;

    return (
        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-2xl shadow-lg bg-slate-100 flex items-center justify-center">
            <img
                src={images[0]}
                alt="Slide 1"
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<div class="text-slate-400">Preview Image</div>';
                }}
            />
        </div>
    );
}

window.ImageSlider = ImageSlider;
