package.path = package.path .. ";oem/ami/?;oem/ami/?.lua"

local inotify = require('inotify')

local map = {}

map['/var/run/ntpd.pid'] = {inotify.IN_CLOSE}

return map