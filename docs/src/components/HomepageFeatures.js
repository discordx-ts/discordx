/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

const FeatureList = [
  {
    title: "Decorators",
    description: <>it simplifies your code and improves the readability!</>,
  },
  {
    title: "Slash commands",
    description: <>Implement a Discord's Slash commands system simply !</>,
  },
  {
    title: "discord.js support",
    description: (
      <>You can use discord.js along discord.ts without any problems !</>
    ),
  },
];

function Feature({ title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
