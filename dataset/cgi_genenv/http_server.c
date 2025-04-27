#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <fcntl.h>
#include <sys/wait.h>

#define PORT 8080
#define BUF_SIZE 4096

void serve_file(int client_fd, const char *path) {
    FILE *file = fopen(path, "r");
    if (!file) {
        dprintf(client_fd, "HTTP/1.1 404 Not Found\r\n\r\n404 Not Found");
        return;
    }

    dprintf(client_fd, "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n");
    char buf[BUF_SIZE];
    while (fgets(buf, sizeof(buf), file)) {
        write(client_fd, buf, strlen(buf));
    }
    fclose(file);
}

void run_cgi(int client_fd, const char *path, const char *query_string) {
    int pipefd[2];
    pipe(pipefd);

    pid_t pid = fork();
    if (pid == 0) { // child
        dup2(pipefd[1], STDOUT_FILENO);
        close(pipefd[0]);

        setenv("REQUEST_METHOD", "GET", 1);
        setenv("QUERY_STRING", query_string, 1);

        execl(path, path, NULL);
        perror("execl");
        exit(1);
    } else { // parent
        close(pipefd[1]);
        dprintf(client_fd, "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n");

        char buf[BUF_SIZE];
        int n;
        while ((n = read(pipefd[0], buf, sizeof(buf))) > 0) {
            write(client_fd, buf, n);
        }

        close(pipefd[0]);
        waitpid(pid, NULL, 0);
    }
}

void handle_client(int client_fd) {
    char buf[BUF_SIZE];
    read(client_fd, buf, sizeof(buf) - 1);
    printf("Request:\n%s\n", buf);

    char method[8], path[256], protocol[16];
    sscanf(buf, "%s %s %s", method, path, protocol);

    if (strncmp(method, "GET", 3) != 0) {
        dprintf(client_fd, "HTTP/1.1 501 Not Implemented\r\n\r\n");
        return;
    }

    char *query = strchr(path, '?');
    if (query) {
        *query++ = '\0';
    } else {
        query = "";
    }

    if (strncmp(path, "/cgi-bin/", 9) == 0) {
        char filepath[512];
        snprintf(filepath, sizeof(filepath), ".%s", path); // ./cgi-bin/xxx.cgi
        run_cgi(client_fd, filepath, query);
    } else if (strcmp(path, "/") == 0) {
        serve_file(client_fd, "./index.html");
    } else {
        char filepath[512];
        snprintf(filepath, sizeof(filepath), ".%s", path);
        serve_file(client_fd, filepath);
    }
}

int main() {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);

    struct sockaddr_in addr = {
        .sin_family = AF_INET,
        .sin_port = htons(PORT),
        .sin_addr.s_addr = INADDR_ANY
    };

    bind(server_fd, (struct sockaddr *)&addr, sizeof(addr));
    listen(server_fd, 10);
    printf("Server listening on http://localhost:%d\n", PORT);

    while (1) {
        int client_fd = accept(server_fd, NULL, NULL);
        if (client_fd >= 0) {
            handle_client(client_fd);
            close(client_fd);
        }
    }

    close(server_fd);
    return 0;
}
