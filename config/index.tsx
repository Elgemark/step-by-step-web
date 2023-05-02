const imageAspect = 4 / 3;
const avatarImageAspect = 2 / 1;

const settings = {
  image: {
    aspect: imageAspect,
    height: (1 / imageAspect) * 100 + "%",
  },
  avatarBackground: {
    aspect: avatarImageAspect,
    height: (1 / avatarImageAspect) * 100 + "%",
  },
  crop: {
    crop: { x: 0, y: 0 },
    zoom: 1,
    minZoom: 0.4,
    restrictPosition: false,
    aspect: imageAspect,
  },
};

export default settings;
