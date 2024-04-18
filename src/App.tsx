import { Canvas } from "@react-three/fiber";
import { Root, Fullscreen, Text } from "@react-three/uikit";
import { Card } from "./ui/card";
import photos from "./data";
// import useSound from "use-sound";

function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 32.5 }}
      style={{ height: "100dvh", touchAction: "none" }}
      gl={{ localClippingEnabled: true }}
    >
      <Root sizeX={2} sizeY={1} flexDirection="row">
        <Card borderRadius={32} padding={32} gap={8} flexDirection="column">
          <Text fontSize={32}>Hello World!</Text>
          <Text fontSize={24} opacity={0.7}>
            This is the apfel kit.
          </Text>
        </Card>
      </Root>
      <Fullscreen flexDirection="row" padding={100} gap={100}>
        {photos.slice(0, 3).map((photo) => (
          <Card
            key={photo.photo_id}
            borderRadius={32}
            padding={32}
            gap={8}
            flexDirection="column"
          >
            <Text fontSize={24}>{photo.title}</Text>
            <Text fontSize={16} opacity={0.7}>
              {photo.text}
            </Text>
          </Card>
        ))}
      </Fullscreen>
    </Canvas>
  );
}

export default App;
