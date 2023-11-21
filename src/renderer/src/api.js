const nameList = [
  'Time - Past - Future - Dev',
  'Fly - Flying - Soar - Soaring',
  'Power - Falling',
  'Sharp - Dead - Mew - Chuckle - Bubba',
  'Time', 'Past', 'Future', 'Dev',
  'Fly', 'Flying', 'Soar', 'Soaring',
  'Power', 'Falling',
  'Legacy', 'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba',
  'Bubble',
  'Sandwich',
  'Smasher - Extreme - Multi',
  'Smasher', 'Extreme', 'Multi',
  'Universe',
  'Ultimate',
  'Death',
  'Ready - Monkey',
  'Ready', 'Monkey',
  'Paradox'
]

const envList = [
  'MENDACITY',
  'PEDANTIC',
  'MELLIFLUOUS',
  'TREPIDATION',
  'EXTENUATE',
  'IMPERTURBABLE',
  'HIRSUTE',
  'PERISH',
  'RECITALS',
  'SUPERCILIOUS',
  'AIL',
  'PERPETRATE'
]

export const getTemplates = () => {
  const howMany = Math.floor(Math.random() * (nameList.length - 10))
  // const howMany = 26
  const nameArray = ['Platformatic service']
  let name
  while (nameArray.length < howMany) {
    name = nameList[Math.floor(Math.random() * nameList.length)]
    if (!nameArray.includes(name)) {
      nameArray.push(name)
    }
  }

  return nameArray.map((name, index) => ({
    id: index + 1,
    name,
    platformaticService: index === 0,
    env: Array.from(new Array(Math.floor(Math.random() * envList.length)).keys()).map(() => envList[Math.floor(Math.random() * envList.length)])
  }))
}

export const getPlugins = () => {
  const howMany = Math.floor(Math.random() * (nameList.length - 10))
  const nameArray = []
  let name
  while (nameArray.length < howMany) {
    name = nameList[Math.floor(Math.random() * nameList.length)]
    if (!nameArray.includes(name)) {
      nameArray.push(name)
    }
  }

  return nameArray.map((name, index) => ({
    id: index + 1,
    name
  }))
}
