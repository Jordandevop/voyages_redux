import { Alert, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
} from "../features/favorites/favoriteSlice";
import { useState } from "react";

function FavoriteButton({ destination }) {
  const dispatch = useDispatch();

  const { favorites } = useSelector((state) => state.favorites);

  const { user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);

  const isFavorite = favorites.some(
    (fav) => fav.destination_id === destination.id,
  );
  const handleToggleFavorite = async () => {
    if (!user) {
      Alert("Veuillez vous connecter pour sauvegarder vos voyages préféres.");
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await dispatch(
          removeFavorite({ destination_id: destination.id }),
        ).unwrap();
      } else {
        await dispatch(
          addFavorite({
            destination_id: destination.id,
            destination_name: destination.name,
            destination_image: destination.image,
            user_id: user.id,
          }),
        ).unwrap();
      }
    } catch (error) {
      console.error("Erreur lors de la modification des favoris :", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Button
        variant={isFavorite ? "danger" : "light"}
        className={`rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm border ${isFavorite ? "" : "border-danger text-danger"}`}
        style={{ width: "40px", height: "40px", transition: "all 0.2s" }}
        onClick={handleToggleFavorite}
        disabled={isLoading}
        aria-label="Ajouter aux favoris"
      >
        {isLoading ? (
          <Spinner
            animation="border"
            size="sm"
            variant={isFavorite ? "light" : "danger"}
          />
        ) : (
          <span style={{ fontSize: "1.2rem", marginTop: "2px" }}>
            {isFavorite ? "❤️" : "🤍"}
          </span>
        )}
      </Button>
    </>
  );
}

export default FavoriteButton;
