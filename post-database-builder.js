import Fs from 'node:fs'

const postList = Fs.readdirSync('./src/assets/post')
console.log(postList)