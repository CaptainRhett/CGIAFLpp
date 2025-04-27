"use strict";
self.importScripts('ecma167.js');

self.requestFileSystemSync = self.webkitRequestFileSystemSync ||
                             self.requestFileSystemSync;

self.addEventListener('message', function(e) {
    "use strict";
    var rtn = mfapi(e.data);
    postMessage([rtn]);
}, false);

var RESERVED    = 0x0001;
var VRS         = 0x0002;
var ANCHOR      = 0x0004;
var MVDS        = 0x0008;
var RVDS        = 0x0010;
var LVID        = 0x0020;
var PSPACE      = 0x0040;
var USPACE      = 0x0080;

var TAG_ID_BEA = 0xFF00;
var TAG_ID_NSR = 0xFF01;
var TAG_ID_TEA = 0xFF02;

var TAG_ID_DATAONLY = 0xFF03;
var TAG_ID_VIRTUAL_FILE = 0xFF04;

var CS0 = 0x00000001;
var UDF_ID_APPLICATION = "*mfapi";

var MAX_DUMP_MEM_LEN = 512;

var ERR_OK = 0;
var ERR_FOLDER_OVERSIZE = -1;

var SEPARATOR = "/";

var CACHED_FILE_MAX_LEN = 512 * 1024;

var udf_images = [null, null, null, null];

function udf_image() {
    "use strict";
    this.total_blocks = 0;
    this.block_size = 0;
    this.dump_udf_text = false;
    this.dump_udf_ima = false;

    this.max_file_len_in_sad = 0;

    this.head = null;
    this.tail = null;

    this.udf_pvd = null;
    this.udf_iuvd = null;
    this.udf_iuvdiu = null;
    this.udf_pd = null;
    this.udf_lvd = null;
    this.udf_usd = null;
    this.udf_td = null;
    this.udf_lvid = null;
    this.udf_lvidiu = null;
    this.udf_fsd = null;

    this.vrs = null;
    this.mvds = null;
    this.lvid = null;
    this.avdp = [null, null, null];
    this.pspace = null;
    this.rvds = null;

    this.cur_parent = null;

    this.cur_path = null;
    this.cur_fp = null;

    this.root_path = null;
    this.root_dir = null;

    this.cached_file_offset = -1;
    this.cached_file_len = -1;
    this.cached_file_data = null;

    this.error_flag = 0;
}

function udf_space() {
    "use strict";
    this.space_type = 0;
    this.offset = 0;
    this.blocks = 0;

    this.prev = null;
    this.next = null;

    this.head = null;
    this.tail = null;
}

function udf_desc() {
    "use strict";
    this.identifier = 0;
    this.offset = 0;
    this.data = null;

    this.prev = null;
    this.next = null;
}

function udf_data() {
    "use strict";
    this.owner = null;
    this.length = 0;
    this.buffer = null;

    this.prev = null;
    this.next = null;
}

function jsFile(isFile, path, dirPath, file) {
    "use strict";
    this.isFile = isFile;
    this.path = path;
    this.dirPath = dirPath;
    this.file = file;
    this.files = [];
}

// ------------------------------------------------------------------------------------------------
function mfapi(args) {
    "use strict";
    switch (args[0]) {
        case 'Linux_Folder_CreateImageFromPath':
            return Linux_Folder_CreateImageFromPath(args[1], args[2], args[3]);
        case 'TFATFileSystemImage_VirtualRead':
            return TFATFileSystemImage_VirtualRead(args[1], args[2], args[3], args[4]);
        case 'TFATFileSystemImage_VirtualWrite':
            return TFATFileSystemImage_VirtualWrite(args[1], args[2], args[3], args[4]);
        case 'Folder_RemoveImage':
            return Folder_RemoveImage(args[1]);
        default:
            return - 1;
    }
}

// ------------------------------------------------------------------------------------------------
function GetFileFromName(dir, name) {
    "use strict";
    for (var idx = 0; idx < dir.files.length; idx++) {
        var file = dir.files[idx];
        if (file.path == name) {
            return file;
        }

        if (!file.isFile) {
            file = GetFileFromName(file, name);
            if (file != null) {
                return file;
            }
        }
    }

    return null;
}

// ------------------------------------------------------------------------------------------------
var crc_table = new Uint16Array([
    0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50A5, 0x60C6, 0x70E7,
    0x8108, 0x9129, 0xA14A, 0xB16B, 0xC18C, 0xD1AD, 0xE1CE, 0xF1EF,
    0x1231, 0x0210, 0x3273, 0x2252, 0x52B5, 0x4294, 0x72F7, 0x62D6,
    0x9339, 0x8318, 0xB37B, 0xA35A, 0xD3BD, 0xC39C, 0xF3FF, 0xE3DE,
    0x2462, 0x3443, 0x0420, 0x1401, 0x64E6, 0x74C7, 0x44A4, 0x5485,
    0xA56A, 0xB54B, 0x8528, 0x9509, 0xE5EE, 0xF5CF, 0xC5AC, 0xD58D,
    0x3653, 0x2672, 0x1611, 0x0630, 0x76D7, 0x66F6, 0x5695, 0x46B4,
    0xB75B, 0xA77A, 0x9719, 0x8738, 0xF7DF, 0xE7FE, 0xD79D, 0xC7BC,
    0x48C4, 0x58E5, 0x6886, 0x78A7, 0x0840, 0x1861, 0x2802, 0x3823,
    0xC9CC, 0xD9ED, 0xE98E, 0xF9AF, 0x8948, 0x9969, 0xA90A, 0xB92B,
    0x5AF5, 0x4AD4, 0x7AB7, 0x6A96, 0x1A71, 0x0A50, 0x3A33, 0x2A12,
    0xDBFD, 0xCBDC, 0xFBBF, 0xEB9E, 0x9B79, 0x8B58, 0xBB3B, 0xAB1A,
    0x6CA6, 0x7C87, 0x4CE4, 0x5CC5, 0x2C22, 0x3C03, 0x0C60, 0x1C41,
    0xEDAE, 0xFD8F, 0xCDEC, 0xDDCD, 0xAD2A, 0xBD0B, 0x8D68, 0x9D49,
    0x7E97, 0x6EB6, 0x5ED5, 0x4EF4, 0x3E13, 0x2E32, 0x1E51, 0x0E70,
    0xFF9F, 0xEFBE, 0xDFDD, 0xCFFC, 0xBF1B, 0xAF3A, 0x9F59, 0x8F78,
    0x9188, 0x81A9, 0xB1CA, 0xA1EB, 0xD10C, 0xC12D, 0xF14E, 0xE16F,
    0x1080, 0x00A1, 0x30C2, 0x20E3, 0x5004, 0x4025, 0x7046, 0x6067,
    0x83B9, 0x9398, 0xA3FB, 0xB3DA, 0xC33D, 0xD31C, 0xE37F, 0xF35E,
    0x02B1, 0x1290, 0x22F3, 0x32D2, 0x4235, 0x5214, 0x6277, 0x7256,
    0xB5EA, 0xA5CB, 0x95A8, 0x8589, 0xF56E, 0xE54F, 0xD52C, 0xC50D,
    0x34E2, 0x24C3, 0x14A0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
    0xA7DB, 0xB7FA, 0x8799, 0x97B8, 0xE75F, 0xF77E, 0xC71D, 0xD73C,
    0x26D3, 0x36F2, 0x0691, 0x16B0, 0x6657, 0x7676, 0x4615, 0x5634,
    0xD94C, 0xC96D, 0xF90E, 0xE92F, 0x99C8, 0x89E9, 0xB98A, 0xA9AB,
    0x5844, 0x4865, 0x7806, 0x6827, 0x18C0, 0x08E1, 0x3882, 0x28A3,
    0xCB7D, 0xDB5C, 0xEB3F, 0xFB1E, 0x8BF9, 0x9BD8, 0xABBB, 0xBB9A,
    0x4A75, 0x5A54, 0x6A37, 0x7A16, 0x0AF1, 0x1AD0, 0x2AB3, 0x3A92,
    0xFD2E, 0xED0F, 0xDD6C, 0xCD4D, 0xBDAA, 0xAD8B, 0x9DE8, 0x8DC9,
    0x7C26, 0x6C07, 0x5C64, 0x4C45, 0x3CA2, 0x2C83, 0x1CE0, 0x0CC1,
    0xEF1F, 0xFF3E, 0xCF5D, 0xDF7C, 0xAF9B, 0xBFBA, 0x8FD9, 0x9FF8,
    0x6E17, 0x7E36, 0x4E55, 0x5E74, 0x2E93, 0x3EB2, 0x0ED1, 0x1EF0
]);

function udf_crc(s, offset, n, crc) {
    "use strict";
    while (n--) {
        crc = crc_table[(crc >>> 8 ^ s[offset++]) & 0xFF] ^ ((crc << 8) >>> 0);
    }

    return crc;
}

// ------------------------------------------------------------------------------------------------
function clear_bits(bitmap, offset, blocks) {
    "use strict";
    for ( ; blocks > 0; blocks--) {
        bitmap[Math.trunc((blocks + offset - 1) / 8)] &= ~(1 << ((offset + blocks - 1) % 8));
    }
}

// ------------------------------------------------------------------------------------------------
function bytes_to_blocks(block_size, length) {
    "use strict";
    return Math.trunc((length + block_size - 1) / block_size);
}

// ------------------------------------------------------------------------------------------------
function padding_4_length(length) {
    "use strict";
    return length + ((4 - (length % 4)) % 4);
}

