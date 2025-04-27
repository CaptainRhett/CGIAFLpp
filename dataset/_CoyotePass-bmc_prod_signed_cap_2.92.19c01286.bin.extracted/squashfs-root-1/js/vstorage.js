"use strict";
var TOTAL_MEDIA_TYPE = 32;
var TOTAL_MEDIA_SET = 7;

var MASK_MEDIA_TYPE_TAG = 0xE0;
var MASK_DEV_NUM = 0x1F;

var REC_DEV_DISABLE = 0x00;
var REC_DEV_TAIL = REC_DEV_DISABLE;

var REC_NO_SELECT_TAG = 0x00;
var REC_PHY_STOR_DEV_TAG = 0x20;
var REC_FILE_STOR_DEV_TAG = 0x40;

var MAX_COUNT_PHY_STOR_DEV = 11;
var MAX_COUNT_FILE_STOR_DEV = 5;

var REC_PHY_STOR_DEV_NUM_USB_FLASH = (0x00 | REC_PHY_STOR_DEV_TAG);
var REC_PHY_STOR_DEV_NUM_USB_FLOPPY = (0x01 | REC_PHY_STOR_DEV_TAG);
var REC_PHY_STOR_DEV_NUM_IDE_FLOPPY = (0x02 | REC_PHY_STOR_DEV_TAG);
var REC_PHY_STOR_DEV_NUM_USB_CDROM = (0x03 | REC_PHY_STOR_DEV_TAG);
var REC_PHY_STOR_DEV_NUM_IDE_CDROM = (0x04 | REC_PHY_STOR_DEV_TAG);
var REC_PHY_STOR_DEV_NUM_SCSI_CDROM = (0x05 | REC_PHY_STOR_DEV_TAG);
var REC_PHY_STOR_DEV_NUM_USB_HD = (0x06 | REC_PHY_STOR_DEV_TAG);
var REC_PHY_STOR_DEV_NUM_IDE_HD = (0x07 | REC_PHY_STOR_DEV_TAG);
var REC_PHY_STOR_DEV_NUM_SCSI_HD = (0x08 | REC_PHY_STOR_DEV_TAG);
var REC_PHY_STOR_DEV_NUM_SATA_HD = (0x09 | REC_PHY_STOR_DEV_TAG);
var REC_PHY_STOR_DEV_NUM_SAS_HD = (0x0A | REC_PHY_STOR_DEV_TAG);

var REC_FILE_STOR_DEV_NUM_ISO = (0x00 | REC_FILE_STOR_DEV_TAG);
var REC_FILE_STOR_DEV_NUM_IMA = (0x01 | REC_FILE_STOR_DEV_TAG);
var REC_FILE_STOR_DEV_NUM_UPLOADIMA = (0x02 | REC_FILE_STOR_DEV_TAG);
var REC_FILE_STOR_DEV_NUM_WEBISO = (0x03 | REC_FILE_STOR_DEV_TAG);
var REC_FILE_STOR_DEV_NUM_FOLDER = (0x04 | REC_FILE_STOR_DEV_TAG);

var DEVICE1 = 0X00;
var DEVICE2 = 0X01;
var DEVICE3 = 0X02;
var DEVICE4 = 0x03;

var HOST_TYPE_NODEFINE = 0x00;
var HOST_TYPE_FLOPPY = 0x01;
var HOST_TYPE_CDROM = 0x02;

var HOST_CMD_SET_NODEFINE = 0x00;
var HOST_CMD_SET_UFI = 0x04;
var HOST_CMD_SET_SFF8070I = 0x05;
var HOST_CMD_SET_SCSI_TRANSPORT = 0x06;

var VM_BEHAVIOR_TYPE_COUNT = 3;
var VM_BEHAVIOR_TYPE_DEFAULT = 0;
var VM_BEHAVIOR_TYPE_BYPASS = 1;
var VM_BEHAVIOR_TYPE_PREMOUNT = 2;

var FW_EXIST_MEDIA_UPLOADIMA = 0x00;
var FW_EXIST_MEDIA_FLPY_IMA = 0x01;
var FW_EXIST_MEDIA_HD_FLASH = 0x02;
var FW_EXIST_MEDIA_CDROM_ISO = 0x03;
var FW_EXIST_MEDIA_WEBISO = 0x04;
var FW_NO_EXIST_MEDIA = 0xFF;

var OFFSET_TOTAL_CONFIG_LENGTH = 2;
var OFFSET_IFNUM = 4;
var OFFSET_DV1_OUT_EP = 22;
var OFFSET_DV1_IN_EP = 29;
var OFFSET_DV1_IF_CLASS = 15;
var OFFSET_DEV_DESP_PID = 10;
var OFFSET_DEV_DESP_VID = 8;

var USB_DEV_VID = 0x0B1F;
var USB_DEV_PID = 0x03EA;
var ONE_DEV_PID = 0X1111;
var TWO_DEV_PID = 0X2222;

var ENCRYPT_RC4 = 0x80;

var SESSION_AUTH_ENABLE = 0x80;

var ENABLE = 1;
var DISABLE = 0;

var VM_MNT_PROCESS_STAGE0 = 0;
var VM_MNT_PROCESS_STAGE1 = 1;

var TCP_IPV4 = 0x00;
var TCP_IPV6 = 0x01;
var TCP_OEM1 = 0x02;
var TCP_OEM2 = 0x03;

var LENGTH_PLUGIN_HEADER = 8;
var LENGTH_MAX_USERNAME = 34;
var LENGTH_MAX_PASSWORD = 34;
var LENGTH_PLUGIN_TIMESTAMP = 4;
var LENGTH_PLUGIN_DEV_NUM = 1;
var LENGTH_PLUGIN_MEDIA_TYPE = 1;
var LENGTH_PLUGIN_RESERVED_1 = 1;
var LENGTH_PLUGIN_RESERVED_2 = 1;

var OFFSET_PLUGIN_HEADER = 0;
var OFFSET_PLUGIN_USERNAME = OFFSET_PLUGIN_HEADER + LENGTH_PLUGIN_HEADER;   // 0 + 8 = 8
var OFFSET_PLUGIN_PASSWORD = OFFSET_PLUGIN_USERNAME + LENGTH_MAX_USERNAME;  // 8 + 34 = 42
var OFFSET_PLUGIN_TIMESTAMP = OFFSET_PLUGIN_PASSWORD + LENGTH_MAX_PASSWORD; // 42 + 34 = 76
var OFFSET_PLUGIN_DEV_NUM = OFFSET_PLUGIN_TIMESTAMP + LENGTH_PLUGIN_TIMESTAMP; // 76 + 4 = 80
var OFFSET_PLUGIN_MEDIA_TYPE = OFFSET_PLUGIN_DEV_NUM + LENGTH_PLUGIN_DEV_NUM;  // 80 + 1 = 81
var OFFSET_PLUGIN_RESERVED_1 = OFFSET_PLUGIN_MEDIA_TYPE + LENGTH_PLUGIN_RESERVED_1; // 81 + 1 = 82
var OFFSET_PLUGIN_RESERVED_2 = OFFSET_PLUGIN_RESERVED_1 + LENGTH_PLUGIN_RESERVED_2; // 82 + 1 =83

var ERR_CODE_INIT = 0xFF;
var ERR_CODE_UNMOUNT = 0x01;
var ERR_CODE_IDECDROM_ERROR = 0x02;

var VM_DEFAULT_PORT = 623;

var LENGTH_PDU_TAG = 8;
var LENGTH_CBW = 0x1F;

var STATE_RX_PDU_TAG = 0x01;
var STATE_RX_CBW = 0x82;
var STATE_TX_KEEP_ALIVE_NOTIFICATION = 0x85;
var STATE_RX_MOUNT_DEV_STATUS = 0x86;
var STATE_RX_BULK_OUT_DATA = 0x87;
var STATE_EXECUTE_CBW = 0x88;

var PDU_TAG_MOUNT_DEV_FLAG = 0x00000002;
var PDU_TAG_KEEP_ALIVE_CMD = 0x00000004;
var PDU_TAG_UNMOUNT_DEV_RESP = 0x00000006;

var BI_ENP_AND_TK_OUT_DV1 = 0x22;

var COMP_AUTHENTICATION_FAIL = 0x01;
var COMP_SYSTEM_BUSY = 0x02
var COMP_PRIVILEGE_ERROR = 0x03;
var COMP_SERVER_VM_DETACH = 0x04;
var COMP_SERVER_IN_FW_UPDATE = 0x05;
var COMP_SESSION_EXPIRE = 0x06;
var PLUGIN_COMP_RESP_OFFSET = 8;

var CBW_OFFSET_DATA_TRANS_LENGTH = 8;
var CBW_OFFSET_CB_LENGTH = 14;
var CBW_OFFSET_BM_FLAGS = 12;
var CBW_OFFSET_CB = 15;
var CBW_OFFSET_CBW_TAG = 4;
var MASK_CBWFLAGS_DATA_DIR = 0X80;

var CSW_STATE_SUCCESS = 0x00;
var CSW_STATE_FAIL = 0x01;

var MEDIA_DATA_IN = 0x01;
var MEDIA_DATA_OUT = 0x00;

var DEVICE_STATUS_RESPONSE_LENGTH = 13;
var DEVICE_STATUS_MIX_DATA_LENGTH = 52;

var st_VSDevConfigDescriptor = [
    {
        DataEnable: 0x00, Maxlength: 0x1E,
        resp: new Uint8Array([0x09, 0x04, 0x00, 0x00, 0x03, 0x08, 0x05, 0x50, 0x00, 0x07, 0x05,
                              0x01, 0x02, 0x00, 0x02, 0xFF, 0x07, 0x05, 0x82, 0x02, 0x00, 0x02,
                              0xFF, 0x07, 0x05, 0x83, 0x03, 0x02, 0x00, 0x01])
    },
    {
        DataEnable: 0x00, Maxlength: 0x1E,
        resp: new Uint8Array([0x09, 0x04, 0x01, 0x00, 0x03, 0x08, 0x05, 0x50, 0x00, 0x07, 0x05,
                              0x01, 0x02, 0x00, 0x02, 0xFF, 0x07, 0x05, 0x82, 0x02, 0x00, 0x02,
                              0xFF, 0x07, 0x05, 0x83, 0x03, 0x02, 0x00, 0x01])
    },
    {
        DataEnable: 0x00, Maxlength: 0x1E,
        resp: new Uint8Array([0x09, 0x04, 0x00, 0x00, 0x03, 0x08, 0x05, 0x50, 0x00, 0x07, 0x05,
                              0x01, 0x02, 0x00, 0x02, 0xFF, 0x07, 0x05, 0x82, 0x02, 0x00, 0x02,
                              0xFF, 0x07, 0x05, 0x83, 0x03, 0x02, 0x00, 0x01])
    },
    {
        DataEnable: 0x00, Maxlength: 0x1E,
        resp: new Uint8Array([0x09, 0x04, 0x00, 0x00, 0x03, 0x08, 0x05, 0x50, 0x00, 0x07, 0x05,
                              0x01, 0x02, 0x00, 0x02, 0xFF, 0x07, 0x05, 0x82, 0x02, 0x00, 0x02,
                              0xFF, 0x07, 0x05, 0x83, 0x03, 0x02, 0x00, 0x01])
    },
    {
        DataEnable: 0x00, Maxlength: 0x19,
        resp: new Uint8Array([0x09, 0x04, 0x02, 0x00, 0x01, 0x03, 0x01, 0x01, 0x00, 0x09, 0x21,
                              0x00, 0x01, 0x00, 0x01, 0x22, 0x40, 0x00, 0x07, 0x05, 0x87, 0x03,
                              0x08, 0x00, 0x0a])
    },
    {
        DataEnable: 0x00, Maxlength: 0x19,
        resp: new Uint8Array([0x09, 0x04, 0x03, 0x00, 0x01, 0x03, 0x01, 0x02, 0x00, 0x09, 0x21,
                              0x00, 0x01, 0x00, 0x01, 0x22, 0x34, 0x00, 0x07, 0x05, 0x86, 0x03,
                              0x04, 0x00, 0x0a])
    }
];

var st_VSIADDescriptor = [
    {
        DataEnable: 0x01,
        resp: new Uint8Array([0x08, 0x0B, 0x00, 0x01, 0x08, 0x06, 0x50, 0x00])
    },
    {
        DataEnable: 0x01,
        resp: new Uint8Array([0x08, 0x0B, 0x01, 0x01, 0x08, 0x06, 0x50, 0x00])
    },
    {
        DataEnable: 0x00,
        resp: new Uint8Array([0x08, 0x0B, 0x02, 0x01, 0x08, 0x06, 0x50, 0x00])
    },
    {
        DataEnable: 0x00,
        resp: new Uint8Array([0x08, 0x0B, 0x03, 0x01, 0x08, 0x06, 0x50, 0x00])
    },
    {
        DataEnable: 0x01,
        resp: new Uint8Array([0x08, 0x0B, 0x02, 0x01, 0x03, 0x01, 0x01, 0x00])
    },
    {
        DataEnable: 0x01,
        resp: new Uint8Array([0x08, 0x0B, 0x03, 0x01, 0x03, 0x01, 0x02, 0x00])
    }
];

var vuDevRespData = [
    {
        bmRequestType: 0x80, bRequest: 0x06, Maxlength: 0x12,
        resp: new Uint8Array([0x12, 0x01, 0x00, 0x02, 0x00, 0x00, 0x00, 0x40, 0xA0, 0x0E, 0x68,
                              0x21, 0x00, 0x02, 0x00, 0x00, 0x00, 0x01])
    },
    {
        bmRequestType: 0x80, bRequest: 0x06, Maxlength: 0x09,
        resp: new Uint8Array([0x09, 0x02, 0x09, 0x00, 0x01, 0x01, 0x00, 0x80, 0x64, 0x09, 0x04,
                              0x00, 0x00, 0x03, 0x08, 0x05, 0x50, 0x00, 0x07, 0x05, 0x01, 0x02,
                              0x00, 0x02, 0xFF, 0x07, 0x05, 0x82, 0x02, 0x00, 0x02, 0xFF, 0x07,
                              0x05, 0x83, 0x03, 0x02, 0x00, 0x01, 0x09, 0x04, 0x01, 0x00, 0x03,
                              0x08, 0x06, 0x50, 0x00, 0x07, 0x05, 0x04, 0x02, 0x00, 0x02, 0xFF,
                              0x07, 0x05, 0x85, 0x02, 0x00, 0x02, 0xFF, 0x07, 0x05, 0x86, 0x03,
                              0x02, 0x00, 0x01])
    },
    {
        bmRequestType: 0x80, bRequest: 0x06, Maxlength: 0x04,
        resp: new Uint8Array([0x04, 0x03, 0x09, 0x04])
    },
    {
        bmRequestType: 0x80, bRequest: 0x06, Maxlength: 0x22,
        resp: new Uint8Array([0x22, 0x03, 0x46, 0x00, 0x6C, 0x00, 0x61, 0x00, 0x73, 0x00, 0x68,
                              0x00, 0x20, 0x00, 0x44, 0x00, 0x69, 0x00, 0x73, 0x00, 0x6B, 0x00,
                              0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20,
                              0x00])
    },
    {
        bmRequestType: 0x80, bRequest: 0x06, Maxlength: 0x22,
        resp: new Uint8Array([0x22, 0x03, 0x34, 0x00, 0x45, 0x00, 0x38, 0x00, 0x46, 0x00, 0x30,
                              0x00, 0x39, 0x00, 0x32, 0x00, 0x43, 0x00, 0x33, 0x00, 0x46, 0x00,
                              0x44, 0x00, 0x37, 0x00, 0x46, 0x00, 0x38, 0x00, 0x46, 0x00, 0x37,
                              0x00])
    },
    {
        bmRequestType: 0x80, bRequest: 0x06, Maxlength: 0x1A,
        resp: new Uint8Array([0x1A, 0x03, 0x53, 0x00, 0x4E, 0x00, 0x30, 0x00, 0x30, 0x00, 0x30,
                              0x00, 0x50, 0x00, 0x51, 0x00, 0x49, 0x00, 0x30, 0x00, 0x30, 0x00,
                              0x39, 0x00, 0x20, 0x00])
    },
    {
        bmRequestType: 0xA1, bRequest: 0xFE, Maxlength: 0x01,
        resp: new Uint8Array([0x00])
    },
    {
        bmRequestType: 0x80, bRequest: 0x06, Maxlength: 0x0a,
        resp: new Uint8Array([0x0a, 0x06, 0x00, 0x02, 0x00, 0x00, 0x00, 0x40, 0x01, 0x00])
    }
];

