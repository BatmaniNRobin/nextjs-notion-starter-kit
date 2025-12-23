import * as React from 'react'
import { GetServerSideProps } from 'next'
import { domain } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { PageProps, Params } from 'lib/types'
import { NotionPage } from 'components'

export const getServerSideProps: GetServerSideProps<PageProps, Params> = async (context) => {
  const rawPageId = context.params?.pageId as string

  try {
    const props = await resolveNotionPage(domain, rawPageId)
    return { props }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)
    return { notFound: true }
  }
}

export default function NotionDomainDynamicPage(props) {
  return <NotionPage {...props} />
}
