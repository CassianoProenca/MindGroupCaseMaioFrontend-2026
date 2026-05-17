type PaginationProps = {
  page: number
  totalPages: number
  onChange: (next: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const containerClassName = className ? `pagination-row ${className}` : "pagination-row"

  return (
    <div className={containerClassName}>
      <button type="button" className="button-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span>
        Pagina {page} de {totalPages}
      </span>
      <button
        type="button"
        className="button-secondary"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Proxima
      </button>
    </div>
  )
}
