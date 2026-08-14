import { useEffect } from 'react'

type Meta = { title: string; description: string }

const upsertMeta = (selector: string, attribute: string, value: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    const [name, key] = selector.includes('property=') ? ['property', selector.match(/"(.+)"/)?.[1]] : ['name', selector.match(/"(.+)"/)?.[1]]
    if (key) element.setAttribute(name, key)
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

export const usePageMeta = ({ title, description }: Meta) => {
  useEffect(() => {
    document.title = title
    upsertMeta('meta[name="description"]', 'content', description)
    upsertMeta('meta[property="og:title"]', 'content', title)
    upsertMeta('meta[property="og:description"]', 'content', description)
    upsertMeta('meta[property="og:type"]', 'content', 'website')
    upsertMeta('meta[property="og:url"]', 'content', window.location.href)
  }, [description, title])
}
