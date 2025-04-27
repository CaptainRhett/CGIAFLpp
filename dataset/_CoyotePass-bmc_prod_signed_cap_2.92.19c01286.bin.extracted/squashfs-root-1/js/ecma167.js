"use strict";
var DEFAULT_BLOCK_SIZE  = 512;

var TAG_ID_PVD  = 0x0001;
var TAG_ID_AVDP = 0x0002;
var TAG_ID_VDP  = 0x0003;
var TAG_ID_IUVD = 0x0004;
var TAG_ID_PD   = 0x0005;
var TAG_ID_LVD  = 0x0006;
var TAG_ID_USD  = 0x0007;
var TAG_ID_TD   = 0x0008;
var TAG_ID_LVID = 0x0009;

var TAG_ID_FSD  = 0x0100;
var TAG_ID_FID  = 0x0101;
var TAG_ID_AED  = 0x0102;
var TAG_ID_IE   = 0x0103;
var TAG_ID_TE   = 0x0104;
var TAG_ID_FE   = 0x0105;
var TAG_ID_EAHD = 0x0106;
var TAG_ID_USE  = 0x0107;
var TAG_ID_SBD  = 0x0108;
var TAG_ID_PIE  = 0x0109;
var TAG_ID_EFE  = 0x010A;

var PD_ACCESS_TYPE_NONE         = 0x00000000;
var PD_ACCESS_TYPE_READ_ONLY    = 0x00000001;
var PD_ACCESS_TYPE_WRITE_ONCE   = 0x00000002;
var PD_ACCESS_TYPE_REWRITABLE   = 0x00000003;
var PD_ACCESS_TYPE_OVERWRITABLE = 0x00000004;

var LVID_INTEGRITY_TYPE_OPEN    = 0x00000000;
var LVID_INTEGRITY_TYPE_CLOSE   = 0x00000001;

var FE_PERM_O_EXEC              = 0x00000001;
var FE_PERM_O_WRITE             = 0x00000002;
var FE_PERM_O_READ              = 0x00000004;
var FE_PERM_O_CHATTR            = 0x00000008;
var FE_PERM_O_DELETE            = 0x00000010;
var FE_PERM_G_EXEC              = 0x00000020;
var FE_PERM_G_WRITE             = 0x00000040;
var FE_PERM_G_READ              = 0x00000080;
var FE_PERM_G_CHATTR            = 0x00000100;
var FE_PERM_G_DELETE            = 0x00000200;
var FE_PERM_U_EXEC              = 0x00000400;
var FE_PERM_U_WRITE             = 0x00000800;
var FE_PERM_U_READ              = 0x00001000;
var FE_PERM_U_CHATTR            = 0x00002000;
var FE_PERM_U_DELETE            = 0x00004000;

var ICBTAG_FLAG_AD_MASK         = 0x0007;
var ICBTAG_FLAG_AD_SHORT        = 0x0000;
var ICBTAG_FLAG_AD_LONG         = 0x0001;
var ICBTAG_FLAG_AD_EXTENDED     = 0x0002;
var ICBTAG_FLAG_AD_IN_ICB       = 0x0003;
var ICBTAG_FLAG_SORTED          = 0x0008;
var ICBTAG_FLAG_NONRELOCATABLE  = 0x0010;
var ICBTAG_FLAG_ARCHIVE         = 0x0020;
var ICBTAG_FLAG_SETUID          = 0x0040;
var ICBTAG_FLAG_SETGID          = 0x0080;
var ICBTAG_FLAG_STICKY          = 0x0100;
var ICBTAG_FLAG_CONTIGUOUS      = 0x0200;
var ICBTAG_FLAG_SYSTEM          = 0x0400;
var ICBTAG_FLAG_TRANSFORMED     = 0x0800;
var ICBTAG_FLAG_MULTIVERSIONS   = 0x1000;
var ICBTAG_FLAG_STREAM          = 0x2000;

var ICBTAG_FILE_TYPE_UNDEF      = 0x00;
var ICBTAG_FILE_TYPE_USE        = 0x01;
var ICBTAG_FILE_TYPE_PIE        = 0x02;
var ICBTAG_FILE_TYPE_IE         = 0x03;
var ICBTAG_FILE_TYPE_DIRECTORY  = 0x04;
var ICBTAG_FILE_TYPE_REGULAR    = 0x05;
var ICBTAG_FILE_TYPE_BLOCK      = 0x06;
var ICBTAG_FILE_TYPE_CHAR       = 0x07;
var ICBTAG_FILE_TYPE_EA         = 0x08;
var ICBTAG_FILE_TYPE_FIFO       = 0x09;
var ICBTAG_FILE_TYPE_SOCKET     = 0x0A;
var ICBTAG_FILE_TYPE_TE         = 0x0B;
var ICBTAG_FILE_TYPE_SYMLINK    = 0x0C;
var ICBTAG_FILE_TYPE_STREAMDIR  = 0x0D;