var ab_ReqSense_success = [
    0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00
];

var client_media_support_table = {
    PhyStorDevTypeID: [REC_DEV_TAIL],
    FileStorDevTypeID: [REC_FILE_STOR_DEV_NUM_ISO, REC_FILE_STOR_DEV_NUM_FOLDER, REC_FILE_STOR_DEV_NUM_IMA, REC_DEV_TAIL]
};

var Linux_FileStorDevRelativeFP_Default = [
    //REC_FILE_STOR_DEV_NUM_ISO
    {
        FunPt_DevCMD: FileStorDevCMDExecuteISO_FixInquiry,
        FunPt_DevOpen: Linux_FileStorDevOpenISO,
        FunPt_DevClose: FileStorDevCloseFile,
        FunPt_DevMount: MtMethod_Media,
        FunPt_DevUnMount: UnMtMethod_Media,
        FunPt_DevCheckFileName: Linux_FileStorDevCheckISOFileName,
        FunPt_DevStoreFileInfo: Linux_StoreFileInfo
    },
    //REC_FILE_STOR_DEV_NUM_IMA
    {
        FunPt_DevCMD: Linux_FileStorDevCMDExecuteMountIMGImage,
        FunPt_DevOpen: Linux_FileStorDevOpenRoIMG,
        FunPt_DevClose: FileStorDevCloseFile,
        FunPt_DevMount: MtMethod_Media,
        FunPt_DevUnMount: UnMtMethod_Media,
        FunPt_DevCheckFileName: Linux_FileStorDevCheckIMAFileName,
        FunPt_DevStoreFileInfo: Linux_StoreFileInfo
    },
    //REC_FILE_STOR_DEV_NUM_UPLOADIMA *not supported
    {
        FunPt_DevCMD: null,
        FunPt_DevOpen: null,
        FunPt_DevClose: null,
        FunPt_DevMount: null,
        FunPt_DevUnMount: null,
        FunPt_DevCheckFileName: null,
        FunPt_DevStoreFileInfo: null
    },
    //REC_FILE_STOR_DEV_NUM_WEBISO *not supported
    {
        FunPt_DevCMD: null,
        FunPt_DevOpen: null,
        FunPt_DevClose: null,
        FunPt_DevMount: null,
        FunPt_DevUnMount: null,
        FunPt_DevCheckFileName: null,
        FunPt_DevStoreFileInfo: null
    },
    //REC_FILE_STOR_DEV_NUM_FOLDER
    {
        FunPt_DevCMD: Linux_FileStorDevCMDExecuteMountFolder,
        FunPt_DevOpen: Linux_FileStorDevOpenMountFolder,
        FunPt_DevClose: Linux_FileStorDevCloseMountFolder,
        FunPt_DevMount: MtMethod_Media,
        FunPt_DevUnMount: UnMtMethod_Media,
        FunPt_DevCheckFileName: Linux_FileStorDevCheckMountFolderAttribute,
        FunPt_DevStoreFileInfo: Linux_StoreFileInfo
    }
];

function VMMainInfoStruct() {
    "use strict";
    this.b_UserName = "";
    this.b_PassWord = "";
    this.b_ServerIP = "";
    this.p_VM_Info = [];
    this.timestamp = new Uint8Array(4);
    this.VMMainInfo_GUI_VMCount = 0;
    this.FunDepVar = { FileDevFP: null, MediaSupportTab: null };
    this.PlugInPkt_Encrypt_en = 0;
    this.PlugInPkt_SIDAuth_en = 0;
    this.tcp_type_idx = 0;
    this.b_UserNameLength = 0;
    this.b_PwdLength = 0;
    this.sec_type = 0;
    this.sec_enable = 0;
    this.totalDevNumber = 0;
}

function vm_Struct() {
    "use strict";
    this.NoSelect_en = 0;
    this.f_image = null;
    this.MediaType_en = [];
    this.HostDevType = 0;
    this.PhyDevFPTabIdx = 0;
    this.VM_Mt_Process_Stage = VM_MNT_PROCESS_STAGE0;
    this.user_select_cb_idx = 0;
    this.dev_str = "";
    this.ImgFileFolderName = null;
    this.f_path_length = 0;
    this.ioctl_ret_value = 0;
    this.w_ISO_size = 0;
    this.DevLanPort = 0;
    this.UnCheckGUIObjAtb_flg = 0;
    this.DevExistFlg = 0;
    this.DevExistType = 0;
    this.change_disc_4A = 0;
    this.USBAccessTimeOutValue = 0;
    this.DevThread_winsocket_en = 0;
    this.VMThrdInfo = new St_VMThrdInfoTag();
    this.VMDevTerminate = 0;
    this.b_DevID = 0;
    this.b_DevPlugInOK = 0;
    this.BOInfo = new St_BOInfoTag();
    this.error_handle_info = new St_ErrorHandleInfoTag();
    this.BulkOutDataWaitCut = 0;
    this.return_data_length = 0;
}

function St_VMThrdInfoTag() {
    "use strict";
    this.Rx_en = 0;
    this.Tx_en =  0;
    this.pid_enp = 0;
    this.RxState = 0;
    this.Tx_Buf = null;
    this.Rx_Buf = null;
    this.codec_Buf = null;
    this.RxTotaLeng = 0;
    this.RxRemainLeng = 0;
    this.TxLengSet = 0;
    this.RxLengGet = 0;
    this.RxLengSet = 0;
    this.RxOffset = 0;
}

function St_BOInfoTag() {
    "use strict";
    this.CBW_Tag = new Uint8Array(4);
    this.CBW_DataTransferLength = 0;
    this.CBW_CBLength = 0;
    this.CBW_bmCBWFlagsL = 0;
    this.CBW_CB = new Uint8Array(16);
    this.CSW_Status = 0;
    this.Data_Dir = 0;
}

function St_ErrorHandleInfoTag() {
    "use strict";
    this.SenseData = new Uint8Array(32);
    this.SenseKey = 0;
    this.ASC = 0;
    this.ASCQ = 0;
    this.DiscModeSenseStatus = 0;
    this.Count_4A = 0;
}

function ArrayCopy(dst, doffset, src, soffset, size) {
    "use strict";
    for (var index = 0; index < size; index++) {
        dst[index + doffset] = src[index + soffset];
    }
}

function ByteToDWord(byte4, byte3, byte2, byte1) {
    "use strict";
    return ((byte4 << 24) | (byte3 << 16) | (byte2 << 8) | byte1);
}

var VM = function() {
    "use strict";
    this._sentDataBytes = 0;
    this._websock = [];
    this._recvHandler = [];
    this._vmWorker = [];

    this.dev_idx = -1;
    this.st_VMMainInfo = null;
    this.VM_Thread = VM_Thread;

    this._eventHandlers = {
        'ready': function () { "use strict"; alert("No onready callback function!"); },
        'mount': function () { "use strict"; alert("No onmount callback function!"); },
        'unmount': function () { "use strict"; alert("No onunmount callback function!"); },
        'error': function () { "use strict"; alert("No onerror callback function!"); },
        'process': function() { "use strict"; }
    };

    // set true to enable debug messages
    if (vmdebug) {
        this.debug = console.log;
    } else {
        this.debug = function(msg) { "use strict"; };
    }
};

VM.prototype = {
    Init: function (pltCode, companyId, boardId){
        "use strict";
        JASWInit(this, pltCode, companyId, boardId);
    },

    Start: function (devIndex, username, password, host, port,
            secType, websock) {
        "use strict";
        this._websock[devIndex] = websock;

        AllocateDevThreadMem(this, devIndex);
        VM_Thread_VarInit(this.st_VMMainInfo.p_VM_Info[devIndex].VMThrdInfo,
                LENGTH_PDU_TAG, STATE_RX_PDU_TAG, BI_ENP_AND_TK_OUT_DV1);
        ArrayCopy(this.st_VMMainInfo.p_VM_Info[devIndex].error_handle_info.SenseData, 0,
                ab_ReqSense_success, 0, 0x12);

        JASetUNamePwdIPPort(this, devIndex, username, password, host, port, secType);
    },

    Mount: function(dev_idx, cb_idx, img_file_name, dev_str, user_name, password, server_ip) {
        "use strict";
        switch (vm.st_VMMainInfo.FunDepVar.MediaSupportTab.FileStorDevTypeID[cb_idx]) {
            case REC_FILE_STOR_DEV_NUM_ISO:
            case REC_FILE_STOR_DEV_NUM_IMA:
                this._vmWorker[dev_idx] = new Worker("../js/mmcCommand.js");
                break;
            case REC_FILE_STOR_DEV_NUM_FOLDER:
                this._vmWorker[dev_idx] = new Worker("../js/mfapi.js");
                break;
            default:
                vm._eventHandlers.error("Invalid media type index: " + cb_idx, dev_idx);
                return;
        }
        UI_Mount_VM(this, dev_idx, cb_idx, img_file_name, dev_str, user_name, password, server_ip);
    },

    Unmount: function(dev_idx, username, password, host) {
        "use strict";
        UI_UnMount_VM(this, dev_idx, username, password, host);
        if (this._vmWorker[dev_idx] != null) {
            this._vmWorker[dev_idx].terminate();
        }
    },

    Stop: function() {
        "use strict";
        if (this._vmWorker != null) {
            this.debug("Terminate vmWorker...");
            for (var dev_index = 0; dev_index < this.st_VMMainInfo.VMMainInfo_GUI_VMCount; dev_index++) {
                if (this._vmWorker[dev_index] != null) {
                    this._vmWorker[dev_index].terminate();
                    this._vmWorker[dev_index] = null;
                }
            }
        }
    },

    Send: function (dev_idx, data, length, offset , handler) {
        "use strict";
        var arr = [];
        for (var index = 0; index < length; index++) {
            arr.push(data[index + offset]);
        }

        this._websock[dev_idx].send(arr);

        if (handler != null) {
            this._recvHandler[dev_idx] = handler;
        }
    },

    Recv: function(dev_idx) {
        "use strict";

        if (this._recvHandler[dev_idx] != null) {
            this._recvHandler[dev_idx](this, dev_idx);
        } else {
            this.debug("No recv handler");
        }
    },

    on: function (evt, handler) {
        "use strict";
        this._eventHandlers[evt] = handler;
    }
};

function JASWInit(vm, plt_code, company_id, board_id) {
    "use strict";
    var VMCount;
    var CompanyID;
    var BoardID;

    if ((company_id == 0) && (board_id == 0)) {
        if ((plt_code == 0x59) || (plt_code == 0x61)) {
            CompanyID = 0x02;
            BoardID = 0x00;
        } else if ((plt_code == 0x57) || (plt_code == 0x58)) {
            CompanyID = 0x01;
            BoardID = 0x00;
        }
    } else {
        CompanyID = company_id;
        BoardID = board_id;
    }

    vm.debug("plt_code = " + plt_code + ", CompanyID = " + CompanyID + ", BoardID = " +
            BoardID);

    InitVMSW(vm);
    VMCount = FunIDToDevInfo(CompanyID, BoardID);
    if (VMCount == 0) {
        vm.debug("VMCount = 0, no matching CompanyID found!!!");
    }
    UI_SetGUIVMCount(vm, VMCount);

    UI_PrepareVMResource(vm, VMCount);
    FunIDToSetMediaTypeStateForDev(vm, CompanyID, BoardID, VMCount);
    FunIDToHostDevType(vm, CompanyID, BoardID);
    UI_SetUSBPlugInPktEncrypt(vm, DISABLE);

    UI_SetUSBPlugInPktSIDAuth(vm, ENABLE);
}

function InitVMSW(vm) {
    "use strict";
    vm.st_VMMainInfo = new VMMainInfoStruct();
    GetRandomTimeStamp(vm);
}

function GetRandomTimeStamp(vm) {
    "use strict";
    var r_timestamp = Math.floor(Math.random() * 32768);
    vm.debug("GetRandomTimeStamp: " + r_timestamp);
    vm.st_VMMainInfo.timestamp[0] = r_timestamp >> 24;
    vm.st_VMMainInfo.timestamp[1] = r_timestamp >> 16;
    vm.st_VMMainInfo.timestamp[2] = r_timestamp >> 8;
    vm.st_VMMainInfo.timestamp[3] = r_timestamp;
}

function FunIDToDevInfo(CompanyID, BoardID) {
    "use strict";
    // TODO: only support 1 vm for now
    //return 1;

    switch (CompanyID) {
        case 0x00:
            return 3;
        case 0x01:
            return 3;
        case 0x02:
            return 2;
        case 0x03:
            return 3;
        case 0x04:
            return 3;
        default:
            return 0;
    }
}

function UI_SetGUIVMCount(vm, GUI_VMCount) {
    "use strict";
    if ((GUI_VMCount > 4) || (GUI_VMCount < 1)) {
        vm._eventHandlers.error("Device " + dev_idx + ": invalid vm count: " + GUI_VMCount, dev_idx);
        return -1;
    }
    vm.st_VMMainInfo.VMMainInfo_GUI_VMCount = GUI_VMCount;
    return 0;
}

function UI_PrepareVMResource(vm, GUI_VMCount) {
    "use strict";
    VMCFGTable_Init(vm);
    VMInfoCalloc(vm, GUI_VMCount);
    UI_InitEachDevMediaType(vm, GUI_VMCount);
}

function VMCFGTable_Init(vm) {
    "use strict";
    vm.st_VMMainInfo.FunDepVar.FileDevFP = Linux_FileStorDevRelativeFP_Default;
    vm.st_VMMainInfo.FunDepVar.MediaSupportTab = client_media_support_table;
}

function VMInfoCalloc(vm, VMCount) {
    "use strict";
    for (var index = 0; index < VMCount; index++) {
        vm.st_VMMainInfo.p_VM_Info[index] = new vm_Struct();
    }
}

function UI_InitEachDevMediaType(vm, vm_count) {
    "use strict";
    var i, j , dev_idx;
    for (dev_idx = 0; dev_idx < vm_count; dev_idx++) {
        vm.st_VMMainInfo.p_VM_Info[dev_idx].NoSelect_en = 1;
        for (i = 0; i < TOTAL_MEDIA_SET; i++) {
            vm.st_VMMainInfo.p_VM_Info[dev_idx].MediaType_en.push(new Array(TOTAL_MEDIA_TYPE));
            for (j = 0; j < TOTAL_MEDIA_TYPE; j++) {
                vm.st_VMMainInfo.p_VM_Info[dev_idx].MediaType_en[i][j] = 1;
            }
        }
    }
}

function FunIDToSetMediaTypeStateForDev(vm, CompanyID, BoardID, VMCount) {
    "use strict";
    switch (CompanyID) {
        case 0x00:
            UI_SetMediaTypeStateForDev(vm, VMCount, REC_FILE_STOR_DEV_NUM_FOLDER, DISABLE);
            UI_SetMediaTypeStateForDev(vm, VMCount, REC_FILE_STOR_DEV_NUM_IMA, DISABLE);
            break;
        case 0x01:
            UI_SetMediaTypeStateForDev(vm, VMCount, REC_FILE_STOR_DEV_NUM_FOLDER, DISABLE);
            UI_SetMediaTypeStateForDev(vm, VMCount, REC_FILE_STOR_DEV_NUM_IMA, DISABLE);
            break;
        case 0x02:
            UI_SetMediaTypeStateForDev(vm, VMCount, REC_FILE_STOR_DEV_NUM_FOLDER, DISABLE);
            UI_SetMediaTypeStateForDev(vm, VMCount, REC_FILE_STOR_DEV_NUM_IMA, DISABLE);
            break;
        case 0x03:
            UI_SetMediaTypeSequenceForDev(vm, VMCount, REC_FILE_STOR_DEV_NUM_ISO, 0);
            UI_SetMediaTypeSequenceForDev(vm, VMCount, REC_FILE_STOR_DEV_NUM_IMA, 1);
            UI_SetMediaTypeSequenceForDev(vm, VMCount, REC_PHY_STOR_DEV_NUM_IDE_CDROM, 0);
            UI_SetMediaTypeStateForDev(vm, VMCount, REC_NO_SELECT_TAG, DISABLE);
            break;
    }
}

