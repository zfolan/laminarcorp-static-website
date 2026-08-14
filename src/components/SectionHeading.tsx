type Props = {
  eyebrow: string
  title: string
  copy: string
  align?: 'left' | 'split'
}

export const SectionHeading = ({ eyebrow, title, copy, align = 'split' }: Props) => (
  <header className={`section-heading section-heading--${align}`}>
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
    <p className="section-copy">{copy}</p>
  </header>
)
