import * as React from 'react'
import { domain } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from 'components'

import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const props = await resolveNotionPage(domain)
    return { props }
  } catch (err) {
    console.error('page error', domain, err)
    return { notFound: true }
  }
}

export default function NotionDomainPage(props) {
  return <NotionPage {...props} />
}
