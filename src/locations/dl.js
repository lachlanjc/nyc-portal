const seenIds = new Set();

Bun.file("src/locations/jay.json")
  .text()
  .then((text) => JSON.parse(text))
  .then((data) => {
    data.forEach((location) => {
      if (seenIds.has(location.photo_id)) {
        console.log(`Duplicate photo_id: ${location.photo_id}`);
      } else {
        seenIds.add(location.photo_id);
      }
      const filename = `${location.photo_id}.jpg`;
      fetch(location.image_url)
        .then((res) => res.blob())
        .then((data) => {
          const file = new File([data], filename, { type: "image/jpeg" });
          Bun.write(`public/photos/${filename}`, file);
        });
    });
  });
