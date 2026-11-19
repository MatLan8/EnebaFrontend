import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { ROUTES } from "../../routes/paths";
import styles from "./NotFound.module.css";

export function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add(styles.background);
    return () => document.body.classList.remove(styles.background);
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.copy}>
        <h1 className={styles.title}>Highscore! 404</h1>
        <p className={styles.text}>We're pretty sure something went horribly wrong</p>
        <SecondaryButton className={styles.button} onClick={() => navigate(ROUTES.homepage)}>
          Continue browsing
        </SecondaryButton>
      </div>
      <img className={styles.image} src="/Ghosts.png" alt="" width={1044} height={424} />
    </main>
  );
}