// ------------------------------------------------------------------------------------------------
function hex_string(value, digit, prefix) {
    "use strict";
    if (digit < 2) {
        digit = 2;
    }

    var padding = Math.pow(10, digit - 1).toString(10).slice(-(digit - 1));
    if (prefix) {
        return  "0x" + (padding + (Number(value).toString(16))).slice(-(digit)).toUpperCase();
    } else {
        return  (padding + (Number(value).toString(16))).slice(-(digit)).toUpperCase();
    }
}

// ------------------------------------------------------------------------------------------------
function space_string(type) {
    "use strict";
    switch (type) {
        case RESERVED:
            return "Reserved Space";
        case VRS:
            return "Volume Recognition Sequence";
        case ANCHOR:
             return "Anchor Volume Descriptor Pointer";
        case MVDS:
             return "Main Volume Descriptor Sequence";
        case RVDS:
             return "Reserve Volume Descriptor Sequence";
        case LVID:
             return "Logical Volume Integrity Descriptor";
        case PSPACE:
             return "Partition Space";
        case USPACE:
            return "Unallocated Space";
        default:
            return "Unknown Space";
    }
}

// ------------------------------------------------------------------------------------------------
function id_string(id) {
    "use strict";
    switch (id) {
        case TAG_ID_PVD:
            return "Primary Volume Descriptor";
        case TAG_ID_AVDP:
            return "Anchor Volume Descriptor Pointer";
        case TAG_ID_VDP:
            return "Volume Descriptor Pointer";
        case TAG_ID_IUVD:
            return "Implementation Use Volume Descriptor";
        case TAG_ID_PD:
            return "Partition Descriptor";
        case TAG_ID_LVD:
            return "Logical Volume Descriptor";
        case TAG_ID_USD:
            return "Unallocated Space Descriptor";
        case TAG_ID_TD:
            return "Terminating Descriptor";
        case TAG_ID_LVID:
            return "Logical Volume Integrity Descriptor";
        case TAG_ID_FSD:
            return "File Set Descriptor";
        case TAG_ID_FID:
            return "File Identifier Descriptor";
        case TAG_ID_AED:
            return "Allocation Extent Descriptor";
        case TAG_ID_IE:
            return "Indirect Entry";
        case TAG_ID_TE:
            return "Terminal Entry";
        case TAG_ID_FE:
            return "File Entry";
        case TAG_ID_EAHD:
            return "Extended Attribute Header Descriptor";
        case TAG_ID_USE:
            return "Unallocated Space Entry";
        case TAG_ID_SBD:
            return "Space Bitmap Descriptor";
        case TAG_ID_PIE:
            return "Partition Integrity Entry";
        case TAG_ID_EFE:
            return "Extended File Entry";
        case TAG_ID_BEA:
            return "Beginning Extended Area Descriptor";
        case TAG_ID_NSR:
            return "NSR Descriptor";
        case TAG_ID_TEA:
            return "Terminating Extended Area Descriptor";
        case TAG_ID_DATAONLY:
            return "Data Block";
        case TAG_ID_VIRTUAL_FILE:
            return "Virtual File Block";
        default:
            return "Unknown Identifier";
    }
}

// ------------------------------------------------------------------------------------------------
function dump_image(image, out, dump) {
    "use strict";
    var space;

    out += "\n***************************** DUMP UDF START ******************************\n";
    out += ("UDF Image: total [" + image.total_blocks + "] blocks / block size [" +
            image.block_size + "] / folder [" + image.cur_path + "]\n");

    if (dump) {
        space = image.head;
        while (space != null) {
            out = dump_space(space, out, true);
            space = space.next;
        }
    }
    out += ("******************************  DUMP UDF END  ******************************\n\n");

    return out;
}

// ------------------------------------------------------------------------------------------------
function dump_space(space, out, dump) {
    "use strict";
    var desc;

    out += ("  UDF Space: type [" + space_string(space.space_type) + "] / offset [" +
            space.offset + "] / [" + space.blocks + "] blocks\n");

    if (dump) {
        desc = space.head;
        while (desc != null) {
            out = dump_desc(space, desc, out, true);
            desc = desc.next;
        }
    }

    return out;
}

// ------------------------------------------------------------------------------------------------
function dump_desc(space, desc, out, dump) {
    "use strict";
    var data;

    out += ("    UDF Desc: owner space [" + space_string(space.space_type) + "] / id [" +
            id_string(desc.identifier) + "] / offset [" + desc.offset + "/" + (space.offset +
            desc.offset) + "] / length [" + desc.data.length + "]\n");

    if (dump) {
        data = desc.data;
        while (data != null) {
            out = dump_data(data, out, true);
            data = data.next;
        }
    }

    return out;
}

// ------------------------------------------------------------------------------------------------
function dump_data(data, out, dump) {
    "use strict";
    out += ("      UDF Data [" + data.length + "] bytes at block [" + data.owner.offset + "]");

    if (dump) {
        if (data.owner.identifier == TAG_ID_SBD) {
            var sbd = data.buffer;
            var read_len = (MAX_DUMP_MEM_LEN > sbd.length) ? sbd.length : MAX_DUMP_MEM_LEN;
            var array = new Uint8Array(read_len);
            sbd.readBlocks(array, 0, read_len);
            out += (" / dump [" + read_len + "] bytes {\n");
            out = dump_mem(array, read_len, out);
        } else if (data.owner.identifier == TAG_ID_VIRTUAL_FILE) {
            var vf = data.buffer;
            out += (" {\n        File name [" + vf.path + "] / file offset [" + vf.offset + "]\n");
        } else {
            out += (" / dump [" + (MAX_DUMP_MEM_LEN > data.length ? data.length : MAX_DUMP_MEM_LEN) + "] bytes {\n");
            out = dump_mem(data.buffer.buffer, (MAX_DUMP_MEM_LEN > data.length ? data.length : MAX_DUMP_MEM_LEN), out);
        }
        out += ("      }\n");
    }

    return out;
}

// ------------------------------------------------------------------------------------------------
function dump_mem(buffer, length, out) {
    "use strict";
    for (var i = 0; i < length; i++) {
        if (!(i % 16)) {
            if (i) {
                out += "\n";
            }
            out += ("        " + hex_string(i, 4, false) + "  ");
        } else if (!(i % 8)) {
            out += ("  ");
        }
        out += (hex_string(buffer[i], 2, false) + " ");
    }
    out += ("\n");

    return out;
}

// ------------------------------------------------------------------------------------------------
function ParseFileList(fileList, separator) {
    "use strict";
    if (separator == undefined) {
        return null;
    }

    var list = [];
    for (var idx = 0; idx < fileList.length; idx++) {
        var file = fileList[idx];
        list.push(file);
    }

    var rootDir = new jsFile(false, list[0].webkitRelativePath.split(separator)[0], null, null);

    var tree = [[]];
    for (var count = 0; count < list.length; count++) {
        var file = list[count];
        var pathes = file.webkitRelativePath.split(separator);
        var maxDepth = pathes.length - 1;

        var dirs = [pathes[0]];
        for (var depth = 1; depth < maxDepth; depth++) {
            if (depth >= tree.length) {
                tree.push([]);
            }
            var dirPath = dirs.join(separator);
            dirs.push(pathes[depth]);
            var path = dirs.join(separator);
            tree[depth - 1].push(new jsFile(false, path, dirPath, null));
        }

        pathes.pop();
        var dirPath = pathes.join(separator);
        tree[maxDepth - 1].push(new jsFile(true, file.webkitRelativePath, dirPath, file));
    }

    for (var depth = 0; depth < tree.length; depth++) {
        for (var index = 0; index < tree[depth].length; index++) {
            var file = tree[depth][index];
            if (!file.isFile) {
                for (var count = index + 1; count < tree[depth].length; count++) {
                    var checkingFile = tree[depth][count];
                    if (!checkingFile.isFile && (file.path == checkingFile.path)) {
                        tree[depth].splice(count, 1);
                        count--;
                    }
                }
            }
        }
    }

    for (var depth = 0; (tree.length > 0) && (depth < tree.length); depth++) {
        for (var idx = 0; (tree[depth].length > 0) && (idx < tree[depth].length); idx++) {
            var currentFile = tree[depth][idx];
            if (depth > 0) {
                for (var cnt = 0; (tree[depth - 1].length > 0) && (cnt < tree[depth - 1].length); cnt++) {
                    var checkFile = tree[depth - 1][cnt];
                    if (!checkFile.isFile && (checkFile.path == currentFile.dirPath)) {
                        checkFile.files.push(currentFile);
                        break;
                    }
                }
            } else {
                rootDir.files.push(currentFile);
            }
        }
    }

    return rootDir;
}

// ------------------------------------------------------------------------------------------------
function find_space(start, offset) {
    "use strict";
    while (start != null) {
        if ((offset >= start.offset) && (offset < (start.offset + start.blocks))) {
            return start;
        }

        start = start.next;
    }

    return null;
}

// ------------------------------------------------------------------------------------------------
function next_space(start, type) {
    "use strict";
    while ((start != null) && !(start.space_type & type)) {
        start = start.next;
    }

    return start;
}

