import React, { useEffect, useState, useCallback } from 'react';
import './StarrySky.css';

interface StarPoint {
    cx: number;
    cy: number;
    r: number;
    delay: number;
    duration: number;
}

interface ShootingStar {
    left: number;
    top: number;
    delay: number;
    duration: number;
    length: number;
    pathScale: number;
    rotation: number;
    thickness: number;
}

type WishStyle = React.CSSProperties & {
    '--wish-start'?: string;
    '--wish-mid-enter'?: string;
    '--wish-mid-exit'?: string;
    '--wish-end'?: string;
    '--wish-rotation'?: string;
    '--wish-thickness'?: string;
};

type BubbleStyle = React.CSSProperties & {
    '--bubble-drift'?: string;
};

interface StarrySkyProps {
    theme?: 'galaxy' | 'ocean';
}

interface Bubble {
    left: number;
    size: number;
    delay: number;
    duration: number;
    drift: number;
    blur: number;
}

export const StarrySky: React.FC<StarrySkyProps> = ({ theme = 'galaxy' }) => {
    const [stars, setStars] = useState<StarPoint[]>([]);
    const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);

    const generateSky = useCallback(() => {
        const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        const newStars = Array.from({ length: 70 }, () => ({
            cx: Math.random() * vw,
            cy: Math.random() * vh,
            r: Math.random() * 0.7 + 0.6,
            delay: Math.random() * 5,
            duration: 2.5 + Math.random() * 3.5,
        }));

        const newShootingStars = Array.from({ length: 10 }, () => ({
            left: Math.random() * vh,
            top: Math.random() * vw,
            delay: Math.random() * 20,
            ...(() => {
                const quick = Math.random() < 0.1;
                const pathScale = quick ? 0.2 + Math.random() * 0.2 : 0.9 + Math.random() * 0.4;
                return {
                    duration: quick ? 0.9 + Math.random() * 0.9 : 3 + Math.random() * 5,
                    length: quick ? 35 + Math.random() * 20 : 90 + Math.random() * 50,
                    pathScale,
                    rotation: 10 + Math.random() * 20,
                    thickness: 0.7 + Math.random() * 0.8,
                };
            })(),
        }));

        const newBubbles = Array.from({ length: 70 }, (_, index) => ({
            left: Math.random() * vw,
            size: 3.5 + Math.random() * 4.5,
            delay: Math.random() * 10 + index * 0.07,
            duration: 11 + Math.random() * 14,
            drift: (Math.random() - 0.5) * 55,
            blur: Math.random() * 3.2,
        }));

        setStars(newStars);
        setShootingStars(newShootingStars);
        setBubbles(newBubbles);
    }, []);

    useEffect(() => {
        generateSky();
        window.addEventListener('resize', generateSky);
        return () => window.removeEventListener('resize', generateSky);
    }, [generateSky]);

    // Theme-specific colors
    const starColor = theme === 'ocean' ? '#87CEEB' : 'white'; // Sky blue for ocean, white for galaxy
    const shootingStarGradient = theme === 'ocean'
        ? 'linear-gradient(-45deg, #87CEEB, rgba(135, 206, 235, 0))'
        : 'linear-gradient(-45deg, white, rgba(255, 255, 255, 0))';
    const shootingStarShadow = theme === 'ocean'
        ? 'drop-shadow(0 0 4px #87CEEB)'
        : 'drop-shadow(0 0 6px white)';

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {theme === 'galaxy' ? (
                <>
                    <svg id="sky">
                        {stars.map((star, index) => (
                            <circle
                                cx={star.cx}
                                cy={star.cy}
                                r={star.r}
                                stroke="none"
                                strokeWidth="0"
                                fill={starColor}
                                key={`star-${index}`}
                                className="star"
                                style={{
                                    animationDelay: `${star.delay}s`,
                                    animationDuration: `${star.duration}s`,
                                }}
                            />
                        ))}
                    </svg>
                    <div id="shootingstars">
                        {shootingStars.map((shootingStar, index) => {
                            const wishStyle: WishStyle = {
                                left: `${shootingStar.left}px`,
                                top: `${shootingStar.top}px`,
                                animationDelay: `${shootingStar.delay}s`,
                                animationDuration: `${shootingStar.duration}s`,
                                width: `${shootingStar.length}px`,
                                '--wish-start': `${-160 * shootingStar.pathScale}px`,
                                '--wish-mid-enter': `${-50 * shootingStar.pathScale}px`,
                                '--wish-mid-exit': `${320 * shootingStar.pathScale}px`,
                                '--wish-end': `${480 * shootingStar.pathScale}px`,
                                '--wish-rotation': `${shootingStar.rotation}deg`,
                                '--wish-thickness': `${shootingStar.thickness}px`,
                            };
                            return (
                                <div
                                    key={`wish-${index}`}
                                    className="wish"
                                    style={{
                                        ...wishStyle,
                                        background: shootingStarGradient,
                                        filter: shootingStarShadow,
                                    }}
                                />
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="ocean-bubbles">
                    {bubbles.map((bubble, index) => (
                        <span
                            key={`bubble-${index}`}
                            className="bubble"
                            style={{
                                left: `${bubble.left}px`,
                                width: `${bubble.size}px`,
                                height: `${bubble.size}px`,
                                animationDelay: `${bubble.delay}s`,
                                animationDuration: `${bubble.duration}s`,
                                filter: `blur(${bubble.blur}px)`,
                                '--bubble-drift': `${bubble.drift}px`,
                            } as BubbleStyle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
