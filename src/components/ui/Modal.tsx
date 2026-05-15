import type { ReactNode } from "react"
import { X } from "lucide-react"

type ModalProps = {
  title: string
  children: ReactNode
  open: boolean
  onClose: () => void
}

export function Modal({ title, children, open, onClose }: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="modal-close" aria-label="Fechar" onClick={onClose}>
          <X size={18} />
        </button>
        <h2 id="modal-title">{title}</h2>
        {children}
      </section>
    </div>
  )
}