function UI_SetMediaTypeStateForDev(vm, dev_idx, media_type, state) {
    "use strict";
    var idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    if ((media_type & MASK_MEDIA_TYPE_TAG) == REC_NO_SELECT_TAG) {
        if ((state > 1) || (state < 0)) {
            console.warn("Invalid state: " + state);
            return -1;
        }
        if (dev_idx == st_VMMainInfo.VMMainInfo_GUI_VMCount) {
            for (idx = 0; idx < st_VMMainInfo.VMMainInfo_GUI_VMCount; idx++) {
                st_VMMainInfo.p_VM_Info[idx].NoSelect_en = state;
            }
        } else {
            st_VMMainInfo.p_VM_Info[dev_idx].NoSelect_en = state;
        }
    } else {
        if (((((media_type & MASK_MEDIA_TYPE_TAG) >> 5) - 1) > TOTAL_MEDIA_SET)
           || ((media_type & MASK_DEV_NUM) > TOTAL_MEDIA_TYPE)) {
            console.warn("Invalid media type: " + media_type.toString(16));
            return -1;
        }
        if ((state > 1) || (state < 0)) {
            console.warn("Invalid state: " + state);
            return -1;
        }
        if (dev_idx == st_VMMainInfo.VMMainInfo_GUI_VMCount) {
            for (idx = 0; idx < st_VMMainInfo.VMMainInfo_GUI_VMCount;idx++) {
                if (((media_type & MASK_MEDIA_TYPE_TAG) >> 5) >= 1) {
                    st_VMMainInfo.p_VM_Info[idx]
                    .MediaType_en[(((media_type & MASK_MEDIA_TYPE_TAG) >> 5) - 1)][(media_type & MASK_DEV_NUM)]
                    = state;
                }
            }
        } else {
            if (((media_type & MASK_MEDIA_TYPE_TAG) >> 5) >= 1) {
                st_VMMainInfo.p_VM_Info[dev_idx]
                .MediaType_en[(((media_type&MASK_MEDIA_TYPE_TAG) >> 5) - 1)][(media_type & MASK_DEV_NUM)]
                = state;
            }
        }
    }
    return 0;
}

function UI_SetMediaTypeSequenceForDev(vm, dev_idx, media_type, list_idx) {
    "use strict";
    var ret = -2;
    var idx;
    switch (media_type & MASK_MEDIA_TYPE_TAG) {
        case REC_PHY_STOR_DEV_TAG:
            // TODO: Should never be in this case for now
            vm._eventHandlers.error("Device " + dev_idx + ": media_type should not be "
                    + REC_PHY_STOR_DEV_TAG.toString(16), dev_idx);
            return -1;
        case REC_FILE_STOR_DEV_TAG:
            if ((list_idx < MAX_COUNT_FILE_STOR_DEV)
                && ((MASK_DEV_NUM & media_type) < MAX_COUNT_FILE_STOR_DEV)) {
                if (dev_idx == vm.st_VMMainInfo.VMMainInfo_GUI_VMCount) {
                    for (idx = 0; idx < vm.st_VMMainInfo.VMMainInfo_GUI_VMCount; idx++) {
                        vm.st_VMMainInfo.p_VM_Info[idx].DevSequence_en = ENABLE;
                        // TODO: what's this?
                        //oem_media_support_sequence_table[idx].FileStorDevTypeID[list_idx] = media_type;
                    }
                } else {
                    vm.st_VMMainInfo.p_VM_Info[dev_idx].DevSequence_en = ENABLE;
                    // TODO: what's this?
                    //oem_media_support_sequence_table[dev_idx].FileStorDevTypeID[list_idx] = media_type;
                }
            } else {
                ret = -1;
            }
            break;
        default :
            ret = -2;
            break;
    }

    return ret;
}

function FunIDToHostDevType(vm, CompanyID, BoardID) {
    "use strict";
    switch (CompanyID) {
        case 0x00:
            UI_SetHostDevType(vm, DEVICE1, HOST_TYPE_NODEFINE);
            UI_SetHostDevType(vm, DEVICE2, HOST_TYPE_NODEFINE);
            UI_SetHostDevType(vm, DEVICE3, HOST_TYPE_NODEFINE);
            break;
        case 0x01:
            UI_SetHostDevType(vm, DEVICE1, HOST_TYPE_NODEFINE);
            UI_SetHostDevType(vm, DEVICE2, HOST_TYPE_NODEFINE);
            UI_SetHostDevType(vm, DEVICE3, HOST_TYPE_NODEFINE);
            break;
        case 0x02:
            UI_SetHostDevType(vm, DEVICE1, HOST_TYPE_FLOPPY);
            UI_SetHostDevType(vm, DEVICE2, HOST_TYPE_CDROM);
            break;
        case 0x03:
            UI_SetHostDevType(vm, DEVICE1, HOST_TYPE_NODEFINE);
            UI_SetHostDevType(vm ,DEVICE2, HOST_TYPE_NODEFINE);
            UI_SetHostDevType(vm, DEVICE3, HOST_TYPE_NODEFINE);
            break;
    }
}

function UI_SetHostDevType(vm, dev_idx, HostDevType) {
    "use strict";
    if (dev_idx >= vm.st_VMMainInfo.VMMainInfo_GUI_VMCount) {
        console.warn("UI_SetHostDevType: index out of range: dev_idx = " + dev_idx);
        return -1;
    }
    vm.st_VMMainInfo.p_VM_Info[dev_idx].HostDevType = HostDevType;
    if (HostDevType != HOST_TYPE_NODEFINE) {
        // TODO: HostDevType not defined case?
        vm._eventHandlers.error("Device " + dev_idx + ": HostDevType should not be defined!", dev_idx);
        return -1;
    } else {
        vm.st_VMMainInfo.p_VM_Info[dev_idx].PhyDevFPTabIdx = VM_BEHAVIOR_TYPE_BYPASS;
    }

    return 0;
}

function UI_SetUSBPlugInPktEncrypt(vm, encrypt_state) {
    "use strict";
    vm.st_VMMainInfo.PlugInPkt_Encrypt_en = encrypt_state;
}

function UI_SetUSBPlugInPktSIDAuth(vm, sid_auth_state) {
    "use strict";
    vm.st_VMMainInfo.PlugInPkt_SIDAuth_en = sid_auth_state;
}

function AllocateDevThreadMem(vm, dev_idx) {
    "use strict";
    vm.st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf = new Uint8Array(200000);
    vm.st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf = new Uint8Array(200000);
}

function VM_Thread_VarInit(VMThrdInfo, init_RxLengSet, init_RxState, init_pid_enp) {
    "use strict";
    VMThrdInfo.Rx_en = ENABLE;
    VMThrdInfo.Tx_en = DISABLE;
    VMThrdInfo.pid_enp = init_pid_enp;
    VMThrdInfo.RxState = init_RxState;
    VMThrdInfo.RxTotaLeng = 0;
    VMThrdInfo.RxRemainLeng = 0;
    VMThrdInfo.TxLengSet = 0;
    VMThrdInfo.RxLengSet = init_RxLengSet;
    VMThrdInfo.RxOffset = 0;
}

function JASetUNamePwdIPPort(vm, dev_idx, uname, passwd, server_ip, server_port, sec_type) {
    "use strict";
    var VMCount = vm.st_VMMainInfo.VMMainInfo_GUI_VMCount;
    for (var dev_index = 0; dev_index < VMCount; dev_index++) {
        UI_SetEachVMLanPort(vm, dev_index, server_port);
    }
    UI_GetDevStatusFromFW(vm, dev_idx, server_ip, server_port, VMCount, sec_type);
}

function UI_SetEachVMLanPort(vm, dev_idx, dev_lan_port) {
    "use strict";
    if (vm.st_VMMainInfo.VMMainInfo_GUI_VMCount < dev_idx) {
        return -1;
    } else {
        if (dev_lan_port == 0) {
            vm.st_VMMainInfo.p_VM_Info[dev_idx].DevLanPort = VM_DEFAULT_PORT;
        } else {
            vm.st_VMMainInfo.p_VM_Info[dev_idx].DevLanPort = dev_lan_port;
        }
        return 0;
    }
}

function UI_GetDevStatusFromFW(vm, dev_idx, b_ServerIP, StatusLanPort, total_dev_num, sec_type) {
    "use strict";
    var st_VMMainInfo = vm.st_VMMainInfo;

    DetermineTCPType(vm, b_ServerIP);
    if (b_ServerIP.charAt(0) == '[') {
        if (b_ServerIP.length >= 2) {
            st_VMMainInfo.b_ServerIP = b_ServerIP.slice(1, (b_ServerIP.length - 1));
        }
    } else {
        st_VMMainInfo.b_ServerIP = b_ServerIP;
    }

    st_VMMainInfo.sec_type = sec_type;
    st_VMMainInfo.sec_enable = StatusLanPort;
    vm.Send(dev_idx, [0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00], 8, 0,
            function(vm, dev_idx) {
                var data_buffer = new Uint8Array(vm._websock[dev_idx].rQshiftBytes(8));
                var length = data_buffer[4] + (data_buffer[5] << 8) + (data_buffer[6] << 16)
                         + (data_buffer[7] << 24);
                data_buffer = new Uint8Array(vm._websock[dev_idx].rQshiftBytes(length));
                for (var index = 0; index < total_dev_num; index++) {
                    if (data_buffer[index + 1] == 0xFF) {
                        vm.debug("UI_GetDevStatusFromFW - 5");
                        st_VMMainInfo.p_VM_Info[index].UnCheckGUIObjAtb_flg = DISABLE;
                        st_VMMainInfo.p_VM_Info[index].DevExistFlg = DISABLE;
                    }
                }
                if (vm._websock[dev_idx].state() == WebSocket.OPEN)
                    vm._eventHandlers.ready(dev_idx);
            }
    );
}

function DetermineTCPType(vm, server_ip) {
    "use strict";
    // TODO: Do check, always set IPV4 for now
    vm.st_VMMainInfo.tcp_type_idx = TCP_IPV4;
}

function UI_Mount_VM(vm, dev_idx, cb_idx, img_file_name, dev_str, user_name, password, server_ip) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var res = 0;

    vm.debug("UI_Mount_VM - 0");

    vm.debug("Clear data queue before mount, drop " + vm._websock[dev_idx].rQlen() + " bytes in queue");
    vm._websock[dev_idx].rQshiftBytes(vm._websock[dev_idx].rQlen());

    if (st_VMMainInfo.p_VM_Info[dev_idx].VM_Mt_Process_Stage != VM_MNT_PROCESS_STAGE0) {
        vm._eventHandlers.error("Device " + dev_idx + ": invalid process stage: " +
                st_VMMainInfo.p_VM_Info[dev_idx].VM_Mt_Process_Stage, dev_idx);
        return -1;
    } else {
        st_VMMainInfo.p_VM_Info[dev_idx].VM_Mt_Process_Stage = VM_MNT_PROCESS_STAGE1;
    }

    if ((res = StoreVMInfoFromGUI(vm, dev_idx, cb_idx, img_file_name, dev_str, user_name,
                       password, server_ip)) == -1) {
        st_VMMainInfo.p_VM_Info[dev_idx].VM_Mt_Process_Stage = VM_MNT_PROCESS_STAGE0;
        vm._eventHandlers.error("Device " + dev_idx + ": fail to store vm info", dev_idx);
        return res;
    }
    vm.debug("UI_Mount_VM - 1");
    CheckDevInfoOnClientComputer(vm, dev_idx, cb_idx, st_VMMainInfo.p_VM_Info[dev_idx].dev_str);
}

function StoreVMInfoFromGUI(vm, dev_idx, cb_idx, img_file_name, dev_str, user_name, password, server_ip) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var media_type;

    vm.debug("StoreVMInfoFromGUI - 1");

    DetermineTCPType(vm, server_ip);
    st_VMMainInfo.p_VM_Info[dev_idx].user_select_cb_idx = cb_idx;
    st_VMMainInfo.p_VM_Info[dev_idx].dev_str = dev_str;

    st_VMMainInfo.b_UserNameLength = user_name.length;
    st_VMMainInfo.b_PwdLength = password.length;
    if (st_VMMainInfo.b_UserNameLength > LENGTH_MAX_USERNAME) {
        vm._eventHandlers.error("Device " + dev_idx + ": invalid username length: "
                + st_VMMainInfo.b_UserNameLength + " max: " + LENGTH_MAX_USERNAME, dev_idx);
        return -1;
    }
    if (st_VMMainInfo.b_PwdLength > LENGTH_MAX_PASSWORD) {
        vm._eventHandlers.error("Device " + dev_idx + ": invalid password length: "
                + st_VMMainInfo.b_PwdLength + " max: " + LENGTH_MAX_PASSWORD, dev_idx);
        return -1;
    }
    st_VMMainInfo.b_UserName = user_name;
    st_VMMainInfo.b_PassWord = password;
    if (server_ip.charAt(0) == '[') {
        if (server_ip.length >= 2) {
            st_VMMainInfo.b_ServerIP = server_ip.slice(1, (server_ip.length - 1));
        }
    } else {
        st_VMMainInfo.b_ServerIP = server_ip;
    }

    vm.debug("st_VMMainInfo.b_UserName = " + st_VMMainInfo.b_UserName);
    vm.debug("st_VMMainInfo.b_PassWord = " + st_VMMainInfo.b_PassWord);

    vm.debug("StoreVMInfoFromGUI - 2");
    media_type = st_VMMainInfo.FunDepVar.MediaSupportTab.FileStorDevTypeID[cb_idx];
    if ((media_type & MASK_MEDIA_TYPE_TAG) == REC_FILE_STOR_DEV_TAG) {
        if (st_VMMainInfo.FunDepVar.FileDevFP[(media_type & MASK_DEV_NUM)].FunPt_DevStoreFileInfo !=
            null) {
             st_VMMainInfo.FunDepVar.FileDevFP[(media_type &
                                                MASK_DEV_NUM)].FunPt_DevStoreFileInfo(vm, dev_idx,
                                                                                      img_file_name);
        }
    }
    return 1;
}

function Linux_StoreFileInfo(vm, dev_idx, img_file_name) {
    "use strict";
    vm.st_VMMainInfo.p_VM_Info[dev_idx].ImgFileFolderName = img_file_name;
    if (img_file_name instanceof FileList) {
        vm.st_VMMainInfo.p_VM_Info[dev_idx].f_path_length
                = img_file_name[0].webkitRelativePath.split("/")[0].length;
    } else {
        vm.st_VMMainInfo.p_VM_Info[dev_idx].f_path_length = img_file_name.name.length;
    }
}

function CheckDevInfoOnClientComputer(vm, dev_idx, cb_idx, dev_str) {
    "use strict";
    var res = -1;
    var media_type = vm.st_VMMainInfo.FunDepVar.MediaSupportTab.FileStorDevTypeID[cb_idx];
    vm.debug("CheckDevInfoOnClientComputer-1");
    switch (media_type & MASK_MEDIA_TYPE_TAG) {
        case REC_PHY_STOR_DEV_TAG:
            // TODO: Should never be in this case for now
            vm._eventHandlers.error("Device " + dev_idx + ": media_type should not be "
                    + REC_PHY_STOR_DEV_TAG.toString(16), dev_idx);
            return -1;
        case REC_FILE_STOR_DEV_TAG:
            vm.debug("CheckDevInfoOnClientComputer-3");
            if ((res = VerifyFileStorDevIfValid(vm, dev_idx, media_type)) == -1) {
                return res;
            }
            break;
        default:
            res = -1;
            break;
    }
    vm.debug("CheckDevInfoOnClientComputer-4, res=" + res);
    return res;
}

