import { useEffect, useState } from "react";
import { Form, Button, Card, Spinner, Alert, Carousel, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommentsByDestination, addComment, resetAddCommentStatus } from "../features/comments/commentSlice";
import { Link } from "react-router-dom";

const commentSchema = yup.object({
  rating: yup.number().min(1, "Veuillez donner une note.").max(5).required("La note est requise."),
  content: yup.string().min(10, "Votre avis doit faire au moins 10 caractères.").required("Le message est requis."),
}).required();

export default function CommentsSection({ destinationId }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items: comments, status, addStatus, addError } = useSelector((state) => state.comments);

  const [hover, setHover] = useState(0);
  const [successMsg, setSuccessMsg] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: { rating: 0, content: "" }
  });

  const currentRating = watch("rating");

  useEffect(() => {
    if (destinationId) {
      dispatch(fetchCommentsByDestination(destinationId));
    }
    return () => dispatch(resetAddCommentStatus());
  }, [dispatch, destinationId]);

  const onSubmit = async (data) => {
    setSuccessMsg(false);
    try {
      const payload = {
        destination_id: destinationId,
        content: data.content,
        rating: data.rating
      };

      await dispatch(addComment(payload)).unwrap();
      
      reset({ rating: 0, content: "" });
      setSuccessMsg(true);
      dispatch(fetchCommentsByDestination(destinationId));
      
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'avis", err);
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Avis des voyageurs ({comments.length})</h4>
      </div>

      {status === 'pending' ? (
        <div className="text-center py-4"><Spinner variant="primary" animation="border" /></div>
      ) : comments.length === 0 ? (
        <p className="text-muted text-center py-4 bg-light rounded-4">Aucun avis pour le moment. Soyez le premier !</p>
      ) : (
        <Carousel 
            variant="dark" 
            indicators={true} 
            controls={comments.length > 1} 
            interval={null} 
            className="pb-4 pt-2"
        >
          {comments.map((comment) => (
            <Carousel.Item key={comment.id}>
              <Card className="border-0 shadow-sm rounded-4 p-3 mx-5 mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      {comment.avatar ? (
                        <Image 
                          src={comment.avatar} 
                          roundedCircle 
                          style={{ width: "45px", height: "45px", objectFit: "cover" }} 
                          className="border shadow-sm"
                        />
                      ) : (
                        <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold fs-5 shadow-sm" style={{ width: "45px", height: "45px" }}>
                          {comment.username ? comment.username.charAt(0).toUpperCase() : "V"}
                        </div>
                      )}
                      
                      <div>
                        <div className="fw-bold text-dark">
                          {comment.username ? `@${comment.username}` : "Voyageur anonyme"}
                        </div>
                        <div className="text-warning small">
                          {"★".repeat(comment.rating)}{"☆".repeat(5 - comment.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted mb-2 fst-italic">"{comment.content}"</p>
                  
                  {comment.created_at && (
                    <small className="text-muted opacity-50 d-block text-end">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </small>
                  )}
                </Card.Body>
              </Card>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      <Card className="border-0 bg-light rounded-4 p-4 mb-5 shadow-sm">
        {!user ? (
          <div className="text-center py-3">
            <h5 className="fw-bold">Partagez votre expérience</h5>
            <p className="text-muted">Vous devez être connecté pour laisser un avis sur cette destination.</p>
            <Button as={Link} to="/login" variant="primary" className="rounded-pill px-4 fw-bold shadow-sm">
              Se connecter
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h5 className="fw-bold mb-3">Laisser un avis</h5>
            
            {successMsg && <Alert variant="success" className="py-2 fw-medium">Merci pour votre avis !</Alert>}
            {addError && <Alert variant="danger" className="py-2 fw-medium">⚠️ {addError}</Alert>}

            <Form.Group className="mb-3">
              <div className="d-flex gap-1 fs-3" style={{ cursor: "pointer" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setValue("rating", star, { shouldValidate: true })}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    style={{ color: star <= (hover || currentRating) ? "#ffc107" : "#e4e5e9" }}
                  >
                    ★
                  </span>
                ))}
              </div>
              {errors.rating && <div className="text-danger small mt-1 fw-bold">{errors.rating.message}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Racontez-nous votre voyage..."
                isInvalid={!!errors.content}
                {...register("content")}
              />
              <Form.Control.Feedback type="invalid">{errors.content?.message}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" className="rounded-pill px-4 fw-bold" disabled={addStatus === 'pending'}>
              {addStatus === 'pending' ? <Spinner size="sm" animation="border" /> : "Publier mon avis"}
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
}