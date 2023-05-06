import { Avatar, Card, useTheme } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import UserAvatar from "../UserAvatar";
import Badge from "@mui/material/Badge";
import { useLikes, useBookmarks } from "../../utils/firebase/api";
import styled from "styled-components";
import { FC } from "react";
import { red } from "@mui/material/colors";
import { backgroundBlurMixin } from "../../utils/styleUtils";
import Script from "next/script";

const Root = styled(Card)`
  ${backgroundBlurMixin}
  .MuiCardContent-root {
    margin-top: ${({ theme }) => theme.spacing(-2)};
  }
`;

const PostAd: FC<{ index?: number; occurrence?: number; skip?: Array<number> }> = ({
  index,
  occurrence,
  skip = [],
}) => {
  const theme = useTheme();

  if ((index !== undefined && occurrence !== undefined && index % occurrence !== 0) || skip.includes(index)) {
    return null;
  }

  return (
    <Root theme={theme} className="post-ad">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[400], width: 32, height: 32 }} aria-label="ads">
            <Typography variant="body2">AD</Typography>
          </Avatar>
        }
        // title={<Typography>Advertising</Typography>}
      />
      <CardContent>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4233698082965305"
          crossOrigin="anonymous"
        ></Script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-4233698082965305"
          data-ad-slot="6247143644"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <Script>(adsbygoogle = window.adsbygoogle || []).push({});</Script>
      </CardContent>
    </Root>
  );
};

export default PostAd;
