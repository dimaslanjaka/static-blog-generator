const Notifier = require('../src/Notifier')
const serviceConfig = require('../src/config')

const url = 'https://www.webmanajemen.com/chimeraland/blacklist-player.html'

const notify = new Notifier(serviceConfig)
notify.single(url, 'update')
//console.log(serviceConfig)