// ------------------------------------------------------------------------------------------------
function alloc_space(image, type, offset, blocks) {
    "use strict";
    var free_space = find_space(image.head, offset);
    var new_space;

    if (free_space == null) {
        console.error("No space is found at offset " + offset);
        return null;
    }

    if (!(free_space.space_type & USPACE)) {
        console.error("Space " + space_string(free_space.space_type) + " containing offset " +
                offset + " has been allocated");
        return null;
    }

    if ((offset + blocks) > (free_space.offset + free_space.blocks)) {
        console.error("Not enough blocks in space " + space_string(free_space.space_type) +
                ": total " + free_space.blocks + " / req " + blocks);
        return null;
    }

    if (offset == free_space.offset) {
        if (blocks == free_space.blocks) {
            free_space.space_type = type;
            return free_space;
        } else {
            new_space = new udf_space();

            new_space.space_type = type;
            new_space.offset = offset;
            new_space.blocks = blocks;

            new_space.prev = free_space.prev;
            if (new_space.prev) {
                new_space.prev.next = new_space;
            }
            new_space.next = free_space;
            if (image.head == free_space) {
                image.head = new_space;
            }

            free_space.offset += blocks;
            free_space.blocks -= blocks;
            free_space.prev = new_space;

            new_space.head = new_space.tail = null;

            return new_space;
        }
    } else {
        if ((offset + blocks) == (free_space.offset + free_space.blocks)) {
            new_space = new udf_space();

            new_space.space_type = type;
            new_space.offset = offset;
            new_space.blocks = blocks;

            new_space.prev = free_space;
            new_space.next = free_space.next;
            if (new_space.next) {
                new_space.next.prev = new_space;
            }
            if (image.tail == free_space) {
                image.tail = new_space;
            }

            free_space.blocks -= blocks;
            free_space.next = new_space;

            new_space.head = new_space.tail = null;

            return new_space;
        } else {
            new_space = new udf_space();

            new_space.space_type = type;
            new_space.offset = offset;
            new_space.blocks = blocks;

            new_space.prev = free_space;

            new_space.head = new_space.tail = null;

            new_space.next = new udf_space();
            new_space.next.space_type = free_space.space_type;
            new_space.next.offset = offset + blocks;
            new_space.next.blocks = free_space.blocks - blocks - (offset - free_space.offset);

            new_space.next.prev = new_space;
            new_space.next.next = free_space.next;
            if (new_space.next.next) {
                new_space.next.next.prev = new_space.next;
            }
            if (image.tail == free_space) {
                image.tail = new_space.next;
            }

            new_space.next.head = new_space.next.tail = null;

            free_space.blocks = offset - free_space.offset;
            free_space.next = new_space;

            return new_space;
        }
    }
}

// ------------------------------------------------------------------------------------------------
function next_desc(desc, id) {
    "use strict";
    while (desc != null) {
        if (desc.identifier == id) {
            return desc;
        }

        desc = desc.next;
    }

    return null;
}

// ------------------------------------------------------------------------------------------------
function find_desc(image, space, offset) {
    "use strict";
    var desc = space.head;

    while (desc != null) {
        if ((offset >= desc.offset)
            && (offset < desc.offset + bytes_to_blocks(image.block_size, desc.data.length))) {
            return desc;
        }

        desc = desc.next;
    }

    return null;
}

// ------------------------------------------------------------------------------------------------
function push_desc(image, space, id, struct) {
    "use strict";
    var new_desc;
    var offset;
    var alloc_length;

    alloc_length = bytes_to_blocks(image.block_size, struct.length) * image.block_size;

    if ((alloc_length == 0) && (id == TAG_ID_DATAONLY)) {
        console.error("Attemp to allocate an emptry data block");
        return null;
    }

    if (space.tail == null) {
        if (space.blocks < (alloc_length / image.block_size)) {
            console.error("Not enough blocks in space " + space_string(space.space_type));
            return null;
        }

        offset = 0;

        new_desc = new udf_desc();
        new_desc.identifier = id;
        new_desc.offset = offset;

        new_desc.data = new udf_data();
        new_desc.data.owner = new_desc;
        new_desc.data.length = struct.length;
        new_desc.data.buffer = struct;
        new_desc.data.prev = new_desc.data.next = null;

        new_desc.prev = new_desc.next = null;

        space.head = space.tail = new_desc;

        return new_desc;
    } else {
        offset = space.tail.offset + bytes_to_blocks(image.block_size,
                                                     space.tail.data.length);

        if (space.blocks < (offset + (alloc_length / image.block_size))) {
            console.error("Not enough blocks in space " + space_string(space.space_type));
            return null;
        }

        new_desc = new udf_desc();
        new_desc.identifier = id;
        new_desc.offset = offset;

        new_desc.data = new udf_data();
        new_desc.data.owner = new_desc;
        new_desc.data.length = struct.length;
        new_desc.data.buffer = struct;
        new_desc.data.prev = new_desc.data.next = null;

        new_desc.prev = space.tail;
        new_desc.next = null;

        space.tail.next = new_desc;
        space.tail = new_desc;

        return new_desc;
    }
}

// ------------------------------------------------------------------------------------------------
function deploy_spaces(image) {
    "use strict";
    var mvds_block_num = 16;

    alloc_space(image, RESERVED, 0, bytes_to_blocks(image.block_size, 32768));

    image.vrs = alloc_space(image, VRS, bytes_to_blocks(image.block_size, 32768),
                        bytes_to_blocks(image.block_size, 2048 * 3));

    image.mvds = alloc_space(image, MVDS, 96,
            bytes_to_blocks(image.block_size, mvds_block_num * image.block_size));

    image.lvid = alloc_space(image, LVID, 128, bytes_to_blocks(image.block_size, 8192));

    image.avdp[0] = alloc_space(image, ANCHOR, 256, bytes_to_blocks(image.block_size, 512));
    image.avdp[1] = alloc_space(image, ANCHOR, image.total_blocks - 1 - 256,
            bytes_to_blocks(image.block_size, 512));
    image.avdp[2] = alloc_space(image, ANCHOR, image.total_blocks - 1,
            bytes_to_blocks(image.block_size, 512));

    image.pspace = alloc_space(image, PSPACE, 257,
            Math.trunc(Math.trunc((image.avdp[1].offset - image.avdp[0].offset) / 8) / 4) * 4 * 8);

    image.rvds = alloc_space(image, RVDS, (next_space(image.avdp[1], USPACE)).offset,
            bytes_to_blocks(image.block_size, image.block_size * mvds_block_num));
}

// ------------------------------------------------------------------------------------------------
function push_meta_descs(image) {
    "use strict";
    push_vrs_descs(image);
    push_vds_descs(image);
    push_lvid_descs(image);
    push_avdp_descs(image);
}

// ------------------------------------------------------------------------------------------------
function push_vrs_descs(image) {
    "use strict";
    var desc;
    var bea = new Uint8Array([0x00, 0x42, 0x45, 0x41, 0x30, 0x31, 0x01]);
    var nsr = new Uint8Array([0x00, 0x4e, 0x53, 0x52, 0x30, 0x32, 0x01]);
    var tea = new Uint8Array([0x00, 0x54, 0x45, 0x41, 0x30, 0x31, 0x01]);

    desc = push_desc(image, image.vrs, TAG_ID_BEA, new UdfStruct(null, 0, 2048));
    desc.data.buffer.fromArray(bea, bea.length);

    desc = push_desc(image, image.vrs, TAG_ID_NSR, new UdfStruct(null, 0, 2048));
    desc.data.buffer.fromArray(nsr, nsr.length);

    desc = push_desc(image, image.vrs, TAG_ID_TEA, new UdfStruct(null, 0, 2048));
    desc.data.buffer.fromArray(tea, tea.length);
}

// ------------------------------------------------------------------------------------------------
function push_vds_descs(image) {
    "use strict";
    push_pvd(image);
    push_lvd(image);
    push_pd(image);
    push_usd(image);
    push_iuvd(image);
    push_td(image);
}

// ------------------------------------------------------------------------------------------------
function push_pvd(image) {
    "use strict";
    var desc = push_desc(image, image.mvds, TAG_ID_PVD, new PrimaryVolumeDescriptor(null, 0));
    image.udf_pvd = desc.data.buffer;

    image.udf_pvd.VolumeDescriptorSequenceNumber = 1;
    image.udf_pvd.PrimaryVolumeDescriptorNumber = 0;
    image.udf_pvd.VolumeIdentifier.dstringl = "UDF";
    image.udf_pvd.VolumeSequenceNumber = 1;
    image.udf_pvd.MaximumVolumeSequenceNumber = 1;
    image.udf_pvd.InterchangeLevel = 3;
    image.udf_pvd.MaximumInterchangeLevel = 3;
    image.udf_pvd.CharacterSetList = CS0;
    image.udf_pvd.MaximumCharacterSetList = CS0;
    image.udf_pvd.VolumeSetIdentifier.dstringl = "0123456789ABCDEFUDF";

    image.udf_pvd.DescriptorCharacterSet.CharacterSetType = UDF_CHAR_SET_TYPE;
    (new UdfString(image.udf_pvd.DescriptorCharacterSet.CharacterSetInformation[0],
                   image.udf_pvd.DescriptorCharacterSet.CharacterSetInformation[1],
                   image.udf_pvd.DescriptorCharacterSet.CharacterSetInformation[2])).string = UDF_CHAR_SET_INFO;

    image.udf_pvd.ExplanatoryCharacterSet.CharacterSetType = UDF_CHAR_SET_TYPE;
    (new UdfString(image.udf_pvd.ExplanatoryCharacterSet.CharacterSetInformation[0],
                   image.udf_pvd.ExplanatoryCharacterSet.CharacterSetInformation[1],
                   image.udf_pvd.ExplanatoryCharacterSet.CharacterSetInformation[2])).string = UDF_CHAR_SET_INFO;

    image.udf_pvd.ApplicationIdentifier.Flags = 0;
    (new UdfString(image.udf_pvd.ApplicationIdentifier.Identifier[0],
                   image.udf_pvd.ApplicationIdentifier.Identifier[1],
                   image.udf_pvd.ApplicationIdentifier.Identifier[2])).string = UDF_ID_APPLICATION;
    image.udf_pvd.ApplicationIdentifier.IdentifierSuffix = [UDF_OS_CLASS_UNIX, UDF_OS_ID_LINUX];

    image.udf_pvd.ImplementationIdentifier.Flags = 0;
    (new UdfString(image.udf_pvd.ImplementationIdentifier.Identifier[0],
                   image.udf_pvd.ImplementationIdentifier.Identifier[1],
                   image.udf_pvd.ImplementationIdentifier.Identifier[2])).string = UDF_ID_DEVELOPER;
    image.udf_pvd.ImplementationIdentifier.IdentifierSuffix = [UDF_OS_CLASS_UNIX, UDF_OS_ID_LINUX];

    image.udf_pvd.PredecessorVolumeDescriptorSequenceLocation = 0;
    image.udf_pvd.Flags = 0x0001;

    fill_timestamp(null, image.udf_pvd.RecordingDateAndTime);
}