function ErrorHandle_Init(vm, dev_idx) {
    "use strict";
    vm.st_VMMainInfo.p_VM_Info[dev_idx].ioctl_ret_value = ERR_CODE_INIT;
}

function VerifyFileStorDevIfValid(vm, dev_idx, media_type) {
    "use strict";
    var st_VMMainInfo = vm.st_VMMainInfo;
    var res = 1;

    if (st_VMMainInfo.FunDepVar.FileDevFP[(media_type & MASK_DEV_NUM)].FunPt_DevCheckFileName != null) {
        if ((res = st_VMMainInfo.FunDepVar.FileDevFP[(media_type & MASK_DEV_NUM)].
                FunPt_DevCheckFileName(vm, dev_idx)) == -1) {
            return -1;
        }
    }
    if(st_VMMainInfo.FunDepVar.FileDevFP[(media_type & MASK_DEV_NUM)].FunPt_DevOpen != null) {
        st_VMMainInfo.FunDepVar.FileDevFP[(media_type & MASK_DEV_NUM)].FunPt_DevOpen(vm, dev_idx);
    }
    return res;
}

function Linux_FileStorDevCheckISOFileName(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    var index = st_VMMainInfo.p_VM_Info[dev_idx].ImgFileFolderName.name.length - 1;
    var fp = st_VMMainInfo.p_VM_Info[dev_idx].ImgFileFolderName;
    if (index < 512) {
        if ((index <= 4)
            || (fp.name.slice(fp.name.length - 4, fp.name.length).toUpperCase() != ".ISO")) {
            console.warn("The selected file is not ISO file");
            return -1;
        }
    }
    return 1;
}

function Linux_FileStorDevCheckIMAFileName(vm, dev_idx) {
    let vmInfo = vm.st_VMMainInfo.p_VM_Info[dev_idx];
    let fp = vmInfo.ImgFileFolderName;
    let index = fp.name.length - 1;

    if (index < 512) {
        let extension = fp.name.slice(fp.name.length - 4).toUpperCase();
        if (extension != ".IMA" && extension != ".IMG") {
            console.warn("The selected file is not IMA/IMG file");
            return -1;
        }
    }

    return 1;
}

function Linux_FileStorDevCheckMountFolderAttribute(vm, dev_idx) {
    "use strict";
    return 1;
}

function Linux_FileStorDevOpenISO(vm, dev_idx) {
    "use strict";
    CalculateISOFileBlockNum(vm, dev_idx);
}

function Linux_FileStorDevOpenMountFolder(vm, dev_idx) {
    "use strict";
    var st_VMMainInfo = vm.st_VMMainInfo;
    var threeGB = 3 * 1024 * 1024 * 1024;

    vm.debug("Linux_FileStorDevOpenMountFolder -1");

    vm._vmWorker[dev_idx].postMessage(
            ['Linux_Folder_CreateImageFromPath',
             dev_idx,
             st_VMMainInfo.p_VM_Info[dev_idx].ImgFileFolderName,
             DEFAULT_BLOCKS]
    );
    vm._vmWorker[dev_idx].onmessage = function(e) {
        "use strict";
        if (e.data[0] == "process") {
            vm._eventHandlers.process(e.data[1], dev_idx);
            return;
        }
        if (e.data[0] == "overSized") {
            alert("The selected folder exceeds the capacity limit! Please remove some files.");
            st_VMMainInfo.p_VM_Info[dev_idx].VM_Mt_Process_Stage = VM_MNT_PROCESS_STAGE0;
            vm._eventHandlers.unmount(dev_idx);

            vm._vmWorker[dev_idx].onmessage = null;
            vm._vmWorker[dev_idx].terminate();
            vm._vmWorker[dev_idx] = undefined;
            return;
        }
        vm._vmWorker[dev_idx].onmessage = null;
        UI_Mount_VM2(vm, dev_idx, 1);
    };
}

function Linux_FileStorDevOpenRoIMG(vm, dev_idx) {
    CalculateIMGFileBlockNum(vm, dev_idx)
}

function CalculateISOFileBlockNum(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var reader = new FileReader();
    var sn;
    st_VMMainInfo.p_VM_Info[dev_idx].f_image
            = st_VMMainInfo.p_VM_Info[dev_idx].ImgFileFolderName;
    reader.onload = function (evt) {
        "use strict";
        sn = new Uint8Array(evt.target.result);
        st_VMMainInfo.p_VM_Info[dev_idx].w_ISO_size
                = sn[3] * 0x1000000 + sn[2] * 0x10000 + sn[1] * 0x100 + sn[0];
        vm.debug("sector size = " + st_VMMainInfo.p_VM_Info[dev_idx].w_ISO_size);
        UI_Mount_VM2(vm, dev_idx, 1);
    };
    reader.onerror = function(evt) {
        "use strict";
        vm._eventHandlers.error("Device " + dev_idx + ": fail to read file", dev_idx);
        UI_Mount_VM2(vm, dev_idx, -1);
    };
    reader.readAsArrayBuffer(st_VMMainInfo.p_VM_Info[dev_idx].f_image.slice(0x8050, 0x8054));
}

function CalculateIMGFileBlockNum(vm, dev_idx) {
    let vmInfo = vm.st_VMMainInfo.p_VM_Info[dev_idx];
    vmInfo.f_image = vmInfo.ImgFileFolderName;
    let size = vmInfo.f_image.size;

    if (size < 2) {
        vmInfo.w_ISO_size = -1;
        UI_Mount_VM2(vm, dev_idx, -1);
    } else {
        vmInfo.w_ISO_size = (size / 0x200) - 1;
        UI_Mount_VM2(vm, dev_idx, 1);
    }
}

function UI_Mount_VM2(vm, dev_idx, res) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var cb_idx = st_VMMainInfo.p_VM_Info[dev_idx].user_select_cb_idx;

    if (res == -1) {
        st_VMMainInfo.p_VM_Info[dev_idx].VM_Mt_Process_Stage = VM_MNT_PROCESS_STAGE0;
        return res;
    }
    vm.debug("UI_Mount_VM - 3");
    SetupVMInfoBetSWAndFW(vm, dev_idx, cb_idx, st_VMMainInfo.b_ServerIP,
            st_VMMainInfo.p_VM_Info[dev_idx].DevLanPort);
}

function SetupVMInfoBetSWAndFW(vm, dev_idx, cb_idx, server_ip, VMLanPort) {
    "use strict";
    var media_type = vm.st_VMMainInfo.FunDepVar.MediaSupportTab.FileStorDevTypeID[cb_idx];
    var res = 1;
    DetectHostCMDType(dev_idx);
    vm.st_VMMainInfo.totalDevNumber = 1;
    vm.debug("SetupVMInfoBetSWAndFW - 1");

    if ((res = FillHostDescriptorData(vm, dev_idx, cb_idx)) == -1) {
        console.error("SetupVMInfoBetSWAndFW - 2");
        return -1;
    }

    SetSocketVarEnableorDisable(vm, dev_idx, DISABLE);

    GetHttpPortFromFW(vm, dev_idx, server_ip, VMLanPort);
}

function DetectHostCMDType(dev_idx) {
    "use strict";
    return 1;
}

function FillHostDescriptorData(vm, dev_idx, cb_idx) {
    "use strict";
    var res = -1;
    var media_type = vm.st_VMMainInfo.FunDepVar.MediaSupportTab.FileStorDevTypeID[cb_idx];
    if ((res = GetDevCMDSet(vm, dev_idx, media_type, st_VSDevConfigDescriptor[dev_idx].resp)) == -1) {
        return -1;
    }
    SetClientAccessTimeOutValue(vm, dev_idx);

    return res;
}

function GetDevCMDSet(vm, dev_idx, media_type, cmd_set) {
    "use strict";
    var res = 1;
    switch (media_type & MASK_MEDIA_TYPE_TAG) {
        case REC_PHY_STOR_DEV_TAG:
            // TODO: Should never be in this case for now
            vm._eventHandlers.error("Device " + dev_idx + ": media_type should not be "
                    + REC_PHY_STOR_DEV_TAG.toString(16), dev_idx);
            return -1;
        case REC_FILE_STOR_DEV_TAG:
            res = DetectFileStorDevCMDType(vm, dev_idx, media_type, cmd_set);
            break;
        default:
            res = -1;
            break;
    }
    return res;
}

function DetectFileStorDevCMDType(vm, dev_idx, media_type, cmd_set) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    if (st_VMMainInfo.p_VM_Info[dev_idx].HostDevType != HOST_TYPE_NODEFINE) {
        cmd_set[6] = HostDevTypeToHostCMDSet(st_VMMainInfo.p_VM_Info[dev_idx].HostDevType);
    } else {
        if ((media_type == REC_FILE_STOR_DEV_NUM_IMA)
            || (media_type == REC_FILE_STOR_DEV_NUM_FOLDER)) {
            cmd_set[6] = 0x06;
        } else if (media_type == REC_FILE_STOR_DEV_NUM_ISO) {
            cmd_set[6] = 0x06;
        }
    }
    return 1;
}

function HostDevTypeToHostCMDSet(HostDevType) {
    "use strict";
    var host_cmd_set;

    switch (HostDevType) {
        case HOST_TYPE_FLOPPY:
            host_cmd_set = HOST_CMD_SET_SCSI_TRANSPORT;
            break;
        case HOST_TYPE_CDROM:
            host_cmd_set = HOST_CMD_SET_SFF8070I;
            break;
        default:
            host_cmd_set = HOST_CMD_SET_NODEFINE;
            break;
    }

    return host_cmd_set;
}

function SetClientAccessTimeOutValue(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var cb_idx = st_VMMainInfo.p_VM_Info[dev_idx].user_select_cb_idx;
    var media_type = REC_FILE_STOR_DEV_NUM_ISO;

    if ((media_type == REC_PHY_STOR_DEV_NUM_USB_CDROM)
        || (media_type == REC_PHY_STOR_DEV_NUM_IDE_CDROM)
        || (media_type == REC_PHY_STOR_DEV_NUM_SCSI_CDROM)) {
        st_VMMainInfo.p_VM_Info[dev_idx].USBAccessTimeOutValue = 10;
    } else {
        st_VMMainInfo.p_VM_Info[dev_idx].USBAccessTimeOutValue = 2;
    }
}

function SetSocketVarEnableorDisable(vm, dev_idx, var_status) {
    "use strict";
    vm.st_VMMainInfo.p_VM_Info[dev_idx].DevThread_winsocket_en = var_status;
    if (var_status == ENABLE) {
        vm._recvHandler[dev_idx] = vm.VM_Thread;
    }
}

function GetHttpPortFromFW(vm, dev_idx, server_ip, VMLanPort) {
    "use strict";
    vm.Send(dev_idx, [0x00, 0x00, 0x00, 0x0A, 0x00, 0x00, 0x00, 0x00], 8, 0, function(vm, dev_idx) {
            var data_buffer = new Uint8Array(vm._websock[dev_idx].rQshiftBytes(10));
            var http_port = data_buffer[8] | (data_buffer[9] << 8);
            vm._recvHandler[dev_idx] = vm.VM_Thread;
            vm.debug("http_port = " + http_port);

            vm.debug("SetupVMInfoBetSWAndFW - 3, VMLanPort = " + VMLanPort);
            vm.debug("SetupVMInfoBetSWAndFW - 5");

            vm.debug("SetupVMInfoBetSWAndFW - 6");
            SetSocketVarEnableorDisable(vm, dev_idx, ENABLE);

            SetDevInfandEPdescriptorStatus(3, DISABLE);
            SetDevInfandEPdescriptorStatus(4, DISABLE);
            SetDevIADdescriptorStatus(0, DISABLE);
            SetDevIADdescriptorStatus(1, DISABLE);
            SetDevIADdescriptorStatus(2, DISABLE);

            SetDevIADdescriptorStatus(3, DISABLE);
            SetDevIADdescriptorStatus(4, DISABLE);
            vm.debug("SetupVMInfoBetSWAndFW - 7");

            UI_Mount_VM3(vm, dev_idx, 1);
    });
}

function SetDevInfandEPdescriptorStatus(dev_idx, desp_status) {
    "use strict";
    st_VSDevConfigDescriptor[dev_idx].DataEnable = desp_status;
}

function SetDevIADdescriptorStatus(dev_idx, desp_status) {
    "use strict";
    st_VSIADDescriptor[dev_idx].DataEnable = desp_status;
}

function UI_Mount_VM3(vm, dev_idx, res) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    if (res == -1) {
        ReSetVMInfo_Main(vm, dev_idx);
        st_VMMainInfo.p_VM_Info[dev_idx].VM_Mt_Process_Stage = VM_MNT_PROCESS_STAGE0;
        return res;
    }

    vm.debug("UI_Mount_VM - 4");
    res = Core_Mount_VM(vm, dev_idx, 0);
    vm.debug("UI_Mount_VM - 5");
}

function ReSetVMInfo_Main(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var cb_idx = st_VMMainInfo.p_VM_Info[dev_idx].user_select_cb_idx;
    var media_type = st_VMMainInfo.FunDepVar.MediaSupportTab.FileStorDevTypeID[cb_idx];

    vm.debug("ReSetVMInfo_Main - 1");
    vm.debug("media_type = " + media_type);
    st_VMMainInfo.p_VM_Info[dev_idx].VM_Mt_Process_Stage = VM_MNT_PROCESS_STAGE0;
    st_VMMainInfo.p_VM_Info[dev_idx].change_disc_4A = DISABLE;
    switch (media_type & MASK_MEDIA_TYPE_TAG) {
        case REC_PHY_STOR_DEV_TAG:
            // TODO: Should never be in this case for now
            vm._eventHandlers.error("Device " + dev_idx + ": media_type should not be "
                    + REC_PHY_STOR_DEV_TAG.toString(16), dev_idx);
            break;
        case REC_FILE_STOR_DEV_TAG:
            ReSetVMInfo_FileStor(vm, dev_idx, media_type);
            break;
    }
}

function ReSetVMInfo_FileStor(vm, dev_idx, media_type) {
    "use strict";
    vm.st_VMMainInfo.FunDepVar.FileDevFP[(media_type & MASK_DEV_NUM)].FunPt_DevClose(vm, dev_idx);
}

function FileStorDevCloseFile(vm, dev_idx) {
    "use strict";
    // nothing to do for HTML5 files
}

function Core_Mount_VM(vm, dev_idx, cb_idx) {
    "use strict";
    var res;

    var media_type = vm.st_VMMainInfo.FunDepVar.MediaSupportTab.FileStorDevTypeID[cb_idx];
    res = MtVM_Engine(vm, dev_idx, media_type);

    return res;
}

function MtVM_Engine(vm, dev_idx, media_type) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var res = 1;
    var PhyDevFPTabIdx = st_VMMainInfo.p_VM_Info[dev_idx].PhyDevFPTabIdx;

    vm.debug("MtVM_Engine-1:media_type=" + media_type);

    switch (media_type & MASK_MEDIA_TYPE_TAG) {
        case REC_PHY_STOR_DEV_TAG:
            // TODO: Should never be in this case for now
            vm._eventHandlers.error("Device " + dev_idx + ": media_type should not be "
                    + REC_PHY_STOR_DEV_TAG.toString(16), dev_idx);
            return -1;
        case REC_FILE_STOR_DEV_TAG:
            st_VMMainInfo.FunDepVar.FileDevFP[(media_type & MASK_DEV_NUM)].FunPt_DevMount(vm, dev_idx);
            break;
        default:
            res = -1;
            break;
    }
    return res;
}

function MtMethod_Media(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    vm.debug("Call Core_GetDevStatusFromFW");
    Core_GetDevStatusFromFW(st_VMMainInfo.b_ServerIP, st_VMMainInfo.p_VM_Info[dev_idx].DevLanPort,
            st_VMMainInfo.VMMainInfo_GUI_VMCount, vm, dev_idx);
}

