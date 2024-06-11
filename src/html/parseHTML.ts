import { JSDOM } from 'jsdom'

export const parseHTML = (html: string): Document => {
  const { window } = new JSDOM(html)
  return window.document
}
