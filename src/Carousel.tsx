// @ts-nocheck
import * as THREE from "three";
import { useLayoutEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import {
  ARButton,
  VRButton,
  XR,
  Controllers,
  Hands,
  Interactive,
} from "@react-three/xr";
import {
  Environment,
  Image,
  // ScrollControls,
  Billboard,
  // Text,
} from "@react-three/drei";
import { easing, geometry } from "maath";
import { jay, stuytown, wasq } from "./data";

import { useEnvironment } from "@react-three/drei";

import useSound from "use-sound";
import { Fullscreen, Text, setPreferredColorScheme } from "@react-three/uikit";
import { Defaults } from "./apfel/theme";
import { Card } from "./apfel/card";
// import { Button } from "./ui/button";
import { Tabs, TabsButton } from "./apfel/tabs";

extend(geometry);
setPreferredColorScheme("light");

const App = () => (
  <>
    <VRButton />
    {/* <ARButton /> */}
    <Canvas dpr={[1, 2]} gl={{ localClippingEnabled: true }}>
      <XR>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Controllers />
        <Hands />
        <Scene position={[0, 1.5, 0]} />
      </XR>
    </Canvas>
  </>
);

export default App;

const getImgUrl = (url) => `/photos/${url.split("/").at(-1)}`;

function Scene({ children, ...props }) {
  const [playSwitch] = useSound("/switch-on.mp3", { volume: 0.5 });
  const ref = useRef();
  const [hovered, hover] = useState(null);
  const [location, setLocation] = useState("jay");
  const data = { jay, stuytown, wasq }[location];

  // Preload textures
  const jayTexture = useEnvironment({
    files: "jay.jpg",
    path: "/environments/",
  });
  const stuytownTexture = useEnvironment({
    files: "stuytown.jpg",
    path: "/environments/",
  });
  const wasqTexture = useEnvironment({
    files: "wasq.jpg",
    path: "/environments/",
  });
  const texture = {
    jay: jayTexture,
    stuytown: stuytownTexture,
    wasq: wasqTexture,
  }[location];

  useFrame((state, delta) => {
    state.events.update(); // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [1, state.pointer.y, 9], 0.3, delta);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={ref} {...props}>
      <Environment
        background
        map={texture}
        backgroundRotation={[0, Math.PI * (2 / 3), 0]}
      />
      <Defaults>
        <Fullscreen
          flexDirection="column"
          sizeX={2}
          sizeY={1}
          distanceToCamera={48}
          width={431}
          paddingTop={16}
        >
          <Card borderRadius={32} padding={12}>
            <Tabs
              defaultValue="jay"
              width="100%"
              onValueChange={(loc) => {
                setLocation(loc);
                hover(null);
                playSwitch();
              }}
            >
              <TabsButton value="jay">
                <Text align="center">Jay St</Text>
              </TabsButton>
              <TabsButton value="stuytown">
                <Text align="center">Stuytown</Text>
              </TabsButton>
              <TabsButton value="wasq">
                <Text align="center">Washington Square</Text>
              </TabsButton>
            </Tabs>
          </Card>
        </Fullscreen>
      </Defaults>
      <Cards
        onPointerOver={hover}
        onPointerOut={hover}
        data={data}
        from={Math.PI * (1 / 1.75)}
        len={Math.PI * 0.5}
        position={[-12, -5, 5]}
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
  radius = 10,
  onPointerOver,
  onPointerOut,
  ...props
}) {
  const [playPlunger] = useSound("/plunger-immediate.mp3", { volume: 0.15 });
  const [hovered, hover] = useState(null);
  const amount = data.length + 3;
  return (
    <group {...props}>
      {data.map((img, i) => {
        const angle = from + (i / amount) * len;
        return (
          <PhotoCard
            key={angle}
            onPointerOver={(e) => {
              e.stopPropagation();
              hover(i);
              playPlunger();
              onPointerOver(i);
            }}
            onPointerOut={() => {
              hover(null);
              onPointerOut(null);
            }}
            position={[
              Math.sin(angle) * radius,
              i * 0.33,
              Math.cos(angle) * radius,
            ]}
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

function PhotoCard({
  url,
  active,
  hovered,
  onPointerOver,
  onPointerOut,
  ...props
}) {
  const ref = useRef();
  useFrame((state, delta) => {
    const f = hovered ? 1.4 : active ? 1.25 : 1;
    easing.damp3(ref.current.position, [0, hovered ? 0.25 : 0, 0], 0.1, delta);
    easing.damp3(ref.current.scale, [1.618 * f, 1 * f, 1], 0.15, delta);
  });
  return (
    <Interactive onSelect={onPointerOver} onBlur={onPointerOut}>
      <group
        {...props}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <Image ref={ref} url={url} scale={[1, 1, 1]} side={THREE.DoubleSide}>
          {/* <roundedPlaneGeometry
          parameters={{ width, height }}
          args={[width, height, 0.075]}
        /> */}
        </Image>
      </group>
    </Interactive>
  );
}

function ActiveCard({
  hoveredI,
  data = {
    width: 1,
    height: 1,
    title: "",
    date: "",
    text: "",
    photo_id: "704452f-a",
  },
  ...props
}) {
  const rootRef = useRef();
  const imgRef = useRef();
  useLayoutEffect(() => void (imgRef.current.material.zoom = 0.8), [hoveredI]);
  useFrame((state, delta) => {
    easing.damp(imgRef.current.material, "zoom", 1, 0.5, delta);
    easing.damp(rootRef.current, "opacity", hoveredI !== null, 0.3, delta);
  });
  const baseSize = 6;
  const aspectRatio = data.width / data.height;
  const width = aspectRatio > 1 ? baseSize : baseSize * aspectRatio;
  const height = aspectRatio > 1 ? baseSize / aspectRatio : baseSize;
  return (
    <group ref={rootRef} {...props}>
      <Defaults>
        <Fullscreen
          flexDirection="column"
          sizeX={2}
          sizeY={1}
          distanceToCamera={48}
          width={768 + 512}
          paddingLeft={768}
          paddingTop={512}
        >
          <Card
            width="100%"
            flexDirection="column"
            alignItems="center"
            gap={8}
            paddingX={32}
            paddingY={32}
            overflowY="scroll"
          >
            <Text fontSize={32} opacity={0.5} width={512 - 32}>
              {data.date}
            </Text>
            <Text fontWeight="bold" fontSize={32} width={512 - 32}>
              {data.title || data.original_title?.replace(" - ", "\n")}
            </Text>
            <Text
              lineHeight={24}
              color="white"
              fillOpacity={0.5}
              width={512 - 32}
            >
              {data.text || ""}
            </Text>
          </Card>
        </Fullscreen>
      </Defaults>
      <Billboard>
        <Image
          ref={imgRef}
          // transparent
          position={[5, 1.5, 0]}
          url={`/photos/${data.photo_id}.jpg`}
        >
          <roundedPlaneGeometry
            parameters={{ width, height }}
            args={[width, height, 0.125]}
          />
        </Image>
      </Billboard>
    </group>
  );
}
