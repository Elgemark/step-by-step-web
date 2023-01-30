const _imageAspect = 16 / 9;
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
};

export default settings;
