package.path = package.path .. ";./libs/?;./libs/?.lua;"

local posix = require('posix')
local ffi = require('ffi')
local redis = require('redis')
local utils = require('utils')

-- Declaring the C functions needed
ffi.cdef[[
typedef int ssize_t;
typedef unsigned int size_t;
int open(const char *_path, int _oflag, ...);
ssize_t read(int fildes, void *buf, size_t nbyte);
]]

-- Create Fifo for to read data from notifications
local QUEUE = "/var/pipe/rf_queue"

-- Creating flag for if the queue has been created
local queue_created = posix.access(QUEUE) and true or posix.mkfifo(QUEUE)

local O_NONBLOCK = 2048
local chunk_size = ffi.sizeof("int")

local buffer_iq = ffi.new('int[1]')

local iqfd = nil

-- Verifying that the queue has been created and then opening a desciptor to read from it
if queue_created then
    iqfd = ffi.C.open(QUEUE, O_NONBLOCK)
    
    if not iqfd then
        print "Can't open time Queue"
        return
    end
end

local sync_time_to_redfish = coroutine.wrap(function() 

    while iqfd > 0 do

        -- Repeat until all the data in pipe right now is read
        repeat

            -- Reading from pipe
            local iqbytes = ffi.C.read(iqfd, buffer_iq, chunk_size)

            -- Checking if any data was read from pipe and then setting this data to the database
            if tonumber(iqbytes) > 0 then
                utils.sub_process_nonblocking("oem/ami/subagents/time_handler.lua", tonumber(buffer_iq[0]))
            end

        until tonumber(iqbytes) <= 0

        coroutine.yield()

    end

end)

return sync_time_to_redfish