// ------------------------------------------------------------------------------------------------
function push_pd(image) {
    "use strict";
    var desc = push_desc(image, image.mvds, TAG_ID_PD, new PartitionDescriptor(null, 0));
    image.udf_pd = desc.data.buffer;

    image.udf_pd.VolumeDescriptorSequenceNumber = 2;
    image.udf_pd.PartitionFlags = 0x0001;
    image.udf_pd.PartitionNumber = 0;

    image.udf_pd.PartitionContents.Flags = 0;
    (new UdfString(image.udf_pd.PartitionContents.Identifier[0],
                   image.udf_pd.PartitionContents.Identifier[1],
                   image.udf_pd.PartitionContents.Identifier[2])).string = "+NSR02";

    image.udf_pd.AccessType = PD_ACCESS_TYPE_OVERWRITABLE;
    image.udf_pd.PartitionStartingLocation = 0;
    image.udf_pd.PartitionLength = 0;

    image.udf_pd.ImplementationIdentifier.Flags = 0;
    (new UdfString(image.udf_pd.ImplementationIdentifier.Identifier[0],
                   image.udf_pd.ImplementationIdentifier.Identifier[1],
                   image.udf_pd.ImplementationIdentifier.Identifier[2])).string = UDF_ID_DEVELOPER;
    image.udf_pd.ImplementationIdentifier.IdentifierSuffix = [UDF_OS_CLASS_UNIX, UDF_OS_ID_LINUX];

    image.udf_pd.PartitionStartingLocation = image.pspace.offset;
    image.udf_pd.PartitionLength = image.pspace.blocks;
}

// ------------------------------------------------------------------------------------------------
function push_lvd(image) {
    "use strict";
    var desc = push_desc(image, image.mvds, TAG_ID_LVD, new LogicalVolumeDescriptor(null, 0));
    image.udf_lvd = desc.data.buffer;

    image.udf_lvd.VolumeDescriptorSequenceNumber = 3;

    image.udf_lvd.DescriptorCharacterSet.CharacterSetType = UDF_CHAR_SET_TYPE;
    (new UdfString(image.udf_lvd.DescriptorCharacterSet.CharacterSetInformation[0],
                   image.udf_lvd.DescriptorCharacterSet.CharacterSetInformation[1],
                   image.udf_lvd.DescriptorCharacterSet.CharacterSetInformation[2])).string = UDF_CHAR_SET_INFO;

    image.udf_lvd.LogicalVolumeIdentifier.dstringl = "UDF";
    image.udf_lvd.LogicalBlockSize = image.block_size;

    image.udf_lvd.DomainIdentifier.Flags = 0;
    (new UdfString(image.udf_lvd.DomainIdentifier.Identifier[0],
                   image.udf_lvd.DomainIdentifier.Identifier[1],
                   image.udf_lvd.DomainIdentifier.Identifier[2])).string = UDF_ID_COMPLIANT;
    image.udf_lvd.DomainIdentifier.IdentifierSuffix = [0x02, 0x01, 0x00];

    image.udf_lvd.MapTableLength = 6;
    image.udf_lvd.NumberOfPartitionMaps = 1;

    image.udf_lvd.ImplementationIdentifier.Flags = 0;
    (new UdfString(image.udf_lvd.ImplementationIdentifier.Identifier[0],
                   image.udf_lvd.ImplementationIdentifier.Identifier[1],
                   image.udf_lvd.ImplementationIdentifier.Identifier[2])).string = UDF_ID_DEVELOPER;
    image.udf_lvd.ImplementationIdentifier.IdentifierSuffix = [UDF_OS_CLASS_UNIX, UDF_OS_ID_LINUX];

    image.udf_lvd.PartitionMaps = [0x01, 0x06, 0x01, 0x00, 0x00, 0x00];

    image.udf_lvd.IntegritySequenceExtent.ExtentLength = image.lvid.blocks * image.block_size;
    image.udf_lvd.IntegritySequenceExtent.ExtentLocation = image.lvid.offset;
}

// ------------------------------------------------------------------------------------------------
function push_usd(image) {
    "use strict";
    var desc;
    var uspace;
    var length;
    var count;

    var ads = [];
    length = 24;
    count = 0;
    uspace = next_space(image.head, USPACE);
    while (uspace != null) {
    "use strict";
        ads[count] = new extent_ad(null, 0);
        ads[count].ExtentLength = uspace.blocks * image.block_size;
        ads[count].ExtentLocation = uspace.offset;
        length += ads[count].length;
        count++;
        uspace = next_space(uspace.next, USPACE);
    }

    desc = push_desc(image, image.mvds, TAG_ID_USD, new UnallocatedSpaceDescriptor(null, 0, length));
    image.udf_usd = desc.data.buffer;

    image.udf_usd.VolumeDescriptorSequenceNumber = 4;
    image.udf_usd.NumberOfAllocationDescriptors = count;

    for (var idx = 0; idx < count; idx++) {
        var ad = new extent_ad(image.udf_usd.buffer, image.udf_usd.AllocationDescriptors[0] + idx * 8);
        ad.ExtentLength = ads[idx].ExtentLength;
        ad.ExtentLocation = ads[idx].ExtentLocation;
    }
}

// ------------------------------------------------------------------------------------------------
function push_iuvd(image) {
    "use strict";
    var desc = push_desc(image, image.mvds, TAG_ID_IUVD, new ImplementationUseVolumeDescriptor(null, 0));
    image.udf_iuvd = desc.data.buffer;

    image.udf_iuvd.VolumeDescriptorSequenceNumber = 5;

    image.udf_iuvd.ImplementationIdentifier.Flags = 0;
    (new UdfString(image.udf_iuvd.ImplementationIdentifier.Identifier[0],
                   image.udf_iuvd.ImplementationIdentifier.Identifier[1],
                   image.udf_iuvd.ImplementationIdentifier.Identifier[2])).string = UDF_ID_LV_INFO;
    image.udf_iuvd.ImplementationIdentifier.IdentifierSuffix = [0x02, 0x01, UDF_OS_CLASS_UNIX, UDF_OS_ID_LINUX];

    image.udf_iuvdiu = image.udf_iuvd.ImplementationUse;

    image.udf_iuvdiu.LVICharset.CharacterSetType = UDF_CHAR_SET_TYPE;
    (new UdfString(image.udf_iuvdiu.LVICharset.CharacterSetInformation[0],
                   image.udf_iuvdiu.LVICharset.CharacterSetInformation[1],
                   image.udf_iuvdiu.LVICharset.CharacterSetInformation[2])).string = UDF_CHAR_SET_INFO;

    image.udf_iuvdiu.LogicalVolumeIdentifier.dstringl = "UDF";
    image.udf_iuvdiu.LVInfo1.dstringl = "mfapi";
    image.udf_iuvdiu.LVInfo2.dstringl = "mfapi";
    image.udf_iuvdiu.LVInfo3.dstringl = "mfapi";

    image.udf_iuvdiu.ImplementionID.Flags = 0;
    (new UdfString(image.udf_iuvdiu.ImplementionID.Identifier[0],
                   image.udf_iuvdiu.ImplementionID.Identifier[1],
                   image.udf_iuvdiu.ImplementionID.Identifier[2])).string = UDF_ID_DEVELOPER;
    image.udf_iuvdiu.ImplementionID.IdentifierSuffix = [UDF_OS_CLASS_UNIX, UDF_OS_ID_LINUX];
}

// ------------------------------------------------------------------------------------------------
function push_td(image) {
    "use strict";
    var desc = push_desc(image, image.mvds, TAG_ID_TD, new TerminatingDescriptor(null, 0));
    image.udf_td = desc.data.buffer;
}