function Core_GetDevStatusFromFW(b_ServerIP, StatusLanPort, total_dev_num, vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    vm.Send(dev_idx, [0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00], 8, 0, function(vm, dev_idx) {
            vm.debug("Core_GetDevStatusFromFW.RxHandler START");
            var data_buffer = new Uint8Array(vm._websock[dev_idx].rQshiftBytes(8));
            var length = data_buffer[4] + (data_buffer[5] << 8) + (data_buffer[6] << 16)
                    + (data_buffer[7] << 24);
            data_buffer = new Uint8Array(vm._websock[dev_idx].rQshiftBytes(length));
            vm._recvHandler[dev_idx] = vm.VM_Thread;

            vm.debug("Core_GetDevStatusFromFW - 1");
            vm.debug("dev_idx=" + dev_idx + ", total_dev_num=" + total_dev_num);
            vm.debug("data_buffer[dev_idx+1]=" + data_buffer[dev_idx + 1]);
            if (data_buffer[dev_idx + 1] != 0xFF) {
                st_VMMainInfo.p_VM_Info[dev_idx].DevExistFlg = ENABLE;
                st_VMMainInfo.p_VM_Info[dev_idx].DevExistType = data_buffer[dev_idx+1];
                if (data_buffer[dev_idx + 1] == 0x00) {
                    // do nothing...
                } else {
                    // do nothing
                }
                MtMethod_Media2(vm, dev_idx, data_buffer[dev_idx + 1]);
            } else {
                st_VMMainInfo.p_VM_Info[dev_idx].UnCheckGUIObjAtb_flg = DISABLE;
                st_VMMainInfo.p_VM_Info[dev_idx].DevExistFlg = DISABLE;
                MtMethod_Media2(vm, dev_idx, FW_NO_EXIST_MEDIA);
            }
    });
}

function MtMethod_Media2(vm, dev_idx, res) {
    "use strict";
    vm.debug("DevStatusFromFW=" + res);

    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var Sdata = new Uint8Array(1500);
    var SpktLength = { value: 0 };
    var DevStatusFromFW = res;
    if (DevStatusFromFW != FW_NO_EXIST_MEDIA) {
        st_VMMainInfo.p_VM_Info[dev_idx].VM_Mt_Process_Stage = VM_MNT_PROCESS_STAGE0;
        vm._eventHandlers.process("Already exist an effective connection from others!", dev_idx);
        return;
    }

    SetDevInfandEPdescriptorStatus(dev_idx, ENABLE);
    FillUSBPlugInPkt(vm, dev_idx, Sdata, SpktLength);
    if ((Sdata[1] & ENCRYPT_RC4) == ENCRYPT_RC4){
        // TODO: encrypt is always disabled for now
        vm._eventHandlers.error("Device " + dev_idx + ": encrypt is not supported", dev_idx);
        return;
    }

    SetDevInfandEPdescriptorStatus(dev_idx, DISABLE);
    vm.debug("OK I call Sdata[48] = " + Sdata[48] + ", Sdata[49]=" + Sdata[49]);
    vm.debug("Device " + dev_idx + "send " + SpktLength.value + " bytes data");
    vm.Send(dev_idx, Sdata, SpktLength.value, 0, vm.VM_Thread);
    vm.debug(" !!!!!!!!!!!!!                   End the MtMethod_Media");
}

function fillUsbPlugInHeader(Tx_Buf){
    "use strict";
    var st_VMMainInfo = vm.st_VMMainInfo;
    Tx_Buf[0] = 0x00; Tx_Buf[1] = 0x00; Tx_Buf[2] = 0x00; Tx_Buf[3] = 0x01;
    Tx_Buf[4] = 0x2C; Tx_Buf[5] = 0x00; Tx_Buf[6] = 0x00; Tx_Buf[7] = 0x00;
}

function fillUserNamePassword(Tx_Buf){
    "use strict";
    var st_VMMainInfo = vm.st_VMMainInfo;
    var i = 0;

    for (i = 0; i < LENGTH_MAX_USERNAME; i++) {
        Tx_Buf[OFFSET_PLUGIN_USERNAME + i] = 0x00;
    }

    for (i = 0; i < st_VMMainInfo.b_UserName.length; i++) {
        Tx_Buf[OFFSET_PLUGIN_USERNAME + i] = st_VMMainInfo.b_UserName.charCodeAt(i);
        vm.debug("Username Tx_Buf[" + i + "] = " + Tx_Buf[OFFSET_PLUGIN_USERNAME + i]);
    }
/*
    if (st_VMMainInfo.b_UserName.length < LENGTH_MAX_USERNAME) {
        Tx_Buf.fill(0, OFFSET_PLUGIN_USERNAME + st_VMMainInfo.b_UserName.length, OFFSET_PLUGIN_PASSWORD);
    }
*/
    for (i = 0; i < LENGTH_MAX_PASSWORD; i++) {
        Tx_Buf[OFFSET_PLUGIN_PASSWORD + i] = 0x00;
    }
    for (i = 0; i < st_VMMainInfo.b_PassWord.length; i++) {
        //Tx_Buf[24 + i] = st_VMMainInfo.b_PassWord.charCodeAt(i);
        Tx_Buf[OFFSET_PLUGIN_PASSWORD + i] = st_VMMainInfo.b_PassWord.charCodeAt(i);
        vm.debug("Password Tx_Buf[" + i + "] = " + Tx_Buf[OFFSET_PLUGIN_PASSWORD + i]);
    }
/*
    if (st_VMMainInfo.b_PassWord.length < LENGTH_MAX_PASSWORD) {
        Tx_Buf.fill(0, OFFSET_PLUGIN_PASSWORD + st_VMMainInfo.b_PassWord.length, OFFSET_PLUGIN_TIMESTAMP);
    }
*/
}

function fillUsbPlugInMediaType(Tx_Buf, media_type){
    "use strict";
    if ((media_type == REC_FILE_STOR_DEV_NUM_IMA) ||
        (media_type == REC_FILE_STOR_DEV_NUM_FOLDER) ||
        (media_type == REC_PHY_STOR_DEV_NUM_IDE_FLOPPY) ||
        (media_type == REC_PHY_STOR_DEV_NUM_USB_FLOPPY)) {
        Tx_Buf[OFFSET_PLUGIN_MEDIA_TYPE] = 0x01;
    } else if ((media_type == REC_PHY_STOR_DEV_NUM_IDE_HD) ||
               (media_type == REC_PHY_STOR_DEV_NUM_SATA_HD) ||
               (media_type == REC_PHY_STOR_DEV_NUM_SAS_HD) ||
               (media_type == REC_PHY_STOR_DEV_NUM_USB_HD) ||
               (media_type == REC_PHY_STOR_DEV_NUM_SCSI_HD) ||
               (media_type == REC_PHY_STOR_DEV_NUM_USB_FLASH)) {
        Tx_Buf[OFFSET_PLUGIN_MEDIA_TYPE] = 0x02;
    } else if ((media_type == REC_PHY_STOR_DEV_NUM_USB_CDROM) ||
               (media_type == REC_PHY_STOR_DEV_NUM_IDE_CDROM) ||
               (media_type == REC_PHY_STOR_DEV_NUM_SCSI_CDROM) ||
               (media_type == REC_FILE_STOR_DEV_NUM_ISO)) {
        Tx_Buf[OFFSET_PLUGIN_MEDIA_TYPE] = 0x03;
    } else if (media_type == REC_FILE_STOR_DEV_NUM_WEBISO) {
        Tx_Buf[OFFSET_PLUGIN_MEDIA_TYPE] = 0x04;
    } else{
        Tx_Buf[OFFSET_PLUGIN_MEDIA_TYPE] = 0x05;
    }
}

function FillUSBPlugInPkt(vm, dev_idx, Tx_Buf, TxLeng) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    var i;
    var search_dev_enable_index, record_length_index, config_desp_length_index;
    var total_descriptor_length = 0;
    var infcount = 0;
    var bNumInterfaces = 0;
    //var media_type = REC_FILE_STOR_DEV_NUM_ISO;
    var cb_idx = st_VMMainInfo.p_VM_Info[dev_idx].user_select_cb_idx;
    var media_type = st_VMMainInfo.FunDepVar.MediaSupportTab.FileStorDevTypeID[cb_idx];
    var TxLengSet = 0;

    //tx buffer 0 ~ 7 : plug-in header
    fillUsbPlugInHeader(Tx_Buf);

    //tx buffer 8 ~ 41: user name
    //tx buffer 42 ~ 75: password
    fillUserNamePassword(Tx_Buf);

    //tx buffer 76 ~ 79: timestamp
    Tx_Buf[OFFSET_PLUGIN_TIMESTAMP] = st_VMMainInfo.timestamp[0];
    Tx_Buf[OFFSET_PLUGIN_TIMESTAMP + 1] = st_VMMainInfo.timestamp[1];
    Tx_Buf[OFFSET_PLUGIN_TIMESTAMP + 2] = st_VMMainInfo.timestamp[2];
    Tx_Buf[OFFSET_PLUGIN_TIMESTAMP + 3] = st_VMMainInfo.timestamp[3];

    //tx buffer 80: deivce number
    if (ENABLE == st_VMMainInfo.PlugInPkt_SIDAuth_en) {
        Tx_Buf[OFFSET_PLUGIN_DEV_NUM] = (st_VMMainInfo.totalDevNumber | SESSION_AUTH_ENABLE
                | ((dev_idx + 1) << 1));
    } else {
        Tx_Buf[OFFSET_PLUGIN_DEV_NUM] = (st_VMMainInfo.totalDevNumber & (~SESSION_AUTH_ENABLE))
                | ((dev_idx + 1) << 1);
    }

    //tx buffer 81: media type
    fillUsbPlugInMediaType(Tx_Buf, media_type);

    //tx buffer 82 ~ 83: reserved
    Tx_Buf[OFFSET_PLUGIN_RESERVED_1] = 0x00; Tx_Buf[OFFSET_PLUGIN_RESERVED_2] = 0x00;
    TxLengSet = 84; //0 ~ 83

    if (st_VMMainInfo.totalDevNumber == 1) {
        vuDevRespData[0].resp[OFFSET_DEV_DESP_PID + 1] = (USB_DEV_PID >> 8);
        vuDevRespData[0].resp[OFFSET_DEV_DESP_PID] = USB_DEV_PID;
        vuDevRespData[0].resp[OFFSET_DEV_DESP_VID + 1] = (USB_DEV_VID >> 8);
        vuDevRespData[0].resp[OFFSET_DEV_DESP_VID] = USB_DEV_VID;
    } else {
        vuDevRespData[0].resp[OFFSET_DEV_DESP_PID + 1] = (USB_DEV_PID >> 8);
        vuDevRespData[0].resp[OFFSET_DEV_DESP_PID] = USB_DEV_PID;
        vuDevRespData[0].resp[OFFSET_DEV_DESP_VID + 1] = (USB_DEV_VID >> 8);
        vuDevRespData[0].resp[OFFSET_DEV_DESP_VID] = USB_DEV_VID;
    }

    for (search_dev_enable_index = 0; search_dev_enable_index < 5; search_dev_enable_index++) {
        if (GetDevInfandEPdescriptorStatus(search_dev_enable_index) == 1) {
            bNumInterfaces++;
        }
    }
    //-----------------------------------------------------------------------------------------------
    for (i = 0; i < 8; i++) {
        if (i == 1) {
            record_length_index = TxLengSet;

            TxLengSet++;
            total_descriptor_length = vuDevRespData[i].Maxlength;
            ArrayCopy(Tx_Buf, TxLengSet, vuDevRespData[i].resp, 0, total_descriptor_length);
            config_desp_length_index = TxLengSet + 2;
            vm.debug("Tx_Buf[" + config_desp_length_index + "]=" + Tx_Buf[config_desp_length_index]);
            Tx_Buf[config_desp_length_index + 2] = bNumInterfaces;
            TxLengSet += total_descriptor_length;
            for (search_dev_enable_index = 0; search_dev_enable_index < 5; search_dev_enable_index++) {
                if (GetDevInfandEPdescriptorStatus(search_dev_enable_index) == 1) {
                    if (GetDevIADdescriptorStatus(search_dev_enable_index) == 1) {
                        total_descriptor_length += 8;
                        st_VSIADDescriptor[search_dev_enable_index].resp[4]
                                = st_VSDevConfigDescriptor[search_dev_enable_index].resp[5];
                        st_VSIADDescriptor[search_dev_enable_index].resp[5]
                                = st_VSDevConfigDescriptor[search_dev_enable_index].resp[6];
                        st_VSIADDescriptor[search_dev_enable_index].resp[6]
                                = st_VSDevConfigDescriptor[search_dev_enable_index].resp[7];
                        ArrayCopy(Tx_Buf, TxLengSet, st_VSIADDescriptor[search_dev_enable_index].resp, 0, 8);
                        TxLengSet += 8;
                        total_descriptor_length += st_VSDevConfigDescriptor[search_dev_enable_index].Maxlength;
                        ArrayCopy(Tx_Buf, TxLengSet, st_VSDevConfigDescriptor[search_dev_enable_index].resp, 0,
                                st_VSDevConfigDescriptor[search_dev_enable_index].Maxlength);
                        if (search_dev_enable_index < 4) {
                            Tx_Buf[TxLengSet + 2] = infcount;
                            infcount++;
                        }
                        TxLengSet += st_VSDevConfigDescriptor[search_dev_enable_index].Maxlength;
                    } else {
                        vm.debug("device descirptor is enable");
                        total_descriptor_length += st_VSDevConfigDescriptor[search_dev_enable_index].Maxlength;
                        vm.debug("total_descriptor_length=" + total_descriptor_length);
                        ArrayCopy(Tx_Buf, TxLengSet, st_VSDevConfigDescriptor[search_dev_enable_index].resp, 0,
                                st_VSDevConfigDescriptor[search_dev_enable_index].Maxlength);
                        if (search_dev_enable_index < 4) {
                            Tx_Buf[TxLengSet + 2] = infcount;
                            infcount++;
                        }
                        TxLengSet += st_VSDevConfigDescriptor[search_dev_enable_index].Maxlength;
                    }
                }
            }
            Tx_Buf[record_length_index] = total_descriptor_length;
            Tx_Buf[config_desp_length_index] = total_descriptor_length;
            vm.debug("final total length=" + total_descriptor_length);
        } else {
            Tx_Buf[TxLengSet] = vuDevRespData[i].Maxlength;
            TxLengSet++;
            ArrayCopy(Tx_Buf, TxLengSet, vuDevRespData[i].resp, 0, vuDevRespData[i].Maxlength);
            TxLengSet += vuDevRespData[i].Maxlength;
        }
    }

    TxLeng.value = TxLengSet;
}

function GetDevInfandEPdescriptorStatus(dev_idx) {
    "use strict";
    return st_VSDevConfigDescriptor[dev_idx].DataEnable;
}

function GetDevIADdescriptorStatus(dev_idx) {
    "use strict";
    return st_VSIADDescriptor[dev_idx].DataEnable;
}

function VM_Thread(vm, dev_idx) {
    "use strict";
    var st_VMMainInfo = vm.st_VMMainInfo;

    while ((vm._vmWorker[dev_idx] != null) && (vm._vmWorker[dev_idx].onmessage == null)) {
        if (st_VMMainInfo.p_VM_Info[dev_idx].DevThread_winsocket_en == ENABLE) {
            if (st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_en == ENABLE) {
                var RxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengSet;
                if ((vm._websock[dev_idx].rQlen() > 0) && (vm._websock[dev_idx].rQlen() >= RxLengSet)) {
                    var RxDoffset = st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxOffset;
                    var data = new Uint8Array(vm._websock[dev_idx].rQshiftBytes(RxLengSet));
                    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengGet = RxLengSet;
                    for (var count = 0; count < RxLengSet; count++) {
                        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo
                                .Rx_Buf[RxDoffset + count] = data[count];
                    }

                } else {
                    vm.debug("Wait more data (" + vm._websock[dev_idx].rQlen() + "/" + RxLengSet + ")");
                    break;
                }
            }

            if (st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengSet == 0x00) {
                st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengGet = 0x00;
            }


            VMSM_USB_BulkOnly(vm, dev_idx);
        } else {
            VM_Thread_VarInit(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo, LENGTH_PDU_TAG,
                    STATE_RX_PDU_TAG, BI_ENP_AND_TK_OUT_DV1);
            break;
        }
    }
}

