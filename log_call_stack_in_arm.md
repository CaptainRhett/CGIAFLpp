在每条 ARM 函数调用指令翻译的过程中插入一段检测逻辑，用于记录调用时压栈的返回地址和调用栈，用于错误定位和判断是否因为栈溢出而覆盖返回地址。

在 QEMU 用户模式中，每当翻译到 ARM 的函数调用指令（比如 BL, BLX 等）时，插入一段检测逻辑，来记录：
    - 当前 PC（程序计数器）；
    - 返回地址（即 call 指令会压栈的值）；
    - 当前栈指针；
    - 当前调用栈的内容（或摘要）；

# ARM 函数调用指令分析
在arm中函数调用主要依靠以下指令完成：
    - BL：把 PC+4 存入 LR (R14)，跳转
    - BLX：同 BL，但支持切换 Thumb/ARM 状态
    - STMFD SP!, {LR}：显式压栈 LR 保存返回地址（在函数 prologue 中）



# 解决方案思路
在 translate.c 中识别到 BL / BLX 指令时，生成一个 helper 调用，它会：

读取当前 PC；

读取当前 SP；

读取或摘要当前栈（比如栈顶 N 个字）；

# 反汇编hello_cgi_arm学习
## 基本信息
### 源代码：
// hello_cgi.c
#include <stdio.h>
#include <stdlib.h>

int main(void) {

    char *query = getenv("PATH_INFO");
    if (query != NULL && *query != '\0') {
        printf("<h1>Received query: %s</h1>\n", query);
    } else {
        printf("<h1>Hello from CGI!</h1>\n");
    }

    return 0;
}

### 编译选项：
CC := /home/wuhuang/fuzz/qasan/gcc-linaro-4.9-2016.02-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi-gcc
CFLAGS += -L /home/wuhuang/fuzz/qasan/gcc-linaro-4.9-2016.02-x86_64_arm-linux-gnueabi/arm-linux-gnueabi -ggdb -g -fno-stack-protector -z execstack

SRC := hello_cgi.c 
HDR := hello_cgi_arm

all: $(HDR)

$(HDR): $(SRC)
		$(CC) $(CFLAGS) -o $(HDR) $(SRC)

### 反汇编选项：
/home/wuhuang/fuzz/qasan/gcc-linaro-4.9-2016.02-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi-objdump -D ./hello_cgi_arm >> hello_cgi_arm_disas

## disas分析
### .plt 过程连接表
procedure linkage table，也叫内部函数表

### .got 全局偏移表
global offset table

# ARM指令指南

## a32和t32
t32指的是对arm thumb指令集的翻译。thumb指令是arm的压缩版

在arm指令中要使用bx来跳转到thumb指令


## ARM调用约定
ARM函数之间的调用遵循ATPCS规则

ATPCS规则是

# 先研究qasan原版中对translate逻辑的插桩
## qasan_shadow_stack_push
1/6：
else if ((insn & 0x0e000000) == 0x0a000000) {
            if (qasan_max_call_stack)
              gen_helper_qasan_shadow_stack_push(tcg_const_ptr(s->pc));
            /* branch link and change to thumb (blx <offset>) */
            int32_t offset;

# qemu代码生成逻辑
.t16.decode 文件  --->  decode-t16.c.inc（构建中生成）
                            ↓
                     trans_BLX_r 的声明 + 调用（匹配规则）
                            ↓
                 trans_BLX_r 的实现写在 translate.c 中


            