// ------------------------------------------------------------------------------------------------
function push_lvid_descs(image) {
    "use strict";
    var desc = push_desc(image, image.lvid, TAG_ID_LVID, new LogicalVolumeIntegrityDescriptor(null, 0));
    image.udf_lvid = desc.data.buffer;

    image.udf_lvid.IntegrityType = LVID_INTEGRITY_TYPE_CLOSE;
    image.udf_lvid.NumberOfPartitions = 1;
    image.udf_lvid.LengthOfImplementationUse = 46;
    image.udf_lvid.FreeSpaceTable = image.pspace.blocks;
    image.udf_lvid.SizeTable = image.pspace.blocks;

    image.udf_lvidiu = image.udf_lvid.ImplementationUse;
    image.udf_lvidiu.ImplementationID.Flags = 0;
    (new UdfString(image.udf_lvidiu.ImplementationID.Identifier[0],
                   image.udf_lvidiu.ImplementationID.Identifier[1],
                   image.udf_lvidiu.ImplementationID.Identifier[2])).string = UDF_ID_DEVELOPER;
    image.udf_lvidiu.ImplementationID.IdentifierSuffix = [UDF_OS_CLASS_UNIX, UDF_OS_ID_LINUX];
    image.udf_lvidiu.NumberOfFiles = 0;
    image.udf_lvidiu.NumberOfDirectories = 0;
    image.udf_lvidiu.MinimumUDFReadRevision = 0x0102;
    image.udf_lvidiu.MinimumUDFWriteRevision = 0x0102;
    image.udf_lvidiu.MaximumUDFWriteRevision = 0x0102;

    desc = push_desc(image, image.lvid, TAG_ID_TD, new TerminatingDescriptor(null, 0));

    fill_timestamp(null, image.udf_lvid.RecordingDateAndTime);
}

// ------------------------------------------------------------------------------------------------
function push_avdp_descs(image) {
    "use strict";
    var desc = push_desc(image, image.avdp[0], TAG_ID_AVDP, new AnchorVolumeDescriptorPointer(null, 0));
    var avdp = desc.data.buffer;

    avdp.MainVolumeDescriptorSequenceExtent.ExtentLength = image.mvds.blocks * image.block_size;
    avdp.MainVolumeDescriptorSequenceExtent.ExtentLocation = image.mvds.offset;
    avdp.ReserveVolumeDescriptorSequenceExtent.ExtentLength = image.rvds.blocks * image.block_size;
    avdp.ReserveVolumeDescriptorSequenceExtent.ExtentLocation = image.rvds.offset;

    desc = push_desc(image, image.avdp[1], TAG_ID_AVDP, new AnchorVolumeDescriptorPointer(null, 0));
    desc.data.buffer.objcpy(avdp);

    desc = push_desc(image, image.avdp[2], TAG_ID_AVDP, new AnchorVolumeDescriptorPointer(null, 0));
    desc.data.buffer.objcpy(avdp);
}

// ------------------------------------------------------------------------------------------------
function push_pspace_descs(image) {
    "use strict";
    push_sbd(image);
    push_fsd(image);
}

// ------------------------------------------------------------------------------------------------
function push_sbd(image) {
    "use strict";
    var desc;
    var n_b;
    var length;
    var sbd;
    var phd;

    n_b = Math.trunc((image.pspace.blocks + 7) / 8);
    length = 24 + n_b;

    desc = push_desc(image, image.pspace, TAG_ID_SBD, new SpaceBitmapDescriptor(null, 0, n_b, image.udf_lvid));
    sbd = desc.data.buffer;
    sbd.NumberOfBits = image.pspace.blocks;
    sbd.NumberOfBytes = n_b;

    phd = image.udf_pd.PartitionContentsUse;
    phd.UnallocatedSpaceBitmap.ExtentPosition = 0;
    phd.UnallocatedSpaceBitmap.ExtentLength
            = bytes_to_blocks(image.block_size, length) * image.block_size;

    image.udf_lvid.FreeSpaceTable
            = image.udf_lvid.FreeSpaceTable - bytes_to_blocks(image.block_size, length);
}

// ------------------------------------------------------------------------------------------------
function push_fsd(image) {
    "use strict";
    var desc = alloc_part_blocks(image, new FileSetDescriptor(null, 0), TAG_ID_FSD);
    image.udf_fsd = desc.data.buffer;

    var ad = new long_ad(null, 0);
    ad.ExtentLength = 512;
    ad.ExtentLocation.LogicalBlockNumber = desc.offset;
    ad.ExtentLocation.PartitionReferenceNumber = 0;
    (new UdfStruct(image.udf_lvd.LogicalVolumeContentsUse[0],
            image.udf_lvd.LogicalVolumeContentsUse[1],
            image.udf_lvd.LogicalVolumeContentsUse[2])).objcpy(ad);


    image.udf_fsd.InterchangeLevel = 3;
    image.udf_fsd.MaximumInterchangeLevel = 3;
    image.udf_fsd.CharacterSetList = CS0;
    image.udf_fsd.MaximumCharacterSetList = CS0;
    image.udf_fsd.FileSetNumber = 0;
    image.udf_fsd.FileSetDescriptorNumber = 0;

    image.udf_fsd.LogicalVolumeIdentifierCharacterSet.CharacterSetType = UDF_CHAR_SET_TYPE;
    (new UdfString(image.udf_fsd.LogicalVolumeIdentifierCharacterSet.CharacterSetInformation[0],
                   image.udf_fsd.LogicalVolumeIdentifierCharacterSet.CharacterSetInformation[1],
                   image.udf_fsd.LogicalVolumeIdentifierCharacterSet.CharacterSetInformation[2])).string = UDF_CHAR_SET_INFO;

    image.udf_fsd.LogicalVolumeIdentifier.dstringl = "UDF";

    image.udf_fsd.FileSetCharacterSet.CharacterSetType = UDF_CHAR_SET_TYPE;
    (new UdfString(image.udf_fsd.FileSetCharacterSet.CharacterSetInformation[0],
                   image.udf_fsd.FileSetCharacterSet.CharacterSetInformation[1],
                   image.udf_fsd.FileSetCharacterSet.CharacterSetInformation[2])).string = UDF_CHAR_SET_INFO;

    image.udf_fsd.FileSetIdentifier.dstringl = "UDF";
    image.udf_fsd.CopyrightFileIdentifier.dstringl = "Copyright";
    image.udf_fsd.AbstractFileIdentifier.dstringl = "Abstract";

    image.udf_fsd.DomainIdentifier.Flags = 0;
    (new UdfString(image.udf_fsd.DomainIdentifier.Identifier[0],
                   image.udf_fsd.DomainIdentifier.Identifier[1],
                   image.udf_fsd.DomainIdentifier.Identifier[2])).string = UDF_ID_COMPLIANT;
    image.udf_fsd.DomainIdentifier.IdentifierSuffix = [0x02, 0x01, 0x00];

    fill_timestamp(null, image.udf_fsd.RecordingDateAndTime);
}

// ------------------------------------------------------------------------------------------------
function update_tags(image) {
    "use strict";
    var desc;

    desc = next_desc(image.mvds.head, TAG_ID_PVD);
    update_tag(image.mvds, desc, TAG_ID_PVD, 1);

    desc = next_desc(image.mvds.head, TAG_ID_PD);
    update_tag(image.mvds, desc, TAG_ID_PD, 1);

    desc = next_desc(image.mvds.head, TAG_ID_LVD);
    update_tag(image.mvds, desc, TAG_ID_LVD, 1);

    desc = next_desc(image.mvds.head, TAG_ID_USD);
    update_tag(image.mvds, desc, TAG_ID_USD, 1);

    desc = next_desc(image.mvds.head, TAG_ID_IUVD);
    update_tag(image.mvds, desc, TAG_ID_IUVD, 1);

    desc = next_desc(image.mvds.head, TAG_ID_TD);
    update_tag(image.mvds, desc, TAG_ID_TD, 1);

    desc = next_desc(image.lvid.head, TAG_ID_LVID);
    update_tag(image.lvid, desc, TAG_ID_LVID, 1);

    desc = next_desc(image.lvid.head, TAG_ID_TD);
    update_tag(image.lvid, desc, TAG_ID_TD, 1);

    desc = next_desc(image.avdp[0].head, TAG_ID_AVDP);
    update_tag(image.avdp[0], desc, TAG_ID_AVDP, 1);

    desc = next_desc(image.avdp[1].head, TAG_ID_AVDP);
    update_tag(image.avdp[1], desc, TAG_ID_AVDP, 1);

    desc = next_desc(image.avdp[2].head, TAG_ID_AVDP);
    update_tag(image.avdp[2], desc, TAG_ID_AVDP, 1);

    desc = next_desc(image.pspace.head, TAG_ID_SBD);
    update_tag(image.pspace, desc, TAG_ID_SBD, 1);

    desc = next_desc(image.pspace.head, TAG_ID_FSD);
    update_tag(image.pspace, desc, TAG_ID_FSD, 1);
}

// ------------------------------------------------------------------------------------------------
function update_tag(space, desc, identifier, serial_number) {
    "use strict";
    var target;
    var offset = 16;
    var crc = 0;

    target = desc.data.buffer.DescriptorTag;
    target.TagIdentifier = identifier;
    target.DescriptorVersion = 2;
    target.TagSerialNumber = serial_number;

    if (identifier != TAG_ID_SBD) {
        crc = udf_crc(desc.data.buffer.buffer, offset, desc.data.length - offset, crc);
        target.DescriptorCRC = crc;
        target.DescriptorCRCLength = desc.data.length - offset;
    } else {
        crc = udf_crc(desc.data.buffer.buffer, offset, 8, crc);
        target.DescriptorCRC = crc;
        target.DescriptorCRCLength = 8;
    }

    if (space.space_type & PSPACE) {
        target.TagLocation = desc.offset;
    } else {
        target.TagLocation = space.offset + desc.offset;
    }

    target.TagChecksum = tag_checksum(desc.data.buffer.buffer, desc.data.buffer.offset);
}

