import { useGetProducts } from "./api/useGetProducts";

function App() {
  const { data, error } = useGetProducts();

  console.log(data);

  if (error) {
    console.error(error);
  }

  return <></>;
}

export default App;
