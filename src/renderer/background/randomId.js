const Char = 'QWERTYUIOPASDFGHJKLZXMCNBV0123456789'
const randomId = (length = 12) => {
  let id = ''
  for (let index = 0; index < length; index++) {
    id += Char[parseInt(Math.random() * (Char.length) - 1)]
  }
  return id
}
export default randomId
