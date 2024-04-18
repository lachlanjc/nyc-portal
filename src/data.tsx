import data from "./minimal.json" assert { type: "json" };

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

const photos = data as Array<Photo>;

export default photos;
