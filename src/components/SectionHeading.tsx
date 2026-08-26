export const SectionHeading = ({ eyebrow, title, description, titleId }: { eyebrow: string; title: string; description: string; titleId?: string }) => (
  <div className="section-heading">
    <div><p className="eyebrow">{eyebrow}</p><h2 id={titleId}>{title}</h2></div>
    <p>{description}</p>
  </div>
)
