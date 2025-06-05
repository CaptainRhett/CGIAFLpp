#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = (int *)malloc(5 * sizeof(int));  // 分配5个int大小的空间
    if (arr == NULL) {
        perror("malloc failed");
        return 1;
    }
    int i;
    for ( i = 0; i < 5; i++) {
        arr[i] = i + 1;
    }

    // 扩容到10个int
    int *new_arr = (int *)realloc(arr, 10 * sizeof(int));
    if (new_arr == NULL) {
        perror("realloc failed");
        free(arr);  // realloc失败要手动释放原内存
        return 1;
    }

    // 对新空间初始化
    for ( i = 5; i < 10; i++) {
        new_arr[i] = i + 1;
    }

    for ( i = 0; i < 10; i++) {
        printf("%d ", new_arr[i]);
    }
    printf("\n");

    free(new_arr);  // 最终释放内存
    return 0;
}
