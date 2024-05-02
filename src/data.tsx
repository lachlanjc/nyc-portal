import jayData from "./locations/jay.json" assert { type: "json" };
import stuytownData from "./locations/stuytown.json" assert { type: "json" };
import wasqData from "./locations/wasq.json" assert { type: "json" };

interface Photo {
  text: string;
  height: number;
  date: string;
  thumb_url: string;
  photo_id: string;
  title: string;
  width: number;
  image_url: string;
  location: {
    lat: number;
    lon: number;
  };
  folder: string;
  years: Array<string>;
}

export const jay = (jayData as Array<Photo>).sort(
  (a, b) => Number(b.date) - Number(a.date),
);
export const stuytown = (stuytownData as Array<Photo>).sort(
  (a, b) => Number(b.date) - Number(a.date),
);
export const wasq = (wasqData as Array<Photo>).sort(
  (a, b) => Number(b.date) - Number(a.date),
);
