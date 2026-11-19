import { AlertCircleIcon } from "../../icons/AlertCircle";
import styles from "./ErrorBox.module.css";

interface ErrorBoxProps {
  messages: string[];
  fit?: boolean;
  className?: string;
}

export function ErrorBox({ messages, fit = false, className }: ErrorBoxProps) {
  if (messages.length === 0) return null;

  return (
    <div className={[styles.box, fit && styles.fit, className].filter(Boolean).join(" ")} role="alert">
      {messages.map((message) => (
        <p key={message} className={styles.message}>
          <AlertCircleIcon className={styles.icon} />
          {message}
        </p>
      ))}
    </div>
  );
}
