// hello_cgi.c
#include <stdio.h>
#include <stdlib.h>

void vul_func() {
    char* a = malloc(64);
    char* b = malloc(64);
    if (!a) {
        perror("malloc failed");
        return 1;
    }
    else{
        printf("malloc executed.\n");
    }
    char *query = getenv("PATH_INFO");
    if (query != NULL && *query != '\0') {
        printf("<h1>Received query: %s</h1>\n", query);
        strcpy(a, query);
    } else {
        printf("<h1>Hello from CGI!</h1>\n");
    }
    free(a);
    free(b);
    
}
void check() {
    printf("calling check().\n");
    vul_func() ;
}
int main(void) {
    printf("calling main().\n");
    check();
    
    return 0;
}
