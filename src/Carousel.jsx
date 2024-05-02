import * as THREE from "three";
import { useLayoutEffect, useEffect, useRef, useState } from "react";
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

import {
  Root as UIRoot,
  Container,
  Fullscreen,
  Image as UIImage,
  Content,
  Text,
  setPreferredColorScheme,
} from "@react-three/uikit";
import { Defaults } from "./ui/apfel/theme";
import { Card } from "./ui/apfel/card";
// import { Button } from "./ui/apfel/button";
import { Tabs, TabsButton } from "./ui/apfel/tabs";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/default/tabs";

extend(geometry);
setPreferredColorScheme("light");

const App = () => (
  <>
    <VRButton />
    {/* <ARButton /> */}
    <Canvas dpr={[1, 2]} gl={{ localClippingEnabled: true }}>
      {/* <ScrollControls pages={4} infinite> */}
      <XR>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Controllers />
        <Hands />
        <Scene position={[0, 1.5, 0]} />
      </XR>
      {/* </ScrollControls> */}
    </Canvas>
  </>
);

export default App;

const getImgUrl = (url) => `/photos/${url.split("/").at(-1)}`;

function Scene({ children, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(null);
  const [location, setLocation] = useState("jay");
  const data = { jay, stuytown, wasq }[location];

  useLoader(TextureLoader, "/environments/jay.jpg");
  useLoader(TextureLoader, "/environments/stuytown.jpg");
  useLoader(TextureLoader, "/environments/wasq.jpg");

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
      <Environment background files={`${location}.jpg`} path="/environments/" />
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
        position={[-6, -5, 5]}
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
  radius = 6,
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
          <PhotoCard
            key={angle}
            onPointerOver={(e) => (
              e.stopPropagation(), hover(i), onPointerOver(i)
            )}
            onPointerOut={() => (hover(null), onPointerOut(null))}
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
    // easing.damp(rootRef.current, "opacity", hoveredI !== null, 0.3, delta);
    // easing.damp(rootRef.current.setStyle)
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
          height={1024}
          width={768 + 512}
          paddingLeft={768}
          paddingTop={128}
          paddingBottom={64}
        >
          <Card
            width="100%"
            flexDirection="column"
            alignItems="center"
            ref={rootRef}
            overflow="hidden"
          >
            {/* <UIImage
              url={`/photos/${data.photo_id}.jpg`}
              flexGrow={1}
              width={512}
              height={512}
              fillMode="cover"
              borderTopLeftRadius={32}
              borderBottomLeftRadius={32}
            /> */}
            <Container flexGrow={1} width={512} height={512} overflow="hidden">
              <Content>
                <Image
                  ref={imgRef}
                  // transparent
                  // position={[0, 1, 0]}
                  url={`/photos/${data.photo_id}.jpg`}
                >
                  <roundedPlaneGeometry
                    parameters={{ width, height }}
                    args={[width, height, 0.075]}
                  />
                </Image>
              </Content>
              {/* <UIImage
              // ref={imgRef}
              // transparent
              width={512}
              height={512}
              // position={[0, 1, 0]}
              src={`/photos/${data.photo_id}.jpg`}
              borderRadius={32}
              fit="cover"
            /> */}
            </Container>
            <Container
              flexGrow={1}
              flexDirection="column"
              justifyContent="flex-start"
              height="100%"
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
            </Container>
          </Card>
        </Fullscreen>
      </Defaults>
      {/* <Billboard>
      <Image
        ref={imgRef}
        // transparent
        // position={[0, 1, 0]}
        url={`/photos/${data.photo_id}.jpg`}
      >
        <roundedPlaneGeometry
          parameters={{ width, height }}
          args={[width, height, 0.075]}
        />
      </Image>
      </Billboard> */}
    </group>
  );
}
