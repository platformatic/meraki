import { ApiReferenceReact } from '@scalar/api-reference-react'

export default function Scalar ({ url }) {
  const customCss = `.dark-mode {
    --theme-color-1: rgb(255 255 255 / var(--tw-text-opacity));
    --theme-background-1: rgb(0 5 11 / var(--tw-bg-opacity));
    --theme-background-3: rgb(0 5 11 / var(--tw-bg-opacity));
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
        }
      }}
    />
  )
}
