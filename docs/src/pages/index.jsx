import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";

import HomepageFeatures from "../components/HomepageFeatures";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero--primary", styles.heroBanner)}>
      <div className="container">
        <img className={styles.heroImg} src={"/discordx.svg"} />
        <h1 className="hero__title ">Documentation</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/discordx/getting-started"
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
    <Layout description="The discordx documentation">
      <main>
        <HomepageHeader />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
