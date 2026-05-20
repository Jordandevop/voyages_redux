import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../features/favorites/favoriteSlice';
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function FavoriteButton({ destination }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { favorites } = useSelector((state) => state.favorites);
    const { user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);

    const isFavorite = favorites.some((fav) => String(fav.destination_id) === String(destination.id));

    const handleToggleFavorite = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            if (isFavorite) {
                await dispatch(removeFavorite({ 
                    destination_id: destination.id,
                    user_id: user.id 
                })).unwrap();
            } else {
                await dispatch(addFavorite({
                    destination_id: destination.id,
                    destination_title: destination.name || destination.title,
                    destination_image: destination.image,
                    user_id: user.id
                })).unwrap();
            }
        } catch (error) {
            console.error("Erreur serveur :", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button 
            variant={isFavorite ? "danger" : "light"} 
            className={`rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm border ${isFavorite ? '' : 'border-danger text-danger'}`}
            style={{ width: '40px', height: '40px', transition: 'all 0.2s' }}
            onClick={handleToggleFavorite}
            disabled={isLoading}
            aria-label="Ajouter aux favoris"
        >
            {isLoading ? (
                <Spinner animation="border" size="sm" variant={isFavorite ? "light" : "danger"} />
            ) : (
                <span style={{ fontSize: '1.2rem', marginTop: '2px' }}>
                    {isFavorite ? "❤️" : "🤍"}
                </span>
            )}
        </Button>
    );
}

export default FavoriteButton;