var FID_FILE_CHAR_HIDDEN        = 0x01;
var FID_FILE_CHAR_DIRECTORY     = 0x02;
var FID_FILE_CHAR_DELETED       = 0x04;
var FID_FILE_CHAR_PARENT        = 0x08;
var FID_FILE_CHAR_METADATA      = 0x10;

var UDF_CHAR_SET_TYPE   =  0;
var UDF_CHAR_SET_INFO   =  "OSTA Compressed Unicode";

var UDF_OS_CLASS_UNIX   = 0x04;
var UDF_OS_CLASS_WIN9X  = 0x05;
var UDF_OS_CLASS_WINNT  = 0x06;

var UDF_OS_ID_LINUX     = 0x05;
var UDF_OS_ID_WIN9X     = 0x00;
var UDF_OS_ID_WINNT     = 0x00;

var UDF_ID_DEVELOPER    = "*Linux UDFFS";
var UDF_ID_COMPLIANT    = "*OSTA UDF Compliant";
var UDF_ID_LV_INFO      = "*UDF LV Info";

function PutUint16Le(buffer, offset, value) {
    "use strict";
    buffer[offset]     = value & 0xFF;
    buffer[offset + 1] = (value & 0xFF00) >>> 8;
}

function GetUint16Le(buffer, offset) {
    "use strict";
    return ((buffer[offset]) |
            (buffer[offset + 1] << 8)) >>> 0;
}

function PutUint32Le(buffer, offset, value) {
    "use strict";
    buffer[offset]     = (value & 0xFF);
    buffer[offset + 1] = (value & 0xFF00) >>> 8;
    buffer[offset + 2] = (value & 0xFF0000) >>> 16;
    buffer[offset + 3] = (value & 0xFF000000) >>> 24;
}

function GetUint32Le(buffer, offset) {
    "use strict";
    return ((buffer[offset]) |
            (buffer[offset + 1] << 8) |
            (buffer[offset + 2] << 16) |
            (buffer[offset + 3] << 24)) >>> 0;
}

function PutUint64Le(buffer, offset, value) {
    "use strict";
    buffer[offset]     = (value & 0xFF);
    buffer[offset + 1] = (value & 0xFF00) >>> 8;
    buffer[offset + 2] = (value & 0xFF0000) >>> 16;
    buffer[offset + 3] = (value & 0xFF000000) >>> 24;
    buffer[offset + 4] = Math.trunc(value / Math.pow(2, 32)) & 0xFF;
    buffer[offset + 5] = Math.trunc(value / Math.pow(2, 40)) & 0xFF;
    buffer[offset + 6] = Math.trunc(value / Math.pow(2, 48)) & 0xFF;
    buffer[offset + 7] = Math.trunc(value / Math.pow(2, 56)) & 0xFF;
}

function GetUint64Le(buffer, offset) {
    "use strict";
    var low = ((buffer[offset]) |
              (buffer[offset + 1] << 8) |
              (buffer[offset + 2] << 16) |
              (buffer[offset + 3] << 24)) >>> 0;
    var high = buffer[offset + 4] * Math.pow(2, 32) +
               buffer[offset + 5] * Math.pow(2, 40) +
               buffer[offset + 6] * Math.pow(2, 48) +
               buffer[offset + 7] * Math.pow(2, 56);

    return low + high;
}

function PutString(buffer, offset, string, length) {
    "use strict";
    var byteCount = 0;
    for (var idx = 0; ((idx < string.length) && (idx < length)); idx++) {
        var charCode = string.charCodeAt(idx);
        if (charCode < 256) {
            buffer[offset + byteCount] = charCode;
            byteCount++;
        } else {
            PutUint16Le(buffer, offset + byteCount, charCode);
            byteCount += 2;;
        }
    }
}

function CheckMultiByteChar(string) {
    "use strict";
    for (var idx = 0; idx < string.length; idx++) {
        if (string.charCodeAt(idx) > 255) {
            return true;
        }
    }
}

function CompressUnicode(numberOfChars, compID, unicode, UDFCompressed, offset) {
    "use strict";
    var byteIndex = -1;
    var unicodeIndex = 0;

    if ((compID != 8) && (compID != 16)) {
        byteIndex = -1;
    } else {
        UDFCompressed[offset] = compID;

        byteIndex = offset + 1;
        unicodeIndex = 0;
        while (unicodeIndex < numberOfChars) {
            if (compID == 16) {
                UDFCompressed[byteIndex++] = (unicode.charCodeAt(unicodeIndex) & 0xFF00) >>> 8;
            }
            UDFCompressed[byteIndex++] = unicode.charCodeAt(unicodeIndex) & 0x00FF;
            unicodeIndex++;
        }
    }

    return byteIndex;
}

