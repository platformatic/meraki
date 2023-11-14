'use strict'
import PropTypes from 'prop-types'

function RuntimeSmallCard ({ classNameSvg }) {
  return (
    <svg width='544' height='125' viewBox='0 0 544 125' fill='none' xmlns='http://www.w3.org/2000/svg' className={classNameSvg}>
      <path d='M224.925 31.6138C224.925 33.0865 226.119 34.2804 227.592 34.2804C229.065 34.2804 230.259 33.0865 230.259 31.6138C230.259 30.141 229.065 28.9471 227.592 28.9471C226.119 28.9471 224.925 30.141 224.925 31.6138ZM44.517 5.61377C44.517 7.08653 45.711 8.28044 47.1837 8.28044C48.6565 8.28044 49.8504 7.08653 49.8504 5.61377C49.8504 4.14101 48.6565 2.9471 47.1837 2.9471C45.711 2.9471 44.517 4.14101 44.517 5.61377ZM228.092 31.6138V24.1141H227.092V31.6138H228.092ZM223.592 19.6141H51.1837V20.6141H223.592V19.6141ZM47.6837 16.1141V5.61377H46.6837V16.1141H47.6837ZM51.1837 19.6141C49.2507 19.6141 47.6837 18.0471 47.6837 16.1141H46.6837C46.6837 18.5994 48.6984 20.6141 51.1837 20.6141V19.6141ZM228.092 24.1141C228.092 21.6288 226.077 19.6141 223.592 19.6141V20.6141C225.525 20.6141 227.092 22.1811 227.092 24.1141H228.092Z' fill='white' fillOpacity={0.15} />
      <path d='M285.769 90.1138C285.769 88.641 284.575 87.4471 283.102 87.4471C281.629 87.4471 280.435 88.641 280.435 90.1138C280.435 91.5865 281.629 92.7805 283.102 92.7805C284.575 92.7805 285.769 91.5865 285.769 90.1138ZM466.177 116.114C466.177 114.641 464.983 113.447 463.51 113.447C462.037 113.447 460.844 114.641 460.844 116.114C460.844 117.587 462.037 118.78 463.51 118.78C464.983 118.78 466.177 117.587 466.177 116.114ZM282.602 90.1138L282.602 97.6135L283.602 97.6135L283.602 90.1138L282.602 90.1138ZM287.102 102.113L459.51 102.113L459.51 101.113L287.102 101.113L287.102 102.113ZM463.01 105.613L463.01 116.114L464.01 116.114L464.01 105.613L463.01 105.613ZM459.51 102.113C461.443 102.113 463.01 103.68 463.01 105.613L464.01 105.613C464.01 103.128 461.996 101.113 459.51 101.113L459.51 102.113ZM282.602 97.6135C282.602 100.099 284.617 102.113 287.102 102.113L287.102 101.113C285.169 101.113 283.602 99.5465 283.602 97.6135L282.602 97.6135Z' fill='white' fillOpacity={0.15} />
      <path d='M285.769 31.6138C285.769 33.0865 284.575 34.2804 283.102 34.2804C281.629 34.2804 280.435 33.0865 280.435 31.6138C280.435 30.141 281.629 28.9471 283.102 28.9471C284.575 28.9471 285.769 30.141 285.769 31.6138ZM466.177 5.61377C466.177 7.08653 464.983 8.28044 463.51 8.28044C462.037 8.28044 460.844 7.08653 460.844 5.61377C460.844 4.14101 462.037 2.9471 463.51 2.9471C464.983 2.9471 466.177 4.14101 466.177 5.61377ZM282.602 31.6138V24.1141H283.602V31.6138H282.602ZM287.102 19.6141H459.51V20.6141H287.102V19.6141ZM463.01 16.1141V5.61377H464.01V16.1141H463.01ZM459.51 19.6141C461.443 19.6141 463.01 18.0471 463.01 16.1141H464.01C464.01 18.5994 461.996 20.6141 459.51 20.6141V19.6141ZM282.602 24.1141C282.602 21.6288 284.617 19.6141 287.102 19.6141V20.6141C285.169 20.6141 283.602 22.1811 283.602 24.1141H282.602Z' fill='white' fillOpacity={0.15} />
      <path d='M224.925 90.1138C224.925 88.641 226.119 87.4471 227.592 87.4471C229.065 87.4471 230.259 88.641 230.259 90.1138C230.259 91.5865 229.065 92.7804 227.592 92.7804C226.119 92.7804 224.925 91.5865 224.925 90.1138ZM44.517 116.114C44.517 114.641 45.711 113.447 47.1837 113.447C48.6565 113.447 49.8504 114.641 49.8504 116.114C49.8504 117.587 48.6565 118.78 47.1837 118.78C45.711 118.78 44.517 117.587 44.517 116.114ZM228.092 90.1138L228.092 97.6134L227.092 97.6134L227.092 90.1138L228.092 90.1138ZM223.592 102.113L51.1837 102.113L51.1837 101.113L223.592 101.113L223.592 102.113ZM47.6837 105.613L47.6837 116.114L46.6837 116.114L46.6837 105.613L47.6837 105.613ZM51.1837 102.113C49.2507 102.113 47.6837 103.68 47.6837 105.613L46.6837 105.613C46.6837 103.128 48.6984 101.113 51.1837 101.113L51.1837 102.113ZM228.092 97.6134C228.092 100.099 226.077 102.113 223.592 102.113L223.592 101.113C225.525 101.113 227.092 99.5464 227.092 97.6134L228.092 97.6134Z' fill='white' fillOpacity={0.15} />
      <path d='M254.531 90.1116C254.531 88.6389 255.725 87.445 257.198 87.445C258.67 87.445 259.864 88.6389 259.864 90.1116C259.864 91.5844 258.67 92.7783 257.198 92.7783C255.725 92.7783 254.531 91.5844 254.531 90.1116ZM129.17 121.614C129.17 120.141 130.364 118.947 131.837 118.947C133.309 118.947 134.503 120.141 134.503 121.614C134.503 123.087 133.309 124.28 131.837 124.28C130.364 124.28 129.17 123.087 129.17 121.614ZM257.698 90.1116L257.698 103.113L256.698 103.113L256.698 90.1116L257.698 90.1116ZM253.198 107.613L135.837 107.613L135.837 106.613L253.198 106.613L253.198 107.613ZM132.337 111.113L132.337 121.614L131.337 121.614L131.337 111.113L132.337 111.113ZM135.837 107.613C133.904 107.613 132.337 109.18 132.337 111.113L131.337 111.113C131.337 108.628 133.351 106.613 135.837 106.613L135.837 107.613ZM257.698 103.113C257.698 105.598 255.683 107.613 253.198 107.613L253.198 106.613C255.131 106.613 256.698 105.046 256.698 103.113L257.698 103.113Z' fill='white' fillOpacity={0.15} />
      <path d='M89.3878 11.6138C89.3878 13.0865 90.5817 14.2804 92.0544 14.2804C93.5272 14.2804 94.7211 13.0865 94.7211 11.6138C94.7211 10.141 93.5272 8.9471 92.0544 8.9471C90.5817 8.9471 89.3878 10.141 89.3878 11.6138ZM67.1837 3.11377C67.1837 4.58653 68.3776 5.78044 69.8503 5.78044C71.3231 5.78044 72.517 4.58653 72.517 3.11377C72.517 1.64101 71.3231 0.447103 69.8503 0.447103C68.3776 0.447103 67.1837 1.64101 67.1837 3.11377ZM92.0544 11.1138H73.8503V12.1138H92.0544V11.1138ZM70.3503 7.61377V3.11377H69.3503V7.61377H70.3503ZM73.8503 11.1138C71.9173 11.1138 70.3503 9.54677 70.3503 7.61377H69.3503C69.3503 10.0991 71.3651 12.1138 73.8503 12.1138V11.1138Z' fill='white' fillOpacity={0.15} />
      <path d='M452.98 11.6138C452.98 13.0865 454.174 14.2804 455.646 14.2804C457.119 14.2804 458.313 13.0865 458.313 11.6138C458.313 10.141 457.119 8.9471 455.646 8.9471C454.174 8.9471 452.98 10.141 452.98 11.6138ZM417.361 4.61377C417.361 6.08653 418.555 7.28044 420.027 7.28044C421.5 7.28044 422.694 6.08653 422.694 4.61377C422.694 3.14101 421.5 1.9471 420.027 1.9471C418.555 1.9471 417.361 3.14101 417.361 4.61377ZM455.646 11.1138H424.027V12.1138H455.646V11.1138ZM420.527 7.61377V4.61377H419.527V7.61377H420.527ZM424.027 11.1138C422.094 11.1138 420.527 9.54677 420.527 7.61377H419.527C419.527 10.0991 421.542 12.1138 424.027 12.1138V11.1138Z' fill='white' fillOpacity={0.15} />
      <path d='M57.7142 110.114C57.7142 108.641 56.5203 107.447 55.0476 107.447C53.5748 107.447 52.3809 108.641 52.3809 110.114C52.3809 111.587 53.5748 112.78 55.0476 112.78C56.5203 112.78 57.7142 111.587 57.7142 110.114ZM93.3333 117.114C93.3333 115.641 92.1394 114.447 90.6666 114.447C89.1939 114.447 88 115.641 88 117.114C88 118.587 89.1939 119.78 90.6666 119.78C92.1394 119.78 93.3333 118.587 93.3333 117.114ZM55.0476 110.614L86.6666 110.614L86.6666 109.614L55.0476 109.614L55.0476 110.614ZM90.1666 114.114L90.1666 117.114L91.1666 117.114L91.1666 114.114L90.1666 114.114ZM86.6666 110.614C88.5996 110.614 90.1666 112.181 90.1666 114.114L91.1666 114.114C91.1666 111.628 89.1519 109.614 86.6666 109.614L86.6666 110.614Z' fill='white' fillOpacity={0.15} />
      <path d='M274.667 106.114C274.667 104.641 273.473 103.447 272 103.447C270.527 103.447 269.333 104.641 269.333 106.114C269.333 107.587 270.527 108.78 272 108.78C273.473 108.78 274.667 107.587 274.667 106.114ZM310.286 113.114C310.286 111.641 309.092 110.447 307.619 110.447C306.146 110.447 304.952 111.641 304.952 113.114C304.952 114.587 306.146 115.78 307.619 115.78C309.092 115.78 310.286 114.587 310.286 113.114ZM272 106.614L303.619 106.614L303.619 105.614L272 105.614L272 106.614ZM307.119 110.114L307.119 113.114L308.119 113.114L308.119 110.114L307.119 110.114ZM303.619 106.614C305.552 106.614 307.119 108.181 307.119 110.114L308.119 110.114C308.119 107.628 306.104 105.614 303.619 105.614L303.619 106.614Z' fill='white' fillOpacity={0.15} />
      <path d='M323.918 26.1138C323.918 27.5865 325.112 28.7804 326.585 28.7804C328.058 28.7804 329.252 27.5865 329.252 26.1138C329.252 24.641 328.058 23.4471 326.585 23.4471C325.112 23.4471 323.918 24.641 323.918 26.1138ZM434.476 26.1138C434.476 27.5865 435.67 28.7804 437.143 28.7804C438.616 28.7804 439.809 27.5865 439.809 26.1138C439.809 24.641 438.616 23.4471 437.143 23.4471C435.67 23.4471 434.476 24.641 434.476 26.1138ZM326.585 26.6138H437.143V25.6138H326.585V26.6138Z' fill='white' fillOpacity={0.15} />
      <path d='M186.776 95.6138C186.776 94.141 185.582 92.9471 184.109 92.9471C182.636 92.9471 181.442 94.141 181.442 95.6138C181.442 97.0865 182.636 98.2804 184.109 98.2804C185.582 98.2804 186.776 97.0865 186.776 95.6138ZM76.2177 95.6138C76.2177 94.141 75.0238 92.9471 73.5511 92.9471C72.0783 92.9471 70.8844 94.141 70.8844 95.6138C70.8844 97.0865 72.0783 98.2804 73.5511 98.2804C75.0238 98.2804 76.2177 97.0865 76.2177 95.6138ZM184.109 95.1138L73.5511 95.1138L73.5511 96.1138L184.109 96.1138L184.109 95.1138Z' fill='white' fillOpacity={0.15} />
      <path d='M71.3469 26.1138C71.3469 27.5865 72.5408 28.7804 74.0135 28.7804C75.4863 28.7804 76.6802 27.5865 76.6802 26.1138C76.6802 24.641 75.4863 23.4471 74.0135 23.4471C72.5408 23.4471 71.3469 24.641 71.3469 26.1138ZM181.905 26.1138C181.905 27.5865 183.099 28.7804 184.571 28.7804C186.044 28.7804 187.238 27.5865 187.238 26.1138C187.238 24.641 186.044 23.4471 184.571 23.4471C183.099 23.4471 181.905 24.641 181.905 26.1138ZM74.0135 26.6138H184.571V25.6138H74.0135V26.6138Z' fill='white' fillOpacity={0.15} />
      <path d='M439.347 95.6138C439.347 94.141 438.153 92.9471 436.68 92.9471C435.207 92.9471 434.014 94.141 434.014 95.6138C434.014 97.0865 435.207 98.2804 436.68 98.2804C438.153 98.2804 439.347 97.0865 439.347 95.6138ZM328.789 95.6138C328.789 94.141 327.595 92.9471 326.122 92.9471C324.65 92.9471 323.456 94.141 323.456 95.6138C323.456 97.0865 324.65 98.2804 326.122 98.2804C327.595 98.2804 328.789 97.0865 328.789 95.6138ZM436.68 95.1138L326.122 95.1138L326.122 96.1138L436.68 96.1138L436.68 95.1138Z' fill='white' fillOpacity={0.15} />
    </svg>
  )
}

RuntimeSmallCard.propTypes = {
  /**
   * classNameSvg
    */
  classNameSvg: PropTypes.string
}

RuntimeSmallCard.defaultProps = {
  classNameSvg: ''
}

export default RuntimeSmallCard
