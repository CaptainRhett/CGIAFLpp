#!/bin/bash

# 固定环境变量

# CGI 程序路径
TARGETa="/home/wuhuang/fuzz/CGIAFLpp/dataset/inspur_NF8480M5_spx_restservice"
CRAMFS_ROOTa="/home/wuhuang/fuzz/CGIAFLpp/dataset/_NF8480M5_BMC_1.19.53_Standard_20230508.extracted/cramfs-root"

TARGETb="/home/wuhuang/fuzz/CGIAFLpp/dataset/inspur_NF5270M5_spx_restservice"
CRAMFS_ROOTb="/home/wuhuang/fuzz/CGIAFLpp/dataset/_NF5270M5_BMC_4.9.4_Standard_20220721.extracted/cramfs-root"

TARGETc="/home/wuhuang/fuzz/CGIAFLpp/dataset/inspur_NF5270M5_spx_restservice"
CRAMFS_ROOTc="/home/wuhuang/fuzz/qasan/cramfs-root"
AFL_TRACE="/home/wuhuang/fuzz/CGIAFLpp/afl-qemu-trace"

# 所有要测试的 PATH_INFO

path_infos=(
    "/usr/local/www/blackbox"
    "/raid/getMVVDInfo"
    "/api/system/info"
    "/api/network/status"
    "/dev/console"
    "/settings/timezone"
    "/settings/user/admin"
    "/data/backup/start"
    "/system/reboot"
    "/system/reset"
    "/log/view"
    "/log/clear"
    "/raid/create"
    "/raid/delete"
    "/network/setdns"
    "/network/setip"
    "/status/health"
    "/sensor/temp"
    "/power/control"
    "/event/trigger"
)

# 要测试的请求方法
request_methods=("GET" "POST" "PUT" "DELETE")

# 固定参数
COMMON_ARGS=(
    "-E" "CONTENT_TYPE=text/html"
    "-E" "HTTP_X_AUTH_TOKEN=testtok"
    "-E" "HTTP_X_CSRFTOKEN=testcsrf"
)

# 遍历组合
# 测试组合
for method in "${request_methods[@]}"; do
    for path in "${path_infos[@]}"; do
        echo "=== Testing METHOD: $method | PATH_INFO: $path ==="
        QEMU_LD_PREFIX="$CRAMFS_ROOTa" CGI_MLEAK=1 AFL_USE_QASAN=1 QASAN_MAX_CALL_STACK=16 "$AFL_TRACE" "${COMMON_ARGS[@]}" -E "REQUEST_METHOD=$method" -E "PATH_INFO=$path" "$TARGETa"
        echo ""
    done
done

for method in "${request_methods[@]}"; do
    for path in "${path_infos[@]}"; do
        echo "=== Testing METHOD: $method | PATH_INFO: $path ==="
        QEMU_LD_PREFIX="$CRAMFS_ROOTb" CGI_MLEAK=1 AFL_USE_QASAN=1 QASAN_MAX_CALL_STACK=16 "$AFL_TRACE" "${COMMON_ARGS[@]}" -E "REQUEST_METHOD=$method" -E "PATH_INFO=$path" "$TARGETb"
        echo ""
    done
done

for method in "${request_methods[@]}"; do
    for path in "${path_infos[@]}"; do
        echo "=== Testing METHOD: $method | PATH_INFO: $path ==="
        QEMU_LD_PREFIX="$CRAMFS_ROOTc" CGI_MLEAK=1 AFL_USE_QASAN=1 QASAN_MAX_CALL_STACK=16 "$AFL_TRACE" "${COMMON_ARGS[@]}" -E "REQUEST_METHOD=$method" -E "PATH_INFO=$path" "$TARGETc"
        echo ""
    done
done