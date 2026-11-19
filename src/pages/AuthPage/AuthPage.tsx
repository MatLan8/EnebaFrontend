import { Link } from "react-router-dom";
import { LoginForm } from "../../components/auth/LoginForm";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { ROUTES } from "../../routes/paths";
import styles from "./AuthPage.module.css";

interface AuthPageProps {
  mode: "login" | "register";
}

export function AuthPage({ mode }: AuthPageProps) {
  return (
    <div className={styles.page}>
      <Link className={styles.logoLink} to={ROUTES.homepage} aria-label="Eneba">
        <img
          className={styles.logo}
          src="https://static.eneba.games/branding/v2/logoFull.svg"
          alt="Eneba"
        />
      </Link>
      <div className={styles.main}>
        <h1 className={styles.greeting}>
          Hi!
          <br />
          It’s nice to see you!
        </h1>
        {mode === "register" ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
}
