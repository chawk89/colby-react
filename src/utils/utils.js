export const isEqualObject =  (a, b) => JSON.stringify(a) == JSON.stringify(b)
export const copySimpleObject =  (a) => JSON.parse(JSON.stringify(a))
export const getNewId =  () => (new Date()).getTime()