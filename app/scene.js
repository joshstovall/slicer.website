"use client";

import { Canvas, useLoader } from '@react-three/fiber';
import { GCodeLoader } from 'three/examples/jsm/loaders/GCodeLoader';
import { OrbitControls } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';

import { convertGcode } from './helpers/convertGcode';

// Gcode as ThreeJS object
function Gcode({ url }) {
    let object = useLoader(GCodeLoader, url)
    return <primitive object={object} />
}

// ThreeJS scene
export default function Scene({ stl }) {

    const [gcode, setGcode] = useState();

    // listen for STL to change
    useEffect(() => {

        if (!stl) return;

        (async () => {
            let blob = await convertGcode(stl);
            setGcode(blob);
        })();

    }, [stl])

    return (
        <Canvas>
            <Gcode url={gcode} />
            <ambientLight />
            <OrbitControls />
        </Canvas>
    );

}