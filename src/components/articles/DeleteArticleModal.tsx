import { Modal } from "@/components/ui/Modal"
type DeleteArticleModalProps = {
  article: { id: number; title: string } | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteArticleModal({ article, isDeleting, onClose, onConfirm }: DeleteArticleModalProps) {
  return (
    <Modal title="Excluir Artigo" open={Boolean(article)} onClose={onClose}>
      <p className="modal-copy">Tem certeza que deseja excluir este artigo? Esta acao nao pode ser desfeita.</p>
      <div className="modal-actions">
        <button type="button" className="button-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="button-danger button-danger--solid" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? "Excluindo..." : "Excluir"}
        </button>
      </div>
    </Modal>
  )
}
