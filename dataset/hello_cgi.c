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