function AddPropUint8(obj, prop, buffer, offset) {
    "use strict";
    Object.defineProperty(obj, prop, {
        get: function() {
            "use strict";
            return buffer[offset];
        },
        set: function(value) {
            "use strict";
            buffer[offset] = value;
        }
    });
}

function AddPropUint16(obj, prop, buffer, offset) {
    "use strict";
    Object.defineProperty(obj, prop, {
        get: function() {
            "use strict";
            return GetUint16Le(buffer, offset);
        },
        set: function(value) {
            "use strict";
            PutUint16Le(buffer, offset, value);
        }
    });
}

function AddPropUint32(obj, prop, buffer, offset) {
    "use strict";
    Object.defineProperty(obj, prop, {
        get: function() {
            "use strict";
            return GetUint32Le(buffer, offset);
        },
        set: function(value) {
            "use strict";
            PutUint32Le(buffer, offset, value);
        }
    });
}

function AddPropUint64(obj, prop, buffer, offset) {
    "use strict";
    Object.defineProperty(obj, prop, {
        get: function() {
            "use strict";
            return GetUint64Le(buffer, offset);
        },
        set: function(value) {
            "use strict";
            PutUint64Le(buffer, offset, value);
        }
    });
}

function AddPropArray(obj, prop, buffer, offset, length) {
    "use strict";
    Object.defineProperty(obj, prop, {
        get: function() {
            "use strict";
            return [buffer, offset, length];
        },
        set: function(source) {
            "use strict";
            for (var idx = 0; idx < source.length; idx++) {
                buffer[offset + idx] = source[idx];
            }
        }
    });
}

function UdfStruct(buffer, offset, length) {
    "use strict";
    if (length == null) {
        throw "Invalid struct length";
    }

    if (buffer == null) {
        this.buffer = new Uint8Array(
                Math.trunc((length + DEFAULT_BLOCK_SIZE - 1) / DEFAULT_BLOCK_SIZE) * DEFAULT_BLOCK_SIZE);
        this.offset = 0;
    } else {
        this.buffer = buffer;
        this.offset = offset;
    }
    this.length = length;
}
UdfStruct.prototype.objcpy = function(source) {
    "use strict";
    for (var idx = 0; idx < source.length; idx++) {
        this.buffer[this.offset + idx] = source.buffer[source.offset + idx];
    }
};
UdfStruct.prototype.memcpy = function(doff, source, soff, length) {
    "use strict";
    for (var idx = 0; idx < length; idx++) {
        this.buffer[this.offset + doff + idx] = source.buffer[source.offset + soff + idx];
    }
};
UdfStruct.prototype.fromArray = function(source, length) {
    "use strict";
    for (var idx = 0; idx < length; idx++) {
        this.buffer[this.offset + idx] = source[idx];
    }
};

function UdfString(buffer, offset, length) {
    "use strict";
    UdfStruct.call(this, buffer, offset, length);

    this.oriString = null;
    this.compId = 0;
    Object.defineProperty(this, "string", {
        get: function() {
            "use strict";
            return this.oriString;
        },
        set: function(source) {
            "use strict";
            this.oriString = source;
            this.compId = 0;
            PutString(buffer, offset, source, length);
        }
    });

    Object.defineProperty(this, "dstring", {
        get: function() {
            "use strict";
            return this.oriString;
        },
        set: function(source) {
            "use strict";
            this.oriString = source;
            if (CheckMultiByteChar(source)) {
                var bytes = source.length * 2;
                if (bytes > (this.length - 1)) {
                    bytes = this.length - 1;
                }

                this.compId = 0x10;
                CompressUnicode(Math.trunc(bytes / 2), 0x10, source, this.buffer, this.offset);
            } else {
                var bytes = source.length;
                if (bytes > this.length - 1) {
                    bytes = this.length - 1;
                }

                this.compId = 0x08;
                CompressUnicode(bytes, 0x08, source, this.buffer, this.offset);
            }
        }
    });

    Object.defineProperty(this, "dstringl", {
        get: function() {
            "use strict";
            return this.oriString;
        },
        set: function(source) {
            "use strict";
            this.oriString = source;
            if (CheckMultiByteChar(source)) {
                var bytes = source.length * 2;
                if (bytes > (this.length - 2)) {
                    bytes = this.length - 2;
                }

                this.compId = 0x10;
                CompressUnicode(Math.trunc(bytes / 2), 0x10, source, this.buffer, this.offset);
                this.buffer[this.offset + this.length - 1] = Math.trunc(bytes / 2) + 1;
            } else {
                var bytes = source.length;
                if (bytes > this.length - 2) {
                    bytes = this.length - 2;
                }

                this.compId = 0x08;
                CompressUnicode(bytes, 0x08, source, this.buffer, this.offset);
                this.buffer[this.offset + this.length - 1] = bytes + 1;
            }
        }
    });
}
UdfString.prototype = Object.create(UdfStruct.prototype);
UdfString.prototype.constructor = UdfString;

