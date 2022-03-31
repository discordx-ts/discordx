import React from "react";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Redirect() {
  React.useEffect(() => {
    window.location.href =
      "https://github.com/oceanroleplay/discord.ts/tree/dev";
  }, []);
  return null;
}
