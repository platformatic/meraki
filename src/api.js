const nameList = [
  'Time - Past - Future - Dev',
  'Fly - Flying - Soar - Soaring',
  'Power - Falling',
  'Legacy', 'Sharp - Dead - Mew - Chuckle - Bubba',
  'Bubble',
  'Sandwich',
  'Smasher - Extreme - Multi',
  'Universe',
  'Ultimate',
  'Death', 'Ready - Monkey',
  'Paradox'
]

export const getTemplates = (howMany) =>
  Array.from(new Array(howMany).keys()).map((element) => ({
    id: element,
    name: element === 0 ? 'Platformatic service' : nameList[Math.floor(Math.random() * nameList.length)],
    platformaticService: element === 0
  })
  )

export const getPlugins = (howMany) =>
  Array.from(new Array(howMany).keys()).map((element) => ({
    id: element,
    name: nameList[Math.floor(Math.random() * nameList.length)]
  })
  )