function charspec(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 64);

    AddPropUint8(this, "CharacterSetType", this.buffer, this.offset);
    AddPropArray(this, "CharacterSetInformation", this.buffer, this.offset + 1, 63);
}
charspec.prototype = Object.create(UdfStruct.prototype);
charspec.prototype.constructor = charspec;

function lb_addr(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 6);

    AddPropUint32(this, "LogicalBlockNumber", this.buffer, this.offset);
    AddPropUint16(this, "PartitionReferenceNumber", this.buffer, this.offset + 4);
}
lb_addr.prototype = Object.create(UdfStruct.prototype);
lb_addr.prototype.constructor = lb_addr;

function short_ad(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 8);

    AddPropUint32(this, "ExtentLength", this.buffer, this.offset);
    AddPropUint32(this, "ExtentPosition", this.buffer, this.offset + 4);
}
short_ad.prototype = Object.create(UdfStruct.prototype);
short_ad.prototype.constructor = short_ad;
short_ad.prototype.ptr = function(index) {
    "use strict";
    var sad = new short_ad(this.buffer, this.offset + index * 8);
    return sad;
};

function long_ad(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 16);

    AddPropUint32(this, "ExtentLength", this.buffer, this.offset);
    this.ExtentLocation = new lb_addr(this.buffer, this.offset + 4);
    AddPropArray(this, "ImplementationUse", this.buffer, this.offset + 10, 6);
}
long_ad.prototype = Object.create(UdfStruct.prototype);
long_ad.prototype.constructor = long_ad;

function extent_ad(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 8);

    AddPropUint32(this, "ExtentLength", this.buffer, this.offset);
    AddPropUint32(this, "ExtentLocation", this.buffer, this.offset + 4);
}
extent_ad.prototype = Object.create(UdfStruct.prototype);
extent_ad.prototype.constructor = extent_ad;

function regid(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 32);

    AddPropUint8(this, "Flags", this.buffer, this.offset);
    AddPropArray(this, "Identifier", this.buffer, this.offset + 1, 23);
    AddPropArray(this, "IdentifierSuffix", this.buffer, this.offset + 24, 8);
}
regid.prototype = Object.create(UdfStruct.prototype);
regid.prototype.constructor = regid;

function timestamp(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 12);

    AddPropUint16(this, "TypeAndTimeZone", this.buffer, this.offset);
    AddPropUint16(this, "Year", this.buffer, this.offset + 2);
    AddPropUint8(this, "Month", this.buffer, this.offset + 4);
    AddPropUint8(this, "Day", this.buffer, this.offset + 5);
    AddPropUint8(this, "Hour", this.buffer, this.offset + 6);
    AddPropUint8(this, "Minute", this.buffer, this.offset + 7);
    AddPropUint8(this, "Second", this.buffer, this.offset + 8);
    AddPropUint8(this, "Centiseconds", this.buffer, this.offset + 9);
    AddPropUint8(this, "HundredsOfMicroseconds", this.buffer, this.offset + 10);
    AddPropUint8(this, "Microseconds", this.buffer, this.ffset + 11);
}
timestamp.prototype = Object.create(UdfStruct.prototype);
timestamp.prototype.constructor = timestamp;

function tag(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 16);

    AddPropUint16(this, "TagIdentifier", this.buffer, this.offset);
    AddPropUint16(this, "DescriptorVersion", this.buffer, this.offset + 2);
    AddPropUint8(this, "TagChecksum", this.buffer, this.offset + 4);
    AddPropUint8(this, "Reserved", this.buffer, this.offset + 4);
    AddPropUint16(this, "TagSerialNumber", this.buffer, this.offset + 6);
    AddPropUint16(this, "DescriptorCRC", this.buffer, this.offset + 8);
    AddPropUint16(this, "DescriptorCRCLength", this.buffer, this.offset + 10);
    AddPropUint32(this, "TagLocation", this.buffer, this.offset + 12);
}
tag.prototype = Object.create(UdfStruct.prototype);
tag.prototype.constructor = tag;

function icbtag(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 20);

    AddPropUint32(this, "PriorRecordedNumberOfDirectEntries", this.buffer, this.offset);
    AddPropUint16(this, "StrategyType", this.buffer, this.offset + 4);
    AddPropUint16(this, "StrategyParameter", this.buffer, this.offset + 6);
    AddPropUint16(this, "MaximumNumberOfEntries", this.buffer, this.offset + 8);
    AddPropUint8(this, "Reserved", this.buffer, this.offset + 10);
    AddPropUint8(this, "FileType", this.buffer, this.offset + 11);
    this.ParentICBLocation = new lb_addr(this.buffer, this.offset + 12);
    AddPropUint16(this, "Flags", this.buffer, this.offset + 18);
}
icbtag.prototype = Object.create(UdfStruct.prototype);
icbtag.prototype.constructor = icbtag;

