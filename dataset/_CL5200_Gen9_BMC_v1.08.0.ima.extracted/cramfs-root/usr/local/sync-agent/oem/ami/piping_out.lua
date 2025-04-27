package.path = package.path .. ";./libs/?;./libs/?.lua;"

local posix = require('posix')
local ffi = require('ffi')
local os = require('os')

-- Declaring the C functions needed
ffi.cdef[[
typedef int ssize_t;
typedef unsigned int size_t;
int open(const char *_path, int _oflag, ...);
ssize_t write(int fildes, const void *buf, size_t nbyte);
]]

-- Create Fifo for writing data 
local QUEUE = "/var/pipe/rf_queue"
local queue_created = posix.access(QUEUE) and true or posix.mkfifo(QUEUE)

if not queue_created then
    print("Error creating queue")
end

local pipe = ffi.C.open(QUEUE, 1)

-- Verifying that the pipe was opened successfully
if pipe == -1 then
    print("Error while opening pipe...")
    return -1
end

local data_len = ffi.sizeof("int")

-- An infinite loop that writes the current time to the pipe and then sleeps for 5 seconds
while true do
    local now = ffi.new("int[1]", os.time())

    -- Writing to pipe and verifying that the write was successful
    if ffi.C.write(pipe, now, data_len) ~= data_len then
        print("Error writing data into pipe...") 
        ffi.C.close(pipe)
        return -1
    end

    posix.sleep(5)
end

ffi.C.close(pipe)