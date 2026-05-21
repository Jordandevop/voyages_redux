import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addFavorite, removeFavorite } from "../features/favorites/favoriteSlice";

export default function FavoriteButton({ destination }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  
  const [isLoading, setIsLoading] = useState(false);

  const isFavorite = favorites.some(
    (fav) => Number(fav.destinationId || fav.destination_id) === Number(destination.id)
  );

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Vous devez être connecté pour ajouter une destination à vos favoris.");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        await dispatch(removeFavorite(destination.id)).unwrap();
      } else {
        await dispatch(addFavorite({
          destinationId: destination.id,
          title: destination.name,
          image: destination.image,
        })).unwrap();
      }
    } catch (error) {
      console.error("Erreur lors de la modification des favoris :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFavorite ? "danger" : "light"}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className="rounded-circle shadow-sm d-flex align-items-center justify-content-center"
      style={{ width: "45px", height: "45px", transition: "all 0.2s" }}
      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      {isLoading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <span className="fs-5">{isFavorite ? "❤️" : "🤍"}</span>
      )}
    </Button>
  );
}