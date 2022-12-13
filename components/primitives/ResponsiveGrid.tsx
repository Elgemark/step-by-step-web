import Masonry from "@mui/lab/Masonry";
const ResponsiveGrid = ({ children }) => {
  return (
    <Masonry spacing={2} columns={{ lg: 4, md: 3, sm: 2, xs: 1 }}>
      {children}
    </Masonry>
  );
};

export default ResponsiveGrid;
