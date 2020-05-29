import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Secure Digital Identity</>,
    imageUrl: '/img/secure.png',
    description: (
      <>
        Bridge Protocol is a secure identity protocol that allows for verification, management, and transmission of digital identity.  With the Bridge Protocol, users are in total control of their data and only provide the data they choose.
      </>
    ),
  },
  {
    title: <>Flexible Integration Options</>,
    imageUrl: '/img/flexible.png',
    description: (
      <>
        Your Bridge Protocol identity is fully portable allowing for peer-to-peer, in-person, and on-chain transmission with popular blockchains.  There are several flexible integrated authentication and authorization options for any application.
      </>
    ),
  },
  {
    title: <>Open Source</>,
    imageUrl: '/img/github.png',
    description: (
      <>
        Bridge Protocol was built and open sourced to bring secure digital identity to the community.  The core SDK, integration microservices, and end-user clients are all available on GitHub and free to use in all of your applications.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <div className="hero-logo">
            <img src="/img/bridge-logo.png"></img>
            <h2>Portable Digital Identity Solution v3.0</h2>
          </div>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/overview')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
