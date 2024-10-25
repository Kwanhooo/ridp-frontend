"use client"
import { useState, useEffect } from 'react';

export default function Home() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        handleResize(); // Set initial dimensions
        window.addEventListener('resize', handleResize); // Listen for window resize

        return () => window.removeEventListener('resize', handleResize); // Cleanup listener on unmount
    }, []);

    return (
        <div style={{ flexGrow: 1, height: '100vh' }}>
            <iframe
                src="https://bootapi.jeecg.com/bigscreen/#/view/1849734583881375746"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    objectFit: 'cover',
                }}
                title="Dynamic iFrame"
            />
        </div>
    );
}
