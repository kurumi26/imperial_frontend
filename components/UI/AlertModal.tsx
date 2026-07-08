import React from "react";

interface AlertModalProps {
  show: boolean;
  title: string;
  message: string;
  variant?: "success" | "danger";
  onClose: () => void;
}

export default function AlertModal({
  show,
  title,
  message,
  variant = "success",
  onClose,
}: AlertModalProps) {
  React.useEffect(() => {
    if (!show) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [show, onClose]);

  if (!show) return null;

  const icon = variant === "success" ? "fa-check-circle" : "fa-exclamation-circle";

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(2px)", zIndex: 1060 }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`card border-0 shadow-lg rounded-4 border-start border-4 border-${variant}`}
        style={{ width: "min(480px, 92vw)" }}
      >
        <div className="card-header bg-white border-0 d-flex align-items-start justify-content-between pt-3 px-3 pb-0">
          <div className="d-flex align-items-center gap-2">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center bg-${variant}-subtle`}
              style={{ width: 34, height: 34 }}
            >
              <i className={`fas ${icon} text-${variant}`} />
            </div>
            <h5 className="mb-0">{title}</h5>
          </div>
          <button type="button" className="btn btn-sm btn-link text-muted" onClick={onClose} aria-label="Close">
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="card-body px-3 pt-2 pb-3">
          <p className="mb-0 text-body">{message}</p>
        </div>

        <div className="card-footer bg-white border-0 px-3 pb-3 pt-0 d-flex justify-content-end">
          <button type="button" className={`btn btn-${variant}`} onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