function PrimaryVolumeDescriptor(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 512);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    AddPropUint32(this, "VolumeDescriptorSequenceNumber", this.buffer, this.offset + 16);
    AddPropUint32(this, "PrimaryVolumeDescriptorNumber", this.buffer, this.offset + 20);
    this.VolumeIdentifier = new UdfString(this.buffer, this.offset + 24, 32);
    AddPropUint16(this, "VolumeSequenceNumber", this.buffer, this.offset + 56);
    AddPropUint16(this, "MaximumVolumeSequenceNumber", this.buffer, this.offset + 58);
    AddPropUint16(this, "InterchangeLevel", this.buffer, this.offset + 60);
    AddPropUint16(this, "MaximumInterchangeLevel", this.buffer, this.offset + 62);
    AddPropUint32(this, "CharacterSetList", this.buffer, this.offset + 64);
    AddPropUint32(this, "MaximumCharacterSetList", this.buffer, this.offset + 68);
    this.VolumeSetIdentifier = new UdfString(this.buffer, this.offset + 72, 128);
    this.DescriptorCharacterSet = new charspec(this.buffer, this.offset + 200);
    this.ExplanatoryCharacterSet = new charspec(this.buffer, this.offset + 264);
    this.VolumeAbstract = new extent_ad(this.buffer, this.offset + 328);
    this.VolumeCopyrightNotice = new extent_ad(this.buffer, this.offset + 336);
    this.ApplicationIdentifier = new regid(this.buffer, this.offset + 344);
    this.RecordingDateAndTime = new timestamp(this.buffer, this.offset + 376);
    this.ImplementationIdentifier = new regid(this.buffer, this.offset + 388);
    AddPropArray(this, "ImplementationUse", this.buffer, this.offset + 420, 64);
    AddPropUint32(this, "PredecessorVolumeDescriptorSequenceLocation", this.buffer, this.offset + 484);
    AddPropUint16(this, "Flags", this.buffer, this.offset + 488);
    AddPropArray(this, "Reserved", this.buffer, this.offset + 490, 22);
}
PrimaryVolumeDescriptor.prototype = Object.create(UdfStruct.prototype);
PrimaryVolumeDescriptor.prototype.constructor = PrimaryVolumeDescriptor;

function AnchorVolumeDescriptorPointer(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 512);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    this.MainVolumeDescriptorSequenceExtent = new extent_ad(this.buffer, this.offset + 16);
    this.ReserveVolumeDescriptorSequenceExtent = new extent_ad(this.buffer, this.offset + 24);
    AddPropArray(this, "Reserved", this.buffer, this.offset + 32, 480);
}
AnchorVolumeDescriptorPointer.prototype = Object.create(UdfStruct.prototype);
AnchorVolumeDescriptorPointer.prototype.constructor = AnchorVolumeDescriptorPointer;

function ImplementationUseVolumeDescriptor(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 512);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    AddPropUint32(this, "VolumeDescriptorSequenceNumber", this.buffer, this.offset + 16);
    this.ImplementationIdentifier = new regid(this.buffer, this.offset + 20);
    this.ImplementationUse = new IuvdImplementationUse(this.buffer, this.offset + 52);
}
ImplementationUseVolumeDescriptor.prototype = Object.create(UdfStruct.prototype);
ImplementationUseVolumeDescriptor.prototype.constructor = ImplementationUseVolumeDescriptor;

function IuvdImplementationUse(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 460);

    this.LVICharset = new charspec(this.buffer, this.offset);
    this.LogicalVolumeIdentifier = new UdfString(this.buffer, this.offset + 64, 128);
    this.LVInfo1 = new UdfString(this.buffer, this.offset + 192, 36);
    this.LVInfo2 = new UdfString(this.buffer, this.offset + 228, 36);
    this.LVInfo3 = new UdfString(this.buffer, this.offset + 264, 36);
    this.ImplementionID = new regid(this.buffer, this.offset + 300);
    AddPropArray(this, "ImplementationUse", this.buffer, this.offset + 332, 128);
};
IuvdImplementationUse.prototype = Object.create(UdfStruct.prototype);
IuvdImplementationUse.prototype.constructor = IuvdImplementationUse;

