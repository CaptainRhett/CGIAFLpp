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
在TCG前端插桩，当遇到跳转指令如b，bl，bx等时，记录
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
## 条件指令和无条件指令

## 调用指令
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

# 剪枝
static void disas_arm_insn(DisasContext *s, unsigned int insn)
{
    unsigned int cond, val, op1, i, shift, rm, rs, rn, rd, sh;
    TCGv_i32 tmp;
    TCGv_i32 tmp2;
    TCGv_i32 tmp3;
    TCGv_i32 addr;
    TCGv_i64 tmp64;

    /* M variants do not implement ARM mode; this must raise the INVSTATE
     * UsageFault exception.
     */
    if (arm_dc_feature(s, ARM_FEATURE_M)) {
        gen_exception_insn(s, 4, EXCP_INVSTATE, syn_uncategorized(),
                           default_exception_el(s));
        return;
    }
    cond = insn >> 28;
    if (cond == 0xf){}
    if (cond != 0xe) {}
    if ((insn & 0x0f900000) == 0x03000000) {} 
    else if ((insn & 0x0f900000) == 0x01000000
               && (insn & 0x00000090) != 0x00000090) {
        /* miscellaneous instructions */
        op1 = (insn >> 21) & 3;
        sh = (insn >> 4) & 0xf;
        rm = insn & 0xf;
        switch (sh) {
        case 0x1:
            if (op1 == 1) {
                /* branch/exchange thumb (bx).  */
                ARCH(4T);
                tmp = load_reg(s, rm);
                if (rm == 14 && qasan_max_call_stack)
                  gen_helper_qasan_shadow_stack_pop(tmp);
                gen_bx(s, tmp);
            } else if (op1 == 3) {
                /* clz */
                ARCH(5);
                rd = (insn >> 12) & 0xf;
                tmp = load_reg(s, rm);
                tcg_gen_clzi_i32(tmp, tmp, 32);
                store_reg(s, rd, tmp);
            } else {
                goto illegal_op;
            }
            break;
        case 0x2:
            if (op1 == 1) {
                ARCH(5J); /* bxj */
                /* Trivial implementation equivalent to bx.  */
                tmp = load_reg(s, rm);
                if (rm == 14 && qasan_max_call_stack)
                  gen_helper_qasan_shadow_stack_pop(tmp);
                gen_bx(s, tmp);
            } else {
                goto illegal_op;
            }
            break;
    } else if (((insn & 0x0e000000) == 0 &&
                (insn & 0x00000090) != 0x90) ||
               ((insn & 0x0e000000) == (1 << 25))) {
        int set_cc, logic_cc, shiftop;

        op1 = (insn >> 21) & 0xf;
        set_cc = (insn >> 20) & 1;
        logic_cc = table_logic_cc[op1] & set_cc;

        /* data processing instruction */
        if (insn & (1 << 25)) {
            /* immediate operand */
            val = insn & 0xff;
            shift = ((insn >> 8) & 0xf) * 2;
            if (shift) {
                val = (val >> shift) | (val << (32 - shift));
            }
            tmp2 = tcg_temp_new_i32();
            tcg_gen_movi_i32(tmp2, val);
            if (logic_cc && shift) {
                gen_set_CF_bit31(tmp2);
            }
        } else {
            /* register */
            rm = (insn) & 0xf;
            tmp2 = load_reg(s, rm);
            shiftop = (insn >> 5) & 3;
            if (!(insn & (1 << 4))) {
                shift = (insn >> 7) & 0x1f;
                gen_arm_shift_im(tmp2, shiftop, shift, logic_cc);
            } else {
                rs = (insn >> 8) & 0xf;
                tmp = load_reg(s, rs);
                gen_arm_shift_reg(tmp2, shiftop, tmp, logic_cc);
            }
        }
        if (op1 != 0x0f && op1 != 0x0d) {
            rn = (insn >> 16) & 0xf;
            tmp = load_reg(s, rn);
        } else {
            tmp = NULL;
        }
        rd = (insn >> 12) & 0xf;
        switch(op1) {
        case 0x00:
            tcg_gen_and_i32(tmp, tmp, tmp2);
            if (logic_cc) {
                gen_logic_CC(tmp);
            }
            if (rd == 15 && rn == 14 && qasan_max_call_stack)
              gen_helper_qasan_shadow_stack_pop(tmp);
            store_reg_bx(s, rd, tmp);
            break;
        case 0x01:
            tcg_gen_xor_i32(tmp, tmp, tmp2);
            if (logic_cc) {
                gen_logic_CC(tmp);
            }
            if (rd == 15 && rn == 14 && qasan_max_call_stack)
              gen_helper_qasan_shadow_stack_pop(tmp);
            store_reg_bx(s, rd, tmp);
            break;
        case 0x02:
            if (set_cc && rd == 15) {
                /* SUBS r15, ... is used for exception return.  */
                if (IS_USER(s)) {
                    goto illegal_op;
                }
                gen_sub_CC(tmp, tmp, tmp2);
                gen_exception_return(s, tmp);
            } else {
                if (set_cc) {
                    gen_sub_CC(tmp, tmp, tmp2);
                    afl_gen_compcov(s->pc, tmp, tmp2, MO_32, insn & (1 << 25));
                } else {
                    tcg_gen_sub_i32(tmp, tmp, tmp2);
                }
                if (rd == 15 && rn == 14 && qasan_max_call_stack)
                  gen_helper_qasan_shadow_stack_pop(tmp);
                store_reg_bx(s, rd, tmp);
            }
            break;
        case 0x03:
            if (set_cc) {
                gen_sub_CC(tmp, tmp2, tmp);
                afl_gen_compcov(s->pc, tmp, tmp2, MO_32, insn & (1 << 25));
            } else {
                tcg_gen_sub_i32(tmp, tmp2, tmp);
            }
            if (rd == 15 && rn == 14 && qasan_max_call_stack)
              gen_helper_qasan_shadow_stack_pop(tmp);
            store_reg_bx(s, rd, tmp);
            break;
        case 0x04:
            if (set_cc) {
                gen_add_CC(tmp, tmp, tmp2);
            } else {
                tcg_gen_add_i32(tmp, tmp, tmp2);
            }
            if (rd == 15 && rn == 14 && qasan_max_call_stack)
              gen_helper_qasan_shadow_stack_pop(tmp);
            store_reg_bx(s, rd, tmp);
            break;
        case 0x05:
            if (set_cc) {
                gen_adc_CC(tmp, tmp, tmp2);
            } else {
                gen_add_carry(tmp, tmp, tmp2);
            }
            if (rd == 15 && rn == 14 && qasan_max_call_stack)
              gen_helper_qasan_shadow_stack_pop(tmp);
            store_reg_bx(s, rd, tmp);
            break;
        case 0x06:
            if (set_cc) {
                gen_sbc_CC(tmp, tmp, tmp2);
            } else {
                gen_sub_carry(tmp, tmp, tmp2);
            }
            if (rd == 15 && rn == 14 && qasan_max_call_stack)
              gen_helper_qasan_shadow_stack_pop(tmp);
            store_reg_bx(s, rd, tmp);
            break;
        case 0x07:
            if (set_cc) {
                gen_sbc_CC(tmp, tmp2, tmp);
            } else {
                gen_sub_carry(tmp, tmp2, tmp);
            }
            if (rd == 15 && rn == 14 && qasan_max_call_stack)
              gen_helper_qasan_shadow_stack_pop(tmp);
            store_reg_bx(s, rd, tmp);
            break;
        case 0x0c:
            tcg_gen_or_i32(tmp, tmp, tmp2);
            if (logic_cc) {
                gen_logic_CC(tmp);
            }
            if (rd == 15 && rn == 14 && qasan_max_call_stack)
              gen_helper_qasan_shadow_stack_pop(tmp);
            store_reg_bx(s, rd, tmp);
            break;
        case 0x0e:
            tcg_gen_andc_i32(tmp, tmp, tmp2);
            if (logic_cc) {
                gen_logic_CC(tmp);
            }
            if (rd == 15 && rn == 14 && qasan_max_call_stack)
              gen_helper_qasan_shadow_stack_pop(tmp);
            store_reg_bx(s, rd, tmp);
            break;
        if (op1 != 0x0f && op1 != 0x0d) {
            tcg_temp_free_i32(tmp2);
        }
    } else {
        /* other instructions */
        op1 = (insn >> 24) & 0xf;
        switch(op1) {
        case 0x0:
        case 0x1:
            /* multiplies, extra load/stores */
            sh = (insn >> 5) & 3;
            if (sh == 0) {
                if (op1 == 0x0) {
                    rd = (insn >> 16) & 0xf;
                    rn = (insn >> 12) & 0xf;
                    rs = (insn >> 8) & 0xf;
                    rm = (insn) & 0xf;
                    op1 = (insn >> 20) & 0xf;
                    switch (op1) {
                    case 0: case 1: case 2: case 3: case 6:
                        /* 32 bit mul */
                        tmp = load_reg(s, rs);
                        tmp2 = load_reg(s, rm);
                        tcg_gen_mul_i32(tmp, tmp, tmp2);
                        tcg_temp_free_i32(tmp2);
                        if (insn & (1 << 22)) {
                            /* Subtract (mls) */
                            ARCH(6T2);
                            tmp2 = load_reg(s, rn);
                            tcg_gen_sub_i32(tmp, tmp2, tmp);
                            tcg_temp_free_i32(tmp2);
                        } else if (insn & (1 << 21)) {
                            /* Add */
                            tmp2 = load_reg(s, rn);
                            tcg_gen_add_i32(tmp, tmp, tmp2);
                            tcg_temp_free_i32(tmp2);
                        }
                        if (insn & (1 << 20))
                            gen_logic_CC(tmp);
                        store_reg(s, rd, tmp);
                        break;
                    case 4:
                        /* 64 bit mul double accumulate (UMAAL) */
                        ARCH(6);
                        tmp = load_reg(s, rs);
                        tmp2 = load_reg(s, rm);
                        tmp64 = gen_mulu_i64_i32(tmp, tmp2);
                        gen_addq_lo(s, tmp64, rn);
                        gen_addq_lo(s, tmp64, rd);
                        gen_storeq_reg(s, rn, rd, tmp64);
                        tcg_temp_free_i64(tmp64);
                        break;
                    case 8: case 9: case 10: case 11:
                    case 12: case 13: case 14: case 15:
                        /* 64 bit mul: UMULL, UMLAL, SMULL, SMLAL. */
                        tmp = load_reg(s, rs);
                        tmp2 = load_reg(s, rm);
                        if (insn & (1 << 22)) {
                            tcg_gen_muls2_i32(tmp, tmp2, tmp, tmp2);
                        } else {
                            tcg_gen_mulu2_i32(tmp, tmp2, tmp, tmp2);
                        }
                        if (insn & (1 << 21)) { /* mult accumulate */
                            TCGv_i32 al = load_reg(s, rn);
                            TCGv_i32 ah = load_reg(s, rd);
                            tcg_gen_add2_i32(tmp, tmp2, tmp, tmp2, al, ah);
                            tcg_temp_free_i32(al);
                            tcg_temp_free_i32(ah);
                        }
                        if (insn & (1 << 20)) {
                            gen_logicq_cc(tmp, tmp2);
                        }
                        store_reg(s, rn, tmp);
                        store_reg(s, rd, tmp2);
                        break;
                    default:
                        goto illegal_op;
                    }
                } else {
                    rn = (insn >> 16) & 0xf;
                    rd = (insn >> 12) & 0xf;
                    if (insn & (1 << 23)) {
                        /* load/store exclusive */
                        int op2 = (insn >> 8) & 3;
                        op1 = (insn >> 21) & 0x3;

                        switch (op2) {
                        case 0: /* lda/stl */
                            if (op1 == 1) {
                                goto illegal_op;
                            }
                            ARCH(8);
                            break;
                        case 1: /* reserved */
                            goto illegal_op;
                        case 2: /* ldaex/stlex */
                            ARCH(8);
                            break;
                        case 3: /* ldrex/strex */
                            if (op1) {
                                ARCH(6K);
                            } else {
                                ARCH(6);
                            }
                            break;
                        }

                        addr = tcg_temp_local_new_i32();
                        load_reg_var(s, addr, rn);

                        /* Since the emulation does not have barriers,
                           the acquire/release semantics need no special
                           handling */
                        if (op2 == 0) {
                            if (insn & (1 << 20)) {
                                tmp = tcg_temp_new_i32();
                                switch (op1) {
                                case 0: /* lda */
                                    gen_aa32_ld32u_iss(s, tmp, addr,
                                                       get_mem_index(s),
                                                       rd | ISSIsAcqRel);
                                    break;
                                case 2: /* ldab */
                                    gen_aa32_ld8u_iss(s, tmp, addr,
                                                      get_mem_index(s),
                                                      rd | ISSIsAcqRel);
                                    break;
                                case 3: /* ldah */
                                    gen_aa32_ld16u_iss(s, tmp, addr,
                                                       get_mem_index(s),
                                                       rd | ISSIsAcqRel);
                                    break;
                                default:
                                    abort();
                                }
                                store_reg(s, rd, tmp);
                            } else {
                                rm = insn & 0xf;
                                tmp = load_reg(s, rm);
                                switch (op1) {
                                case 0: /* stl */
                                    gen_aa32_st32_iss(s, tmp, addr,
                                                      get_mem_index(s),
                                                      rm | ISSIsAcqRel);
                                    break;
                                case 2: /* stlb */
                                    gen_aa32_st8_iss(s, tmp, addr,
                                                     get_mem_index(s),
                                                     rm | ISSIsAcqRel);
                                    break;
                                case 3: /* stlh */
                                    gen_aa32_st16_iss(s, tmp, addr,
                                                      get_mem_index(s),
                                                      rm | ISSIsAcqRel);
                                    break;
                                default:
                                    abort();
                                }
                                tcg_temp_free_i32(tmp);
                            }
                        } else if (insn & (1 << 20)) {
                            switch (op1) {
                            case 0: /* ldrex */
                                gen_load_exclusive(s, rd, 15, addr, 2);
                                break;
                            case 1: /* ldrexd */
                                gen_load_exclusive(s, rd, rd + 1, addr, 3);
                                break;
                            case 2: /* ldrexb */
                                gen_load_exclusive(s, rd, 15, addr, 0);
                                break;
                            case 3: /* ldrexh */
                                gen_load_exclusive(s, rd, 15, addr, 1);
                                break;
                            default:
                                abort();
                            }
                        } else {
                            rm = insn & 0xf;
                            switch (op1) {
                            case 0:  /*  strex */
                                gen_store_exclusive(s, rd, rm, 15, addr, 2);
                                break;
                            case 1: /*  strexd */
                                gen_store_exclusive(s, rd, rm, rm + 1, addr, 3);
                                break;
                            case 2: /*  strexb */
                                gen_store_exclusive(s, rd, rm, 15, addr, 0);
                                break;
                            case 3: /* strexh */
                                gen_store_exclusive(s, rd, rm, 15, addr, 1);
                                break;
                            default:
                                abort();
                            }
                        }
                        tcg_temp_free_i32(addr);
                    } else if ((insn & 0x00300f00) == 0) {
                        /* 0bcccc_0001_0x00_xxxx_xxxx_0000_1001_xxxx
                        *  - SWP, SWPB
                        */

                        TCGv taddr;
                        TCGMemOp opc = s->be_data;

                        rm = (insn) & 0xf;

                        if (insn & (1 << 22)) {
                            opc |= MO_UB;
                        } else {
                            opc |= MO_UL | MO_ALIGN;
                        }

                        addr = load_reg(s, rn);
                        taddr = gen_aa32_addr(s, addr, opc);
                        tcg_temp_free_i32(addr);

                        tmp = load_reg(s, rm);
                        tcg_gen_atomic_xchg_i32(tmp, taddr, tmp,
                                                get_mem_index(s), opc);
                        tcg_temp_free(taddr);
                        store_reg(s, rd, tmp);
                    } else {
                        goto illegal_op;
                    }
                }
            } else {
                int address_offset;
                bool load = insn & (1 << 20);
                bool wbit = insn & (1 << 21);
                bool pbit = insn & (1 << 24);
                bool doubleword = false;
                ISSInfo issinfo;

                /* Misc load/store */
                rn = (insn >> 16) & 0xf;
                rd = (insn >> 12) & 0xf;

                /* ISS not valid if writeback */
                issinfo = (pbit & !wbit) ? rd : ISSInvalid;

                if (!load && (sh & 2)) {
                    /* doubleword */
                    ARCH(5TE);
                    if (rd & 1) {
                        /* UNPREDICTABLE; we choose to UNDEF */
                        goto illegal_op;
                    }
                    load = (sh & 1) == 0;
                    doubleword = true;
                }

                addr = load_reg(s, rn);
                if (pbit) {
                    gen_add_datah_offset(s, insn, 0, addr);
                }
                address_offset = 0;

                if (doubleword) {
                    if (!load) {
                        /* store */
                        tmp = load_reg(s, rd);
                        gen_aa32_st32(s, tmp, addr, get_mem_index(s));
                        tcg_temp_free_i32(tmp);
                        tcg_gen_addi_i32(addr, addr, 4);
                        tmp = load_reg(s, rd + 1);
                        gen_aa32_st32(s, tmp, addr, get_mem_index(s));
                        tcg_temp_free_i32(tmp);
                    } else {
                        /* load */
                        tmp = tcg_temp_new_i32();
                        gen_aa32_ld32u(s, tmp, addr, get_mem_index(s));
                        store_reg(s, rd, tmp);
                        tcg_gen_addi_i32(addr, addr, 4);
                        tmp = tcg_temp_new_i32();
                        gen_aa32_ld32u(s, tmp, addr, get_mem_index(s));
                        rd++;
                    }
                    address_offset = -4;
                } else if (load) {
                    /* load */
                    tmp = tcg_temp_new_i32();
                    switch (sh) {
                    case 1:
                        gen_aa32_ld16u_iss(s, tmp, addr, get_mem_index(s),
                                           issinfo);
                        break;
                    case 2:
                        gen_aa32_ld8s_iss(s, tmp, addr, get_mem_index(s),
                                          issinfo);
                        break;
                    default:
                    case 3:
                        gen_aa32_ld16s_iss(s, tmp, addr, get_mem_index(s),
                                           issinfo);
                        break;
                    }
                } else {
                    /* store */
                    tmp = load_reg(s, rd);
                    gen_aa32_st16_iss(s, tmp, addr, get_mem_index(s), issinfo);
                    tcg_temp_free_i32(tmp);
                }
                /* Perform base writeback before the loaded value to
                   ensure correct behavior with overlapping index registers.
                   ldrd with base writeback is undefined if the
                   destination and index registers overlap.  */
                if (!pbit) {
                    gen_add_datah_offset(s, insn, address_offset, addr);
                    store_reg(s, rn, addr);
                } else if (wbit) {
                    if (address_offset)
                        tcg_gen_addi_i32(addr, addr, address_offset);
                    store_reg(s, rn, addr);
                } else {
                    tcg_temp_free_i32(addr);
                }
                if (load) {
                    /* Complete the load.  */
                    store_reg(s, rd, tmp);
                }
            }
            break;
        case 0x4:
        case 0x5:
            goto do_ldst;
        case 0x6:
        case 0x7:
            if (insn & (1 << 4)) {
                ARCH(6);
                /* Armv6 Media instructions.  */
                rm = insn & 0xf;
                rn = (insn >> 16) & 0xf;
                rd = (insn >> 12) & 0xf;
                rs = (insn >> 8) & 0xf;
                switch ((insn >> 23) & 3) {
                case 0: /* Parallel add/subtract.  */
                    op1 = (insn >> 20) & 7;
                    tmp = load_reg(s, rn);
                    tmp2 = load_reg(s, rm);
                    sh = (insn >> 5) & 7;
                    if ((op1 & 3) == 0 || sh == 5 || sh == 6)
                        goto illegal_op;
                    gen_arm_parallel_addsub(op1, sh, tmp, tmp2);
                    tcg_temp_free_i32(tmp2);
                    store_reg(s, rd, tmp);
                    break;
                case 1:
                    if ((insn & 0x00700020) == 0) {
                        /* Halfword pack.  */
                        tmp = load_reg(s, rn);
                        tmp2 = load_reg(s, rm);
                        shift = (insn >> 7) & 0x1f;
                        if (insn & (1 << 6)) {
                            /* pkhtb */
                            if (shift == 0)
                                shift = 31;
                            tcg_gen_sari_i32(tmp2, tmp2, shift);
                            tcg_gen_andi_i32(tmp, tmp, 0xffff0000);
                            tcg_gen_ext16u_i32(tmp2, tmp2);
                        } else {
                            /* pkhbt */
                            if (shift)
                                tcg_gen_shli_i32(tmp2, tmp2, shift);
                            tcg_gen_ext16u_i32(tmp, tmp);
                            tcg_gen_andi_i32(tmp2, tmp2, 0xffff0000);
                        }
                        tcg_gen_or_i32(tmp, tmp, tmp2);
                        tcg_temp_free_i32(tmp2);
                        store_reg(s, rd, tmp);
                    } else if ((insn & 0x00200020) == 0x00200000) {
                        /* [us]sat */
                        tmp = load_reg(s, rm);
                        shift = (insn >> 7) & 0x1f;
                        if (insn & (1 << 6)) {
                            if (shift == 0)
                                shift = 31;
                            tcg_gen_sari_i32(tmp, tmp, shift);
                        } else {
                            tcg_gen_shli_i32(tmp, tmp, shift);
                        }
                        sh = (insn >> 16) & 0x1f;
                        tmp2 = tcg_const_i32(sh);
                        if (insn & (1 << 22))
                          gen_helper_usat(tmp, cpu_env, tmp, tmp2);
                        else
                          gen_helper_ssat(tmp, cpu_env, tmp, tmp2);
                        tcg_temp_free_i32(tmp2);
                        store_reg(s, rd, tmp);
                    } else if ((insn & 0x00300fe0) == 0x00200f20) {
                        /* [us]sat16 */
                        tmp = load_reg(s, rm);
                        sh = (insn >> 16) & 0x1f;
                        tmp2 = tcg_const_i32(sh);
                        if (insn & (1 << 22))
                          gen_helper_usat16(tmp, cpu_env, tmp, tmp2);
                        else
                          gen_helper_ssat16(tmp, cpu_env, tmp, tmp2);
                        tcg_temp_free_i32(tmp2);
                        store_reg(s, rd, tmp);
                    } else if ((insn & 0x00700fe0) == 0x00000fa0) {
                        /* Select bytes.  */
                        tmp = load_reg(s, rn);
                        tmp2 = load_reg(s, rm);
                        tmp3 = tcg_temp_new_i32();
                        tcg_gen_ld_i32(tmp3, cpu_env, offsetof(CPUARMState, GE));
                        gen_helper_sel_flags(tmp, tmp3, tmp, tmp2);
                        tcg_temp_free_i32(tmp3);
                        tcg_temp_free_i32(tmp2);
                        store_reg(s, rd, tmp);
                    } else if ((insn & 0x000003e0) == 0x00000060) {
                        tmp = load_reg(s, rm);
                        shift = (insn >> 10) & 3;
                        /* ??? In many cases it's not necessary to do a
                           rotate, a shift is sufficient.  */
                        if (shift != 0)
                            tcg_gen_rotri_i32(tmp, tmp, shift * 8);
                        op1 = (insn >> 20) & 7;
                        switch (op1) {
                        case 0: gen_sxtb16(tmp);  break;
                        case 2: gen_sxtb(tmp);    break;
                        case 3: gen_sxth(tmp);    break;
                        case 4: gen_uxtb16(tmp);  break;
                        case 6: gen_uxtb(tmp);    break;
                        case 7: gen_uxth(tmp);    break;
                        default: goto illegal_op;
                        }
                        if (rn != 15) {
                            tmp2 = load_reg(s, rn);
                            if ((op1 & 3) == 0) {
                                gen_add16(tmp, tmp2);
                            } else {
                                tcg_gen_add_i32(tmp, tmp, tmp2);
                                tcg_temp_free_i32(tmp2);
                            }
                        }
                        store_reg(s, rd, tmp);
                    } else if ((insn & 0x003f0f60) == 0x003f0f20) {
                        /* rev */
                        tmp = load_reg(s, rm);
                        if (insn & (1 << 22)) {
                            if (insn & (1 << 7)) {
                                gen_revsh(tmp);
                            } else {
                                ARCH(6T2);
                                gen_helper_rbit(tmp, tmp);
                            }
                        } else {
                            if (insn & (1 << 7))
                                gen_rev16(tmp);
                            else
                                tcg_gen_bswap32_i32(tmp, tmp);
                        }
                        store_reg(s, rd, tmp);
                    } else {
                        goto illegal_op;
                    }
                    break;
                case 2: /* Multiplies (Type 3).  */
                    switch ((insn >> 20) & 0x7) {
                    case 5:
                        if (((insn >> 6) ^ (insn >> 7)) & 1) {
                            /* op2 not 00x or 11x : UNDEF */
                            goto illegal_op;
                        }
                        /* Signed multiply most significant [accumulate].
                           (SMMUL, SMMLA, SMMLS) */
                        tmp = load_reg(s, rm);
                        tmp2 = load_reg(s, rs);
                        tmp64 = gen_muls_i64_i32(tmp, tmp2);

                        if (rd != 15) {
                            tmp = load_reg(s, rd);
                            if (insn & (1 << 6)) {
                                tmp64 = gen_subq_msw(tmp64, tmp);
                            } else {
                                tmp64 = gen_addq_msw(tmp64, tmp);
                            }
                        }
                        if (insn & (1 << 5)) {
                            tcg_gen_addi_i64(tmp64, tmp64, 0x80000000u);
                        }
                        tcg_gen_shri_i64(tmp64, tmp64, 32);
                        tmp = tcg_temp_new_i32();
                        tcg_gen_extrl_i64_i32(tmp, tmp64);
                        tcg_temp_free_i64(tmp64);
                        store_reg(s, rn, tmp);
                        break;
                    case 0:
                    case 4:
                        /* SMLAD, SMUAD, SMLSD, SMUSD, SMLALD, SMLSLD */
                        if (insn & (1 << 7)) {
                            goto illegal_op;
                        }
                        tmp = load_reg(s, rm);
                        tmp2 = load_reg(s, rs);
                        if (insn & (1 << 5))
                            gen_swap_half(tmp2);
                        gen_smul_dual(tmp, tmp2);
                        if (insn & (1 << 22)) {
                            /* smlald, smlsld */
                            TCGv_i64 tmp64_2;

                            tmp64 = tcg_temp_new_i64();
                            tmp64_2 = tcg_temp_new_i64();
                            tcg_gen_ext_i32_i64(tmp64, tmp);
                            tcg_gen_ext_i32_i64(tmp64_2, tmp2);
                            tcg_temp_free_i32(tmp);
                            tcg_temp_free_i32(tmp2);
                            if (insn & (1 << 6)) {
                                tcg_gen_sub_i64(tmp64, tmp64, tmp64_2);
                            } else {
                                tcg_gen_add_i64(tmp64, tmp64, tmp64_2);
                            }
                            tcg_temp_free_i64(tmp64_2);
                            gen_addq(s, tmp64, rd, rn);
                            gen_storeq_reg(s, rd, rn, tmp64);
                            tcg_temp_free_i64(tmp64);
                        } else {
                            /* smuad, smusd, smlad, smlsd */
                            if (insn & (1 << 6)) {
                                /* This subtraction cannot overflow. */
                                tcg_gen_sub_i32(tmp, tmp, tmp2);
                            } else {
                                /* This addition cannot overflow 32 bits;
                                 * however it may overflow considered as a
                                 * signed operation, in which case we must set
                                 * the Q flag.
                                 */
                                gen_helper_add_setq(tmp, cpu_env, tmp, tmp2);
                            }
                            tcg_temp_free_i32(tmp2);
                            if (rd != 15)
                              {
                                tmp2 = load_reg(s, rd);
                                gen_helper_add_setq(tmp, cpu_env, tmp, tmp2);
                                tcg_temp_free_i32(tmp2);
                              }
                            store_reg(s, rn, tmp);
                        }
                        break;
                    case 1:
                    case 3:
                        /* SDIV, UDIV */
                        if (!dc_isar_feature(arm_div, s)) {
                            goto illegal_op;
                        }
                        if (((insn >> 5) & 7) || (rd != 15)) {
                            goto illegal_op;
                        }
                        tmp = load_reg(s, rm);
                        tmp2 = load_reg(s, rs);
                        if (insn & (1 << 21)) {
                            gen_helper_udiv(tmp, tmp, tmp2);
                        } else {
                            gen_helper_sdiv(tmp, tmp, tmp2);
                        }
                        tcg_temp_free_i32(tmp2);
                        store_reg(s, rn, tmp);
                        break;
                    default:
                        goto illegal_op;
                    }
                    break;
                case 3:
                    op1 = ((insn >> 17) & 0x38) | ((insn >> 5) & 7);
                    switch (op1) {
                    case 0: /* Unsigned sum of absolute differences.  */
                        ARCH(6);
                        tmp = load_reg(s, rm);
                        tmp2 = load_reg(s, rs);
                        gen_helper_usad8(tmp, tmp, tmp2);
                        tcg_temp_free_i32(tmp2);
                        if (rd != 15) {
                            tmp2 = load_reg(s, rd);
                            tcg_gen_add_i32(tmp, tmp, tmp2);
                            tcg_temp_free_i32(tmp2);
                        }
                        store_reg(s, rn, tmp);
                        break;
                    case 0x20: case 0x24: case 0x28: case 0x2c:
                        /* Bitfield insert/clear.  */
                        ARCH(6T2);
                        shift = (insn >> 7) & 0x1f;
                        i = (insn >> 16) & 0x1f;
                        if (i < shift) {
                            /* UNPREDICTABLE; we choose to UNDEF */
                            goto illegal_op;
                        }
                        i = i + 1 - shift;
                        if (rm == 15) {
                            tmp = tcg_temp_new_i32();
                            tcg_gen_movi_i32(tmp, 0);
                        } else {
                            tmp = load_reg(s, rm);
                        }
                        if (i != 32) {
                            tmp2 = load_reg(s, rd);
                            tcg_gen_deposit_i32(tmp, tmp2, tmp, shift, i);
                            tcg_temp_free_i32(tmp2);
                        }
                        store_reg(s, rd, tmp);
                        break;
                    case 0x12: case 0x16: case 0x1a: case 0x1e: /* sbfx */
                    case 0x32: case 0x36: case 0x3a: case 0x3e: /* ubfx */
                        ARCH(6T2);
                        tmp = load_reg(s, rm);
                        shift = (insn >> 7) & 0x1f;
                        i = ((insn >> 16) & 0x1f) + 1;
                        if (shift + i > 32)
                            goto illegal_op;
                        if (i < 32) {
                            if (op1 & 0x20) {
                                tcg_gen_extract_i32(tmp, tmp, shift, i);
                            } else {
                                tcg_gen_sextract_i32(tmp, tmp, shift, i);
                            }
                        }
                        store_reg(s, rd, tmp);
                        break;
                    default:
                        goto illegal_op;
                    }
                    break;
                }
                break;
            }
        do_ldst:
            /* Check for undefined extension instructions
             * per the ARM Bible IE:
             * xxxx 0111 1111 xxxx  xxxx xxxx 1111 xxxx
             */
            sh = (0xf << 20) | (0xf << 4);
            if (op1 == 0x7 && ((insn & sh) == sh))
            {
                goto illegal_op;
            }
            /* load/store byte/word */
            rn = (insn >> 16) & 0xf;
            rd = (insn >> 12) & 0xf;
            tmp2 = load_reg(s, rn);
            if ((insn & 0x01200000) == 0x00200000) {
                /* ldrt/strt */
                i = get_a32_user_mem_index(s);
            } else {
                i = get_mem_index(s);
            }
            if (insn & (1 << 24))
                gen_add_data_offset(s, insn, tmp2);
            if (insn & (1 << 20)) {
                /* load */
                tmp = tcg_temp_new_i32();
                if (insn & (1 << 22)) {
                    gen_aa32_ld8u_iss(s, tmp, tmp2, i, rd);
                } else {
                    gen_aa32_ld32u_iss(s, tmp, tmp2, i, rd);
                }
            } else {
                /* store */
                tmp = load_reg(s, rd);
                if (insn & (1 << 22)) {
                    gen_aa32_st8_iss(s, tmp, tmp2, i, rd);
                } else {
                    gen_aa32_st32_iss(s, tmp, tmp2, i, rd);
                }
                tcg_temp_free_i32(tmp);
            }
            if (!(insn & (1 << 24))) {
                gen_add_data_offset(s, insn, tmp2);
                store_reg(s, rn, tmp2);
            } else if (insn & (1 << 21)) {
                store_reg(s, rn, tmp2);
            } else {
                tcg_temp_free_i32(tmp2);
            }
            if (insn & (1 << 20)) {
                /* Complete the load.  */
                store_reg_from_load(s, rd, tmp);
            }
            break;
        case 0x08:
        case 0x09:
            {
                int j, n, loaded_base;
                bool exc_return = false;
                bool is_load = extract32(insn, 20, 1);
                bool user = false;
                TCGv_i32 loaded_var;
                /* load/store multiple words */
                /* XXX: store correct base if write back */
                if (insn & (1 << 22)) {
                    /* LDM (user), LDM (exception return) and STM (user) */
                    if (IS_USER(s))
                        goto illegal_op; /* only usable in supervisor mode */

                    if (is_load && extract32(insn, 15, 1)) {
                        exc_return = true;
                    } else {
                        user = true;
                    }
                }
                rn = (insn >> 16) & 0xf;
                addr = load_reg(s, rn);

                /* compute total size */
                loaded_base = 0;
                loaded_var = NULL;
                n = 0;
                for(i=0;i<16;i++) {
                    if (insn & (1 << i))
                        n++;
                }
                /* XXX: test invalid n == 0 case ? */
                if (insn & (1 << 23)) {
                    if (insn & (1 << 24)) {
                        /* pre increment */
                        tcg_gen_addi_i32(addr, addr, 4);
                    } else {
                        /* post increment */
                    }
                } else {
                    if (insn & (1 << 24)) {
                        /* pre decrement */
                        tcg_gen_addi_i32(addr, addr, -(n * 4));
                    } else {
                        /* post decrement */
                        if (n != 1)
                        tcg_gen_addi_i32(addr, addr, -((n - 1) * 4));
                    }
                }
                j = 0;
                for(i=0;i<16;i++) {
                    if (insn & (1 << i)) {
                        if (is_load) {
                            /* load */
                            tmp = tcg_temp_new_i32();
                            gen_aa32_ld32u(s, tmp, addr, get_mem_index(s));
                            if (user) {
                                tmp2 = tcg_const_i32(i);
                                gen_helper_set_user_reg(cpu_env, tmp2, tmp);
                                tcg_temp_free_i32(tmp2);
                                tcg_temp_free_i32(tmp);
                            } else if (i == rn) {
                                loaded_var = tmp;
                                loaded_base = 1;
                            } else if (rn == 15 && exc_return) {
                                store_pc_exc_ret(s, tmp);
                            } else {
                                if (i == 15 && qasan_max_call_stack)
                                  gen_helper_qasan_shadow_stack_pop(tmp);
                                store_reg_from_load(s, i, tmp);
                            }
                        } else {
                            /* store */
                            if (i == 15) {
                                /* special case: r15 = PC + 8 */
                                val = (long)s->pc + 4;
                                tmp = tcg_temp_new_i32();
                                tcg_gen_movi_i32(tmp, val);
                            } else if (user) {
                                tmp = tcg_temp_new_i32();
                                tmp2 = tcg_const_i32(i);
                                gen_helper_get_user_reg(tmp, cpu_env, tmp2);
                                tcg_temp_free_i32(tmp2);
                            } else {
                                tmp = load_reg(s, i);
                            }
                            gen_aa32_st32(s, tmp, addr, get_mem_index(s));
                            tcg_temp_free_i32(tmp);
                        }
                        j++;
                        /* no need to add after the last transfer */
                        if (j != n)
                            tcg_gen_addi_i32(addr, addr, 4);
                    }
                }
                if (insn & (1 << 21)) {
                    /* write back */
                    if (insn & (1 << 23)) {
                        if (insn & (1 << 24)) {
                            /* pre increment */
                        } else {
                            /* post increment */
                            tcg_gen_addi_i32(addr, addr, 4);
                        }
                    } else {
                        if (insn & (1 << 24)) {
                            /* pre decrement */
                            if (n != 1)
                                tcg_gen_addi_i32(addr, addr, -((n - 1) * 4));
                        } else {
                            /* post decrement */
                            tcg_gen_addi_i32(addr, addr, -(n * 4));
                        }
                    }
                    store_reg(s, rn, addr);
                } else {
                    tcg_temp_free_i32(addr);
                }
                if (loaded_base) {
                    store_reg(s, rn, loaded_var);
                }
                if (exc_return) {
                    /* Restore CPSR from SPSR.  */
                    tmp = load_cpu_field(spsr);
                    if (tb_cflags(s->base.tb) & CF_USE_ICOUNT) {
                        gen_io_start();
                    }
                    gen_helper_cpsr_write_eret(cpu_env, tmp);
                    if (tb_cflags(s->base.tb) & CF_USE_ICOUNT) {
                        gen_io_end();
                    }
                    tcg_temp_free_i32(tmp);
                    /* Must exit loop to check un-masked IRQs */
                    s->base.is_jmp = DISAS_EXIT;
                }
            }
            break;
        case 0xa:
        case 0xb:
            {
                int32_t offset;

                /* branch (and link) */
                val = (int32_t)s->pc;
                if (insn & (1 << 24)) {
                    tmp = tcg_temp_new_i32();
                    tcg_gen_movi_i32(tmp, val);
                    store_reg(s, 14, tmp);
                }
                offset = sextract32(insn << 2, 0, 26);
                val += offset + 4;
                gen_jmp(s, val);
            }
            break;
        case 0xc:
        case 0xd:
        case 0xe:
            if (((insn >> 8) & 0xe) == 10) {
                /* VFP.  */
                if (disas_vfp_insn(s, insn)) {
                    goto illegal_op;
                }
            } else if (disas_coproc_insn(s, insn)) {
                /* Coprocessor.  */
                goto illegal_op;
            }
            break;
        case 0xf:
            /* swi */
            gen_set_pc_im(s, s->pc);
            s->svc_imm = extract32(insn, 0, 24);
            s->base.is_jmp = DISAS_SWI;
            break;
        default:
        illegal_op:
            gen_exception_insn(s, 4, EXCP_UDEF, syn_uncategorized(),
                               default_exception_el(s));
            break;
        }
    }
}

            
