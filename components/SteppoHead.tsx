import Head from "next/head";
import React, { FC } from "react";

const SteppoHead: FC<{
  title?: string;
  description: string;
  titleTags?: string;
  image?: string;
  children?: React.ReactNode;
}> = ({ title, description, titleTags, image, children }) => {
  const headTitle = title ? ` | ${title}` : ``;
  const headTitleTags = titleTags ? ` - ${titleTags}` : ``;
  return (
    <Head>
      <title>{"Steppo" + headTitle + headTitleTags}</title>
      {/* REMOVE THIS WHEN LIVE */}
      <meta content="noindex, nofollow, initial-scale=1, width=device-width" name="robots" />
      {/* :::: */}
      <meta name="description" content={description} />
      <meta property="og:title" content={"Steppo" + headTitle} />
      <meta property="og:description" content={description} />
      {image ? <meta property="og:image" content={image} /> : null}
      <link rel="shortcut icon" href="/images/favicon.ico" />
      {children}
    </Head>
  );
};

export default SteppoHead;