function PartitionDescriptor(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 512);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    AddPropUint32(this, "VolumeDescriptorSequenceNumber", this.buffer, this.offset + 16);
    AddPropUint16(this, "PartitionFlags", this.buffer, this.offset + 20);
    AddPropUint16(this, "PartitionNumber", this.buffer, this.offset + 22);
    this.PartitionContents = new regid(this.buffer, this.offset + 24);
    this.PartitionContentsUse = new PartitionHeaderDescriptor(this.buffer, this.offset + 56);
    AddPropUint32(this, "AccessType", this.buffer, this.offset + 184);
    AddPropUint32(this, "PartitionStartingLocation", this.buffer, this.offset + 188);
    AddPropUint32(this, "PartitionLength", this.buffer, this.offset + 192);
    this.ImplementationIdentifier = new regid(this.buffer, this.offset + 196);
    AddPropArray(this, "ImplementationUse", this.buffer, this.offset + 228, 128);
    AddPropArray(this, "Reserved", this.buffer, this.offset + 356, 156);
}
PartitionDescriptor.prototype = Object.create(UdfStruct.prototype);
PartitionDescriptor.prototype.constructor = PartitionDescriptor;

function PartitionHeaderDescriptor(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 128);

    this.UnallocatedSpaceTable = new short_ad(this.buffer, this.offset);
    this.UnallocatedSpaceBitmap = new short_ad(this.buffer, this.offset + 8);
    this.PartitionIntegrityTable = new short_ad(this.buffer, this.offset + 16);
    this.FreedSpaceTable = new short_ad(this.buffer, this.offset + 24);
    this.FreedSpaceBitmap = new short_ad(this.buffer, this.offset + 32);
    AddPropArray(this, "Reserved", this.buffer, this.offset + 40, 88);
}
PartitionHeaderDescriptor.prototype = Object.create(UdfStruct.prototype);
PartitionHeaderDescriptor.prototype.constructor = PartitionHeaderDescriptor;

function LogicalVolumeDescriptor(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 446);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    AddPropUint32(this, "VolumeDescriptorSequenceNumber", this.buffer, this.offset + 16);
    this.DescriptorCharacterSet = new charspec(this.buffer, this.offset + 20);
    this.LogicalVolumeIdentifier = new UdfString(this.buffer, this.offset + 84, 128);
    AddPropUint32(this, "LogicalBlockSize", this.buffer, this.offset + 212);
    this.DomainIdentifier = new regid(this.buffer, this.offset + 216);
    AddPropArray(this, "LogicalVolumeContentsUse", this.buffer, this.offset + 248, 16);
    AddPropUint32(this, "MapTableLength", this.buffer, this.offset + 264);
    AddPropUint32(this, "NumberOfPartitionMaps", this.buffer, this.offset + 268);
    this.ImplementationIdentifier = new regid(this.buffer, this.offset + 272);
    AddPropArray(this, "ImplementationUse", this.buffer, this.offset + 304, 128);
    this.IntegritySequenceExtent = new extent_ad(this.buffer, this.offset + 432);
    AddPropArray(this, "PartitionMaps", this.buffer, this.offset + 440, 6);
}
LogicalVolumeDescriptor.prototype = Object.create(UdfStruct.prototype);
LogicalVolumeDescriptor.prototype.constructor = LogicalVolumeDescriptor;

function UnallocatedSpaceDescriptor(buffer, offset, length) {
    "use strict";
    UdfStruct.call(this, buffer, offset, length);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    AddPropUint32(this, "VolumeDescriptorSequenceNumber", this.buffer, this.offset + 16);
    AddPropUint32(this, "NumberOfAllocationDescriptors", this.buffer, this.offset + 20);
    AddPropArray(this, "AllocationDescriptors", this.buffer, this.offset + 24, length - 24);
}
UnallocatedSpaceDescriptor.prototype = Object.create(UdfStruct.prototype);
UnallocatedSpaceDescriptor.prototype.constructor = UnallocatedSpaceDescriptor;

function LogicalVolumeIntegrityDescriptor(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 134);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    this.RecordingDateAndTime = new timestamp(this.buffer, this.offset + 16);
    AddPropUint32(this, "IntegrityType", this.buffer, this.offset + 28);
    this.NextIntegrityExtent = new extent_ad(this.buffer, this.offset + 32);
    AddPropArray(this, "LogicalVolumeContentsUse", this.buffer, this.offset + 40, 32);
    AddPropUint32(this, "NumberOfPartitions", this.buffer, this.offset + 72);
    AddPropUint32(this, "LengthOfImplementationUse", this.buffer, this.offset + 76);
    AddPropUint32(this, "FreeSpaceTable", this.buffer, this.offset + 80);
    AddPropUint32(this, "SizeTable", this.buffer, this.offset + 84);
    this.ImplementationUse = new LvidImplementationUse(this.buffer, this.offset + 88);
}
LogicalVolumeIntegrityDescriptor.prototype = Object.create(UdfStruct.prototype);
LogicalVolumeIntegrityDescriptor.prototype.constructor = LogicalVolumeIntegrityDescriptor;