// ------------------------------------------------------------------------------------------------
function update_tag_with_buffer(space, data, length, location, identifier, serial_number) {
    "use strict";
    var target;
    var offset = 16;
    var crc = 0;

    target = data.DescriptorTag;
    target.TagIdentifier = identifier;
    target.DescriptorVersion = 2;
    target.TagSerialNumber = serial_number;

    crc = udf_crc(data.buffer, offset, length - offset, crc);

    target.DescriptorCRC = crc;
    target.DescriptorCRCLength = length - 16;

    if (space.space_type & PSPACE) {
        target.TagLocation = location;
    } else {
        target.TagLocation = space.offset + location;
    }

    target.TagChecksum = tag_checksum(data.buffer, data.offset);
}

// ------------------------------------------------------------------------------------------------
function update_rvds(image) {
    "use strict";
    var desc;

    desc = next_desc(image.mvds.head, TAG_ID_PVD);
    desc = push_desc(image, image.rvds, TAG_ID_PVD, new PrimaryVolumeDescriptor(null, 0));
    desc.data.buffer.objcpy(image.udf_pvd);
    update_tag(image.rvds, desc, TAG_ID_PVD, 1);

    desc = next_desc(image.mvds.head, TAG_ID_PD);
    desc = push_desc(image, image.rvds, TAG_ID_PD, new PartitionDescriptor(null, 0));
    desc.data.buffer.objcpy(image.udf_pd);
    update_tag(image.rvds, desc, TAG_ID_PD, 1);

    desc = next_desc(image.mvds.head, TAG_ID_LVD);
    desc = push_desc(image, image.rvds, TAG_ID_LVD, new LogicalVolumeDescriptor(null, 0));
    desc.data.buffer.objcpy(image.udf_lvd);
    update_tag(image.rvds, desc, TAG_ID_LVD, 1);

    desc = next_desc(image.mvds.head, TAG_ID_USD);
    desc = push_desc(image, image.rvds, TAG_ID_USD, new UnallocatedSpaceDescriptor(null, 0, desc.data.length));
    desc.data.buffer.objcpy(image.udf_usd);
    update_tag(image.rvds, desc, TAG_ID_USD, 1);

    desc = next_desc(image.mvds.head, TAG_ID_IUVD);
    desc = push_desc(image, image.rvds, TAG_ID_IUVD, new ImplementationUseVolumeDescriptor(null, 0));
    desc.data.buffer.objcpy(image.udf_iuvd);
    update_tag(image.rvds, desc, TAG_ID_IUVD, 1);

    desc = next_desc(image.mvds.head, TAG_ID_TD);
    desc = push_desc(image, image.rvds, TAG_ID_TD, new TerminatingDescriptor(null, 0));
    desc.data.buffer.objcpy(image.udf_td);
    update_tag(image.rvds, desc, TAG_ID_TD, 1);
}

// ------------------------------------------------------------------------------------------------
function tag_checksum(tag_data, offset) {
    "use strict";
    var checksum = 0;

    for (var idx = 0; idx < 16; idx++) {
        if (idx == 4) {
            continue;
        }

        checksum += tag_data[offset + idx];
    }

    return (checksum % 256);
}

// ------------------------------------------------------------------------------------------------
function alloc_fe(image, filetype, flags) {
    "use strict";
    if ((filetype != ICBTAG_FILE_TYPE_DIRECTORY) && (filetype != ICBTAG_FILE_TYPE_REGULAR)) {
        console.error("Unsupported file type: ", filetype);
        return null;
    }

    var fe_desc = alloc_part_blocks(image, new FileEntry(null, 0), TAG_ID_FE);
    if (fe_desc == null) {
        return null;
    }

    var fe = fe_desc.data.buffer;

    fe.DescriptorTag.TagIdentifier = TAG_ID_FE;
    fe.DescriptorTag.DescriptorVersion = 3;
    fe.DescriptorTag.TagChecksum = 0;
    fe.DescriptorTag.Reserved = 0;
    fe.DescriptorTag.TagSerialNumber = 1;

    fe.ICBTag.PriorRecordedNumberOfDirectEntries = 0;
    fe.ICBTag.StrategyType = 4;
    fe.ICBTag.StrategyParameter = 0;
    fe.ICBTag.MaximumNumberOfEntries = 1;
    fe.ICBTag.Reserved = 0;
    fe.ICBTag.FileType = filetype;
    fe.ICBTag.Flags = ICBTAG_FLAG_AD_SHORT | flags;

    fe.Uid = 0xFFFFFFFF;
    fe.Gid = 0xFFFFFFFF;
    fe.Permissions = 0;
    fe.FileLinkCount = 0;
    fe.RecordFormat = 0;
    fe.RecordDisplayAttributes = 0;
    fe.RecordLength = 0;
    fe.InformationLength = 0;
    fe.LogicalBlocksRecorded = 0;

    fe.Checkpoint = 1;

    fe.ImplementationIdentifier.Flags = 0;
    (new UdfString(fe.ImplementationIdentifier.Identifier[0],
                   fe.ImplementationIdentifier.Identifier[1],
                   fe.ImplementationIdentifier.Identifier[2])).string = UDF_ID_DEVELOPER;
    fe.ImplementationIdentifier.IdentifierSuffix = [UDF_OS_CLASS_UNIX, UDF_OS_ID_LINUX];

    fe.AccessDateAndTime.objcpy(image.udf_pvd.RecordingDateAndTime);
    fe.ModificationDateAndTime.objcpy(fe.AccessDateAndTime);
    fe.AttributeDateAndTime.objcpy(fe.AccessDateAndTime);

    fe.UniqueId = GetUint32Le(image.udf_lvid.LogicalVolumeContentsUse[0], image.udf_lvid.LogicalVolumeContentsUse[1]);
    var unique_id;
    if (!(fe.UniqueId & 0xFFFFFFFF)) {
        unique_id = fe.UniqueId + 16;
    } else {
        unique_id = fe.UniqueId + 1;
    }
    PutUint32Le(image.udf_lvid.LogicalVolumeContentsUse[0], image.udf_lvid.LogicalVolumeContentsUse[1], unique_id);

    return fe_desc;
}

// ------------------------------------------------------------------------------------------------
function alloc_part_blocks(image, struct, id) {
    "use strict";
    var blocks = bytes_to_blocks(image.block_size, struct.length);
    var sbd_desc = next_desc(image.pspace.head, TAG_ID_SBD);
    var sbd = sbd_desc.data.buffer;
    var start = image.pspace.tail.offset + bytes_to_blocks(image.block_size, image.pspace.tail.data.length);

    if (start + blocks > sbd.NumberOfBits) {
        console.error("No enough blocks in partition space");
        image.error_flag = ERR_FOLDER_OVERSIZE;
        return null;
    }

    image.udf_lvid.FreeSpaceTable = image.udf_lvid.FreeSpaceTable - blocks;

    return push_desc(image, image.pspace, id, struct);
}

