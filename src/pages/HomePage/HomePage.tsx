import { readApiErrors } from "../../api/readApiErrors";
import { useGetHome } from "../../api/useGetHome";
import { ProductCarouselBlock } from "../../components/home/ProductCarouselBlock/ProductCarouselBlock";
import { PageLoader } from "../../components/PageLoader/PageLoader";
import { storePath } from "../../routes/paths";
import styles from "./HomePage.module.css";

export function HomePage() {
  const home = useGetHome();
  const blocks = home.data?.blocks ?? [];

  return (
    <main className={styles.page}>
      <h1 className={styles.srOnly}>Eneba</h1>
      {home.isPending && <PageLoader />}

      {home.error && (
        <div className={styles.state}>
          {readApiErrors(home.error).map((message) => (
            <p key={message} className={styles.message}>
              {message}
            </p>
          ))}
        </div>
      )}
      {home.data && blocks.length === 0 && (
        <div className={styles.state}>
          <p className={styles.message}>No products available right now.</p>
        </div>
      )}
      {blocks.map((block, index) => (
        <ProductCarouselBlock
          key={block.title}
          title={block.title}
          products={block.products}
          showAllTo={storePath(block.productTypes)}
          raised={index % 2 === 1}
        />
      ))}
    </main>
  );
}
