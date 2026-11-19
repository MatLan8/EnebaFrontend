import { Link } from "react-router-dom";
import { useGetProductFilters } from "../../../api/useGetProductFilters";
import type { ProductType } from "../../../constants/productType";
import { storePath } from "../../../routes/paths";
import { typeLabels } from "../../filters/filterLabels";
import styles from "./CategoryBar.module.css";

export function CategoryBar() {
  const filters = useGetProductFilters();
  const types = filters.data?.types ?? [];

  return (
    <nav className={styles.bar} aria-label="Product categories">
      <ul className={styles.list}>
        {types.map(({ value }) => (
          <li key={value} className={styles.item}>
            <Link className={styles.link} to={storePath([value])}>
              {`${typeLabels[value as ProductType] ?? value}s`}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
