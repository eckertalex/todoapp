import {Helmet} from 'react-helmet-async'

type SEOProps = {
  helmetTitle: string
  helmetDescription: string
}

function SEO(props: SEOProps) {
  const {helmetTitle, helmetDescription} = props

  return (
    <Helmet>
      <title>{helmetTitle}</title>
      <meta name="description" content={helmetDescription} />
    </Helmet>
  )
}

export {SEO}
