type ArticleContentProps = {
  title: string
  content: string
}

function renderContent(content: string) {
  return content.split("\n").map((line, index) => {
    if (!line.trim()) {
      return null
    }

    if (line.startsWith("## ")) {
      return <h3 key={`${line}-${index}`}>{line.replace("## ", "")}</h3>
    }

    return <p key={`${line}-${index}`}>{line}</p>
  })
}

export function ArticleContent({ title, content }: ArticleContentProps) {
  return (
    <div className="article-prose">
      <h2>{title}</h2>
      {renderContent(content)}
    </div>
  )
}
