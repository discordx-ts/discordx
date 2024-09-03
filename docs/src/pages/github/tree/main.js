import React from "react";

export default function Redirect() {
  React.useEffect(() => {
    window.location.href = "https://github.com/discordx-ts/discordx/tree/main";
  }, []);
  return null;
}
