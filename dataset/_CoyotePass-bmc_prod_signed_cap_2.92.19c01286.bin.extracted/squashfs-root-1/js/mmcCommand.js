"use strict";
const commandHandler = {
    "iso": isoCommand,
    "img": imgCommand
}

self.addEventListener('message', function(e) {
    "use strict";
    if (true) {
        console.log = () => {};
    }

    var args = e.data;
    let fileType = args[6];

    args[4] = commandHandler[fileType](args[0], args[1], args[2], args[3], args[4], args[5]);

    // Return respData and dataLength
    postMessage([args[3], args[4]]);
}, false);

function isoCommand(fp, pCDB, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    switch(pCDB[0]) {
        case 0x46:
            GetConfig(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0xa7:
            SetReadAhead(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x03:
            RequestSense(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x12:
            Inquiry(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0xbd:
            MachanismStatus(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x1b:
            Startstopunit(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x5a:
            ModeSense(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x4a:
            GetEventStatus(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x00:
            TestUnitReady(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x52:
            ReadTrackInfo(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x1e:
            MediumRemoval(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0xbb:
            SetCDSpeed(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0xb6:
            SetStream(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x43:
            ReadToc(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0xa4:
            ReportKey(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x01:
            Test(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x28:
            Read10(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0xbe:
            ReadCD(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0xad:
            ReadDiscStructure(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x23:
            ReadFormatCapacities(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x5c:
            ReadBufferCapacity(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x25:
            ReadCapacity(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x51:
            ReadDiscInformation(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0x3c:
            ReadBuffer(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0xab:
            ReadMediaSerialNumber(fp, pCDB, cmdLength, resp_data, dataLength, SenInF);
            break;
        case 0xa8:
            Read12(fp,pCDB,cmdLength,resp_data,dataLength,SenInF);
            break;
        default:
            dataLength.value = 0;
            break;
    }

    return dataLength;
}

function ArrayCopy(dst, doffset, src, soffset, size) {
    for (var index = 0; index < size; index++) {
        dst[index + doffset] = src[index + soffset];
    }
}

function imgCommand(file, cdb, cmdLength, respData, sectorSize, sensecode) {
    const LENGTH_PDU_TAG = 8;
    let return_data_length = 0;

    //Virtual Floppy Resp Data
    // /VM_Lib/VM_Lib_Agent/Func_Cfg_Tables/DefaultFunc/OS/OS_Indep_Default_Func.c
    var ab_vf_ReqSense =
        new Uint8Array([0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0A, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);

    var ab_vf_Inquary =
        new Uint8Array([0x00, 0x80, 0x00, 0x01, 0x1F, 0x00, 0x00, 0x00, 0x47, 0x45, 0x4E,
        0x45, 0x52, 0x49, 0x43, 0x20, 0x56, 0x69, 0x72, 0x74, 0x75, 0x61, 0x6C,
        0x20, 0x46, 0x6C, 0x6F,
        0x70, 0x70, 0x79, 0x20, 0x20, 0x33, 0x30, 0x30, 0x30
    ]);
    var ab_vf_ReadCap = new Uint8Array([0x00, 0x00, 0x0b, 0x3f, 0x00, 0x00, 0x02, 0x00]);

    var ab_vf_ReadFormatCap = new Uint8Array([
        0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x0b, 0x40, 0x02, 0x00, 0x02,
        0x00, 0x00, 0x00, 0x0b, 0x40, 0x00, 0x00,
        0x02, 0x00, 0x00, 0x00, 0x04, 0xd0, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00,
        0x09, 0x60, 0x00, 0x00, 0x02, 0x00
    ]);

    var ab_vf_ModeSense = new Uint8Array([
        0x26, 0x94, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x1E, 0x01, 0xF4,
        0x02, 0x12, 0x02, 0x00, 0x00, 0x50
    ]);

    var ab_vf_ModeSense6 = new Uint8Array([
        0x03, 0x00, 0x00, 0x00
    ]);

    var ab_vf_ModeSense10 = new Uint8Array([
        0x00, 0x26, 0x94, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x1E, 0x01,
        0xF4, 0x02, 0x12, 0x02, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x05,
        0x1E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x2C, 0x00, 0x0
    ]);

    console.log(`imgCommand: cdb[0] = 0x${cdb[0].toString(16)}`);

    switch (cdb[0]) {
    case 0x2a:
        break;
    case 0x28:
        let vf_offset = ((cdb[2] << 24) | (cdb[3] << 16) | (cdb[4] << 8) | cdb[5]);
        let fs_offset = vf_offset * 512;
        let offset = 0;

        while (Math.floor(fs_offset / 0x7FFFFFFF)) {
            offset = offset + 0x7FFFFFFF;
            fs_offset -= 0x7FFFFFFF;
        }

        offset = offset + (fs_offset % 0x7FFFFFFF);


        let reader = new FileReaderSync();
        let fileBuffer = new Uint8Array(reader.readAsArrayBuffer(file.slice(offset, offset + sectorSize)));
        respData.set(fileBuffer);
        return_data_length = sectorSize;

        break;


    case 0x03:                 //Request Sense
        return_data_length = 18;
        ArrayCopy(respData, LENGTH_PDU_TAG, ab_vf_ReqSense, 0, return_data_length);
        break;

    case 0x12:                 //Inquiry
        return_data_length = 36;
        ArrayCopy(respData, LENGTH_PDU_TAG, ab_vf_Inquary, 0, return_data_length);
        break;

    case 0x1A:                 //ModeSense
        return_data_length = 4;
        ArrayCopy(respData, LENGTH_PDU_TAG, ab_vf_ModeSense6, 0, return_data_length);
        break;

    case 0x23:                 //Read Format Capacity
        return_data_length = 36;
        ArrayCopy(respData, LENGTH_PDU_TAG, ab_vf_ReadFormatCap, 0, return_data_length);
        break;

    case 0x25:                 //Read Capacity
        return_data_length = 8;
        ArrayCopy(respData, LENGTH_PDU_TAG, ab_vf_ReadCap, 0, return_data_length);
        break;

    case 0x5A:                 //ModeSense(10)
        if(cdb[8] > 40) {
            return_data_length = 40;
        } else {
            return_data_length = cdb[8];
        }
        ArrayCopy(respData, LENGTH_PDU_TAG, ab_vf_ModeSense10, 0, return_data_length);
        break;
    case 0x1E:                 //MEDIA REMOVAL
        sensecode[12] = 0x00;
        //sensecode[13]=0x01;
        sensecode[13] = 0x00;   //for linux text mode issue
        return_data_length = 0;
        break;
    default:
        break;
    }

    return return_data_length;
}

function memset(src, srcIndex, value, length) {
    "use strict";
    var index;
    for (index = 0 ; index < length ; index++) {
        src[srcIndex + index] = value;
    }
}

function StrByteCpy(src, srcIndex, dest, destLen) {
    "use strict";
    var index;
    for (index = 0 ; index < destLen; index++) {
        src[srcIndex + index] = dest.charCodeAt(index);
    }
}

function InvalidFieldCDB(sense_data) {       //INVALID FIELD IN CDB
    "use strict";
    var ni;
    for (ni = 0 ; ni < 30 ; ni++) {
        sense_data[ni]=0;
    }

    sense_data[0]=0x70;        //RESPONDE CODE
    sense_data[2]=0x05;        //SK
    sense_data[7]=0X0a;        //ADDITION SENSE LENGTH
    sense_data[12]=0x24;       //ASC
    sense_data[13]=0x00;       //ASCQ
    return 0;
}

function ParOK(sense_data) {       //PARAMETER OK
    "use strict";
    var ni;
    for (ni = 0 ; ni < 30 ; ni++) {
        sense_data[ni]=0;
    }

    sense_data[0]=0x70;        //RESPONDE CODE
    sense_data[7]=0x0a;        //ADDITION SENSE LENGTH
    return 0;
}

function ErrUnknownMedia(pSense, pLength) {
    "use strict";
    var i;
    for (i = 0 ; i < 18 ; i++) {
        pSense[i]=0x00;
    }
    pSense[0]=0x70;
    pSense[2]=0x05;
    pSense[7]=0xa;
    pSense[12]=0x30;
    pSense[13]=0x02;
    pLength.value=0x00;
}

function ErrInvalidCDB(pSe, pLength) {
    "use strict";
    var i;
    for (i = 0 ; i < 18 ; i++) {
        pSe[i]=0x00;
    }
    pSe[0]=0x70;
    pSe[2]=0x05;
    pSe[7]=0xa;
    pSe[12]=0x24;
    pLength.value=0x00;
}

function ErrIllegalRequest(pSe, pLength) {
    "use strict";
    var i;
    for (i = 0 ; i < 18 ; i++) {
        pSe[i]=0x00;
    }
    pSe[0]=0x70;
    pSe[2]=0x05;
    pSe[7]=0x0a;
    pSe[12]=0x20;
    pLength.value=0x00;
}

function GetConfig(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var i;
    var j;
    var index;
    var alloLength;
    var n;
    //int addLength;

    alloLength = cdb[7];
    alloLength <<= 8;
    alloLength |= cdb[8];

    dataLength.value = 0; //initial datalength
    if (alloLength > 0x0000) {
        for (i = 0 ; i < 200 ; i++) {
            resp_data[i]=0x00;
        }

        resp_data[6]=0x00; //Current Profile (MSB)--CD ROM
        resp_data[7]=0x08; //Current Profile (LSB)--CD ROM

        //n=pCDB[2]<<8+pCDB[3];
        n = cdb[2];
        n <<= 8;
        n |= cdb[3]; //starting feature number

        /*****************************************************/
        dataLength.value = 8;
        j = 8;
        index = n;
        for ( ; index <= 0x010B ; index++) {
            //profile list
            if (index == 0x0000) {
                resp_data[j]=0x00;      //Feature Code (MSB)
                resp_data[++j]=0x00;    //Feature Code (LSB)
                resp_data[++j]=0x03;    //version=0000b,persistent=1b,current=1b
                resp_data[++j]=0x08;    //additon length
                resp_data[++j]=0x00;
                resp_data[++j]=0x10;    //profile dvd :0010
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x08;    //profile cd :0008
                if (fp == null) {
                    resp_data[++j]=0x00;    //no media
                } else {
                    resp_data[++j]=0x01;    //cd active
                }
                resp_data[++j]=0x00;
                ++j;
                //j+=13;
                dataLength.value += 12;
            }

            //Core Featrue
            if (index == 0x0001) {
                resp_data[j]=0x00;      //Feature Code (MSB)
                resp_data[++j]=0x01;    //Feature Code (LSB)
                resp_data[++j]=0x03;
                resp_data[++j]=0x04;    //additon length
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x02;    //SCSI
                ++j;
                //j+=9;
                dataLength.value+=8;
            }

            //Morphing Featrue
            if (index == 0x0002) {
                resp_data[j]=0x00;       //Feature Code (MSB)
                resp_data[++j]=0x02;     //Feature Code (LSB)
                resp_data[++j]=0x07;
                resp_data[++j]=0x04;    //additon length
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                ++j;
                //j+=5;
                dataLength.value+=8;
            }

            //Removable Medium Featrue
            if (index == 0x0003) {
                resp_data[j]=0x00;       //Feature Code (MSB)
                resp_data[++j]=0x03;     //Feature Code (LSB)
                resp_data[++j]=0x03;    //version=0000b,persistent=1b,current=1b
                resp_data[++j]=0x04;    //additon length
                resp_data[++j]=0x29;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                ++j;
                //j+=5;
                dataLength.value+=8;
            }

            //Power Management Featrue
            if (index == 0x0010) {
                resp_data[j]=0x00;       //Feature Code (MSB)
                resp_data[++j]=0x10;     //Feature Code (LSB)
                if (fp == null) {
                    resp_data[++j]=0x00;   //no media
                } else {
                    resp_data[++j]=0x01;   //cd active
                }
                resp_data[++j]=0x08;    //additon length
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x08;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x01;
                resp_data[++j]=0x00;
                ++j;
                //j+=9;
                dataLength.value+=12;
            }

            //Multi-Read Feature
            if (index == 0x001d) {
                resp_data[j]=0x00;       //Feature Code (MSB)
                resp_data[++j]=0x1d;     //Feature Code (LSB)
                if (fp == null) {
                    resp_data[++j]=0x04;   //version=0001b,pesistent=0b,current=0b
                } else {
                    resp_data[++j]=0x01;
                }
                resp_data[++j]=0x00;   //addition length
                ++j;
                //j+=5;
                dataLength.value+=4;
            }

            //CD Read Feature
            if (index == 0x001e) {
                resp_data[j]=0x00;       //Feature Code (MSB)
                resp_data[++j]=0x1e;     //Feature Code (LSB)
                if (fp == null) {
                    resp_data[++j]=0x04;
                } else {
                    resp_data[++j]=0x05;
                }
                resp_data[++j]=0x04;   //addition length
                resp_data[++j]=0x03;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                ++j;
                //j+=5;
                dataLength.value+=8;
            }

            //DVD Read Feature
            if (index == 0x001f) {
                resp_data[j]=0x00;       //Feature Code (MSB)
                resp_data[++j]=0x1f;     //Feature Code (LSB)
                resp_data[++j]=0x00;
                resp_data[++j]=0x04;   //addition length
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x01;
                resp_data[++j]=0x00;
                ++j;
                //j+=5;
                dataLength.value+=8;
            }

            // Hareware  Detect Managerment Feature
            if (index == 0x0024) {
                resp_data[j]=0x00;       //Feature Code (MSB)
                resp_data[++j]=0x24;     //Feature Code (LSB)
                resp_data[++j]=0x00;
                resp_data[++j]=0x04;   //addition length
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                ++j;
                //j+=5;
                dataLength.value+=8;
            }

            //DVD+RW Feature
            if (index == 0x002a) {
                resp_data[j]=0x00;       //Feature Code (MSB)
                resp_data[++j]=0x2a;     //Feature Code (LSB)
                resp_data[++j]=0x00;
                resp_data[++j]=0x04;   //addition length
                resp_data[++j]=0x00;
                resp_data[++j]=0x01;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                ++j;
                //j+=5;
                dataLength.value+=8;
            }

            //DVD+R Feature
            if (index == 0x002b) {
                resp_data[j]=0x00;       //Feature Code (MSB)
                resp_data[++j]=0x2b;     //Feature Code (LSB)
                resp_data[++j]=0x00;
                resp_data[++j]=0x04;   //addition length
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                ++j;
                //j+=5;
                dataLength.value+=8;
            }

            //DVD+R DualLayer Feature
            if (index == 0x003b) {
                resp_data[j]=0x00;       //Feature Code (MSB)
                resp_data[++j]=0x3b;     //Feature Code (LSB)
                resp_data[++j]=0x00;
                resp_data[++j]=0x04;   //addition length
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                ++j;
                //j+=5;
                dataLength.value+=8;
            }

            //Power Management Featrue
            if (index == 0x0100) {
                resp_data[j]=0x01;       //Feature Code (MSB)
                resp_data[++j]=0x00;     //Feature Code (LSB)
                resp_data[++j]=0x03;
                resp_data[++j]=0x00;   //addition length
                ++j;
                dataLength.value+=4;
            }

            //
            if (index == 0x0103) {
                resp_data[j]=0x01;       //Feature Code (MSB)
                resp_data[++j]=0x03;     //Feature Code (LSB)
                resp_data[++j]=0x00;
                resp_data[++j]=0x04;   //addition length
                resp_data[++j]=0x07;
                resp_data[++j]=0x00;
                resp_data[++j]=0x01;
                resp_data[++j]=0x00;
                ++j;
                dataLength.value+=8;
            }

            //Microcode Update Feature
            if (index == 0x0104) {
                resp_data[j]=0x01;       //Feature Code (MSB)
                resp_data[++j]=0x04;     //Feature Code (LSB)
                resp_data[++j]=0x03;
                resp_data[++j]=0x00;   //addition length
                ++j;
                dataLength.value+=4;
            }

            //Timeout Feature
            if (index == 0x0105) {
                resp_data[j]=0x01;       //Feature Code (MSB)
                resp_data[++j]=0x05;     //Feature Code (LSB)
                resp_data[++j]=0x07;
                resp_data[++j]=0x04;     //addition length
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                ++j;
                dataLength.value+=8;
            }

            // DVD CSS Feature
            if (index == 0x0106) {
                resp_data[j]=0x01;       //Feature Code (MSB)
                resp_data[++j]=0x06;     //Feature Code (LSB)
                resp_data[++j]=0x00;
                resp_data[++j]=0x04;     //addition length
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x01;
                ++j;
                dataLength.value+=8;
            }

            //Real Time Stream Feature
            if (index == 0x0107) {
                resp_data[j]=0x01;       //Feature Code (MSB)
                resp_data[++j]=0x07;     //Feature Code (LSB)
                resp_data[++j]=0xc0;     //version=0100b,pesistent=0b,current=0b
                resp_data[++j]=0x04;     //addition length
                resp_data[++j]=0x08;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                ++j;
                dataLength.value+=8;
            }

            //DVD CPRM Feature
            if (index == 0x010b) {
                resp_data[j]=0x01;       //Feature Code (MSB)
                resp_data[++j]=0x0b;     //Feature Code (LSB)
                resp_data[++j]=0x00;     //version=0100b,pesistent=0b,current=0b
                resp_data[++j]=0x04;     //addition length
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x00;
                resp_data[++j]=0x01;
                ++j;
                dataLength.value+=8;
            }
        }//end of for

        resp_data[3] = (dataLength.value - 4);

        if (alloLength < dataLength.value) {
            if (alloLength < 8) {
                if (alloLength % 2 == 0) {       //even
                    dataLength.value = alloLength;
                } else {                         //odd number
                    dataLength.value = alloLength + 1;
                }
            }
        }

        if (alloLength < dataLength.value) {
            dataLength.value = alloLength;
        }

        ParOK(SenInF);
    } else { //no respond data
        dataLength.value=0;
        InvalidFieldCDB(SenInF);
    }
}

function SetReadAhead(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var n2, n3, n4, n5, n6, n7, n8, n9, TriggerLBA, ReadAheadLBA;

    dataLength.value = 0;
    n2 = cdb[2];
    n3 = cdb[3];
    n4 = cdb[4];
    n5 = cdb[5];
    n2 <<= 24;
    n3 <<= 16;
    n4 <<= 8;

    TriggerLBA = n2 | n3 | n4 | n5;    //Trigger Logical Block Address

    n6 = cdb[6];
    n7 = cdb[7];
    n8 = cdb[8];
    n9 = cdb[9];
    n6 <<= 24;
    n7 <<= 16;
    n8 <<= 8;

    ReadAheadLBA = n6 | n7 | n8 | n9;   //read ahead Logical Block Address

    if (TriggerLBA >= ReadAheadLBA) {
        ParOK(SenInF);
        //data after Trigger LBA and before Read Ahead LBA in cache should be discard
        //Read Ahead Caching restrart from Read Ahead LBA
        //data for both the Trigger LBA and Read Ahead LBA will normally read by the Host
        //data between these address are not read by the Host
    } else {
        InvalidFieldCDB(SenInF);
    }
}

function RequestSense(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var i;
    var n;

    n = cdb[4];

    //respond data
    for (i = 0 ; i <= 17 ; i++) {
        resp_data[i] = SenInF[i];
    }
    //resp_data[0]=0x70;
    //resp_data[2]=0x02;
    //resp_data[7]=0x0a;
    //resp_data[12]=0x04;
    //resp_data[13]=0x01;
    if (n >= 18) {
        dataLength.value = 18;
        //ֻ����ż���respond data
    } else {
        if (n % 2 == 0) { //even
           dataLength.value = n;
        } else {          //odd number
           dataLength.value = n + 1;
        }
    }
    //sense data
    ParOK(SenInF);
}

function Inquiry(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var VDOR_SPECIFIC_IDENTIFIER = "Virtual ISO Driver";
    var PRODUCT_IDENTIFICATION = "DVD-ROM";
    var PRODUCT_REVISION_LEVER = "1.00";
    //unsigned char VENDOR_SPECIFIC[] ={"Insyde Co.,"};
    var a, b, c;
    //unsigned char

    dataLength.value = 0;
    switch(cdb[0]) {
        case 0x12:
            {
                if ((cdb[1] & 0x01) == 0x01) {
                    resp_data[0] = 0x05;
                    if ((cdb[3] == 0x00) && (cdb[4] < 0x04)) {
                        InvalidFieldCDB(SenInF);
                        return;
                    } else if (cdb[2] == 0x83) {
                        resp_data[1]=0x83;
                        resp_data[2]=0;
                        resp_data[3]=VDOR_SPECIFIC_IDENTIFIER.length + 0x04; //
                        resp_data[4]=0x82; //PROTOCOL IDENTIFIER=08H,CODE SET=2H;
                        resp_data[5]=0xA0; //PIV=1H,ASSOCOATION=10H;IDENTIFIER TYPE=0H;
                        resp_data[6]=0;    //RESERVED
                        resp_data[7]=VDOR_SPECIFIC_IDENTIFIER.length; //
                        StrByteCpy(resp_data, 8, VDOR_SPECIFIC_IDENTIFIER, VDOR_SPECIFIC_IDENTIFIER.length);
                        dataLength.value = 8 + VDOR_SPECIFIC_IDENTIFIER.length;
                        a=cdb[3];
                        b=cdb[4];
                        c=a*16*16+b;
                        if (dataLength.value > c) {
                            dataLength.value=c;
                        }
                    } else if(cdb[2]==0x00) {
                        resp_data[1]=0x00;
                        resp_data[2]=0x00;
                        resp_data[3]=0x02;
                        resp_data[4]=0x83;
                        resp_data[5]=0x00;
                        dataLength.value=6;
                        a=cdb[3];
                        b=cdb[4];
                        c=a*16*16+b;
                        if (dataLength.value > c) {
                            dataLength.value=c;
                        }
                    } else {
                        InvalidFieldCDB(SenInF);
                        return;
                    }
                } else if ((cdb[1] & 0x01) == 0x00) {
                    if ((cdb[2] != 0x00) || ((cdb[3] == 0x00) && (cdb[4] < 0x05))) {
                        InvalidFieldCDB(SenInF);
                        return;
                    } else {
                        resp_data[0]=0x05;
                        resp_data[1]=0x80;
                        resp_data[2]=0x00;
                        resp_data[3]=0x31;
                        resp_data[4]=0x5b;
                        resp_data[5]=0x00;
                        resp_data[6]=0x00;
                        resp_data[7]=0x00;
                        resp_data[8]=0x41;//'A'
                        resp_data[9]=0x54;//'T'
                        resp_data[10]=0x45;//'E'
                        resp_data[11]=0x4E;//'N'
                        memset(resp_data, 12, 0x20, 4);
                        StrByteCpy(resp_data, 16, PRODUCT_IDENTIFICATION, PRODUCT_IDENTIFICATION.length);
                        memset(resp_data, 16 + PRODUCT_IDENTIFICATION.length, 0x20, 16 - PRODUCT_IDENTIFICATION.length);

                        StrByteCpy(resp_data, 32, PRODUCT_REVISION_LEVER, 4);

                        dataLength.value=36;
                        a=cdb[3];
                        b=cdb[4];
                        c=a*16*16+b;
                        if (dataLength.value > c) {
                            dataLength.value=c;
                        }
                    }
                } else {
                    InvalidFieldCDB(SenInF);
                    return;
                }
            }
            break;
    }
    ParOK(SenInF);
}

function MachanismStatus(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var chr;
    var Current_LBA=[0x00, 0x05, 0x40, 0];
    var a, b, c;
    var Machanism_state = [0];
    //Current_LBA=0x000540;

    dataLength.value=0;
    if ((cdb[1] || cdb[2] || cdb[3] || cdb[4] || cdb[5] || cdb[6])
        ||
        (cdb[7] || cdb[10] || cdb[11])) {
        SenInF[0]=0x70;
        SenInF[1]=0x00;//Obsolete
        SenInF[2]=0x05;// sense key=05h
        memset(SenInF, 3, 0, 4);//invalid fieldreserved
        SenInF[7]=0x0a;//additional sense length
        memset(SenInF, 8, 0, 4);//command-specific information
        SenInF[12]=0x24; //ASC/ASCQ=24/00
        SenInF[13]=0x00;//FIELD REPLACABLE UNIT CODE
        return;
    } else {
        resp_data[0]=0x00;
        chr=Machanism_state[0];
        chr<<=4;
        resp_data[1]=chr+0x00;
        resp_data[2]=Current_LBA[0];
        resp_data[3]=Current_LBA[1];
        resp_data[4]=Current_LBA[2];
        resp_data[5]=0x00;
        resp_data[6]=0x00;
        resp_data[7]=0x00;
        dataLength.value=8;
        a=cdb[8];
        //a=(cdb[8]&&0x0f)+(cdb[8]&&0xf0)*16;
        b=cdb[9];
        c=a*16*16+b;
        if (dataLength.value > c) {
            dataLength.value=c;
        }
        ParOK(SenInF);
    }//else
}

function Startstopunit(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    dataLength.value=0;
    switch (cdb[0]) {
        case 0x1b: {
                if (((cdb[1] & 0xfe) != 0) || cdb[2] || cdb[3]
                    || cdb[5] || ((cdb[4] & 0xfc) != 0)) {
                    InvalidFieldCDB(SenInF);
                } else if ((cdb[4] & 0x03) == 0x03) {
                    InvalidFieldCDB(SenInF);
                    SenInF[2]=0x06;
                    SenInF[12]=0x28;
                } else if ((SenInF[2] == 0x02) && (SenInF[12] == 0x3a)) {
                    InvalidFieldCDB(SenInF);
                    SenInF[2]=0x02;
                    SenInF[12]=0x3a;
                } else if ((cdb[4] & 0x03) == 0x02) {
                    InvalidFieldCDB(SenInF);
                    SenInF[2]=0x02;
                    SenInF[12]=0x3a;
                } else {
                    InvalidFieldCDB(SenInF);
                }
            }
            break;
    }
}

function IsAllocEnough(cdb, SenInF, dataLength) {
    "use strict";
    var nalloc_length;

    nalloc_length = cdb[7];
    nalloc_length <<= 8;
    nalloc_length = nalloc_length | cdb[8];
    if (dataLength.value > nalloc_length) {
        if (!(nalloc_length % 2)) {
            dataLength.value = nalloc_length;
        } else {
            dataLength.value = nalloc_length+1;
        }
    }
    return 0;
}

function pagecode_01h(cdb, SenInF, dataLength, resp_data) {
    "use strict";
    var ni;

    dataLength.value = 20;
    for (ni = 0 ; ni < dataLength.value ; ni++) {
        resp_data[ni] = 0;
    }

    resp_data[1] = dataLength.value - 2;
    resp_data[9] = dataLength.value - 8 - 2;
    IsAllocEnough(cdb, SenInF, dataLength);
    resp_data[8]=0x01;
    resp_data[11]=0x20;
}

function pagecode_0dh(cdb, SenInF, dataLength, resp_data) {
    "use strict";
    var ni;

    dataLength.value = 16;
    for (ni = 0 ; ni < dataLength.value;ni++) {
        resp_data[ni] = 0;
    }

    resp_data[1]= dataLength.value - 2;
    resp_data[9]= dataLength.value - 8 - 2;
    IsAllocEnough(cdb, SenInF, dataLength);
    resp_data[8] = 0x0d; //page codeΪ0dh
    resp_data[13] = 0x3c;
    resp_data[15] = 0x4b;
}

function pagecode_0eh(cdb, SenInF, dataLength, resp_data) {
    "use strict";
    var ni;

    dataLength.value = 24;
    for (ni = 0 ; ni < dataLength.value ; ni++) {
        resp_data[ni] = 0;
    }

    resp_data[1] = dataLength.value - 2;
    resp_data[9] = dataLength.value - 8 - 2;
    IsAllocEnough(cdb, SenInF, dataLength);
    resp_data[8] = 0x0e; //page codeΪ0eh
    resp_data[10] = 0x04;
    resp_data[16] = 0x01;
    resp_data[17] = resp_data[19] = 0xff;
    resp_data[18] = 0x02;
}

function pagecode_1ah(cdb, SenInF, dataLength, resp_data) { //described in SPC-3 7.4.12
    "use strict";
    var ni;

    dataLength.value=20;
    for (ni = 0 ; ni < dataLength.value ; ni++) {
        resp_data[ni] = 0;
    }

    resp_data[1] = dataLength.value - 2;
    resp_data[9]= dataLength.value - 8 - 2;
    IsAllocEnough(cdb, SenInF, dataLength);
    resp_data[8] = 0x1a; //page codeΪ1ah
    resp_data[11] = 0x03;
    resp_data[14] = 0x04;
    resp_data[15] = 0xb0;
    resp_data[18] = 0x09;
    resp_data[19] = 0x60;
}

function pagecode_1dh(cdb, SenInF, dataLength, resp_data) {
    "use strict";
    var ni;

    dataLength.value=18;
    for(ni = 0 ; ni < dataLength.value ; ni++) {
        resp_data[ni] = 0;
    }

    resp_data[1] = dataLength.value - 2;
    resp_data[9] = dataLength.value - 8 - 2;
    IsAllocEnough(cdb, SenInF, dataLength);
    resp_data[8] = 0x1d;
    resp_data[15] = 0x06;
}

function pagecode_2ah(cdb, SenInF, dataLength, resp_data) {
    "use strict";
    var ni;

    dataLength.value=38;
    for (ni = 0 ; ni < dataLength.value ; ni++) {
        resp_data[ni] = 0;
    }
    resp_data[1] = dataLength.value - 2;
    resp_data[9] = dataLength.value - 8 - 2;
    IsAllocEnough(cdb, SenInF, dataLength);
    resp_data[8] = 0x2a;
    resp_data[10] = 0x3f;
    resp_data[12] = 0x71;
    resp_data[13] = 0x77;
    resp_data[14] = 0x29;
    resp_data[15] = 0x23;
    resp_data[16] = 0x1b;
    resp_data[17] = 0x90;
    resp_data[18] = 0x01;
    resp_data[21] = 0xc6;
    resp_data[22] = 0x1b;
    resp_data[23] = 0x90;
    resp_data[25] = 0x10;
    resp_data[31] = 0x01;
}

function ModeSense(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var chpagecode, chpc_field;
    var ni=0;

    ParOK(SenInF);
    chpc_field = cdb[2] & 0xc0;
    chpagecode = cdb[2] & 0x3F;
    switch (chpc_field) {
        case 0x00:
            switch (chpagecode) {
                case 0x01:
                    pagecode_01h(cdb, SenInF, dataLength, resp_data);
                    if (fp != null) {
                        resp_data[22]=0x1b;
                        resp_data[23]=0x90;
                    }
                    break;
                case 0x0d:
                    pagecode_0dh(cdb, SenInF, dataLength, resp_data);
                    break;
                case 0x0e:
                    pagecode_0eh(cdb, SenInF, dataLength, resp_data);
                    break;
                case 0x1a:
                    pagecode_1ah(cdb, SenInF, dataLength, resp_data);
                    break;
                case 0x1d:
                    pagecode_1dh(cdb, SenInF, dataLength, resp_data);
                    break;
                case 0x2a:
                    pagecode_2ah(cdb, SenInF, dataLength, resp_data);
                    break;
                default:
                    dataLength.value=0;
                    InvalidFieldCDB(SenInF);
                    break;
            }
            break;
        case 0x40:
            switch(chpagecode) {
                case 0x01:
                    pagecode_01h(cdb, SenInF, dataLength, resp_data);
                    resp_data[10]=0x00;
                    resp_data[11]=0x01;
                    break;
                case 0x0d:
                    pagecode_0dh(cdb, SenInF, dataLength, resp_data);
                    resp_data[13]=0x00;
                    resp_data[15]=0x00;
                    break;
                case 0x0e:
                    pagecode_0eh(cdb, SenInF, dataLength, resp_data);
                    resp_data[10]=0x02;
                    resp_data[16]=0x0f;
                    resp_data[18]=0x0f;
                    break;
                case 0x1a:
                    pagecode_1ah(cdb, SenInF, dataLength, resp_data);
                    resp_data[11]=0x00;
                    resp_data[14]=0x00;
                    resp_data[15]=0x00;
                    resp_data[18]=0x00;
                    resp_data[19]=0x00;
                    break;
                case 0x1d:
                    pagecode_1dh(cdb, SenInF, dataLength, resp_data);
                    resp_data[15]=0x00;
                    break;
                case 0x2a:
                    pagecode_2ah(cdb, SenInF, dataLength, resp_data);
                    resp_data[9]=0x18;
                    resp_data[10]=0x00;
                    resp_data[12]=0x00;
                    resp_data[13]=0x00;
                    resp_data[14]=0x00;
                    resp_data[15]=0x00;
                    resp_data[16]=0x00;
                    resp_data[17]=0x00;
                    resp_data[18]=0x00;
                    resp_data[21]=0x00;
                    resp_data[22]=0x00;
                    resp_data[23]=0x00;
                    resp_data[25]=0x00;
                    resp_data[31]=0x00;
                    resp_data[36]=0x03;
                    resp_data[37]=0x08;
                    break;
                default:
                    dataLength.value=0;
                    InvalidFieldCDB(SenInF);
                    break;
            }
            break;
        case 0x80:
            switch(chpagecode) {
                case 0x01:
                    pagecode_01h(cdb, SenInF, dataLength, resp_data);
                    break;
                case 0x0d:
                    pagecode_0dh(cdb, SenInF, dataLength, resp_data);
                    break;
                case 0x0e:
                    pagecode_0eh(cdb, SenInF, dataLength, resp_data);
                    break;
                case 0x1a:
                    pagecode_1ah(cdb, SenInF, dataLength, resp_data);
                    break;
                case 0x1d:
                    pagecode_1dh(cdb, SenInF, dataLength, resp_data);
                    break;
                case 0x2a:
                    pagecode_2ah(cdb, SenInF, dataLength, resp_data);
                    break;
                default:
                    dataLength.value=0;
                    InvalidFieldCDB(SenInF);
                break;
            }
            break;
        case 0xc0:
            dataLength.value=0;   //Medium not present,tray closed.
            for (ni = 0 ; ni < 18 ; ni++) {
                SenInF[ni]=0;
            }
            SenInF[0]=0x70;
            SenInF[2]=0x05;        //Illegal Request
            SenInF[7]=18-8;
            SenInF[12]=0x39;       //SAVING PARAMETERS NOT SUPPORTED
            break;
    }
    if (fp != null) {
        resp_data[2]=0x01;
    } else {
        resp_data[2]=0x70;
    }
}

function getLastOne(chr) {
    "use strict";
    var flag=0;
    var nj;
    var nk=-1;

    for (nj = 0x01 ; nj <= 0x80; ) {
        //printf("%d,%d,%d*",chr,nj,chr&nj);
        nk++;
        if (chr & nj) {
            flag = 1;
            break;
        }
        nj *= 2;
    }
    if (flag) {
        return nk;
    } else {
        return 0;
    }
}

function EventDes(noticlass, resp_data, fp) {
    "use strict";
    switch (noticlass) {
        case 0x01:      //Operational Change Request Notification
            break;
        case 0x04:      //media
            if (fp) {
                resp_data[5]=0x02;
            }
            break;
        case 0x06:      //Device Busy
            break;
        default:
            break;
    }
}

function Zero(pRes, length) {
    "use strict";
    var i;
    for (i = 0 ; i < length ; i++) {
        pRes[i] = 0x00;
    }
}

function GetEventStatus(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var nr1, nr2, ntemp;
    var i = 0;
    var chr1, chr2;

    if (cdb[1] == 0x00) {
        dataLength.value=0;
        InvalidFieldCDB(SenInF);
        return;
    }

    nr1 = cdb[7];
    nr1 <<= 8;
    nr1 = nr1 | cdb[8];
    if (cdb[4]) {
        if (nr1 > 8) {
            dataLength.value=8;
	} else {
            if (nr1 % 2) {
                dataLength.value=nr1+1;
            } else {
                dataLength.value=nr1;
                //printf("\n!!!%d!!!\n",*dataLength);
            }
        }

        nr2=6;
    } else {
        dataLength.value=4;
        nr2 = dataLength.value - 2;
    }
    while (i < 8) {
        resp_data[i]=0;
        i++;
    }
    resp_data[3]=0x56;
    ntemp=nr2;
    resp_data[1]=ntemp;
    ntemp=nr2>>8;
    resp_data[0]=ntemp;
    //NEA
    //Notification Class
    if (!cdb[4]) {
        resp_data[2]=0x80;
    } else {
        chr1=cdb[4];
        chr2=getLastOne(chr1);
        resp_data[2]=chr2;
        EventDes(chr2, resp_data, fp);
    }
    ParOK(SenInF);
}

function MediumNotPresent(sense_data) {
    "use strict";
    var ni=0;
    //Medium not present,no tray
    for ( ; ni < 18 ; ni++) {
        sense_data[ni]=0;
    }
    sense_data[0]=0x70;
    sense_data[2]=0x02;
    sense_data[7]=0x0a;
    sense_data[12]=0x3a;
    return 0;
}

function TestUnitReady(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    //int i;
    if (fp) {
        dataLength.value=0;
        ParOK(SenInF);
    } else {
        MediumNotPresent(SenInF);
    }
}

function ReadTrackInfo(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var nAllocLength;
    var ntemp;
    var ni;
    var fileLength, trackSize;
    var nLBA=0;
    var chANT;

    chANT = cdb[1] & 0x03;

    if (!fp) {
        dataLength.value=0;
        MediumNotPresent(SenInF);         //no media,no tray SK/ASC/ASCQ=02H/3ah/00h
        return;
    }

    if (chANT == 0x02 || chANT == 0x03) {
        dataLength.value=0;
        InvalidFieldCDB(SenInF);
        return;
    }
    nLBA = cdb[2];
    nLBA <<= 8;
    nLBA = nLBA | cdb[3];
    nLBA <<= 8;
    nLBA = nLBA | cdb[4];
    nLBA <<= 8;
    nLBA = nLBA | cdb[5];

    //fseek(fp,0,SEEK_END);
    fileLength = fp.size;
    trackSize = fileLength / 2048;

    if (nLBA >= trackSize) {
        dataLength.value = 0;
        InvalidFieldCDB(SenInF);        //logical block address out of range
        return;
    }
    for (ni = 0 ; ni < 48 ; ni++) {
        resp_data[ni]=0;
    }

    nAllocLength = cdb[7];
    nAllocLength <<= 8;
    nAllocLength = nAllocLength | cdb[8];

    dataLength.value=28;
    ntemp = dataLength.value;
    resp_data[1] = ntemp;
    resp_data[0] = ntemp >> 8;
    if (dataLength.value > nAllocLength) {
        if(nAllocLength % 2) {
            dataLength.value = nAllocLength + 1;
        } else {
            dataLength.value = nAllocLength;
        }
    }

    resp_data[2]=0x01;                   //Logical Track Number field,not containing Logical Tracks
    resp_data[3]=0x01;                   //session number field, not containing sessions that contain this track

    resp_data[5]=0x04;
    resp_data[6]=0x01;

    //printf("*%d*",fileLength);

    resp_data[24]=trackSize>>24;
    resp_data[25]=trackSize>>16;
    resp_data[26]=trackSize>>8;
    resp_data[27]=trackSize;

    ParOK(SenInF);
    return;
}

function MediumRemoval(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    //char chcmd0,chcmd1;

    dataLength.value = 0;
    //chcmd0=cdb[4]&0x02;
    //chcmd1=cdb[4]&0x01;

    if (!fp) {
        MediumNotPresent(SenInF);
    } else {
        ParOK(SenInF);
    }
}

function SetCDSpeed(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var ni;
    dataLength.value = 32;
    for (ni = 0 ; ni < dataLength.value ; ni++) {
        resp_data[ni]=0x00;
    }
    ParOK(SenInF);
}

function SetStream(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    dataLength.value = 0;
    ParOK(SenInF);
}

function ReadToc(fp, pCDB, cmdLength, pr, dataLength, SenInF) {
    "use strict";
    //unsigned char *pr=resp_data;
    //unsigned char *pCDB=cdb;
    //unsigned char *pSe=SenInF;
    //int i;
    //unsigned char *pOrgine;
    var Totol;
    //unsigned char f,s,m;
    var MaxLength;
    //unsigned int a=0,*pSecNum=&a;
    var reader;
    var fileBuffer;
    var SecNum;
    var i;

    if (pCDB[2] != 0x00) {
        ErrInvalidCDB(SenInF, dataLength);
        return;
    }
    for (i = 0 ; i < 20 ; i++) {
        pr[i]=0x00;
    }
    pr[1]  = 0x12;
    pr[2]  = 0x01;
    pr[3]  = 0x01;
    pr[5]  = 0x14;
    pr[6]  = 0x01;
    pr[13] = 0x14;
    pr[14] = 0xaa;
    /*fseek(fp,0x8050L,0);
    //pSecNum=new unsigned int;
    if(fread(pSecNum,sizeof(unsigned int),1,fp)>0)
    {
        ;//printf("fread OK\n");
    }
    else
    {
        ;//printf("fread NG\n");
    }*/

    reader = new FileReaderSync();
    fileBuffer = new Uint8Array(reader.readAsArrayBuffer(fp.slice(0x8050, 0x8054)));
    SecNum = fileBuffer[3] * 0x1000000 + fileBuffer[2] * 0x10000
              + fileBuffer[1] * 0x100 + fileBuffer[0];

    if ((pCDB[1] & 0x02) != 0x02) {
        pr[1] = 0xa;
        pr[10] = 0x00;
        dataLength.value = 0x12 + 2;
        //pOrgine=(unsigned char*)pSecNum;
        pr[19] = fileBuffer[0];
        pr[18] = fileBuffer[1];
        pr[17] = fileBuffer[2];
    } else {
        pr[10] = 0x02;
        dataLength.value = 0x12 + 2;

        Totol = SecNum + 150;
        pr[19] = Totol % 75;

        Totol = Totol / 75;
        pr[18] = Totol % 60;

        pr[17] = Totol / 60;
    }

    MaxLength = (pCDB[7] << 8) + pCDB[8];
    if (dataLength.value > MaxLength) {
         dataLength.value = MaxLength;
    }
    ParOK(SenInF);
}

function ReportKey(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
     //unsigned char *pSense=SenInF;
     //unsigned char *pCDB=cdb;
     //int *pLength=dataLength;
    var MaxLength;
    var i;

    for (i = 1 ; i <= 7 ; i++) {
        if (cdb[i] != 0x00) {
            ErrUnknownMedia(SenInF, dataLength);
            return;
        }
    }
    if (cdb[7] == 0x00) {
        if ((cdb[10] & 0x3f) == 0x08) {
            resp_data[0]=0x00;
            resp_data[1]=0x06;
            resp_data[2]=0x00;
            resp_data[3]=0x00;

            resp_data[4]=0x25;
            resp_data[5]=0xff;
            resp_data[6]=0x01;
            resp_data[7]=0x00;

            dataLength.value=8;
        }
    }
    MaxLength = (cdb[8] << 8)+ cdb[9];
    if (dataLength.value > MaxLength) {
         dataLength.value = MaxLength;
    }
    ParOK(SenInF);
}

//test
function Test(fp, pCDB, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var i;
    dataLength.value = 30;
    for (i = 0 ; i < 10 ; i++) {
        resp_data[i] = 0x00;
    }
    ParOK(SenInF);
}

function Read10(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
//#ifdef WIN32
//    #define _fseek _fseeki64
//    #define off_t __int64
//#endif

//#ifdef LINUX
//    #define _fseek fseeko
//    typedef off_t off_t;
    //#define off_t off_t
//#endif

//#ifdef MAC
//    #define _fseek fseeko
//    typedef off_t off_t;
//#endif

    //*dataLength=30;
    //unsigned char *pRes=resp_data;
    //unsigned char *pSense=SenInF;
    //int *pLength=dataLength;
    var startAddrNum = 0;
    var needSectors = 0;
    var reader;
    var fileBuffer;

    if (cdb[1] != 0x00 || cdb[6] != 0x00) {
        ErrInvalidCDB(SenInF, dataLength);
        return;
    }
    startAddrNum = startAddrNum + (cdb[2] << 24);
    startAddrNum = startAddrNum + (cdb[3] << 16);
    startAddrNum = startAddrNum + (cdb[4] << 8);
    startAddrNum = startAddrNum + cdb[5];
    startAddrNum = startAddrNum * 0x800;

    needSectors = needSectors + (cdb[7] << 8);
    needSectors = needSectors + cdb[8];

    /*_fseek(fp,startAddrNum,0);
    if(fread(pRes,0x800L,needSectors,fp)>0)
    {
        ;//printf("fread OK\n");
    }
    else
    {
        ;//printf("fread NG\n");
    }*/
    reader = new FileReaderSync();
    fileBuffer = new Uint8Array(reader.readAsArrayBuffer(
            fp.slice(startAddrNum, startAddrNum + 0x800 * needSectors)));
    resp_data.set(fileBuffer);
    dataLength.value = 0x800 * needSectors;

    ParOK(SenInF);
}

function ReadCD(fp, pCDB, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var i;
    dataLength.value = 30;
    for (i = 0 ; i < 10 ; i++) {
        resp_data[i] = 0x00;
    }
    ParOK(SenInF);
}

function ReadDiscStructure(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    //unsigned char *pCDB=cdb;
    //unsigned char *pRes=resp_data;
    //unsigned char *pchSecNum;
    //unsigned int a=0,*pSecNum=&a;
    var reader;
    var MaxLength;
    var fileReader;
    var fileBuffer;
    var SecNum;
    dataLength.value = 0x00;
    if (!fp) {
        dataLength.value = 0;
        MediumNotPresent(SenInF);
        return;
    }

    switch(cdb[7]) {
        case 0x00:  {
            Zero(resp_data, 2050);
            resp_data[0] = 0x08;
            resp_data[1] = 0x02;
            resp_data[4] = 0x21;
            resp_data[5] = 0x02;
            resp_data[6] = 0x01;
            resp_data[7] = 0x10;

            resp_data[9] = 0x03;
            /*fseek(fp,0x8050L,0);
            //pSecNum=new unsigned int;
            if(fread(pSecNum,sizeof(unsigned int),1,fp)>0)
            {
                ;//printf("fread OK\n");
            }
            else
            {
                ;//printf("fread NG\n");
            }*/
            reader = new FileReaderSync();
            fileBuffer = new Uint8Array(reader.readAsArrayBuffer(fp.slice(0x8050, 0x8054)));
            SecNum = fileBuffer[3] * 0x1000000 + fileBuffer[2] * 0x10000
                     + fileBuffer[1] * 0x100 + fileBuffer[0];


            SecNum += 0x00030000 - 1;

            resp_data[13] = SecNum >> 16;
            resp_data[14] = SecNum >> 8;
            resp_data[15] = SecNum & 0x0000FF;

            dataLength.value = 2052;
            break;
        }
        case 0x01: {
            Zero(resp_data, 8);
            resp_data[1] = 0x06;
            dataLength.value = 8;
            break;
        }
        case 0x04: {
            Zero(resp_data, 2050);
            resp_data[0] = 0x08;
            resp_data[1] = 0x02;
            dataLength.value = 2052;
            break;
        }
        case 0x03: {
            ErrInvalidCDB(SenInF, dataLength);
            break;
        }
        default:
            ErrInvalidCDB(SenInF, dataLength);
            break;
    }

    MaxLength = (cdb[8] << 8) + cdb[9];
    if (dataLength.value > MaxLength) {
        dataLength.value = MaxLength;
    }
    ParOK(SenInF);
}

function ReadFormatCapacities(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    //int i;
    //unsigned char *pRes=resp_data,*pchSector;
    //unsigned char *pCDB=cdb;
    //unsigned int a=0,*pSector=&a;
    var MaxLength;
    var reader;
    var fileBuffer;
    var SecNum;
    var i;
    if (!fp) {
        dataLength.value = 0;
        MediumNotPresent(SenInF);
        return;
    }
    for (i = 1 ; i <= 6 ; i++) {
        if (cdb[i] != 0x00) {
            ErrInvalidCDB(SenInF, dataLength);
            return;
        }
    }

    for (i = 0 ; i < 12 ; i++) {
        resp_data[i] = 0x00;
    }
    /*fseek(fp,0x8050L,0);
    if(fread(pSector,sizeof(unsigned int),1,fp)>0)
    {
        ;//printf("fread OK\n");
    }
    else
    {
        ;//printf("fread NG\n");
    }*/
    reader = new FileReaderSync();
    fileBuffer = new Uint8Array(reader.readAsArrayBuffer(fp.slice(0x8050, 0x8054)));
    SecNum = fileBuffer[3] * 0x1000000 + fileBuffer[2] * 0x10000
             + fileBuffer[1] * 0x100 + fileBuffer[0];

    resp_data[4] = SecNum >> 24;
    resp_data[5] = SecNum >> 16;
    resp_data[6] = SecNum >> 8;
    resp_data[7] = SecNum & 0x000000FF;

    resp_data[3] = 0x08;
    resp_data[8] = 0x02;
    resp_data[10] = 0x08;

    dataLength.value = 12;

    MaxLength = (cdb[7] << 8) + cdb[8];
    if (dataLength.value > MaxLength) {
        dataLength.value = MaxLength;
    }
    ParOK(SenInF);
}

function ReadBufferCapacity(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    if (!fp) {
        dataLength.value = 0;
        MediumNotPresent(SenInF);
        return;
    }
    ErrIllegalRequest(SenInF, dataLength);
    return;
}

function ReadCapacity(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    //int i;
    //unsigned char *pRes=resp_data;
    //unsigned char *pchSector;
    //unsigned int a=0,*pSector=&a;
    var i;
    var reader;
    var fileBuffer;
    var SecNum;

    for (i = 1 ; i <= 8 ; i++) {
        if (cdb[i] != 0x00) {
            ErrInvalidCDB(SenInF, dataLength);
            return;
        }
    }
    if (!fp) {
        dataLength.value = 0;
        MediumNotPresent(SenInF);
        return;
    }
    for (i = 0 ; i < 8 ; i++) {
        resp_data[i] = 0x00;
    }
    /*fseek(fp,0x8050L,0);
    if(fread(pSector,sizeof(unsigned int),1,fp)>0)
    {
        ;//printf("fread OK\n");
    }
    else
    {
        ;//printf("fread NG\n");
    }*/
    reader = new FileReaderSync();
    fileBuffer = new Uint8Array(reader.readAsArrayBuffer(fp.slice(0x8050, 0x8054)));
    SecNum = fileBuffer[3] * 0x1000000 + fileBuffer[2] * 0x10000
             + fileBuffer[1] * 0x100 + fileBuffer[0];

    SecNum--;

    //pchSector=(unsigned char *)pSector;
    resp_data[0] = SecNum >> 24;//pchSector[3];
    resp_data[1] = SecNum >> 16;//pchSector[2];
    resp_data[2] = SecNum >> 8;//pchSector[1];
    resp_data[3] = SecNum & 0x000000FF;//pchSector[0];

    resp_data[6] = 0x08;

    dataLength.value = 0x08;

    ParOK(SenInF);
}

function ReadDiscInformation(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    //unsigned char *pRes=resp_data;
    //unsigned char *pSense=SenInF;
    //unsigned char *pCDB=cdb;
    //int *pLength=dataLength;
    var MaxLength;
    var i;
    if (!fp) {
        dataLength.value = 0;
        MediumNotPresent(SenInF);
        return;
    }
    for (i = 1 ; i <= 6 ; i++) {
        if (cdb[i] != 0x00) {
            ErrInvalidCDB(SenInF, dataLength);
            return;
        }
    }

    Zero(resp_data, 34);

    resp_data[1]=0x20;
    resp_data[2]=0x0e;
    resp_data[3]=0x01;
    resp_data[4]=0x01;
    resp_data[5]=0x01;
    resp_data[6]=0x01;
    resp_data[7]=0x20;

    for (i = 16 ; i < 24 ; i++) {
        resp_data[i] = 0xff;
    }
    dataLength.value = 34;

    MaxLength = (cdb[7] << 8) + cdb[8];
    if (dataLength.value > MaxLength) {
         dataLength.value = MaxLength;
    }
    ParOK(SenInF);
}

function ReadBuffer(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    if(!fp) {
        dataLength.value = 0;
        MediumNotPresent(SenInF);
        return;
    }
    ErrIllegalRequest(SenInF, dataLength);
}

function ReadMediaSerialNumber(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var i;
    if (!fp) {
        dataLength.value = 0;
        MediumNotPresent(SenInF);
        return;
    }
    dataLength.value = 30;
    for (i = 0 ; i < 10 ; i++) {
        resp_data[i] = 0x00;
    }
    ParOK(SenInF);
}

function Read12(fp, cdb, cmdLength, resp_data, dataLength, SenInF) {
    "use strict";
    var i;
    if (!fp) {
        dataLength.value = 0;
        MediumNotPresent(SenInF);
        return;
    }
    dataLength.value = 30;

    for (i = 0 ; i < 10 ; i++) {
        resp_data[i] = 0x00;
    }
    ParOK(SenInF);
}
