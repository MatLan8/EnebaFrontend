import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAddToCart } from "../api/cart/useAddToCart";
import { readApiErrorMessage } from "../api/core/readApiErrors";
import { AddedToCartModal } from "../components/cart/AddedToCartModal/AddedToCartModal";
import { ROUTES } from "../routes/paths";

export function useCartActions(offerId: string) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  const addAndOpen = () => {
    setBuyError(null);
    setModalOpen(true);
    addToCart.mutate(offerId);
  };

  const buyNow = async () => {
    setBuyError(null);
    try {
      await addToCart.mutateAsync(offerId);
      navigate(ROUTES.checkout);
    } catch (error) {
      setBuyError(readApiErrorMessage(error));
    }
  };

  const modalStatus = addToCart.isPending ? "pending" : addToCart.isError ? "error" : "success";

  const modal = modalOpen
    ? createPortal(
        <AddedToCartModal
          status={modalStatus}
          itemCount={addToCart.data?.itemCount}
          errorMessage={addToCart.isError ? readApiErrorMessage(addToCart.error) : undefined}
          onClose={() => setModalOpen(false)}
        />,
        document.body,
      )
    : null;

  return { isPending: addToCart.isPending, addAndOpen, buyNow, buyError, modal };
}
