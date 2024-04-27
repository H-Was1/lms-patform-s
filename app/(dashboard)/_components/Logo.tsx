import Image from "next/image";
import React from "react";

const Logo = () => {
  return <Image height={100} width={100} alt="logo" src={"/logo.svg"} />;
};

export default Logo;
