import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import HomepageFeatures from "../components/HomepageFeatures";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero--primary", styles.heroBanner)}>
      <div className="container">
        <img
          className={styles.heroImg}
          src={"https://discord-ts.js.org/discord-ts.svg"}
        />
        <h1 className="hero__title ">Documentation</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/installation"
          >
            Quick Start →
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout description="The discord.ts documentation">
      <main>
        <HomepageHeader />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
