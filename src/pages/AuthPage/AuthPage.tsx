import { LoginForm } from "../../components/auth/LoginForm";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { BrandLogo } from "../../components/BrandLogo/BrandLogo";
import styles from "./AuthPage.module.css";

interface AuthPageProps {
  mode: "login" | "register";
}

export function AuthPage({ mode }: AuthPageProps) {
  return (
    <div className={styles.page}>
      <BrandLogo className={styles.logo} linkClassName={styles.logoLink} />
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
