import { useEffect, useState } from "react";
import { Form, Button, Spinner, Alert, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommentsByDestination,
  addComment,
  resetAddCommentStatus,
} from "../features/comments/commentSlice";
import { Link } from "react-router-dom";

const commentSchema = yup
  .object({
    rating: yup.number().min(1, "Veuillez donner une note.").max(5).required(),
    content: yup
      .string()
      .min(10, "Votre avis doit faire au moins 10 caractères.")
      .required("Le message est requis."),
  })
  .required();

function StarRating({ value, hover, onHover, onLeave, onClick }) {
  return (
    <div className="d-flex gap-1" style={{ fontSize: "1.6rem", cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onClick(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={onLeave}
          className={star <= (hover || value) ? "star-active" : "star-empty"}
          style={{ transition: "color 0.15s" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function CommentsSection({ destinationId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: comments, status, addStatus, addError } = useSelector(
    (state) => state.comments
  );

  const [hover, setHover] = useState(0);
  const [successMsg, setSuccessMsg] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm({
      resolver: yupResolver(commentSchema),
      defaultValues: { rating: 0, content: "" },
    });

  const currentRating = watch("rating");

  useEffect(() => {
    if (destinationId) dispatch(fetchCommentsByDestination(destinationId));
    return () => dispatch(resetAddCommentStatus());
  }, [dispatch, destinationId]);

  const onSubmit = async (data) => {
    setSuccessMsg(false);
    try {
      await dispatch(
        addComment({ destination_id: destinationId, content: data.content, rating: data.rating })
      ).unwrap();
      reset({ rating: 0, content: "" });
      setSuccessMsg(true);
      dispatch(fetchCommentsByDestination(destinationId));
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(comments.length - 1, i + 1));

  return (
    <div>
      <span className="section-eyebrow">Avis voyageurs</span>
      <h3
        className="section-title h4 mb-4"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        Ce qu'ils en pensent
        {comments.length > 0 && (
          <span
            className="ms-2 rounded-pill px-2 py-1"
            style={{
              background: "var(--gold-subtle)",
              color: "var(--gold-dark)",
              fontSize: "0.75rem",
              fontWeight: 600,
              border: "1px solid var(--gold-light)",
              verticalAlign: "middle",
            }}
          >
            {comments.length}
          </span>
        )}
      </h3>

      {status === "pending" ? (
        <div className="text-center py-4">
          <Spinner animation="border" style={{ color: "var(--gold)" }} />
        </div>
      ) : comments.length === 0 ? (
        <p
          className="text-center py-4 rounded-4 mb-4"
          style={{
            color: "var(--text-muted)",
            background: "var(--cream-dark)",
            fontSize: "0.9rem",
          }}
        >
          Aucun avis pour le moment. Soyez le premier !
        </p>
      ) : (
        <div className="mb-4">
          <div
            className="comment-card p-4 mb-3"
            style={{ borderRadius: "1rem" }}
          >
            <div className="d-flex align-items-center gap-3 mb-3">
              {comments[activeIndex]?.avatar ? (
                <Image
                  src={comments[activeIndex].avatar}
                  roundedCircle
                  style={{
                    width: "44px",
                    height: "44px",
                    objectFit: "cover",
                    border: "2px solid var(--gold-light)",
                  }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "var(--gold-subtle)",
                    color: "var(--gold-dark)",
                    fontSize: "1rem",
                    border: "1px solid var(--gold-light)",
                    flexShrink: 0,
                  }}
                >
                  {comments[activeIndex]?.username?.charAt(0)?.toUpperCase() || "V"}
                </div>
              )}
              <div>
                <div className="fw-semibold" style={{ fontSize: "0.9rem", color: "var(--text-dark)" }}>
                  @{comments[activeIndex]?.username || "Voyageur anonyme"}
                </div>
                <div style={{ fontSize: "0.9rem" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={s <= (comments[activeIndex]?.rating || 0) ? "star-active" : "star-empty"}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p
              className="fst-italic mb-2"
              style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.9rem" }}
            >
              "{comments[activeIndex]?.content}"
            </p>

            {comments[activeIndex]?.created_at && (
              <small style={{ color: "var(--text-muted)", opacity: 0.6, fontSize: "0.75rem" }}>
                {new Date(comments[activeIndex].created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </small>
            )}
          </div>
          {comments.length > 1 && (
            <div className="d-flex align-items-center justify-content-between">
              <button
                onClick={prev}
                disabled={activeIndex === 0}
                className="border-0 rounded-pill px-4 py-2 fw-semibold"
                style={{
                  background: activeIndex === 0 ? "var(--cream-dark)" : "var(--navy)",
                  color: activeIndex === 0 ? "var(--text-muted)" : "#fff",
                  fontSize: "0.8rem",
                  cursor: activeIndex === 0 ? "default" : "pointer",
                  transition: "var(--transition)",
                }}
              >
                ← Précédent
              </button>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {activeIndex + 1} / {comments.length}
              </span>
              <button
                onClick={next}
                disabled={activeIndex === comments.length - 1}
                className="border-0 rounded-pill px-4 py-2 fw-semibold"
                style={{
                  background: activeIndex === comments.length - 1 ? "var(--cream-dark)" : "var(--navy)",
                  color: activeIndex === comments.length - 1 ? "var(--text-muted)" : "#fff",
                  fontSize: "0.8rem",
                  cursor: activeIndex === comments.length - 1 ? "default" : "pointer",
                  transition: "var(--transition)",
                }}
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      )}
      <div
        className="p-4 luxury-form"
        style={{
          background: "var(--cream-dark)",
          borderRadius: "1rem",
          marginBottom: "2rem",
        }}
      >
        {!user ? (
          <div className="text-center py-2">
            <p
              className="mb-3 fw-medium"
              style={{ fontFamily: "Playfair Display, serif", color: "var(--text-dark)" }}
            >
              Partagez votre expérience
            </p>
            <p className="mb-3" style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Connectez-vous pour laisser un avis sur cette destination.
            </p>
            <Button as={Link} to="/login" className="btn-gold rounded-pill px-4 fw-bold">
              Se connecter
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h6
              className="fw-bold mb-3"
              style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem" }}
            >
              Laisser un avis
            </h6>

            {successMsg && (
              <Alert variant="success" className="py-2 border-0 rounded-3 mb-3 small fw-medium">
                Merci pour votre avis !
              </Alert>
            )}
            {addError && (
              <Alert variant="danger" className="py-2 border-0 rounded-3 mb-3 small fw-medium">
                {addError}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <StarRating
                value={currentRating}
                hover={hover}
                onHover={setHover}
                onLeave={() => setHover(0)}
                onClick={(star) => setValue("rating", star, { shouldValidate: true })}
              />
              {errors.rating && (
                <div className="text-danger small mt-1 fw-semibold">{errors.rating.message}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Racontez-nous votre voyage…"
                isInvalid={!!errors.content}
                style={{
                  border: "1.5px solid #e0d9d0",
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  resize: "none",
                }}
                {...register("content")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.content?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              className="rounded-pill px-4 fw-bold"
              style={{
                background: "var(--navy)",
                border: "none",
                color: "#fff",
                fontSize: "0.85rem",
                letterSpacing: "0.04em",
              }}
              disabled={addStatus === "pending"}
            >
              {addStatus === "pending" ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Publier mon avis"
              )}
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}
