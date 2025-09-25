AFL_PP="/home/wuhuang/CGIAFLpp/afl-fuzz"

TARGETa="/home/wuhuang/CGIAFLpp/dataset/Inspur_SA5212M5_spx_restservice"
CRAMFS_ROOTa="/home/wuhuang/CGIAFLpp/dataset/_SA5212M5_BMC_4.29.9_Standard_20231227.extracted/cramfs-root"


QEMU_LD_PREFIX="$CRAMFS_ROOTa" CGI_MLEAK=1 AFL_USE_QASAN=1 QASAN_MAX_CALL_STACK=16 "$AFL_PP" -Q -i /home/wuhuang/CGIAFLpp/input -o /home/wuhuang/CGIAFLpp/output -t 4000 "$TARGETa" @@