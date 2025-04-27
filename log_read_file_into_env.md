# 设计目标
从AFL++中读取文件并设置到目标程序的环境变量中。

# QEMU启动流程
afl-fuzz程序fork一个子进程并执行复制arg执行afl-qemu-trace

afl-qemu-trace从linux-user/main.c开始执行，一些初始化后，使用loader_exec()函数加载目标二进制程序。

一些初始化后进入cpu_loop。在cpu_loop中，遇到EXCP_ATOMIC原子执行时，执行cpu_exec_step_atomic函数。该函数会通过tb_gen_code生成指令，在tb_gen_code函数中，会执行gen_intermediate_code生成中间表示IR，gen_intermediate_code进入translator_loop，translator_loop在遇到pc_next->afl_enterpoint时，会启动afl_forkserver。

设置环境变量可以在装载目标文件时设置，但是由于此时afl_forkserver并未被创建，也即afl++还没生成的输入。因此需要在afl_forkserver启动后在afl_forkserver子进程启动前写入环境变量。

# QEMU为用户程序设置环境变量的机制


1. QEMU 用户模式如何传递环境变量给目标程序？
在命令行运行qemu时，通过-E参数调用handle_arg_set_env函数设置环境变量，再利用envlist_to_environ将当前环境变量数组转换成target_environ，在loader_exec时写入target_environ。加载结束后进入cpu_loop执行阶段。

2. afl-forkserver 的行为？
你说得很对，流程大概是这样的：

afl-fuzz 启动 → fork 一个子进程；

这个子进程执行 afl-qemu-trace；

afl-qemu-trace 会在 main() 中进行一些初始化（包括可能设置了 envlist_setenv()）；

然后调用 loader_exec() 加载目标程序；

再进入 cpu_loop() 模拟执行；

在某个 TB 处触发 afl_enterpoint，进入 afl_forkserver；

然后 fork。

❗️关键点来了：
你是在 afl-forkserver fork 子线程前设置环境变量，但 fork 是 QEMU 自己实现的 fork 模拟行为（用于 forkserver），目标程序并不是重新走一遍 loader_exec，所以它不会重新构建 envp！
 


因为AFL机制是通过在TCG翻译阶段通过插桩实现的，因此在cpu_loop中fork子线程前通过解析afl输入文件并设置环境变量是不可行的。