function LvidImplementationUse(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 46);

    this.ImplementationID = new regid(this.buffer, this.offset);
    AddPropUint32(this, "NumberOfFiles", this.buffer, this.offset + 32);
    AddPropUint32(this, "NumberOfDirectories", this.buffer, this.offset + 36);
    AddPropUint16(this, "MinimumUDFReadRevision", this.buffer, this.offset + 40);
    AddPropUint16(this, "MinimumUDFWriteRevision", this.buffer, this.offset + 42);
    AddPropUint16(this, "MaximumUDFWriteRevision", this.buffer, this.offset + 44);
    //uint8_t     ImplementationUse[0];
}
LvidImplementationUse.prototype = Object.create(UdfStruct.prototype);
LvidImplementationUse.prototype.constructor = LvidImplementationUse;

function TerminatingDescriptor(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 512);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    AddPropArray(this, "Reserved", this.buffer, this.offset + 16, 496);
}
TerminatingDescriptor.prototype = Object.create(UdfStruct.prototype);
TerminatingDescriptor.prototype.constructor = TerminatingDescriptor;

function SpaceBitmapDescriptor(buffer, offset, blen, lvid) {
    "use strict";
    if (blen == null) {
        throw "NumberOfBytes is invalid";
    }

    UdfStruct.call(this, buffer, offset, 24);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    AddPropUint32(this, "NumberOfBits", this.buffer, this.offset + 16);
    AddPropUint32(this, "NumberOfBytes", this.buffer, this.offset + 20);

    this.length = 24 + blen;
    this.lvid = lvid;
}
SpaceBitmapDescriptor.prototype = Object.create(UdfStruct.prototype);
SpaceBitmapDescriptor.prototype.constructor = SpaceBitmapDescriptor;
SpaceBitmapDescriptor.prototype.readBlocks = function(buffer, offset, length) {
    "use strict";
    var free = this.lvid.FreeSpaceTable;
    var zbits = this.NumberOfBits - free;
    var zbytes = Math.trunc(zbits / 8);
    var chaos = -1;
    var boffset = 0;

    if ((zbits % 8) != 0) {
        chaos = zbytes;
    }

    buffer.fill(0xFF);
    if (offset == 0) {
        buffer.set(this.buffer.slice(this.offset, this.offset + 24));
        length -= 24;
        boffset = 24;
    } else {
        offset -= 24;
    }

    if (chaos < 0) {
        for (var index = 0; index < length; index++) {
            if (index + offset < zbytes) {
                buffer[index + boffset] = 0;
            } else {
                buffer[index + boffset] = 0xFF;
            }
        }
    } else {
        for (var index = 0; index < length; index++) {
            if (index + offset == zbytes) {
                for (var blocks = zbits % 8 ; blocks > 0; blocks--) {
                    buffer[index + boffset] &= ~(1 << ((blocks - 1) % 8));
                }
            } else if (index + offset < zbytes) {
                buffer[index + boffset] = 0;
            } else {
                buffer[index + boffset] = 0xFF;
            }
        }
    }
};

function FileSetDescriptor(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 512);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    this.RecordingDateAndTime = new timestamp(this.buffer, this.offset + 16);
    AddPropUint16(this, "InterchangeLevel", this.buffer, this.offset + 28);
    AddPropUint16(this, "MaximumInterchangeLevel", this.buffer, this.offset + 30);
    AddPropUint32(this, "CharacterSetList", this.buffer, this.offset + 32);
    AddPropUint32(this, "MaximumCharacterSetList", this.buffer, this.offset + 36);
    AddPropUint32(this, "FileSetNumber", this.buffer, this.offset + 40);
    AddPropUint32(this, "FileSetDescriptorNumber", this.buffer, this.offset + 44);
    this.LogicalVolumeIdentifierCharacterSet = new charspec(this.buffer, this.offset + 48);
    this.LogicalVolumeIdentifier = new UdfString(this.buffer, this.offset + 112, 128);
    this.FileSetCharacterSet = new charspec(this.buffer, this.offset + 240);
    this.FileSetIdentifier = new UdfString(this.buffer, this.offset + 304, 32);
    this.CopyrightFileIdentifier = new UdfString(this.buffer, this.offset + 336, 32);
    this.AbstractFileIdentifier = new UdfString(this.buffer, this.offset + 368, 32);
    this.RootDirectoryICB = new long_ad(this.buffer, this.offset + 400);
    this.DomainIdentifier = new regid(this.buffer, this.offset + 416);
    this.NextExtent = new long_ad(this.buffer, this.offset + 448);
    this.SystemStreamDirectoryICB = new long_ad(this.buffer, this.offset + 464);
    AddPropArray(this, "Reserved", this.buffer, this.offset + 480, 32);
}
FileSetDescriptor.prototype = Object.create(UdfStruct.prototype);
FileSetDescriptor.prototype.constructor = FileSetDescriptor;

