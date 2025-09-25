# AFLplusplus/build_qemu_mode_only.sh
cd qemu_mode/
CROSS=/home/wuhuang/CGIAFLpp/env_tools/gcc-linaro-4.9-2016.02-rc1-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi-gcc CPU_TARGET=arm DEBUG=1 ./build_qemu_support.sh
if [ $? == 0 ]
then
    cd -
    sudo make install
fi