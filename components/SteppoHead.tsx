import Head from "next/head";
import { FC } from "react";

const SteppoHead: FC<{ title: string; titleTags?: string; description: string; image?: string }> = ({
  title,
  description,
  titleTags,
  image,
}) => {
  const headTitle = title ? ` | ${title}` : ``;
  const headTitleTags = titleTags ? ` - ${titleTags}` : ``;
  return (
    <Head>
      <title>{"Steppo" + headTitle + headTitleTags}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={"Steppo" + headTitle} />
      <meta property="og:description" content={description} />
      {image ? <meta property="og:image" content={image} /> : null}
    </Head>
  );
};

export default SteppoHead;
