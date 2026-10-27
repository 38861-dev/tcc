export default function ToastStack({ toasts }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={toast.type === "error" ? "toast error" : "toast success"}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
