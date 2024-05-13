import { ApiReferenceReact } from '@scalar/api-reference-react'

export default function Scalar ({ url }) {
  const customCss = `.dark-mode {
    --scalar-color-1: rgb(255 255 255 / var(--tw-bg-opacity));
    --scalar-background-1: rgb(0 5 11 / var(--tw-bg-opacity));
    --scalar-background-3: rgb(0 5 11 / var(--tw-bg-opacity));
    --sidebar-background-1: rgb(0 5 11 / var(--tw-bg-opacity));
    --sidebar-border-color: rgb(0 5 11 / var(--tw-bg-opacity));
  }
  .darklight {
    display: none !important;
  }`

  return (
    <ApiReferenceReact
      configuration={{
        customCss,
        spec: {
          url: `${url}/documentation/json`
        },
        showSidebar: false
      }}
    />
  )
}