// ------------------------------------------------------------------------------------------------
function insert_fid(image, new_fedesc, parent, name, file_char) {
    "use strict";
    var SAD_SIZE = 8;
    var cur_sad_count, max_sad_count;
    var fid_len, free_len;
    var sad_arr = null;
    var last_sad_owner = null;
    var parent_fe = parent.data.buffer;
    var new_fe = new_fedesc.data.buffer;
    var aed = null;
    var fid_data_block = null;
    var fid = null;

    last_sad_owner = parent;
    while (last_sad_owner.data.next != null) {
        last_sad_owner = last_sad_owner.data.next.owner;
    }

    if (last_sad_owner.identifier == TAG_ID_FE) {
        max_sad_count = Math.trunc((image.block_size - 176 - parent_fe.LengthOfExtendedAttributes) / SAD_SIZE);
        cur_sad_count = Math.trunc(parent_fe.LengthOfAllocationDescriptors / SAD_SIZE);
        sad_arr = new short_ad(parent_fe.AllocationDescriptors[0], parent_fe.AllocationDescriptors[1]);

        if (cur_sad_count == 0) {
            fid_data_block = alloc_part_blocks(image, new UdfStruct(null, 0, image.block_size), TAG_ID_DATAONLY);
            if (fid_data_block == null) {
                return false;
            }

            fid_data_block.data.length = 0;
            sad_arr.ptr(0).ExtentLength = 0;
            sad_arr.ptr(0).ExtentPosition = fid_data_block.offset;
            cur_sad_count = 1;

            parent_fe.LengthOfAllocationDescriptors += SAD_SIZE;
            last_sad_owner.data.length += SAD_SIZE;
        }
    } else if (last_sad_owner.identifier == TAG_ID_AED) {
        aed = last_sad_owner.data.buffer;
        max_sad_count = Math.trunc((image.block_size - 24) / SAD_SIZE);
        cur_sad_count = Math.trunc(aed.LengthOfAllocationDescriptors / SAD_SIZE);
        sad_arr = new short_ad(last_sad_owner.data.buffer.buffer, 24);

        if (cur_sad_count == 0) {
            console.error("This case should never happen! AED at offset [",
                    last_sad_owner.offset, "] has no short_ad");
            return false;
        }
    } else {
        console.error("The short_ad pointing to FIDs is not recorded in an FE or AED (owner: [" +
                id_string(last_sad_owner.identifier) + "])");
        return false;
    }

    if (fid_data_block == null) {
        fid_data_block = find_desc(image, image.pspace, sad_arr.ptr(cur_sad_count - 1).ExtentPosition);
        if (fid_data_block == null) {
            console.error("Can't find the block at position [" +
                    sad_arr.ptr(cur_sad_count - 1).ExtentPosition + "] owns FIDs");
            return false;
        }
    }

    var rvalue = [0];
    fid = create_fid(image, name, file_char, new_fedesc, rvalue);
    fid_len = rvalue[0];
    free_len = image.block_size - fid_data_block.data.length;
    if (fid_len > free_len) {
        var new_fid_data = null;

        if (free_len > 0) {
            update_tag_with_buffer(image.pspace, fid, fid_len, fid_data_block.offset, TAG_ID_FID, 1);
            fid_data_block.data.buffer.memcpy(fid_data_block.data.length, fid, 0, free_len);
            fid_data_block.data.length += free_len;
            sad_arr.ptr(cur_sad_count - 1).ExtentLength += free_len;

            new_fid_data = alloc_part_blocks(image, new UdfStruct(null, 0, fid_len - free_len), TAG_ID_DATAONLY);
            if (new_fid_data == null) {
                return false;
            }
        } else {
            new_fid_data = alloc_part_blocks(image, new UdfStruct(null, 0, fid_len - free_len), TAG_ID_DATAONLY);
            if (new_fid_data == null) {
                return false;
            }
            update_tag_with_buffer(image.pspace, fid, fid_len, new_fid_data.offset, TAG_ID_FID, 1);
        }

        if (cur_sad_count == max_sad_count) {
            var new_sad_owner = alloc_part_blocks(image,
                    new AllocationExtentDescriptor(null, 0), TAG_ID_AED);

            if (new_sad_owner == null) {
                return false;
            }

            aed = new_sad_owner.data.buffer;

            var new_sad_arr = new short_ad(new_sad_owner.data.buffer.buffer, 24);
            new_sad_arr.ptr(0).objcpy(sad_arr.ptr(cur_sad_count - 1));
            new_sad_owner.data.length += SAD_SIZE;
            aed.LengthOfAllocationDescriptors += SAD_SIZE;

            sad_arr.ptr(cur_sad_count - 1).ExtentLength = new_sad_owner.data.length;
            sad_arr.ptr(cur_sad_count - 1).ExtentLength |= ((3 << 30) >>> 0);
            sad_arr.ptr(cur_sad_count - 1).ExtentPosition = new_sad_owner.offset;

            sad_arr = new_sad_arr;
            max_sad_count = Math.trunc((image.block_size - 24) / SAD_SIZE);
            cur_sad_count = 1;

            update_tag(image.pspace, last_sad_owner, last_sad_owner.identifier, 1);
            last_sad_owner.data.next = new_sad_owner.data;
            last_sad_owner = new_sad_owner;
        }

        new_fid_data.data.length = 0;
        new_fid_data.data.buffer.memcpy(0, fid, free_len, fid_len - free_len);
        new_fid_data.data.length += (fid_len - free_len);

        cur_sad_count++;
        last_sad_owner.data.length += SAD_SIZE;
        sad_arr.ptr(cur_sad_count - 1).ExtentLength = new_fid_data.data.length;
        sad_arr.ptr(cur_sad_count - 1).ExtentPosition = new_fid_data.offset;

        if (aed == null) {
            parent_fe.LengthOfAllocationDescriptors += SAD_SIZE;
        } else {
            aed.LengthOfAllocationDescriptors += SAD_SIZE;
        }

        fid_data_block = new_fid_data;
    } else {
        update_tag_with_buffer(image.pspace, fid, fid_len, fid_data_block.offset, TAG_ID_FID, 1);
        fid_data_block.data.buffer.memcpy(fid_data_block.data.length, fid, 0, fid_len);
        fid_data_block.data.length += fid_len;
        sad_arr.ptr(cur_sad_count - 1).ExtentLength += fid_len;
    }

    parent_fe.InformationLength += fid_len;
    parent_fe.LogicalBlocksRecorded = bytes_to_blocks(image.block_size, parent_fe.InformationLength);

    new_fe.FileLinkCount++;

    update_tag(image.pspace, parent, TAG_ID_FE, 1);
    update_tag(image.pspace, new_fedesc, TAG_ID_FE, 1);
    update_tag(image.pspace, last_sad_owner, last_sad_owner.identifier, 1);

    return true;
}

// ------------------------------------------------------------------------------------------------
function create_fid(image, name, file_char, fe_desc, out_len) {
    "use strict";
    var fid;
    var fid_len;
    var name_len;
    var uniq_id_32;

    if (name != null) {
        if (CheckMultiByteChar(name)) {
            if (name.length > 127) {
                console.error("LengthOfFileIdentifier of [" + name + "] is longer than 255 bytes");
                return null;
            }

            name_len = name.length * 2 + 1;
        } else {
            if (name.length > 254) {
                console.error("LengthOfFileIdentifier of [" + name + "] is longer than 255 bytes");
                return null;
            }

            name_len = name.length + 1;
        }
    } else {
        name_len = 0;
    }

    fid_len = padding_4_length(38 + name_len);
    out_len[0] = fid_len;

    fid = new FileIdentifierDescriptor(null, 0, fid_len);
    fid.FileVersionNumber = 1;
    fid.FileCharacteristics = file_char;
    fid.LengthOfFileIdentifier = name_len;
    fid.ICB.ExtentLength = bytes_to_blocks(image.block_size, fe_desc.data.length) * image.block_size;
    fid.ICB.ExtentLocation.LogicalBlockNumber = fe_desc.offset;
    fid.ICB.ExtentLocation.PartitionReferenceNumber = 0;

    var fe = fe_desc.data.buffer;
    uniq_id_32 = fe.UniqueId & 0xFFFFFFFF;
    var adiu = new ADImpUse(fid.ICB.ImplementationUse[0], fid.ICB.ImplementationUse[1]);
    PutUint32Le(adiu.ImpUse[0], adiu.ImpUse[1], uniq_id_32);

    fid.LengthOfImplementationUse = 0;
    if (name_len > 0) {
        fid.FileIdentifier.length = name_len;
        fid.FileIdentifier.dstring = name;
    }

    return fid;
}

// ------------------------------------------------------------------------------------------------
function create_root_dir(image) {
    "use strict";
    var fe_desc;

    fe_desc = create_dir(image, null, null);

    if (fe_desc == null) {
        return;
    }

    image.udf_fsd.RootDirectoryICB.ExtentLength = image.block_size;
    image.udf_fsd.RootDirectoryICB.ExtentLocation.LogicalBlockNumber = fe_desc.offset;
    image.udf_fsd.RootDirectoryICB.ExtentLocation.PartitionReferenceNumber = 0;

    image.cur_parent = fe_desc;
}

// ------------------------------------------------------------------------------------------------
function create_dir(image, parent, name) {
    "use strict";
    var fe_desc = alloc_fe(image, ICBTAG_FILE_TYPE_DIRECTORY, 0);

    if (fe_desc == null) {
        return null;
    }

    set_file_attributes(image, image.cur_path, fe_desc.data.buffer);
    if (parent != null) {
        if (!insert_fid(image, fe_desc, parent, name, FID_FILE_CHAR_DIRECTORY)
            || !insert_fid(image, parent, fe_desc, null, FID_FILE_CHAR_DIRECTORY | FID_FILE_CHAR_PARENT)) {
            return null;
        }
    } else {
        fe_desc.data.buffer.Permissions &=
                ~(FE_PERM_O_DELETE | FE_PERM_G_DELETE | FE_PERM_U_DELETE);
        if (!insert_fid(image, fe_desc, fe_desc, name, FID_FILE_CHAR_DIRECTORY | FID_FILE_CHAR_PARENT)) {
            return null;
        }
    }

    image.udf_lvidiu.NumberOfDirectories = image.udf_lvidiu.NumberOfDirectories + 1;

    return fe_desc;
}

// ------------------------------------------------------------------------------------------------
function create_file(image, parent, name, path) {
    "use strict";
    var fe_desc = alloc_fe(image, ICBTAG_FILE_TYPE_REGULAR, 0);

    if (fe_desc == null) {
        return null;
    }

    if (!insert_fid(image, fe_desc, parent, name, 0)) {
        return null;
    }

    image.udf_lvidiu.NumberOfFiles = image.udf_lvidiu.NumberOfFiles + 1;

    var fe = fe_desc.data.buffer;
    if (!set_file_attributes(image, path, fe)) {
        console.error("Fail to set file [" + name + "] time and size");
        return null;
    }

    var file_size = fe.InformationLength;
    var sad_count = Math.trunc((file_size + image.max_file_len_in_sad - 1) / image.max_file_len_in_sad);
    var max_sad_count = Math.trunc((image.block_size - 176 + 8 - 1) / 8);
    if (max_sad_count < sad_count) {
        console.error("Not enough space in the FE block to add more short_ad");
        return null;
    }

    fe_desc.data.length += sad_count * 8;
    fe.LogicalBlocksRecorded = bytes_to_blocks(image.block_size, file_size);
    fe.LengthOfAllocationDescriptors = sad_count * 8;
    var sad_arr = new short_ad(fe.AllocationDescriptors[0], fe.AllocationDescriptors[1]);
    if (file_size <= image.max_file_len_in_sad) {
        var file_desc = alloc_part_blocks(image, new UdfVfile(null, 0, file_size), TAG_ID_VIRTUAL_FILE);
        if (file_desc == null) {
            return null;
        }

        var vf = file_desc.data.buffer;
        vf.path = path;
        vf.offset = 0;
        sad_arr.ptr(0).ExtentLength = file_size;
        sad_arr.ptr(0).ExtentPosition = file_desc.offset;
    } else {
        var copy_len = image.max_file_len_in_sad;
        for (var cnt = 0; cnt < sad_count; cnt++) {
            if (file_size < image.max_file_len_in_sad) {
                copy_len = file_size;
            }
            var file_desc = alloc_part_blocks(image, new UdfVfile(null, 0, copy_len), TAG_ID_VIRTUAL_FILE);
            if (file_desc == null) {
                return null;
            }

            var vf = file_desc.data.buffer;
            vf.path = path;
            vf.offset = cnt * image.max_file_len_in_sad;
            sad_arr.ptr(cnt).ExtentLength = copy_len;
            sad_arr.ptr(cnt).ExtentPosition = file_desc.offset;

            file_size -= copy_len;
        }
    }

    update_tag(image.pspace, fe_desc, TAG_ID_FE, 1);

    return fe_desc;
}

