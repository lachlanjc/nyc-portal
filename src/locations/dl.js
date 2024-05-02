const seenIds = new Set();

Bun.file("src/locations/stuytown.json")
  .text()
  .then((text) => JSON.parse(text))
  .then((data) => {
    data.forEach((location) => {
      if (seenIds.has(location.photo_id)) {
        console.log(`Duplicate photo_id: ${location.photo_id}`);
      } else {
        seenIds.add(location.photo_id);
      }
      const filepath = `public/photos/${location.photo_id}.jpg`;
      if (!Bun.file(filepath)) {
        console.log(`Downloading ${location.image_url}`);
        fetch(location.image_url)
          .then((res) => res.blob())
          .catch((err) => console.error(err))
          .then((data) => {
            const file = new File([data], filepath, { type: "image/jpeg" });
            Bun.write(filepath, file);
          });
      } else {
        console.log(`File already exists: ${filepath}`);
      }
    });
  });
