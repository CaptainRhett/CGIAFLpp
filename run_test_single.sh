#!/bin/bash

# 固定环境变量

# CGI 程序路径
TARGETa="/home/wuhuang/CGIAFLpp/dataset/Inspur_SA5212M5_spx_restservice"
CRAMFS_ROOTa="/home/wuhuang/CGIAFLpp/dataset/_SA5212M5_BMC_4.29.9_Standard_20231227.extracted/cramfs-root"

AFL_TRACE="/home/wuhuang/CGIAFLpp/afl-qemu-trace"

# 所有要测试的 PATH_INFO

path_infos=(
    "/logs/audit"
)

# 要测试的请求方法
request_methods=("GET" "POST" "PUT" "DELETE")

# 固定参数
COMMON_ARGS=(
    "-E" "CONTENT_TYPE=text/html"
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

# for method in "${request_methods[@]}"; do
#     for path in "${path_infos[@]}"; do
#         echo "=== Testing METHOD: $method | PATH_INFO: $path ==="
#         QEMU_LD_PREFIX="$CRAMFS_ROOTa" CGI_MLEAK=1 AFL_USE_QASAN=1 QASAN_MAX_CALL_STACK=16 "$AFL_TRACE" "${COMMON_ARGS[@]}" -E "REQUEST_METHOD=$method" -E "PATH_INFO=$path" "$TARGETa"
#         echo ""
#     done
# done

# for method in "${request_methods[@]}"; do
#     for path in "${path_infos[@]}"; do
#         echo "=== Testing METHOD: $method | PATH_INFO: $path ==="
#         QEMU_LD_PREFIX="$CRAMFS_ROOTb" CGI_MLEAK=1 AFL_USE_QASAN=1 QASAN_MAX_CALL_STACK=16 "$AFL_TRACE" "${COMMON_ARGS[@]}" -E "REQUEST_METHOD=$method" -E "PATH_INFO=$path" "$TARGETb"
#         echo ""
#     done
# done