function VMSM_USB_BulkOnly(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    vm.debug("RxState=0x" + st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxState.toString(16));

    let rxState = st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxState;

    switch (rxState) {
        case STATE_RX_PDU_TAG:
            State_Fn_RX_PDU_TAG(vm, dev_idx);
            break;
        case STATE_RX_MOUNT_DEV_STATUS:
            State_Fn_RX_MOUNT_DEV_STATUS(vm, dev_idx);
            break;
        case STATE_TX_KEEP_ALIVE_NOTIFICATION:
            State_Fn_TX_KEEP_ALIVE_NOTIFICATION(vm, dev_idx);
            break;
        case STATE_RX_CBW:
            State_Fn_RX_CBW(vm, dev_idx);
            break;
        case STATE_RX_BULK_OUT_DATA:
            State_Fn_RX_BULK_OUT_DATA(vm, dev_idx);
            break;
        case STATE_EXECUTE_CBW:
            State_Fn_EXECUTE_CBW(vm, dev_idx);
            return;
        default:
            vm._eventHandlers.error("Device " + dev_idx + ": unknown state: "
                    + st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxState, dev_idx);
            return;
    }
    if ((st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en == ENABLE)
        && st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet > 0) {
        vm.debug("Device " + dev_idx + "send " + st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet
                + " bytes to VM server");
        vm.Send(dev_idx, st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf,
             st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet,
             0, null);
    }
}

function State_Fn_RX_PDU_TAG(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var dw_PktClass = 0, dw_PktLen = 0;

    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en = DISABLE;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_en = ENABLE;
    dw_PktClass = ByteToDWord(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[0],
                              st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[1],
                              st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[2],
                              st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[3]);
    dw_PktLen = ByteToDWord(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[7],
                            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[6],
                            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[5],
                            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[4]);

    vm.debug("dw_PktClass = " + dw_PktClass + ", dw_PktLen = " + dw_PktLen);

    switch (dw_PktClass) {
        case PDU_TAG_MOUNT_DEV_FLAG:
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengSet = 9;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxOffset = LENGTH_PDU_TAG;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxState = STATE_RX_MOUNT_DEV_STATUS;
            break;
        case PDU_TAG_UNMOUNT_DEV_RESP:
            UnMountStatusInit(vm, dev_idx);
            st_VMMainInfo.p_VM_Info[dev_idx].VMDevTerminate = DISABLE;

            vm._eventHandlers.unmount(dev_idx);
            break;
        case PDU_TAG_KEEP_ALIVE_CMD:
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxState = STATE_TX_KEEP_ALIVE_NOTIFICATION;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en = DISABLE;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_en = DISABLE;
            break;
        default:
            if (dw_PktLen == LENGTH_CBW) {
                st_VMMainInfo.p_VM_Info[dev_idx].b_DevID = st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[2];
                st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengSet = LENGTH_CBW;
                st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxOffset = LENGTH_PDU_TAG;
                st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxState = STATE_RX_CBW;
            } else {
                SetState_ReadPDU(vm, dev_idx);
            }
            break;
    }
}

function SetState_ReadPDU(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengSet = LENGTH_PDU_TAG;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxOffset = 0;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxState = STATE_RX_PDU_TAG;
}

function UnMountStatusInit(vm, dev_idx) {
    "use strict";
    if (vm.st_VMMainInfo.p_VM_Info != null) {
        VM_TCPSocket_Terminate(vm, dev_idx);
        Core_InitDevStateInfo(vm, dev_idx);
    }
}

function VM_TCPSocket_Terminate(vm, dev_idx) {
    "use strict";
    ResetVariableBeforeCloseTCP(vm, dev_idx);
    vm.debug("Drop " + vm._websock[dev_idx].rQlen() + " bytes in queue");
    vm._websock[dev_idx].rQshiftBytes(vm._websock[dev_idx].rQlen());
}

function ResetVariableBeforeCloseTCP(vm, dev_idx) {
    "use strict";
    vm.st_VMMainInfo.p_VM_Info[dev_idx].DevThread_winsocket_en = DISABLE;
    vm.st_VMMainInfo.p_VM_Info[dev_idx].b_DevPlugInOK = DISABLE;
}

function Core_InitDevStateInfo(vm, dev_idx) {
    "use strict";
    vm.st_VMMainInfo.p_VM_Info[dev_idx].UnCheckGUIObjAtb_flg = DISABLE;
}

function State_Fn_RX_MOUNT_DEV_STATUS(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en = DISABLE;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_en = DISABLE;

    vm.debug("Mount state=0x" + st_VMMainInfo.p_VM_Info[dev_idx]
                                .VMThrdInfo.Rx_Buf[PLUGIN_COMP_RESP_OFFSET].toString(16));

    switch (st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[PLUGIN_COMP_RESP_OFFSET]) {
        case COMP_AUTHENTICATION_FAIL:
            VM_TCPSocket_Terminate(vm, dev_idx);
            ReSetVMInfo_Main(vm, dev_idx);
            return;
        case COMP_SYSTEM_BUSY:
            VM_TCPSocket_Terminate(vm, dev_idx);
            ReSetVMInfo_Main(vm, dev_idx);
            return;
        case COMP_PRIVILEGE_ERROR:
            VM_TCPSocket_Terminate(vm, dev_idx);
            ReSetVMInfo_Main(vm, dev_idx);
            return;
        case COMP_SERVER_VM_DETACH:
            VM_TCPSocket_Terminate(vm, dev_idx);
            ReSetVMInfo_Main(vm, dev_idx);
            return;
        case COMP_SERVER_IN_FW_UPDATE:
            VM_TCPSocket_Terminate(vm, dev_idx);
            ReSetVMInfo_Main(vm, dev_idx);
            return;
        case COMP_SESSION_EXPIRE:
            VM_TCPSocket_Terminate(vm, dev_idx);
            ReSetVMInfo_Main(vm, dev_idx);
            return;
        default:
            st_VMMainInfo.p_VM_Info[dev_idx].b_DevPlugInOK = ENABLE;;
            FillSetEPCMDPkt(vm, dev_idx);
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en = ENABLE;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_en = ENABLE;

            vm._eventHandlers.mount(dev_idx);
            break;
    }
    SetState_ReadPDU(vm, dev_idx);
}

function FillSetEPCMDPkt(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[0] = 0x00;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[1] = 0x00;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[2] = 0x00;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[3] = 0x07;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[4] = 0x00;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[5] = 0x00;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[6] = 0x00;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[7] = 0x00;

    if (st_VSDevConfigDescriptor[dev_idx].resp[6] == 0x02) {
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[8] = 0x06;
    } else {
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[8]
                = st_VSDevConfigDescriptor[dev_idx].resp[6];
    }

    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[9] = 0x03;

    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[10] = 0x01;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[11] = 0x10;

    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[12] = 0x02;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[13] = 0x20;

    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[14] = 0x03;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[15] = 0x30;

    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[4] =
            2 * st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[9] + 2;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet =
            2 * st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[9] + 10;
}

function State_Fn_TX_KEEP_ALIVE_NOTIFICATION(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    FillKeepAlivePkt(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf);
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet = 12;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en = ENABLE;
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_en = ENABLE;
    SetState_ReadPDU(vm, dev_idx);
}

function FillKeepAlivePkt(send_data) {
    "use strict";
    send_data[0] = 0x00; send_data[1] = 0x00; send_data[2]  = 0x00;send_data[3]  = 0x03;
    send_data[4] = 0x04; send_data[5] = 0x00; send_data[6]  = 0x00;send_data[7]  = 0x00;
    send_data[8] = 0xFF; send_data[9] = 0xFF; send_data[10] = 0xFF;send_data[11] = 0xFF;
}

function State_Fn_RX_CBW(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength =
            (st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[LENGTH_PDU_TAG + CBW_OFFSET_DATA_TRANS_LENGTH] |
            (st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[LENGTH_PDU_TAG + CBW_OFFSET_DATA_TRANS_LENGTH + 1] << 8) |
            (st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[LENGTH_PDU_TAG + CBW_OFFSET_DATA_TRANS_LENGTH + 2] << 16) |
            (st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[LENGTH_PDU_TAG + CBW_OFFSET_DATA_TRANS_LENGTH + 3] << 24));

    vm.debug("CBW_DataTransferLength = " + st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength.toString(16));

    st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CBLength =
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[LENGTH_PDU_TAG + CBW_OFFSET_CB_LENGTH];

    vm.debug("CBW_CBLength=" + st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CBLength);

    ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB, 0,
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf, LENGTH_PDU_TAG + CBW_OFFSET_CB,
            st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CBLength);

    st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_bmCBWFlags =
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[LENGTH_PDU_TAG + CBW_OFFSET_BM_FLAGS];

    vm.debug("CBW_bmCBWFlags = " + st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_bmCBWFlags.toString(16));

    st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[0]
            = st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[LENGTH_PDU_TAG + CBW_OFFSET_CBW_TAG];
    st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[1]
            = st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[LENGTH_PDU_TAG + CBW_OFFSET_CBW_TAG + 1];
    st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[2]
            = st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[LENGTH_PDU_TAG + CBW_OFFSET_CBW_TAG + 2];
    st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[3]
            = st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf[LENGTH_PDU_TAG + CBW_OFFSET_CBW_TAG + 3];

    vm.debug("CBW_Tag[0]=" + st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[0].toString(16) +
               ",CBW_Tag[1]=" + st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[1].toString(16) +
               ",CBW_Tag[2]=" + st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[2].toString(16) +
               ",CBW_Tag[3]=" + st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[3].toString(16));

    if ((st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_bmCBWFlags & MASK_CBWFLAGS_DATA_DIR) == MASK_CBWFLAGS_DATA_DIR) {
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxState = STATE_EXECUTE_CBW;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en = DISABLE;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_en = DISABLE;
        st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.Data_Dir = MEDIA_DATA_IN;
    } else {
        st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.Data_Dir = MEDIA_DATA_OUT;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASC = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASCQ = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CSW_Status = CSW_STATE_SUCCESS;
        if (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength == 0x00) {
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxState = STATE_EXECUTE_CBW;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en = DISABLE;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_en = DISABLE;
        } else {
            vm.debug("State_Fn_RX_CBW - cmd:" + st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0].toString(16));
            vm.debug("State_Fn_RX_CBW - BulkOutDataWaitCut=" + st_VMMainInfo.p_VM_Info[dev_idx].BulkOutDataWaitCut);
            st_VMMainInfo.p_VM_Info[dev_idx].BulkOutDataWaitCut = 0;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxState = STATE_RX_BULK_OUT_DATA;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength + LENGTH_PDU_TAG;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxOffset = 0;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en = DISABLE;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_en = ENABLE;
        }
    }
}

function State_Fn_RX_BULK_OUT_DATA(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    if (st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengSet == st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengGet) {
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxTotaLeng += st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengGet;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengGet = st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxTotaLeng;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxTotaLeng = 0;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en = ENABLE;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_en = DISABLE;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxState = STATE_EXECUTE_CBW;
        FillCSW(vm, dev_idx);
    } else {
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxOffset += st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengGet;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxTotaLeng += st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengGet;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxRemainLeng =
                (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength + LENGTH_PDU_TAG)
                - st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxTotaLeng;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxRemainLeng;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en = DISABLE;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_en = ENABLE;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.RxState = STATE_RX_BULK_OUT_DATA;
    }
}

function FillCSW(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var ResidueDataLength = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength
            - st_VMMainInfo.p_VM_Info[dev_idx].return_data_length;

    if (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.Data_Dir == MEDIA_DATA_IN) {
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+0] = BI_ENP_AND_TK_OUT_DV1;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+1] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+2] = st_VMMainInfo.p_VM_Info[dev_idx].b_DevID;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+3] = 0xFF;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+4] = 0x0D;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+5] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+6] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+7] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+8] = 'U'.charCodeAt();
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+9] = 'S'.charCodeAt();
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+10] = 'B'.charCodeAt();
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+11] = 'S'.charCodeAt();
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+12] = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[0];
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+13] = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[1];
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+14] = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[2];
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+15] = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[3];
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+16] = (ResidueDataLength & 0x000000FF);
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+17] = ((ResidueDataLength & 0x0000FF00) >> 8);
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+18] = ((ResidueDataLength & 0x00FF0000) >> 16);
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+19] = ((ResidueDataLength & 0xFF000000) >> 24);
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[st_VMMainInfo.p_VM_Info[dev_idx].return_data_length+LENGTH_PDU_TAG+20] = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CSW_Status;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet += (LENGTH_PDU_TAG + 0x0D);
    } else {
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[0] = BI_ENP_AND_TK_OUT_DV1;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[1] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[2] = st_VMMainInfo.p_VM_Info[dev_idx].b_DevID;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[3] = 0xFF;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[4] = 0x0D;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[5] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[6] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[7] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[8] = 'U'.charCodeAt();
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[9] = 'S'.charCodeAt();
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[10] = 'B'.charCodeAt();
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[11] = 'S'.charCodeAt();
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[12] = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[0];
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[13] = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[1];
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[14] = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[2];
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[15] = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_Tag[3];
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[16] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[17] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[18] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[19] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[20] = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CSW_Status;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet = 0x0D + LENGTH_PDU_TAG;
    }
}

function State_Fn_EXECUTE_CBW(vm, dev_idx) {
    "use strict";
    Execute_VM_CMD(vm, dev_idx);
}

function Execute_VM_CMD(vm, dev_idx) {
    "use strict";
    var st_VMMainInfo = vm.st_VMMainInfo;
    var cb_idx = st_VMMainInfo.p_VM_Info[dev_idx].user_select_cb_idx;
    var media_type = st_VMMainInfo.FunDepVar.MediaSupportTab.FileStorDevTypeID[cb_idx];

    switch (media_type & MASK_MEDIA_TYPE_TAG) {
        case REC_PHY_STOR_DEV_TAG:
            vm._eventHandlers.error("Device " + dev_idx + ": media type should not be " + media_type, dev_idx);
            return;
        case REC_FILE_STOR_DEV_TAG:
            st_VMMainInfo.FunDepVar.FileDevFP[(media_type & MASK_DEV_NUM)].FunPt_DevCMD(vm, dev_idx);
            break;
        default:
            break;
    }
}

