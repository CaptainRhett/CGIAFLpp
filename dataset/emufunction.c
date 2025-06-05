#include <stdio.h>
#include <stdlib.h>

void emu_func() {
    char* a = malloc(64); // 动态分配内存
    if (a == NULL) {
        perror("malloc failed"); // 内存分配失败时输出错误信息
        return;
    }
    char *query = getenv("PATH_INFO"); // 获取环境变量
    if (query != NULL && *query != '\0') { 
        // 如果环境变量存在且非空，输出查询字符串
        printf("<h1>Received query: %s</h1>\n", query); 
    } else { 
        // 如果环境变量不存在或为空，输出默认信息
        printf("<h1>Hello from CGI!</h1>\n"); 
    }
    free(a); // 释放分配的内存
}

int main(void) {
    printf("calling main().\n");
    emu_func(); // 调用emu_func函数
    return 0;
}