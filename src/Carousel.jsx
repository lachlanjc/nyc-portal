import * as THREE from "three";
import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { VRButton, XR } from "@react-three/xr";
import { Image, ScrollControls, Billboard, Text } from "@react-three/drei";
import { easing, geometry } from "maath";
import data from "./data";

extend(geometry);

const App = () => (
  <>
    <VRButton />
    <Canvas dpr={[1, 2]}>
      <ScrollControls pages={4} infinite>
        <XR>
          <Scene position={[0, 1.5, 0]} />
        </XR>
      </ScrollControls>
    </Canvas>
  </>
);

export default App;

const getImgUrl = (url) => `/photos/${url.split("/").at(-1)}`;

function Scene({ children, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(null);

  useFrame((state, delta) => {
    state.events.update(); // Raycasts every frame rather than on pointer-move
    easing.damp3(
      state.camera.position,
      [1, state.pointer.y + 3, 9],
      0.3,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={ref} {...props}>
      <Cards
        onPointerOver={hover}
        onPointerOut={hover}
        data={data}
        from={Math.PI * (3 / 4)}
        len={Math.PI / 2}
        position={[-0.75, -1.5, 9.5]}
      />
      <ActiveCard
        hoveredI={hovered}
        data={hovered ? data[hovered] : undefined}
      />
    </group>
  );
}

function Cards({
  data,
  from = 0,
  len = Math.PI * 2,
  radius = 5.25,
  onPointerOver,
  onPointerOut,
  ...props
}) {
  const [hovered, hover] = useState(null);
  const amount = data.length + 3;
  return (
    <group {...props}>
      {data.map((img, i) => {
        const angle = from + (i / amount) * len;
        return (
          <Card
            key={angle}
            onPointerOver={(e) => (
              e.stopPropagation(), hover(i), onPointerOver(i)
            )}
            onPointerOut={() => (hover(null), onPointerOut(null))}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            active={hovered !== null}
            hovered={hovered === i}
            url={getImgUrl(img.image_url)}
          />
        );
      })}
    </group>
  );
}

function Card({ url, active, hovered, ...props }) {
  const ref = useRef();
  useFrame((state, delta) => {
    const f = hovered ? 1.4 : active ? 1.25 : 1;
    easing.damp3(ref.current.position, [0, hovered ? 0.25 : 0, 0], 0.1, delta);
    easing.damp3(ref.current.scale, [1.618 * f, 1 * f, 1], 0.15, delta);
  });
  return (
    <group {...props}>
      <Image ref={ref} url={url} scale={[1, 1, 1]} side={THREE.DoubleSide} />
    </group>
  );
}

function ActiveCard({
  hoveredI,
  data = {
    width: 1,
    height: 1,
    title: "",
    years: [],
    image_url: "/716458f-a.jpg",
  },
  ...props
}) {
  const imgRef = useRef();
  useLayoutEffect(() => void (imgRef.current.material.zoom = 0.8), [hoveredI]);
  useFrame((state, delta) => {
    easing.damp(imgRef.current.material, "zoom", 1, 0.5, delta);
    easing.damp(
      imgRef.current.material,
      "opacity",
      hoveredI !== null,
      0.3,
      delta
    );
  });
  const baseSize = 6;
  const aspectRatio = data.width / data.height;
  const width = aspectRatio > 1 ? baseSize : baseSize * aspectRatio;
  const height = aspectRatio > 1 ? baseSize / aspectRatio : baseSize;
  return (
    <Billboard {...props}>
      <Text
        font="/Spectral-Regular.woff"
        fontSize={0.25}
        position={[width / 2 + 0.5, 3, 0]}
        anchorX="left"
        anchorY="top"
        color="black"
        fillOpacity={0.5}
      >
        {data.years.join("–")}
      </Text>
      <Text
        font="/Spectral-Regular.woff"
        fontSize={0.5}
        position={[width / 2 + 0.5, 2.5, 0]}
        anchorX="left"
        anchorY="top"
        color="black"
        maxWidth={6}
        lineHeight={1}
      >
        {data.title || data.original_title}
      </Text>
      {/* <Text
          font="/Spectral-Regular.woff"
          fontSize={0.25}
          position={[width / 2 + 0.5, 2.5, 0]}
          anchorX="left"
          anchorY="top"
          color="black"
          maxWidth={6}
          lineHeight={1.25}
          fillOpacity={0.5}
        >
          {data.text}
        </Text> */}
      <Image
        ref={imgRef}
        transparent
        position={[0, 1.5, 0]}
        url={getImgUrl(data.image_url)}
      >
        <roundedPlaneGeometry
          parameters={{ width, height }}
          args={[width, height, 0.075]}
        />
      </Image>
    </Billboard>
  );
}
