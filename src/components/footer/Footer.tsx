import type { FormEvent } from "react";
import { DiscordIcon } from "../../icons/DiscordIcon";
import { FacebookIcon } from "../../icons/FacebookIcon";
import { GlobeIcon } from "../../icons/GlobeIcon";
import { InstagramIcon } from "../../icons/InstagramIcon";
import { PcGamerIcon } from "../../icons/PcGamerIcon";
import { RedditIcon } from "../../icons/RedditIcon";
import { XIcon } from "../../icons/XIcon";
import { mainFooterColumns, type FooterColumn } from "./footerLinks";
import styles from "./Footer.module.css";

const socialLinks = [
  { label: "Facebook", Icon: FacebookIcon },
  { label: "X", Icon: XIcon },
  { label: "Instagram", Icon: InstagramIcon },
  { label: "Discord", Icon: DiscordIcon },
  { label: "Reddit", Icon: RedditIcon },
];

function FooterExtras() {
  return (
    <>
      <div className={styles.follow}>
        <span className={styles.heading}>Follow us</span>
        <ul className={styles.social}>
          {socialLinks.map(({ label, Icon }) => (
            <li key={label}>
              <button type="button" className={styles.socialLink} aria-label={label}>
                <Icon />
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.award}>
          <PcGamerIcon />
          <span>Editor&apos;s Choice</span>
        </div>
        <img
          className={styles.partner}
          src="https://static.eneba.games/d109b8436c8e285f7dbc.png"
          alt="Monster Energy"
        />
      </div>
      <div className={styles.apps}>
        <span className={styles.heading}>Download the App</span>
        <button type="button" className={styles.badgeButton}>
          <img
            className={styles.badge}
            src="https://static.eneba.games/mobile/v1/appAndroidCTA.svg"
            alt="Google play badge"
          />
        </button>
        <button type="button" className={styles.badgeButton}>
          <img
            className={styles.badge}
            src="https://static.eneba.games/mobile/v1/appAppleCTA.svg"
            alt="Apple badge"
          />
        </button>
      </div>
      <div className={styles.reviews}>
        <span className={styles.heading}>See our reviews on</span>
        <button type="button" className={styles.trustpilot} aria-label="Trustpilot">
          <span className={styles.trustpilotName}>
            <span className={styles.trustpilotStar}>★</span> Trustpilot
          </span>
          <span className={styles.stars} aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className={styles.starBox}>
                ★
              </span>
            ))}
          </span>
          <span className={styles.trustScore}>
            TrustScore 4.4 | <u>334,734 reviews</u>
          </span>
        </button>
      </div>
    </>
  );
}

function FooterNewsletter() {
  const subscribe = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <form className={styles.newsletter} onSubmit={subscribe}>
        <p className={styles.newsletterTitle}>Get personalized game deals</p>
        <div className={styles.newsletterRow}>
          <input
            className={styles.email}
            type="email"
            placeholder="Enter your email"
            aria-label="Enter your email"
            required
          />
          <button type="submit" className={styles.subscribe}>
            Subscribe
          </button>
        </div>
        <p className={styles.note}>
          You can unsubscribe at any time. Visit{" "}
          <button type="button" className={styles.inlineButton}>
            Privacy notice
          </button>{" "}
          for more information
        </p>
      </form>
      <button type="button" className={styles.language}>
        <img
          src="https://static.eneba.games/flags/lang/v2/lithuania.svg"
          alt=""
          width={16}
          height={16}
        />
        <span>English EU</span>
        <span className={styles.divider} aria-hidden="true" />
        <span>EUR</span>
      </button>
    </>
  );
}

interface FooterProps {
  variant?: "dark" | "light";
  minimal?: boolean;
  columns?: FooterColumn[];
}

export function Footer({ variant = "dark", minimal = false, columns = mainFooterColumns }: FooterProps) {
  return (
    <footer className={variant === "light" ? `${styles.footer} ${styles.light}` : styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {columns.map((column) => (
            <ul key={column.title} className={styles.column}>
              <li className={styles.heading}>{column.title}</li>
              {column.links.map((label) => (
                <li key={label}>
                  <button type="button" className={styles.link}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          ))}
          {!minimal && <FooterExtras />}
        </div>

        <div className={styles.bottom}>
          {minimal ? (
            <button type="button" className={styles.language}>
              <GlobeIcon />
              <span>Lithuania (English EU)</span>
              <span className={styles.divider} aria-hidden="true" />
              <span>EUR</span>
            </button>
          ) : (
            <FooterNewsletter />
          )}
        </div>

        <p className={styles.copyright}>
          Copyright © 2026 Eneba. All Rights Reserved. JSC “Helis play”, Gyneju St. 4-333,
          Vilnius, the Republic of Lithuania{" "}
          <button type="button" className={styles.inlineButton}>
            Terms and Conditions
          </button>
          ,{" "}
          <button type="button" className={styles.inlineButton}>
            Privacy notice
          </button>
          ,{" "}
          <button type="button" className={styles.inlineButton}>
            Cookie preferences
          </button>
          .
        </p>
      </div>
    </footer>
  );
}