function FileStorDevCMDExecuteISO_FixInquiry(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    var ab_sbc3_CDROMinquiry =
            new Uint8Array([0x05, 0x80, 0x00, 0x21, 0x1F, 0x00, 0x00, 0x00, 0x47, 0x45, 0x4E,
                            0x45, 0x52, 0x49, 0x43, 0x20, 0x56, 0x69, 0x72, 0x74, 0x75, 0x61,
                            0x6C, 0x20, 0x43, 0x44, 0x52, 0x4F, 0x4D, 0x20, 0x20, 0x20, 0x59,
                            0x53, 0x30, 0x4A]);
    var ab_sbc3_CDROM_OP_AC =
            new Uint8Array([0x00, 0x00, 0x00, 0x14, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                            0x00, 0x00, 0x00, 0x11, 0x50, 0x00, 0x00, 0x00, 0x2B]);
    var ab_iso_ReadTOC1 =
            new Uint8Array([0x00, 0x0a, 0x01, 0x01, 0x00, 0x14, 0x01, 0x00, 0x00, 0x00, 0x00,
                            0x00]);
    var ab_iso_ReadTOC2 =
            new Uint8Array([0x00, 0x12, 0x01, 0x01, 0x00, 0x14, 0x01, 0x00, 0x00, 0x00, 0x02,
                            0x00, 0x00, 0x14, 0xaa, 0x00, 0x00, 0x07, 0x2a, 0x07]);
    var ab_iso_ReadTOC3 =
            new Uint8Array([0x00, 0x12, 0x01, 0x01, 0x00, 0x14, 0x01, 0x00, 0x00, 0x00, 0x00,
                            0x00]);
    var ab_iso_ReadTOC4 =
            new Uint8Array([0x00, 0x12, 0x01, 0x01, 0x00, 0x14, 0x01, 0x00, 0x00, 0x00, 0x02,
                            0x00]);

    if (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0] == 0x12) {
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASC = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASCQ = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseKey = 0x00;
        if (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[4] <= 36) {
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[4];
        } else {
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 36;
        }
        ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG,
                  ab_sbc3_CDROMinquiry, 0, st_VMMainInfo.p_VM_Info[dev_idx].return_data_length);
    } else if ((st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0] == 0xAC) && (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[10] == 0x00)) {
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASC = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASCQ = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseKey = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 20;

        ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG,
                  ab_sbc3_CDROM_OP_AC, 0, st_VMMainInfo.p_VM_Info[dev_idx].return_data_length);
    } else if(st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0] == 0x43) {
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASC = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASCQ = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseKey = 0x00;
        if (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength == 12) {
            if ((st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[9] == 0) && (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[1] == 0x00)) {
                st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 12;
                ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG,
                          ab_iso_ReadTOC3, 0, st_VMMainInfo.p_VM_Info[dev_idx].return_data_length);
            } else if(st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[1] == 0x02) {
                st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 12;
                ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG,
                          ab_iso_ReadTOC4, 0, st_VMMainInfo.p_VM_Info[dev_idx].return_data_length);
            } else {
                st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 12;
                ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG,
                          ab_iso_ReadTOC1, 0, st_VMMainInfo.p_VM_Info[dev_idx].return_data_length);
            }
        } else if(st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength >= 20) {
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 20;
            ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG,
                      ab_iso_ReadTOC2, 0, st_VMMainInfo.p_VM_Info[dev_idx].return_data_length);
        } else {
            st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASC = 0x24;
            st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASCQ = 0x00;
            st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseKey = 0x05;
            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 0;
        }
    } else {
        FileStorDevCMDExecuteISO_Default(vm, dev_idx);
        return;
    }
    State_Fn_EXECUTE_CBW2(vm, dev_idx);
}

function Linux_FileStorDevCMDExecuteMountIMGImage(vm, dev_idx) {
    let ab_mmc_readFormatCap = new Uint8Array([
        0x00, 0x00, 0x00, 0x08, 0x00, 0x40,
        0x00, 0x00, 0x02, 0x00, 0x02, 0x00
    ]);

    let ab_sbc3_inquiry_simToFlash = new Uint8Array([
        0x00, 0x80, 0x00, 0x01, 0x1F, 0x00, 0x00, 0x00, 0x47, 0x45, 0x4E, 0x45,
        0x52, 0x49, 0x43, 0x20, 0x56, 0x69, 0x72, 0x74, 0x75, 0x61, 0x6C, 0x20,
        0x46, 0x6C, 0x6F, 0x70, 0x70, 0x79, 0x20, 0x20, 0x33, 0x30, 0x30, 0x30
    ]);

    let ab_sb3_readCap = new Uint8Array([
        0x01, 0xdf, 0x36, 0xff, 0x00, 0x00, 0x02, 0x00
    ]);

    let vmInfo = vm.st_VMMainInfo.p_VM_Info[dev_idx];

    {
        // Convert LSB to MSB to comply SCSI spec.
        let totalSecs = vmInfo.w_ISO_size;
        ab_sb3_readCap[3] = (totalSecs) & 0xFF;
        ab_sb3_readCap[2] = (totalSecs >> 8) & 0xFF;
        ab_sb3_readCap[1] = (totalSecs >> 16) & 0xFF;
        ab_sb3_readCap[0] = (totalSecs >> 24) & 0xFF;
    }

    let cbwcb = vmInfo.BOInfo.CBW_CB[0];
    switch (cbwcb) {
        case 0x25: {
            vmInfo.VMThrdInfo.TxLengSet = vmInfo.return_data_length = 8;
            ArrayCopy(vmInfo.VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG, ab_sb3_readCap, 0, vmInfo.return_data_length);
            break;
        }

        case 0x23: {
            let numBlocks = vmInfo.w_ISO_size - 1;
            ab_mmc_readFormatCap[4] = (numBlocks >> 24) & 0xFF;
            ab_mmc_readFormatCap[5] = (numBlocks >> 16) & 0xFF;
            ab_mmc_readFormatCap[6] = (numBlocks >> 8) & 0xFF;
            ab_mmc_readFormatCap[7] = (numBlocks) & 0xFF;
            vmInfo.VMThrdInfo.TxLengSet = vmInfo.return_data_length = 36;
            ArrayCopy(vmInfo.VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG, ab_mmc_readFormatCap, 0, vmInfo.return_data_length);
            break;
        }

        case 0x12: {
            vmInfo.error_handle_info.ASC = 0x00;
            vmInfo.error_handle_info.ASCQ = 0x00;
            vmInfo.error_handle_info.SenseKey = 0x00;
            vmInfo.VMThrdInfo.TxLengSet = vmInfo.return_data_length = 36;
            ArrayCopy(vmInfo.VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG, ab_sbc3_inquiry_simToFlash, 0, vmInfo.return_data_length);
            break;
        }

        default: {
            FileStorDevCMDExecuteIMA_Default(vm, dev_idx);
            return;
        }
    }
    State_Fn_EXECUTE_CBW2(vm, dev_idx);
}

function FileStorDevCMDExecuteISO_Default(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    vm.debug("FileStorDevCMDExecuteISO_Default - CBW_CB[0]=0x"
            + st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0].toString(16));
    vm.debug(" ");

    if (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0] == 0x03) {
        st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 0x12;
        ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG,
                  st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData, 0, 0x12);
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[2] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[12] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[13] = 0x00;
        FileStorDevCMDExecuteISO_Default2(vm, dev_idx);
        State_Fn_EXECUTE_CBW2(vm, dev_idx);
    } else if((st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.Data_Dir == MEDIA_DATA_IN)
              || (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength == 0x00)) {
        FileStorCMD_ISO_API(st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CBLength,
                            vm,
                            dev_idx,
                            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf,
                            LENGTH_PDU_TAG,
                            st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB,
                            st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength,
                            st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.Data_Dir,
                            st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData,
                            st_VMMainInfo.p_VM_Info[dev_idx].ioctl_ret_value);
    } else {
        FileStorCMD_ISO_API(st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CBLength,
                            vm,
                            dev_idx,
                            st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf,
                            LENGTH_PDU_TAG,
                            st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB,
                            st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength,
                            st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.Data_Dir,
                            st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData,
                            st_VMMainInfo.p_VM_Info[dev_idx].ioctl_ret_value);
    }
}

function FileStorDevCMDExecuteISO_Default2(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    if ((st_VMMainInfo.p_VM_Info[dev_idx].return_data_length == 0x00) && (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength != 0x00)) {
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASC = st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[12] = 0x24;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASCQ = st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[13] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseKey = st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[2] = 0x05;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].return_data_length;
    } else {
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASC = st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[12];
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASCQ = st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[13];
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseKey = st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[2];
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet = st_VMMainInfo.p_VM_Info[dev_idx].return_data_length;
    }
}

var DISC_BECOMINGEREADY = 0x00000001;

// Increase DEFAULT_BLOCKS for larger space
// 2147483648 =>  1  TB
//  134217728 => 64  GB
//   33554432 => 16  GB
//   16777216 =>  8  GB
//    8388608 =>  4  GB
//    4194304 =>  2  GB
var DEFAULT_BLOCKS      = 33554432;
var DEFAULT_BLOCK_SIZE  = 512;

function Linux_FileStorDevCMDExecuteMountFolder(vm, dev_idx){
    "use strict";
    vm.debug("DevCMDExecuteMountFolder start...");
    var st_VMMainInfo = vm.st_VMMainInfo;
    var sec_idx = 0;
    var sec_offset = 0;
    var postCount = 0;
    var ab_ReqSense_ok =
        new Uint8Array([0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0A, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    var ab_sbc3_ReadCap = new Uint8Array([0x00, 0x3E, 0x80, 0x00, 0x00, 0x00, 0x02, 0x00]);
    var ab_sbc3_readformatcap = new Uint8Array(12);
    var block_size = DEFAULT_BLOCK_SIZE;
    var blocks = DEFAULT_BLOCKS;

    ab_sbc3_readformatcap[3]  = 8;
    ab_sbc3_readformatcap[8]  = 2;
    ab_sbc3_readformatcap[4]  = (blocks >> 24) & 0xFF;
    ab_sbc3_readformatcap[5]  = (blocks >> 16) & 0xFF;
    ab_sbc3_readformatcap[6]  = (blocks >>  8) & 0xFF;
    ab_sbc3_readformatcap[7]  =  blocks        & 0xFF;
    ab_sbc3_readformatcap[9]  = (block_size >> 16) & 0xFF;
    ab_sbc3_readformatcap[10] = (block_size >>  8) & 0xFF;
    ab_sbc3_readformatcap[11] =  block_size        & 0xFF;

    blocks--;
    ab_sbc3_ReadCap[0] = (blocks >> 24) & 0xFF;
    ab_sbc3_ReadCap[1] = (blocks >> 16) & 0xFF;
    ab_sbc3_ReadCap[2] = (blocks >>  8) & 0xFF;
    ab_sbc3_ReadCap[3] =  blocks        & 0xFF;
    ab_sbc3_ReadCap[4] = (block_size >> 24) & 0xFF;
    ab_sbc3_ReadCap[5] = (block_size >> 16) & 0xFF;
    ab_sbc3_ReadCap[6] = (block_size >>  8) & 0xFF;
    ab_sbc3_ReadCap[7] =  block_size        & 0xFF;

    if(st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0] == 0x03) {     //Get Physical Storage Device Sense Data
        vm.debug("DevCMDExecuteMountFolder: CBW_CB[0] = 0x03");
        st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 0x12;
        if(st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[0] == 0x00) {
            ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData,
                      0, ab_ReqSense_ok, 0, 18);
        }
        if((st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[2] == 0x02)
           && (st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[12] == 0x04)
           && (st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[13] == 0x01)
            ) {
            st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.DiscModeSenseStatus |=
                DISC_BECOMINGEREADY;
        } else if((st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[2] == 0x00)
                  && (st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[12] == 0x00)
                  && (st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[13] == 0x00)
                  &&
                  ((st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.DiscModeSenseStatus &
                    DISC_BECOMINGEREADY) != 0x00)
            ) {
            st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.DiscModeSenseStatus &=
                ~DISC_BECOMINGEREADY;
            st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[2] = 0x06;
            st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[12] = 0x28;
            st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[13] = 0x00;
        }

        ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG,
                  st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData, 0, 0x12);
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[2] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[12] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[13] = 0x00;
    }
    else if(st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0] == 0x28) {
        vm.debug("DevCMDExecuteMountFolder: CBW_CB[0] = 0x28");
        sec_offset = ((st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[2]) << 24)
                      | ((st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[3]) << 16)
                      | ((st_VMMainInfo.p_VM_Info[dev_idx].BOInfo. CBW_CB[4]) << 8)
                      | (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[5]);

        for (sec_idx = 0; sec_idx < st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[8]; sec_idx++) {
            vm.debug("calling TFATFileSystemImage_VirtualRead...., CBW_CB[8]=" + st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[8]);
            vm._vmWorker[dev_idx].postMessage(
                                             ['TFATFileSystemImage_VirtualRead',
                                              dev_idx,
                                              null,
                                              LENGTH_PDU_TAG + sec_idx * 512,
                                              sec_offset + sec_idx]);
            //TFATFileSystemImage_VirtualRead(dev_idx,
            //                               st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf
            //                                [LENGTH_PDU_TAG + sec_idx * 512],
            //                                sec_offset + sec_idx);
        }
        vm._vmWorker[dev_idx].onmessage = function(e){
            "use strict";
            var data = e.data[0];
            ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, data[1], data[0], 0, 512);

            postCount += 1;
            if (postCount == st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[8]) {

                st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[12] = 0x00;
                st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[13] = 0x00;
                st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[2] = 0x00;


                st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet =
                    st_VMMainInfo.p_VM_Info[dev_idx].return_data_length =
                    st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength;

                st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASC =
                    st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[12];
                st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASCQ =
                    st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[13];
                st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseKey =
                    st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[2];
                st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet =
                    st_VMMainInfo.p_VM_Info[dev_idx].return_data_length;

                State_Fn_EXECUTE_CBW2(vm, dev_idx);
                vm._vmWorker[dev_idx].onmessage = null;
            }
        };
        return;
    } else if (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0] == 0x2a) {
        vm.debug("DevCMDExecuteMountFolder: CBW_CB[0] = 0x2a");
        sec_offset =
            ((st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[2]) << 24) |
            ((st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[3]) << 16) |
            ((st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[4]) << 8) |
            (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[5]);

        for (sec_idx = 0; sec_idx < st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[8]; sec_idx++) {
            vm.debug("calling TFATFileSystemImage_VirtualWrite....");
            vm._vmWorker[dev_idx].postMessage(
                                              ['TFATFileSystemImage_VirtualWrite',
                                               dev_idx,
                                               st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf,
                                               LENGTH_PDU_TAG + sec_idx * 512,
                                               sec_offset + sec_idx]);
            //TFATFileSystemImage_VirtualWrite(dev_idx,
            //                                 st_VMMainInfo.p_VM_Info
            //                                 [dev_idx].VMThrdInfo.Rx_Buf
            //                                 [LENGTH_PDU_TAG + sec_idx * 512],
            //                                 sec_offset + sec_idx);
        }
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[12] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[13] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[2] = 0x00;

        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet =
            st_VMMainInfo.p_VM_Info[dev_idx].return_data_length =
            st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength;
    } else if (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0] == 0x25) {
        vm.debug("DevCMDExecuteMountFolder: CBW_CB[0] = 0x25");
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[12] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[13] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[2] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet =
            st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 8;
        ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG,
                  ab_sbc3_ReadCap, 0, 8);
    } else if(st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0] == 0x23) {
        vm.debug("DevCMDExecuteMountFolder: CBW_CB[0] = 0x23");
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASC = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASCQ = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseKey = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet =
            st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 12;
        ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG,
                  ab_sbc3_readformatcap, 0, 12);
    } else if (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0] == 0x12) {
        vm.debug("DevCMDExecuteMountFolder: CBW_CB[0] = 0x12");
        let ab_vf_Inquary = new Uint8Array([
            0x00, 0x80, 0x00, 0x01, 0x1F, 0x00, 0x00, 0x00, 0x47, 0x45, 0x4E,
            0x45, 0x52, 0x49, 0x43, 0x20, 0x56, 0x69, 0x72, 0x74, 0x75, 0x61, 0x6C,
            0x20, 0x46, 0x6C, 0x6F,
            0x70, 0x70, 0x79, 0x20, 0x20, 0x33, 0x30, 0x30, 0x30
        ]);

        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet =
            st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 36;
        ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG, ab_vf_Inquary, 0, 36);
    } else if (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0] == 0x1A) {
        vm.debug("DevCMDExecuteMountFolder: CBW_CB[0] = 0x1A");
        let ab_vf_ModeSense6 = new Uint8Array([0x03, 0x00, 0x00, 0x00]);

        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet =
            st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = 4;
        ArrayCopy(st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, LENGTH_PDU_TAG, ab_vf_ModeSense6, 0, 4);
    }  else {
        vm.debug("Unsupport cbwcb");
    }

    vm.debug("DevCMDExecuteMountFolder: st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = " + st_VMMainInfo.p_VM_Info[dev_idx].return_data_length);

    st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASC =
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[12];
    st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASCQ =
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[13];
    st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseKey =
        st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData[2];
    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet =
        st_VMMainInfo.p_VM_Info[dev_idx].return_data_length;

    State_Fn_EXECUTE_CBW2(vm, dev_idx);
    vm.debug("DevCMDExecuteMountFolder: done");
}

