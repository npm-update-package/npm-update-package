import { main } from './main'

console.log('start')
main()
  .then(() => {
    console.log('end')
  })
  .catch(e => {
    console.error(e)
  })