// ------------------------------------------------------------------------------------------------
function fill_timestamp(time_handle, ts) {
    "use strict";
    // TODO:
}

// ------------------------------------------------------------------------------------------------
function set_file_attributes(image, path, fe) {
    "use strict";
    // TODO:
    var file = GetFileFromName(image.root_dir, path);

    if ((file != null) || (path == image.root_path)) {
        fe.Permissions = FE_PERM_O_EXEC |
                         FE_PERM_O_WRITE |
                         FE_PERM_O_READ |
                         FE_PERM_O_CHATTR |
                         FE_PERM_O_DELETE |
                         FE_PERM_G_EXEC |
                         FE_PERM_G_WRITE |
                         FE_PERM_G_READ |
                         FE_PERM_G_CHATTR |
                         FE_PERM_G_DELETE |
                         FE_PERM_U_EXEC |
                         FE_PERM_U_WRITE |
                         FE_PERM_U_READ |
                         FE_PERM_U_CHATTR |
                         FE_PERM_U_DELETE;

        if (fe.ICBTag.FileType == ICBTAG_FILE_TYPE_REGULAR) {
            fe.InformationLength = file.file.size;
        }

        /*fill_timestamp(&(statbuf.st_atime), &(fe->AccessDateAndTime));
        fill_timestamp(&(statbuf.st_mtime), &(fe->ModificationDateAndTime));
        fill_timestamp(&(statbuf.st_ctime), &(fe->AttributeDateAndTime));*/

        return true;
    } else {
        console.error("Can't find file ", path, " in the file list");
        return false;
    }
}

// ------------------------------------------------------------------------------------------------
function create_udf_image(dev_idx, root_path, fileList, blocks) {
    "use strict";
    var image;
    var space;

    image = new udf_image();

    image.total_blocks = blocks;
    image.block_size = DEFAULT_BLOCK_SIZE;
    image.dump_udf_text = false;
    image.dump_udf_ima = false;

    image.max_file_len_in_sad = Math.trunc(0x3FFFFFFF / image.block_size) * image.block_size;

    console.log("UDF total blocks " + image.total_blocks + " / block size " + image.block_size);

    space = new udf_space();
    space.space_type = USPACE;
    space.offset = 0;
    space.blocks = image.total_blocks;
    space.prev = space.next = null;
    space.head = space.tail = null;

    image.head = image.tail = space;

    image.error_flag = ERR_OK;

    console.log("Create UDF file system of directory: [" + root_path + "]");
    image.root_path = root_path;
    image.cur_path = root_path;

    if (fileList instanceof FileList) {
        image.root_dir = ParseFileList(fileList, SEPARATOR);
    } else {
        image.root_dir = ParseFileList([fileList], SEPARATOR);
    }

    deploy_spaces(image);

    push_meta_descs(image);

    push_pspace_descs(image);

    create_root_dir(image);

    create_dir_files(image, image.root_dir);

    update_tags(image);

    update_rvds(image);

    console.log("Total [", image.udf_lvidiu.NumberOfDirectories, "] directories and [",
            image.udf_lvidiu.NumberOfFiles, "] files in this UDF file system");

    //console.debug(dump_image(image, "", true));

    return image;
}

// ------------------------------------------------------------------------------------------------
function create_dir_files(image, jsDir) {
    "use strict";
    for (var index = 0; index < jsDir.files.length; index++) {
        if (image.error_flag != ERR_OK) {
            return;
        }

        var jsFile = jsDir.files[index];

        image.cur_path = jsFile.path;

        if (!jsFile.isFile) {
            var fileName = jsFile.path.split(SEPARATOR).pop();

            console.log("Handling DIR [" + image.cur_path + "]");
            var temp = image.cur_parent;
            image.cur_parent = create_dir(image, temp, fileName);

            if (image.cur_parent == null) {
                return;
            }

            create_dir_files(image, jsFile);
            image.cur_parent = temp;
        } else {
            console.log("Handling FILE [" + image.cur_path + "]");
            if (create_file(image, image.cur_parent, jsFile.file.name, image.cur_path) == null) {
                return;
            }
        }
        image.cur_path = jsFile.dirPath;
    }
}

// ------------------------------------------------------------------------------------------------
function Linux_Folder_CreateImageFromPath(dev_idx, fileList, blocks) {
    "use strict";
    var root_path = fileList[0].webkitRelativePath.split(SEPARATOR)[0];

    if (udf_images[dev_idx] != null) {
        Folder_RemoveImage(dev_idx);
    }

    if (root_path.charCodeAt(root_path.length - 1) == SEPARATOR.charCodeAt(0)) {
        root_path = root_path.substr(0, root_path.length - 1);
    }

    udf_images[dev_idx] = create_udf_image(dev_idx, root_path, fileList, blocks);

    switch (udf_images[dev_idx].error_flag) {
        case ERR_FOLDER_OVERSIZE:
            Folder_RemoveImage(dev_idx);
            return "overSized";
        default:
            return 1;
    }
}

// ------------------------------------------------------------------------------------------------
function Folder_RemoveImage(dev_idx) {
    "use strict";
    udf_images[dev_idx] = null;
}

// ------------------------------------------------------------------------------------------------
function TFATFileSystemImage_VirtualRead(dev_idx, Unused, off, sec) {
    "use strict";
    var image = udf_images[dev_idx];
    var space = find_space(image.head, sec);
    var desc = null;
    var block_size = image.block_size;
    var offset;
    var WorkBuf = new Uint8Array(block_size);

    WorkBuf.fill(0);

    if (space == null) {
        //console.warn("Invalid sector for reading: " + sec);
        return [WorkBuf, off];
    }

    if (space.space_type & (USPACE | RESERVED)) {
        // Nothing to do
    } else if (space.space_type & PSPACE) {
        offset = sec - space.offset;
        desc = find_desc(image, space, offset);
        if (desc != null) {
            if (desc.identifier == TAG_ID_VIRTUAL_FILE) {
                var vf = desc.data.buffer;
                var file = GetFileFromName(image.root_dir, vf.path);
                if (file != null) {
                    var file_offset = vf.offset + (offset - desc.offset) * block_size;
                    var read_len = ((file_offset + block_size) > file.file.size)
                                   ? file.file.size - file_offset : block_size;
                    if (vf.path != image.cur_path || (file_offset < image.cached_file_offset || file_offset + read_len > image.cached_file_offset + image.cached_file_len)) {
                        image.cur_path = vf.path;
                        // console.log("Reading file [" + image.cur_path + "]");
                        image.cur_fp = file.file;

                        var fileReader = new FileReaderSync();
                        image.cached_file_offset = file_offset;
                        if (image.cur_fp.size - file_offset < CACHED_FILE_MAX_LEN) {
                            image.cached_file_len = image.cur_fp.size - file_offset;
                        } else {
                            image.cached_file_len = CACHED_FILE_MAX_LEN;
                        }
                        image.cached_file_data = new Uint8Array(fileReader.readAsArrayBuffer(image.cur_fp.slice(image.cached_file_offset, image.cached_file_offset + image.cached_file_len)));
                    }
                    if (read_len >= block_size) {
                        WorkBuf = image.cached_file_data.slice(file_offset - image.cached_file_offset, file_offset - image.cached_file_offset + read_len);
                    } else {
                        WorkBuf.set(image.cached_file_data.slice(file_offset - image.cached_file_offset, file_offset - image.cached_file_offset + read_len), 0);
                    }
                }
            } else if (desc.identifier == TAG_ID_SBD) {
                var start = (offset - desc.offset) * block_size;
                var read_len = ((start + block_size) > desc.data.length) ? (desc.data.length - start) : block_size;
                var sbd = desc.data.buffer;

                sbd.readBlocks(WorkBuf, start, read_len);
            } else {
                var start = (offset - desc.offset) * block_size;
                var read_len = ((start + block_size) > (desc.data.length))
                               ? desc.data.length - start : block_size;
                for (var idx = 0; idx < read_len; idx++) {
                    WorkBuf[idx] = desc.data.buffer.buffer[start + idx];
                }
            }
        } else {
            // No data is recorded at this block
        }
    } else {
        offset = sec - space.offset;
        desc = find_desc(image, space, offset);
        if (desc != null) {
            var read_len;

            offset = (offset - desc.offset) * block_size;
            read_len = ((desc.data.length - offset) > block_size) ? block_size : (desc.data.length - offset);
            for (var idx = 0; idx < read_len; idx++) {
                WorkBuf[idx] = desc.data.buffer.buffer[offset + idx];
            }
        } else {
            // No data is recorded at this block
        }
    }

    return [WorkBuf, off];
}

// ------------------------------------------------------------------------------------------------
function TFATFileSystemImage_VirtualWrite(dev_idx, rx_buf, rx_buf_index, sec) {
    "use strict";
}