function FileStorDevCMDExecuteIMA_Default(vm, dev_idx) {
    "use strict";
    vm.debug("FileStorDevCMDExecuteIMA_Default start...");
    var st_VMMainInfo = vm.st_VMMainInfo;

    if((st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.Data_Dir == MEDIA_DATA_IN) || (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength == 0x00)) {    //Execute Bulk In CMD or Zero Data Transfer CMD
        vm.debug("FileStorDevCMDExecuteIMA_Default: fill TxBuf");
        // st_VMMainInfo.p_VM_Info[dev_idx].return_data_length =
            FileStorCMD_IMA_API(st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CBLength, dev_idx,
                                st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf,
                                st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB,
                                st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength,
                                st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.Data_Dir,
                                st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData,
                                st_VMMainInfo.p_VM_Info[dev_idx].ioctl_ret_value);
    } else                      //MEDIA_DATA_OUT
    {                           //Execute Bulk Out CMD
        vm.debug("FileStorDevCMDExecuteIMA_Default: fill RxBuf");
        // st_VMMainInfo.p_VM_Info[dev_idx].return_data_length =
            FileStorCMD_IMA_API(st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CBLength, dev_idx,
                                st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_Buf,
                                st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB,
                                st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength,
                                st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.Data_Dir,
                                st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.SenseData,
                                st_VMMainInfo.p_VM_Info[dev_idx].ioctl_ret_value);
    }

    vm.debug("FileStorDevCMDExecuteIMA_Default done");
}

function FileStorDevCMDExecuteIMA_Default2(vm, dev_idx) {
    "use strict";
    let vmInfo = vm.st_VMMainInfo.p_VM_Info[dev_idx];

    if (vmInfo.return_data_length == 0x00 && vmInfo.BOInfo.CBW_DataTransferLength != 0x00) {
        vmInfo.error_handle_info.ASC = vmInfo.error_handle_info.SenseData[12] = 0x24;
        vmInfo.error_handle_info.ASCQ = vmInfo.error_handle_info.SenseData[13] = 0x00;
        vmInfo.error_handle_info.SenseKey = vmInfo.error_handle_info.SenseData[2] = 0x05;
        vmInfo.VMThrdInfo.TxLengSet = vmInfo.return_data_length;
    } else {
        vmInfo.error_handle_info.ASC = vmInfo.error_handle_info.SenseData[12];
        vmInfo.error_handle_info.ASCQ = vmInfo.error_handle_info.SenseData[13];
        vmInfo.error_handle_info.SenseKey = vmInfo.error_handle_info.SenseData[2];
        vmInfo.VMThrdInfo.TxLengSet = vmInfo.return_data_length;
    }
}

function FileStorCMD_IMA_API(cmdlength,
                             dev_idx,
                             dataBuffer,
                             cdb,
                             sectorSize,
                             data_dir,
                             sensecode,
                             ioctl_ret_value) {
    "use strict";
    vm.debug("FileStorCMD_IMA_API start ...");
    var st_VMMainInfo = vm.st_VMMainInfo;
    let respBuff = new Uint8Array(dataBuffer.length);
    sensecode[12] = 0x00;
    sensecode[13] = 0x00;

    vm._vmWorker[dev_idx].postMessage([st_VMMainInfo.p_VM_Info[dev_idx].f_image, cdb, cmdlength, respBuff, sectorSize, sensecode, "img"]);
    vm._vmWorker[dev_idx].onmessage = function(e) {
        let [buff, length] = e.data;
        st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = length;
        ArrayCopy(dataBuffer, LENGTH_PDU_TAG, buff, 0, length);

        FileStorDevCMDExecuteIMA_Default2(vm, dev_idx);
        State_Fn_EXECUTE_CBW2(vm, dev_idx);
        vm._vmWorker[dev_idx].onmessage = null;
    }
}

function PrintTxBuffer(vm, dev_idx){
  "use strict";
  var st_VMMainInfo = vm.st_VMMainInfo;
  var length;
  if (st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet > 70)
      length = 70;
  else
      length = st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet;
  var TmpBuf = new Uint8Array(length);
  ArrayCopy(TmpBuf, 0, st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, 0, length);
  vm.debug("PrintTxBuffer: " + TmpBuf.toString());
}

function State_Fn_EXECUTE_CBW2(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    FillDataPDUTag(vm, dev_idx);
    FillErrorData(vm, dev_idx);
    if ((st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.Data_Dir == MEDIA_DATA_IN)
        || (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_DataTransferLength == 0x00)) {
        FillCSW(vm, dev_idx);
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en = ENABLE;
    } else {
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en = DISABLE;
    }

    st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Rx_en = ENABLE;
    SetState_ReadPDU(vm, dev_idx);

    // PrintTxBuffer(vm, dev_idx);

    if ((st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_en == ENABLE) &&
        (st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet > 0)) {
        vm.debug("State_Fn_EXECUTE_CBW2: Device " + dev_idx + "send " + st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet + " bytes to VM server");
        vm.Send(dev_idx, st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf, st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet,0, null);

        // Only record sent data in READ(10) command
        if (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CBW_CB[0] == 0x28) {
            vm._sentDataBytes += st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet;
            vm._eventHandlers.process(vm._sentDataBytes, dev_idx);
        }

    }
}

function FillDataPDUTag(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    if (st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.Data_Dir == MEDIA_DATA_IN) {
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[0] = BI_ENP_AND_TK_OUT_DV1;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[1] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[2] = st_VMMainInfo.p_VM_Info[dev_idx].b_DevID;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[3] = 0x00;
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[4] = (st_VMMainInfo.p_VM_Info[dev_idx].return_data_length & 0x000000FF);
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[5] = ((st_VMMainInfo.p_VM_Info[dev_idx].return_data_length & 0x0000FF00) >> 8);
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[6] = ((st_VMMainInfo.p_VM_Info[dev_idx].return_data_length & 0x00FF0000) >> 16);
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.Tx_Buf[7] = ((st_VMMainInfo.p_VM_Info[dev_idx].return_data_length & 0xFF000000) >> 24);
        st_VMMainInfo.p_VM_Info[dev_idx].VMThrdInfo.TxLengSet += LENGTH_PDU_TAG;
    }
}

function FillErrorData(vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;

    if ((st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASC != 0x00)
        || (st_VMMainInfo.p_VM_Info[dev_idx].error_handle_info.ASCQ != 0x00)) {
        st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CSW_Status = CSW_STATE_FAIL;
    } else {
        st_VMMainInfo.p_VM_Info[dev_idx].BOInfo.CSW_Status = CSW_STATE_SUCCESS;
    }
}

function FileStorCMD_ISO_API(cmdlength, vm, dev_idx, dataBuffer, offset, cdb, sectorSize, data_dir, sensecode, ioctl_ret_value) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var resp_length = { value: 0 };
    "use strict";
    var temp = new Uint8Array(dataBuffer.length);
    sensecode[12] = 0x00;
    sensecode[13] = 0x00;

    if (cdb[0] != 0x2a) {
        vm._vmWorker[dev_idx].postMessage([st_VMMainInfo.p_VM_Info[dev_idx].f_image, cdb, cmdlength, temp, resp_length, sensecode, "iso"]);
        vm._vmWorker[dev_idx].onmessage = function(e) {
            "use strict";
            st_VMMainInfo.p_VM_Info[dev_idx].return_data_length = resp_length.value = e.data[1].value;
            temp = e.data[0];
            for (var index = 0; index < resp_length.value; index++) {
                dataBuffer[offset + index] = temp[index];
            }

            if (cdb[0] == 0x4a) {
                dataBuffer[3] = 0x5e;
            }

            FileStorDevCMDExecuteISO_Default2(vm, dev_idx);
            State_Fn_EXECUTE_CBW2(vm, dev_idx);
            vm._vmWorker[dev_idx].onmessage = null;
        };
        //return resp_length;
    } else {
        //return 0;
    }
}

function UI_UnMount_VM(vm, dev_idx, user_name, password, server_ip) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var res;
    var cb_idx = st_VMMainInfo.p_VM_Info[dev_idx].user_select_cb_idx;
    var media_type = st_VMMainInfo.FunDepVar.MediaSupportTab.FileStorDevTypeID[cb_idx];

    st_VMMainInfo.b_UserNameLength = user_name.length;
    st_VMMainInfo.b_PwdLength = password.length;
    if (st_VMMainInfo.b_UserNameLength > LENGTH_MAX_USERNAME) {
        vm._eventHandlers.error("Device " + dev_idx + " invalid username length: "
                + st_VMMainInfo.b_UserNameLength + " max: " + LENGTH_MAX_USERNAME, dev_idx);
        return -1;
    }
    if (st_VMMainInfo.b_PwdLength > LENGTH_MAX_PASSWORD) {
        vm._eventHandlers.error("Device " + dev_idx + ": invalid password length: "
                + st_VMMainInfo.b_PwdLength + " max: " + LENGTH_MAX_PASSWORD, dev_idx);
        return -1;
    }
    st_VMMainInfo.b_UserName = user_name;
    st_VMMainInfo.b_PassWord = password;
    if (server_ip.charAt(0) == '[') {
        if (server_ip.length >= 2) {
            st_VMMainInfo.b_ServerIP = server_ip.slice(1, (server_ip.length - 1));
        }
    } else {
        st_VMMainInfo.b_ServerIP = server_ip;
    }
    vm.debug("UI_UnMount_VM: server_ip = " + st_VMMainInfo.b_ServerIP);
    res = UnMtVM_Engine_Main(vm, dev_idx, media_type);
    if (res > 0) {
        vm.debug("UI_UnMount_VM: UnMount Success");
    } else {
        vm.debug("UI_UnMount_VM: UnMount failed");
    }
}

function UnMtVM_Engine_Main(vm, dev_idx, media_type) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var res = -1;
    if (st_VMMainInfo.p_VM_Info[dev_idx].DevExistFlg != ENABLE) {
        vm.debug("ISO file call UnMtVM_Engine_Normal !!");
        res = UnMtVM_Engine_Normal(vm, dev_idx, media_type);
    } else{
        vm._eventHandlers.error("Device " + dev_idx + ": invalid unmount action", dev_idx);
    }
    return res;
}

function UnMtVM_Engine_Normal(vm, dev_idx, media_type) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var res = 1;
    var PhyDevFPTabIdx = st_VMMainInfo.p_VM_Info[dev_idx].PhyDevFPTabIdx;
    vm.debug("UnMtVM_Engine_Normal -1");

    switch (media_type & MASK_MEDIA_TYPE_TAG){
        case REC_PHY_STOR_DEV_TAG:
            vm.debug("REC_PHY_STOR_DEV_TAG:");
            vm._eventHandlers.error("Device " + dev_idx + ": invalide media type: " + media_type, dev_idx);
            return -1;
        case REC_FILE_STOR_DEV_TAG:
            vm.debug("REC_FILE_STOR_DEV_TAG:");
            st_VMMainInfo.FunDepVar.FileDevFP[(media_type & MASK_DEV_NUM)].FunPt_DevUnMount(vm, dev_idx);
            break;
        default:
            vm._eventHandlers.error("Device " + dev_idx + ": invalide media type: " + media_type, dev_idx);
            res = -1;
            break;
    }
    return res;
}

function UnMtMethod_Media(vm, dev_idx) {
    "use strict";
    var st_VMMainInfo = vm.st_VMMainInfo;
    vm._sentDataBytes = 0;

    vm.debug("UnMtMethod_Media: call CoreUnMt_GetDevStatusFromFW");
    CoreUnMt_GetDevStatusFromFW(st_VMMainInfo.b_ServerIP,
                                st_VMMainInfo.p_VM_Info[dev_idx].DevLanPort,
                                st_VMMainInfo.VMMainInfo_GUI_VMCount,
                                vm,
                                dev_idx);
}

function CoreUnMt_GetDevStatusFromFW(b_ServerIP, StatusLanPort, total_dev_num, vm, dev_idx) {
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var length;

    vm.Send(dev_idx, [0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00], 8, 0, function(vm, dev_idx) {

            if(vm._websock[dev_idx].rQlen() != DEVICE_STATUS_RESPONSE_LENGTH) {  //not DevStatus
                console.log("CoreUnMt_GetDevStatusFromFW: Received wrong data! (leng != 13)");
                if(vm._websock[dev_idx].rQlen() == DEVICE_STATUS_MIX_DATA_LENGTH) {
                    console.log("CoreUnMt_GetDevStatusFromFW: Received wrong data! (length = 52)");
                    CoreUnMt_GetDevStatusFromFW(st_VMMainInfo.b_ServerIP,
                                                st_VMMainInfo.p_VM_Info[dev_idx].DevLanPort,
                                                st_VMMainInfo.VMMainInfo_GUI_VMCount,
                                                vm,
                                                dev_idx);
                    return;
                }
                vm._websock[dev_idx].rQshiftBytes(vm._websock[dev_idx].rQlen()); //clear buffer

                vm._recvHandler[dev_idx] = function (vm, dev_idx){   //listen again
                    CoreUnMt_HandleReceivedStatus(vm, dev_idx);
                };
                return;
            }

            CoreUnMt_HandleReceivedStatus(vm, dev_idx);
    });
}

function CoreUnMt_HandleReceivedStatus(vm, dev_idx) {
    "use strict";
    var st_VMMainInfo = vm.st_VMMainInfo;
    var data_buffer = new Uint8Array(vm._websock[dev_idx].rQshiftBytes(8));
    var length = data_buffer[4] + (data_buffer[5] << 8) + (data_buffer[6] << 16) + (data_buffer[7] << 24);
    data_buffer = new Uint8Array(vm._websock[dev_idx].rQshiftBytes(length));
    vm._recvHandler[dev_idx] = vm.VM_Thread;
    vm.debug("Core_GetDevStatusFromFW - 1");
    vm.debug("data_buffer[" + dev_idx+1 + "] = " + data_buffer[dev_idx + 1]);
    st_VMMainInfo.p_VM_Info[dev_idx].UnCheckGUIObjAtb_flg = DISABLE;
    if (data_buffer[dev_idx + 1] != 0xFF) {
        st_VMMainInfo.p_VM_Info[dev_idx].DevExistType = data_buffer[dev_idx+1];
        UnMtMethod_Media2(vm, dev_idx, data_buffer[dev_idx + 1]);
    } else {
        UnMtMethod_Media2(vm, dev_idx, FW_NO_EXIST_MEDIA);
    }

}

function UnMtMethod_Media2(vm, dev_idx, res){
    "use strict";
    //var dev_idx = vm.dev_idx;
    var st_VMMainInfo = vm.st_VMMainInfo;
    var Sdata = new Uint8Array(1500);
    var SpktLength = { value: 0 };
    var DevStatusFromFW = res;

    vm.debug("DevStatusFromFW=" + DevStatusFromFW);
    if (DevStatusFromFW == FW_NO_EXIST_MEDIA) {
        st_VMMainInfo.p_VM_Info[dev_idx].VM_Mt_Process_Stage = VM_MNT_PROCESS_STAGE0;
        VM_TCPSocket_Terminate(vm, dev_idx);
        ReSetVMInfo_Main(vm, dev_idx);
        GetRandomTimeStamp(vm);
        SetDevInfandEPdescriptorStatus(dev_idx, DISABLE);
        return;
    }
    Core_VM_SendUnMountPkt(vm, dev_idx);
    vm.debug("UnMtMethod_Media2 -1");
    ReSetVMInfo_Main(vm, dev_idx);
    GetRandomTimeStamp(vm);
    SetDevInfandEPdescriptorStatus(dev_idx, DISABLE);
}

function Core_VM_SendUnMountPkt(vm, dev_idx){
    "use strict";
    vm.Send(dev_idx, [0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00], 8, 0, vm.VM_Thread);
}

function Linux_FileStorDevCloseMountFolder(vm, dev_idx){
    "use strict";
    vm._vmWorker[dev_idx].postMessage(
                            ['Folder_RemoveImage',
                             dev_idx]);
}
