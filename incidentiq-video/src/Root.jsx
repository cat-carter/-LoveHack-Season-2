import { Composition, registerRoot } from "remotion";
import { IncidentIQVideo } from "./Video.jsx";

const RemotionRoot = () => (
  <Composition
    id="IncidentIQ"
    component={IncidentIQVideo}
    durationInFrames={3300}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RemotionRoot);