function FileEntry(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 176);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    this.ICBTag = new icbtag(this.buffer, this.offset + 16);
    AddPropUint32(this, "Uid", this.buffer, this.offset + 36);
    AddPropUint32(this, "Gid", this.buffer, this.offset + 40);
    AddPropUint32(this, "Permissions", this.buffer, this.offset + 44);
    AddPropUint16(this, "FileLinkCount", this.buffer, this.offset + 48);
    AddPropUint8(this, "RecordFormat", this.buffer, offset + 50);
    AddPropUint8(this, "RecordDisplayAttributes", this.buffer, offset + 51);
    AddPropUint32(this, "RecordLength", this.buffer, this.offset + 52);
    AddPropUint64(this, "InformationLength", this.buffer, this.offset + 56);
    AddPropUint64(this, "LogicalBlocksRecorded", this.buffer, this.offset + 64);
    this.AccessDateAndTime = new timestamp(this.buffer, this.offset + 72);
    this.ModificationDateAndTime = new timestamp(this.buffer, this.offset + 84);
    this.AttributeDateAndTime = new timestamp(this.buffer, this.offset + 96);
    AddPropUint32(this, "Checkpoint", this.buffer, this.offset + 108);
    this.ExtendedAttributeICB = new long_ad(this.buffer, this.offset + 112);
    this.ImplementationIdentifier = new regid(this.buffer, this.offset + 128);
    AddPropUint64(this, "UniqueId", this.buffer, this.offset + 160);
    AddPropUint32(this, "LengthOfExtendedAttributes", this.buffer, this.offset + 168);
    AddPropUint32(this, "LengthOfAllocationDescriptors", this.buffer, this.offset + 172);
    AddPropArray(this, "ExtendedAttributes", this.buffer, this.offset + 176, this.LengthOfExtendedAttributes);
    AddPropArray(this, "AllocationDescriptors", this.buffer, this.offset + 176 + this.LengthOfExtendedAttributes,
                 this.LengthOfAllocationDescriptors);
}
FileEntry.prototype = Object.create(UdfStruct.prototype);
FileEntry.prototype.constructor = FileEntry;

function FileIdentifierDescriptor(buffer, offset, length) {
    "use strict";
    if (length == null) {
        throw "Invalid FID length";
    }

    UdfStruct.call(this, buffer, offset, length);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    AddPropUint16(this, "FileVersionNumber", this.buffer, this.offset + 16);
    AddPropUint8(this, "FileCharacteristics", this.buffer, offset + 18);
    AddPropUint8(this, "LengthOfFileIdentifier", this.buffer, offset + 19);
    this.ICB = new long_ad(this.buffer, this.offset + 20);
    AddPropUint16(this, "LengthOfImplementationUse", this.buffer, this.offset + 36);
    AddPropArray(this, "ImplementationUse", this.buffer, this.offset + 38, this.LengthOfImplementationUse);
    this.FileIdentifier = new UdfString(this.buffer, this.offset + 38 + this.LengthOfImplementationUse, this.LengthOfFileIdentifier);
    AddPropArray(this, "Padding", this.buffer, this.offset + 38 + this.LengthOfImplementationUse + this.LengthOfFileIdentifier,
                 length - (this.offset + 38 + this.LengthOfImplementationUse + this.LengthOfFileIdentifier));
}
FileIdentifierDescriptor.prototype = Object.create(UdfStruct.prototype);
FileIdentifierDescriptor.prototype.constructor = FileIdentifierDescriptor;

function AllocationExtentDescriptor(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 24);

    this.DescriptorTag = new tag(this.buffer, this.offset);
    AddPropUint32(this, "PreviousAllocationExtentLocation", this.buffer, this.offset + 16);
    AddPropUint32(this, "LengthOfAllocationDescriptors", this.buffer, this.offset + 20);
}
AllocationExtentDescriptor.prototype = Object.create(UdfStruct.prototype);
AllocationExtentDescriptor.prototype.constructor = AllocationExtentDescriptor;

function ADImpUse(buffer, offset) {
    "use strict";
    UdfStruct.call(this, buffer, offset, 6);

    AddPropUint16(this, "Flags", this.buffer, this.offset);
    AddPropArray(this, "ImpUse", this.buffer, this.offset + 2, 4);
};
ADImpUse.prototype = Object.create(UdfStruct.prototype);
ADImpUse.prototype.constructor = ADImpUse;

function UdfVfile(path, offset, length) {
    "use strict";
    UdfStruct.call(this, null, 0, 0);

    this.path = path;
    this.offset = offset;
    this.length = length;
}
UdfVfile.prototype = Object.create(UdfStruct.prototype);
UdfVfile.prototype.constructor = UdfVfile;
