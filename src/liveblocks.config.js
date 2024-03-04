import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey:
    "pk_prod_NRpn0sb0aCNWsl7RXQ7FnxiTE5xlAR52PRgSyDD13xlidKhB0GLNuAJGWVIFNm77",
});

export const {
  RoomProvider,
  useBroadcastEvent,
  /* ...all the other hooks you’re using... */
} = createRoomContext(client);
