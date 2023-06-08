import appStore from "../store/store";

async function pixelate(
  img: HTMLImageElement,
  pixelation: number,
  green?: boolean
): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  let url: string;

  canvas.height = img.height;
  canvas.width = img.width;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += pixelation) {
    for (let x = 0; x < canvas.width; x += pixelation) {
      const pixelPosition = (x + y * canvas.width) * 4;

      if (green) {
        const avg =
          (imgData[pixelPosition] +
            imgData[pixelPosition + 1] +
            imgData[pixelPosition + 2]) /
          3;
        ctx.fillStyle = `rgba(
          0,
          ${avg},
          0,
          ${imgData[pixelPosition + 3]}
        )`;
      } else {
        ctx.fillStyle = `rgba(
          ${imgData[pixelPosition]},
          ${imgData[pixelPosition + 1]},
          ${imgData[pixelPosition + 2]},
          ${imgData[pixelPosition + 3]}
        )`;
      }

      ctx.fillRect(x, y, pixelation, pixelation);
    }
  }

  // @ts-ignore
  const blob: Blob = await new Promise((resolve) => canvas.toBlob(resolve));
  url = URL.createObjectURL(blob);

  return url;
}

export default async function getPhoto(id: string) {
  const store = appStore.getState();
  const token = store.user.authToken;
  const greenImg = new Image();
  const imgUrl = {
    original: "",
    green: "",
  };
  let imgBlob: Blob;

  try {
    imgBlob = await fetch("/api/photos/img/" + id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((res) => res.blob());
  } catch (err) {
    console.warn(err);
    return imgUrl;
  }

  imgUrl.original = URL.createObjectURL(imgBlob);

  greenImg.src = imgUrl.original;
  imgUrl.green = await new Promise((resolve) => {
    greenImg.onload = () => resolve(pixelate(greenImg, 7, true));
  });

  return imgUrl;
}
