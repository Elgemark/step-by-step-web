export const readJSON = (blob): Promise<object> => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();

    fr.addEventListener("load", (e) => {
      resolve(JSON.parse(e.target.result as string));
    });

    fr.readAsText(blob);
  });
};
