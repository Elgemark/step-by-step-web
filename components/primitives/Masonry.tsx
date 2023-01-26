import MUIMasonry from "@mui/lab/Masonry";

export default (props) => (
  <MUIMasonry
    spacing={{ lg: 2, md: 2, sm: 1, xs: 1 }}
    columns={{ md: 3, sm: 2, xs: 1 }}
    // Defaults to support SSR?
    // defaultHeight={450}
    // defaultColumns={3}
    // defaultSpacing={2}
    sx={{ width: "auto" }}
    {...props}
  ></MUIMasonry>
);
