local ffi = require("ffi")
-- cdef to use if libipmi_ffi is already loaded

if pcall(ffi.new, "IPMI20_SESSION_T") then
ffi.cdef[[

typedef unsigned int size_t;
typedef unsigned char __u_char;
typedef unsigned short int __u_short;
typedef unsigned int __u_int;
typedef unsigned long int __u_long;
typedef signed char __int8_t;
typedef unsigned char __uint8_t;
typedef signed short int __int16_t;
typedef unsigned short int __uint16_t;
typedef signed int __int32_t;
typedef unsigned int __uint32_t;
__extension__ typedef signed long long int __int64_t;
__extension__ typedef unsigned long long int __uint64_t;
__extension__ typedef long long int __quad_t;
__extension__ typedef unsigned long long int __u_quad_t;
__extension__ typedef __u_quad_t __dev_t;
__extension__ typedef unsigned int __uid_t;
__extension__ typedef unsigned int __gid_t;
__extension__ typedef unsigned long int __ino_t;
__extension__ typedef __u_quad_t __ino64_t;
__extension__ typedef unsigned int __mode_t;
__extension__ typedef unsigned int __nlink_t;
__extension__ typedef long int __off_t;
__extension__ typedef __quad_t __off64_t;
__extension__ typedef int __pid_t;
__extension__ typedef struct { int __val[2]; } __fsid_t;
__extension__ typedef long int __clock_t;
__extension__ typedef unsigned long int __rlim_t;
__extension__ typedef __u_quad_t __rlim64_t;
__extension__ typedef unsigned int __id_t;
__extension__ typedef long int __time_t;
__extension__ typedef unsigned int __useconds_t;
__extension__ typedef long int __suseconds_t;
__extension__ typedef int __daddr_t;
__extension__ typedef int __key_t;
__extension__ typedef int __clockid_t;
__extension__ typedef void * __timer_t;
__extension__ typedef long int __blksize_t;
__extension__ typedef long int __blkcnt_t;
__extension__ typedef __quad_t __blkcnt64_t;
__extension__ typedef unsigned long int __fsblkcnt_t;
__extension__ typedef __u_quad_t __fsblkcnt64_t;
__extension__ typedef unsigned long int __fsfilcnt_t;
__extension__ typedef __u_quad_t __fsfilcnt64_t;
__extension__ typedef int __fsword_t;
__extension__ typedef int __ssize_t;
__extension__ typedef long int __syscall_slong_t;
__extension__ typedef unsigned long int __syscall_ulong_t;
typedef __off64_t __loff_t;
typedef __quad_t *__qaddr_t;
typedef char *__caddr_t;
__extension__ typedef int __intptr_t;
__extension__ typedef unsigned int __socklen_t;
struct _IO_FILE;

typedef struct _IO_FILE FILE;


typedef struct _IO_FILE __FILE;
typedef struct
{
  int __count;
  union
  {
    unsigned int __wch;
    char __wchb[4];
  } __value;
} __mbstate_t;
typedef struct
{
  __off_t __pos;
  __mbstate_t __state;
} _G_fpos_t;
typedef struct
{
  __off64_t __pos;
  __mbstate_t __state;
} _G_fpos64_t;
typedef __builtin_va_list __gnuc_va_list;
struct _IO_jump_t; struct _IO_FILE;
typedef void _IO_lock_t;
struct _IO_marker {
  struct _IO_marker *_next;
  struct _IO_FILE *_sbuf;
  int _pos;
};
enum __codecvt_result
{
  __codecvt_ok,
  __codecvt_partial,
  __codecvt_error,
  __codecvt_noconv
};
struct _IO_FILE {
  int _flags;
  char* _IO_read_ptr;
  char* _IO_read_end;
  char* _IO_read_base;
  char* _IO_write_base;
  char* _IO_write_ptr;
  char* _IO_write_end;
  char* _IO_buf_base;
  char* _IO_buf_end;
  char *_IO_save_base;
  char *_IO_backup_base;
  char *_IO_save_end;
  struct _IO_marker *_markers;
  struct _IO_FILE *_chain;
  int _fileno;
  int _flags2;
  __off_t _old_offset;
  unsigned short _cur_column;
  signed char _vtable_offset;
  char _shortbuf[1];
  _IO_lock_t *_lock;
  __off64_t _offset;
  void *__pad1;
  void *__pad2;
  void *__pad3;
  void *__pad4;
  size_t __pad5;
  int _mode;
  char _unused2[15 * sizeof (int) - 4 * sizeof (void *) - sizeof (size_t)];
};
typedef struct _IO_FILE _IO_FILE;
struct _IO_FILE_plus;
extern struct _IO_FILE_plus _IO_2_1_stdin_;
extern struct _IO_FILE_plus _IO_2_1_stdout_;
extern struct _IO_FILE_plus _IO_2_1_stderr_;
typedef __ssize_t __io_read_fn (void *__cookie, char *__buf, size_t __nbytes);
typedef __ssize_t __io_write_fn (void *__cookie, const char *__buf,
     size_t __n);
typedef int __io_seek_fn (void *__cookie, __off64_t *__pos, int __w);
typedef int __io_close_fn (void *__cookie);
extern int __underflow (_IO_FILE *);
extern int __uflow (_IO_FILE *);
extern int __overflow (_IO_FILE *, int);
extern int _IO_getc (_IO_FILE *__fp);
extern int _IO_putc (int __c, _IO_FILE *__fp);
extern int _IO_feof (_IO_FILE *__fp) __attribute__ ((__nothrow__ , __leaf__));
extern int _IO_ferror (_IO_FILE *__fp) __attribute__ ((__nothrow__ , __leaf__));
extern int _IO_peekc_locked (_IO_FILE *__fp);
extern void _IO_flockfile (_IO_FILE *) __attribute__ ((__nothrow__ , __leaf__));
extern void _IO_funlockfile (_IO_FILE *) __attribute__ ((__nothrow__ , __leaf__));
extern int _IO_ftrylockfile (_IO_FILE *) __attribute__ ((__nothrow__ , __leaf__));
extern int _IO_vfscanf (_IO_FILE * __restrict, const char * __restrict,
   __gnuc_va_list, int *__restrict);
extern int _IO_vfprintf (_IO_FILE *__restrict, const char *__restrict,
    __gnuc_va_list);
extern __ssize_t _IO_padn (_IO_FILE *, int, __ssize_t);
extern size_t _IO_sgetn (_IO_FILE *, void *, size_t);
extern __off64_t _IO_seekoff (_IO_FILE *, __off64_t, int, int);
extern __off64_t _IO_seekpos (_IO_FILE *, __off64_t, int);
extern void _IO_free_backup_area (_IO_FILE *) __attribute__ ((__nothrow__ , __leaf__));
typedef __gnuc_va_list va_list;
typedef __off_t off_t;
typedef __ssize_t ssize_t;

typedef _G_fpos_t fpos_t;

extern struct _IO_FILE *stdin;
extern struct _IO_FILE *stdout;
extern struct _IO_FILE *stderr;

extern int remove (const char *__filename) __attribute__ ((__nothrow__ , __leaf__));
extern int rename (const char *__old, const char *__new) __attribute__ ((__nothrow__ , __leaf__));

extern int renameat (int __oldfd, const char *__old, int __newfd,
       const char *__new) __attribute__ ((__nothrow__ , __leaf__));

extern FILE *tmpfile (void) ;
extern char *tmpnam (char *__s) __attribute__ ((__nothrow__ , __leaf__)) ;

extern char *tmpnam_r (char *__s) __attribute__ ((__nothrow__ , __leaf__)) ;
extern char *tempnam (const char *__dir, const char *__pfx)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__malloc__)) ;

extern int fclose (FILE *__stream);
extern int fflush (FILE *__stream);

extern int fflush_unlocked (FILE *__stream);

extern FILE *fopen (const char *__restrict __filename,
      const char *__restrict __modes) ;
extern FILE *freopen (const char *__restrict __filename,
        const char *__restrict __modes,
        FILE *__restrict __stream) ;

extern FILE *fdopen (int __fd, const char *__modes) __attribute__ ((__nothrow__ , __leaf__)) ;
extern FILE *fmemopen (void *__s, size_t __len, const char *__modes)
  __attribute__ ((__nothrow__ , __leaf__)) ;
extern FILE *open_memstream (char **__bufloc, size_t *__sizeloc) __attribute__ ((__nothrow__ , __leaf__)) ;

extern void setbuf (FILE *__restrict __stream, char *__restrict __buf) __attribute__ ((__nothrow__ , __leaf__));
extern int setvbuf (FILE *__restrict __stream, char *__restrict __buf,
      int __modes, size_t __n) __attribute__ ((__nothrow__ , __leaf__));

extern void setbuffer (FILE *__restrict __stream, char *__restrict __buf,
         size_t __size) __attribute__ ((__nothrow__ , __leaf__));
extern void setlinebuf (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__));

extern int fprintf (FILE *__restrict __stream,
      const char *__restrict __format, ...);
extern int printf (const char *__restrict __format, ...);
extern int sprintf (char *__restrict __s,
      const char *__restrict __format, ...) __attribute__ ((__nothrow__));
extern int vfprintf (FILE *__restrict __s, const char *__restrict __format,
       __gnuc_va_list __arg);
extern int vprintf (const char *__restrict __format, __gnuc_va_list __arg);
extern int vsprintf (char *__restrict __s, const char *__restrict __format,
       __gnuc_va_list __arg) __attribute__ ((__nothrow__));


extern int snprintf (char *__restrict __s, size_t __maxlen,
       const char *__restrict __format, ...)
     __attribute__ ((__nothrow__)) __attribute__ ((__format__ (__printf__, 3, 4)));
extern int vsnprintf (char *__restrict __s, size_t __maxlen,
        const char *__restrict __format, __gnuc_va_list __arg)
     __attribute__ ((__nothrow__)) __attribute__ ((__format__ (__printf__, 3, 0)));

extern int vdprintf (int __fd, const char *__restrict __fmt,
       __gnuc_va_list __arg)
     __attribute__ ((__format__ (__printf__, 2, 0)));
extern int dprintf (int __fd, const char *__restrict __fmt, ...)
     __attribute__ ((__format__ (__printf__, 2, 3)));

extern int fscanf (FILE *__restrict __stream,
     const char *__restrict __format, ...) ;
extern int scanf (const char *__restrict __format, ...) ;
extern int sscanf (const char *__restrict __s,
     const char *__restrict __format, ...) __attribute__ ((__nothrow__ , __leaf__));
extern int fscanf (FILE *__restrict __stream, const char *__restrict __format, ...) __asm__ ("" "__isoc99_fscanf") ;
extern int scanf (const char *__restrict __format, ...) __asm__ ("" "__isoc99_scanf") ;
extern int sscanf (const char *__restrict __s, const char *__restrict __format, ...) __asm__ ("" "__isoc99_sscanf") __attribute__ ((__nothrow__ , __leaf__));


extern int vfscanf (FILE *__restrict __s, const char *__restrict __format,
      __gnuc_va_list __arg)
     __attribute__ ((__format__ (__scanf__, 2, 0))) ;
extern int vscanf (const char *__restrict __format, __gnuc_va_list __arg)
     __attribute__ ((__format__ (__scanf__, 1, 0))) ;
extern int vsscanf (const char *__restrict __s,
      const char *__restrict __format, __gnuc_va_list __arg)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__format__ (__scanf__, 2, 0)));
extern int vfscanf (FILE *__restrict __s, const char *__restrict __format, __gnuc_va_list __arg) __asm__ ("" "__isoc99_vfscanf")
     __attribute__ ((__format__ (__scanf__, 2, 0))) ;
extern int vscanf (const char *__restrict __format, __gnuc_va_list __arg) __asm__ ("" "__isoc99_vscanf")
     __attribute__ ((__format__ (__scanf__, 1, 0))) ;
extern int vsscanf (const char *__restrict __s, const char *__restrict __format, __gnuc_va_list __arg) __asm__ ("" "__isoc99_vsscanf") __attribute__ ((__nothrow__ , __leaf__))
     __attribute__ ((__format__ (__scanf__, 2, 0)));


extern int fgetc (FILE *__stream);
extern int getc (FILE *__stream);
extern int getchar (void);

extern int getc_unlocked (FILE *__stream);
extern int getchar_unlocked (void);
extern int fgetc_unlocked (FILE *__stream);

extern int fputc (int __c, FILE *__stream);
extern int putc (int __c, FILE *__stream);
extern int putchar (int __c);

extern int fputc_unlocked (int __c, FILE *__stream);
extern int putc_unlocked (int __c, FILE *__stream);
extern int putchar_unlocked (int __c);
extern int getw (FILE *__stream);
extern int putw (int __w, FILE *__stream);

extern char *fgets (char *__restrict __s, int __n, FILE *__restrict __stream)
     ;
extern char *gets (char *__s) __attribute__ ((__deprecated__));

extern __ssize_t __getdelim (char **__restrict __lineptr,
          size_t *__restrict __n, int __delimiter,
          FILE *__restrict __stream) ;
extern __ssize_t getdelim (char **__restrict __lineptr,
        size_t *__restrict __n, int __delimiter,
        FILE *__restrict __stream) ;
extern __ssize_t getline (char **__restrict __lineptr,
       size_t *__restrict __n,
       FILE *__restrict __stream) ;

extern int fputs (const char *__restrict __s, FILE *__restrict __stream);
extern int puts (const char *__s);
extern int ungetc (int __c, FILE *__stream);
extern size_t fread (void *__restrict __ptr, size_t __size,
       size_t __n, FILE *__restrict __stream) ;
extern size_t fwrite (const void *__restrict __ptr, size_t __size,
        size_t __n, FILE *__restrict __s);

extern size_t fread_unlocked (void *__restrict __ptr, size_t __size,
         size_t __n, FILE *__restrict __stream) ;
extern size_t fwrite_unlocked (const void *__restrict __ptr, size_t __size,
          size_t __n, FILE *__restrict __stream);

extern int fseek (FILE *__stream, long int __off, int __whence);
extern long int ftell (FILE *__stream) ;
extern void rewind (FILE *__stream);

extern int fseeko (FILE *__stream, __off_t __off, int __whence);
extern __off_t ftello (FILE *__stream) ;

extern int fgetpos (FILE *__restrict __stream, fpos_t *__restrict __pos);
extern int fsetpos (FILE *__stream, const fpos_t *__pos);


extern void clearerr (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__));
extern int feof (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;
extern int ferror (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;

extern void clearerr_unlocked (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__));
extern int feof_unlocked (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;
extern int ferror_unlocked (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;

extern void perror (const char *__s);

extern int sys_nerr;
extern const char *const sys_errlist[];
extern int fileno (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;
extern int fileno_unlocked (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;
extern FILE *popen (const char *__command, const char *__modes) ;
extern int pclose (FILE *__stream);
extern char *ctermid (char *__s) __attribute__ ((__nothrow__ , __leaf__));
extern void flockfile (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__));
extern int ftrylockfile (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;
extern void funlockfile (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__));


typedef __u_char u_char;
typedef __u_short u_short;
typedef __u_int u_int;
typedef __u_long u_long;
typedef __quad_t quad_t;
typedef __u_quad_t u_quad_t;
typedef __fsid_t fsid_t;
typedef __loff_t loff_t;
typedef __ino_t ino_t;
typedef __dev_t dev_t;
typedef __gid_t gid_t;
typedef __mode_t mode_t;
typedef __nlink_t nlink_t;
typedef __uid_t uid_t;
typedef __pid_t pid_t;
typedef __id_t id_t;
typedef __daddr_t daddr_t;
typedef __caddr_t caddr_t;
typedef __key_t key_t;

typedef __clock_t clock_t;



typedef __time_t time_t;


typedef __clockid_t clockid_t;
typedef __timer_t timer_t;
typedef unsigned long int ulong;
typedef unsigned short int ushort;
typedef unsigned int uint;
typedef int int8_t __attribute__ ((__mode__ (__QI__)));
typedef int int16_t __attribute__ ((__mode__ (__HI__)));
typedef int int32_t __attribute__ ((__mode__ (__SI__)));
typedef int int64_t __attribute__ ((__mode__ (__DI__)));
typedef unsigned int u_int8_t __attribute__ ((__mode__ (__QI__)));
typedef unsigned int u_int16_t __attribute__ ((__mode__ (__HI__)));
typedef unsigned int u_int32_t __attribute__ ((__mode__ (__SI__)));
typedef unsigned int u_int64_t __attribute__ ((__mode__ (__DI__)));
typedef int register_t __attribute__ ((__mode__ (__word__)));
static __inline unsigned int
__bswap_32 (unsigned int __bsx)
{
  return __builtin_bswap32 (__bsx);
}
static __inline __uint64_t
__bswap_64 (__uint64_t __bsx)
{
  return __builtin_bswap64 (__bsx);
}
typedef int __sig_atomic_t;
typedef struct
  {
    unsigned long int __val[(1024 / (8 * sizeof (unsigned long int)))];
  } __sigset_t;
typedef __sigset_t sigset_t;

typedef __suseconds_t suseconds_t;
typedef long int __fd_mask;
typedef struct
  {
    __fd_mask __fds_bits[1024 / (8 * (int) sizeof (__fd_mask))];
  } fd_set;
typedef __fd_mask fd_mask;

extern int select (int __nfds, fd_set *__restrict __readfds,
     fd_set *__restrict __writefds,
     fd_set *__restrict __exceptfds,
     struct timeval *__restrict __timeout);
extern int pselect (int __nfds, fd_set *__restrict __readfds,
      fd_set *__restrict __writefds,
      fd_set *__restrict __exceptfds,
      const struct timespec *__restrict __timeout,
      const __sigset_t *__restrict __sigmask);


__extension__
extern unsigned int gnu_dev_major (unsigned long long int __dev)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
__extension__
extern unsigned int gnu_dev_minor (unsigned long long int __dev)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
__extension__
extern unsigned long long int gnu_dev_makedev (unsigned int __major,
            unsigned int __minor)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));

typedef __blksize_t blksize_t;
typedef __blkcnt_t blkcnt_t;
typedef __fsblkcnt_t fsblkcnt_t;
typedef __fsfilcnt_t fsfilcnt_t;
typedef unsigned long int pthread_t;
union pthread_attr_t
{
  char __size[36];
  long int __align;
};
typedef union pthread_attr_t pthread_attr_t;
typedef struct __pthread_internal_slist
{
  struct __pthread_internal_slist *__next;
} __pthread_slist_t;
typedef union
{
  struct __pthread_mutex_s
  {
    int __lock;
    unsigned int __count;
    int __owner;
    int __kind;
    unsigned int __nusers;
    __extension__ union
    {
      struct
      {
 short __espins;
 short __elision;
      } d;
      __pthread_slist_t __list;
    };
  } __data;
  char __size[24];
  long int __align;
} pthread_mutex_t;
typedef union
{
  char __size[4];
  int __align;
} pthread_mutexattr_t;
typedef union
{
  struct
  {
    int __lock;
    unsigned int __futex;
    __extension__ unsigned long long int __total_seq;
    __extension__ unsigned long long int __wakeup_seq;
    __extension__ unsigned long long int __woken_seq;
    void *__mutex;
    unsigned int __nwaiters;
    unsigned int __broadcast_seq;
  } __data;
  char __size[48];
  __extension__ long long int __align;
} pthread_cond_t;
typedef union
{
  char __size[4];
  int __align;
} pthread_condattr_t;
typedef unsigned int pthread_key_t;
typedef int pthread_once_t;
typedef union
{
  struct
  {
    int __lock;
    unsigned int __nr_readers;
    unsigned int __readers_wakeup;
    unsigned int __writer_wakeup;
    unsigned int __nr_readers_queued;
    unsigned int __nr_writers_queued;
    unsigned char __flags;
    unsigned char __shared;
    unsigned char __pad1;
    unsigned char __pad2;
    int __writer;
  } __data;
  char __size[32];
  long int __align;
} pthread_rwlock_t;
typedef union
{
  char __size[8];
  long int __align;
} pthread_rwlockattr_t;
typedef volatile int pthread_spinlock_t;
typedef union
{
  char __size[20];
  long int __align;
} pthread_barrier_t;
typedef union
{
  char __size[4];
  int __align;
} pthread_barrierattr_t;

typedef struct FCGX_Stream {
    unsigned char *rdNext;
    unsigned char *wrNext;
    unsigned char *stop;
    unsigned char *stopUnget;
    int isReader;
    int isClosed;
    int wasFCloseCalled;
    int FCGI_errno;
    void (*fillBuffProc) (struct FCGX_Stream *stream);
    void (*emptyBuffProc) (struct FCGX_Stream *stream, int doClose);
    void *data;
} FCGX_Stream;
typedef char **FCGX_ParamArray;
typedef struct FCGX_Request {
    int requestId;
    int role;
    FCGX_Stream *in;
    FCGX_Stream *out;
    FCGX_Stream *err;
    char **envp;
    struct Params *paramsPtr;
    int ipcFd;
    int isBeginProcessed;
    int keepConnection;
    int appStatus;
    int nWriters;
    int flags;
    int listen_sock;
    int detached;
} FCGX_Request;
 int FCGX_IsCGI(void);
 int FCGX_Init(void);
 int FCGX_OpenSocket(const char *path, int backlog);
 int FCGX_InitRequest(FCGX_Request *request, int sock, int flags);
 int FCGX_Accept_r(FCGX_Request *request);
 void FCGX_Finish_r(FCGX_Request *request);
 void FCGX_Free(FCGX_Request * request, int close);
 int FCGX_Accept(
        FCGX_Stream **in,
        FCGX_Stream **out,
        FCGX_Stream **err,
        FCGX_ParamArray *envp);
 void FCGX_Finish(void);
 int FCGX_StartFilterData(FCGX_Stream *stream);
 void FCGX_SetExitStatus(int status, FCGX_Stream *stream);
 char *FCGX_GetParam(const char *name, FCGX_ParamArray envp);
 int FCGX_GetChar(FCGX_Stream *stream);
 int FCGX_UnGetChar(int c, FCGX_Stream *stream);
 int FCGX_GetStr(char *str, int n, FCGX_Stream *stream);
 char *FCGX_GetLine(char *str, int n, FCGX_Stream *stream);
 int FCGX_HasSeenEOF(FCGX_Stream *stream);
 int FCGX_PutChar(int c, FCGX_Stream *stream);
 int FCGX_PutStr(const char *str, int n, FCGX_Stream *stream);
 int FCGX_PutS(const char *str, FCGX_Stream *stream);
 int FCGX_FPrintF(FCGX_Stream *stream, const char *format, ...);
 int FCGX_VFPrintF(FCGX_Stream *stream, const char *format, va_list arg);
 int FCGX_FFlush(FCGX_Stream *stream);
 int FCGX_FClose(FCGX_Stream *stream);
 int FCGX_GetError(FCGX_Stream *stream);
 void FCGX_ClearError(FCGX_Stream *stream);
 FCGX_Stream *FCGX_CreateWriter(
        int socket,
        int requestId,
        int bufflen,
        int streamType);
 void FCGX_FreeStream(FCGX_Stream **stream);
 void FCGX_ShutdownPending(void);
 int FCGX_Attach(FCGX_Request * r);
 int FCGX_Detach(FCGX_Request * r);
typedef struct {
    FILE *stdio_stream;
    FCGX_Stream *fcgx_stream;
} FCGI_FILE;
 int FCGI_Accept(void);
 void FCGI_Finish(void);
 int FCGI_StartFilterData(void);
 void FCGI_SetExitStatus(int status);
 extern FCGI_FILE _fcgi_sF[];
 void FCGI_perror(const char *str);
 FCGI_FILE *FCGI_fopen(const char *path, const char *mode);
 int FCGI_fclose(FCGI_FILE *fp);
 int FCGI_fflush(FCGI_FILE *fp);
 FCGI_FILE *FCGI_freopen(const char *path, const char *mode, FCGI_FILE *fp);
 int FCGI_setvbuf(FCGI_FILE *fp, char *buf, int bufmode, size_t size);
 void FCGI_setbuf(FCGI_FILE *fp, char *buf);
 int FCGI_fseek(FCGI_FILE *fp, long offset, int whence);
 int FCGI_ftell(FCGI_FILE *fp);
 void FCGI_rewind(FCGI_FILE *fp);
 int FCGI_fgetc(FCGI_FILE *fp);
 int FCGI_getchar(void);
 int FCGI_ungetc(int c, FCGI_FILE *fp);
 char *FCGI_fgets(char *str, int size, FCGI_FILE *fp);
 char *FCGI_gets(char *str);
 int FCGI_fputc(int c, FCGI_FILE *fp);
 int FCGI_putchar(int c);
 int FCGI_fputs(const char *str, FCGI_FILE *fp);
 int FCGI_puts(const char *str);
 int FCGI_fprintf(FCGI_FILE *fp, const char *format, ...);
 int FCGI_printf(const char *format, ...);
 int FCGI_vfprintf(FCGI_FILE *fp, const char *format, va_list ap);
 int FCGI_vprintf(const char *format, va_list ap);
 size_t FCGI_fread(void *ptr, size_t size, size_t nmemb, FCGI_FILE *fp);
 size_t FCGI_fwrite(void *ptr, size_t size, size_t nmemb, FCGI_FILE *fp);
 int FCGI_feof(FCGI_FILE *fp);
 int FCGI_ferror(FCGI_FILE *fp);
 void FCGI_clearerr(FCGI_FILE *fp);
 FCGI_FILE *FCGI_tmpfile(void);
 int FCGI_fileno(FCGI_FILE *fp);
 FCGI_FILE *FCGI_fdopen(int fd, const char *mode);
 FCGI_FILE *FCGI_popen(const char *cmd, const char *type);
 int FCGI_pclose(FCGI_FILE *);
typedef long int wchar_t;

typedef enum
{
  P_ALL,
  P_PID,
  P_PGID
} idtype_t;
union wait
  {
    int w_status;
    struct
      {
 unsigned int __w_termsig:7;
 unsigned int __w_coredump:1;
 unsigned int __w_retcode:8;
 unsigned int:16;
      } __wait_terminated;
    struct
      {
 unsigned int __w_stopval:8;
 unsigned int __w_stopsig:8;
 unsigned int:16;
      } __wait_stopped;
  };
typedef union
  {
    union wait *__uptr;
    int *__iptr;
  } __WAIT_STATUS __attribute__ ((__transparent_union__));

typedef struct
  {
    int quot;
    int rem;
  } div_t;
typedef struct
  {
    long int quot;
    long int rem;
  } ldiv_t;


__extension__ typedef struct
  {
    long long int quot;
    long long int rem;
  } lldiv_t;

extern size_t __ctype_get_mb_cur_max (void) __attribute__ ((__nothrow__ , __leaf__)) ;

extern double atof (const char *__nptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1))) ;
extern int atoi (const char *__nptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1))) ;
extern long int atol (const char *__nptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1))) ;


__extension__ extern long long int atoll (const char *__nptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1))) ;


extern double strtod (const char *__restrict __nptr,
        char **__restrict __endptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));


extern float strtof (const char *__restrict __nptr,
       char **__restrict __endptr) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern long double strtold (const char *__restrict __nptr,
       char **__restrict __endptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));


extern long int strtol (const char *__restrict __nptr,
   char **__restrict __endptr, int __base)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern unsigned long int strtoul (const char *__restrict __nptr,
      char **__restrict __endptr, int __base)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));

__extension__
extern long long int strtoq (const char *__restrict __nptr,
        char **__restrict __endptr, int __base)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
__extension__
extern unsigned long long int strtouq (const char *__restrict __nptr,
           char **__restrict __endptr, int __base)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));

__extension__
extern long long int strtoll (const char *__restrict __nptr,
         char **__restrict __endptr, int __base)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
__extension__
extern unsigned long long int strtoull (const char *__restrict __nptr,
     char **__restrict __endptr, int __base)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));

extern char *l64a (long int __n) __attribute__ ((__nothrow__ , __leaf__)) ;
extern long int a64l (const char *__s)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1))) ;
extern long int random (void) __attribute__ ((__nothrow__ , __leaf__));
extern void srandom (unsigned int __seed) __attribute__ ((__nothrow__ , __leaf__));
extern char *initstate (unsigned int __seed, char *__statebuf,
   size_t __statelen) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));
extern char *setstate (char *__statebuf) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
struct random_data
  {
    int32_t *fptr;
    int32_t *rptr;
    int32_t *state;
    int rand_type;
    int rand_deg;
    int rand_sep;
    int32_t *end_ptr;
  };
extern int random_r (struct random_data *__restrict __buf,
       int32_t *__restrict __result) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int srandom_r (unsigned int __seed, struct random_data *__buf)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));
extern int initstate_r (unsigned int __seed, char *__restrict __statebuf,
   size_t __statelen,
   struct random_data *__restrict __buf)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2, 4)));
extern int setstate_r (char *__restrict __statebuf,
         struct random_data *__restrict __buf)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));

extern int rand (void) __attribute__ ((__nothrow__ , __leaf__));
extern void srand (unsigned int __seed) __attribute__ ((__nothrow__ , __leaf__));

extern int rand_r (unsigned int *__seed) __attribute__ ((__nothrow__ , __leaf__));
extern double drand48 (void) __attribute__ ((__nothrow__ , __leaf__));
extern double erand48 (unsigned short int __xsubi[3]) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern long int lrand48 (void) __attribute__ ((__nothrow__ , __leaf__));
extern long int nrand48 (unsigned short int __xsubi[3])
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern long int mrand48 (void) __attribute__ ((__nothrow__ , __leaf__));
extern long int jrand48 (unsigned short int __xsubi[3])
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern void srand48 (long int __seedval) __attribute__ ((__nothrow__ , __leaf__));
extern unsigned short int *seed48 (unsigned short int __seed16v[3])
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern void lcong48 (unsigned short int __param[7]) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
struct drand48_data
  {
    unsigned short int __x[3];
    unsigned short int __old_x[3];
    unsigned short int __c;
    unsigned short int __init;
    __extension__ unsigned long long int __a;
  };
extern int drand48_r (struct drand48_data *__restrict __buffer,
        double *__restrict __result) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int erand48_r (unsigned short int __xsubi[3],
        struct drand48_data *__restrict __buffer,
        double *__restrict __result) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int lrand48_r (struct drand48_data *__restrict __buffer,
        long int *__restrict __result)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int nrand48_r (unsigned short int __xsubi[3],
        struct drand48_data *__restrict __buffer,
        long int *__restrict __result)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int mrand48_r (struct drand48_data *__restrict __buffer,
        long int *__restrict __result)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int jrand48_r (unsigned short int __xsubi[3],
        struct drand48_data *__restrict __buffer,
        long int *__restrict __result)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int srand48_r (long int __seedval, struct drand48_data *__buffer)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));
extern int seed48_r (unsigned short int __seed16v[3],
       struct drand48_data *__buffer) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int lcong48_r (unsigned short int __param[7],
        struct drand48_data *__buffer)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));

extern void *malloc (size_t __size) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__malloc__)) ;
extern void *calloc (size_t __nmemb, size_t __size)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__malloc__)) ;


extern void *realloc (void *__ptr, size_t __size)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__warn_unused_result__));
extern void free (void *__ptr) __attribute__ ((__nothrow__ , __leaf__));

extern void cfree (void *__ptr) __attribute__ ((__nothrow__ , __leaf__));

extern void *alloca (size_t __size) __attribute__ ((__nothrow__ , __leaf__));

extern void *valloc (size_t __size) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__malloc__)) ;
extern int posix_memalign (void **__memptr, size_t __alignment, size_t __size)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1))) ;

extern void abort (void) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__noreturn__));
extern int atexit (void (*__func) (void)) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));

extern int on_exit (void (*__func) (int __status, void *__arg), void *__arg)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));

extern void exit (int __status) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__noreturn__));


extern void _Exit (int __status) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__noreturn__));


extern char *getenv (const char *__name) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1))) ;

extern int putenv (char *__string) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern int setenv (const char *__name, const char *__value, int __replace)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));
extern int unsetenv (const char *__name) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern int clearenv (void) __attribute__ ((__nothrow__ , __leaf__));
extern char *mktemp (char *__template) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern int mkstemp (char *__template) __attribute__ ((__nonnull__ (1))) ;
extern int mkstemps (char *__template, int __suffixlen) __attribute__ ((__nonnull__ (1))) ;
extern char *mkdtemp (char *__template) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1))) ;

extern int system (const char *__command) ;

extern char *realpath (const char *__restrict __name,
         char *__restrict __resolved) __attribute__ ((__nothrow__ , __leaf__)) ;
typedef int (*__compar_fn_t) (const void *, const void *);

extern void *bsearch (const void *__key, const void *__base,
        size_t __nmemb, size_t __size, __compar_fn_t __compar)
     __attribute__ ((__nonnull__ (1, 2, 5))) ;
extern void qsort (void *__base, size_t __nmemb, size_t __size,
     __compar_fn_t __compar) __attribute__ ((__nonnull__ (1, 4)));
extern int abs (int __x) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__)) ;
extern long int labs (long int __x) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__)) ;

__extension__ extern long long int llabs (long long int __x)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__)) ;

extern div_t div (int __numer, int __denom)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__)) ;
extern ldiv_t ldiv (long int __numer, long int __denom)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__)) ;


__extension__ extern lldiv_t lldiv (long long int __numer,
        long long int __denom)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__)) ;

extern char *ecvt (double __value, int __ndigit, int *__restrict __decpt,
     int *__restrict __sign) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4))) ;
extern char *fcvt (double __value, int __ndigit, int *__restrict __decpt,
     int *__restrict __sign) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4))) ;
extern char *gcvt (double __value, int __ndigit, char *__buf)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3))) ;
extern char *qecvt (long double __value, int __ndigit,
      int *__restrict __decpt, int *__restrict __sign)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4))) ;
extern char *qfcvt (long double __value, int __ndigit,
      int *__restrict __decpt, int *__restrict __sign)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4))) ;
extern char *qgcvt (long double __value, int __ndigit, char *__buf)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3))) ;
extern int ecvt_r (double __value, int __ndigit, int *__restrict __decpt,
     int *__restrict __sign, char *__restrict __buf,
     size_t __len) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4, 5)));
extern int fcvt_r (double __value, int __ndigit, int *__restrict __decpt,
     int *__restrict __sign, char *__restrict __buf,
     size_t __len) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4, 5)));
extern int qecvt_r (long double __value, int __ndigit,
      int *__restrict __decpt, int *__restrict __sign,
      char *__restrict __buf, size_t __len)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4, 5)));
extern int qfcvt_r (long double __value, int __ndigit,
      int *__restrict __decpt, int *__restrict __sign,
      char *__restrict __buf, size_t __len)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4, 5)));

extern int mblen (const char *__s, size_t __n) __attribute__ ((__nothrow__ , __leaf__));
extern int mbtowc (wchar_t *__restrict __pwc,
     const char *__restrict __s, size_t __n) __attribute__ ((__nothrow__ , __leaf__));
extern int wctomb (char *__s, wchar_t __wchar) __attribute__ ((__nothrow__ , __leaf__));
extern size_t mbstowcs (wchar_t *__restrict __pwcs,
   const char *__restrict __s, size_t __n) __attribute__ ((__nothrow__ , __leaf__));
extern size_t wcstombs (char *__restrict __s,
   const wchar_t *__restrict __pwcs, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__));

extern int rpmatch (const char *__response) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1))) ;
extern int getsubopt (char **__restrict __optionp,
        char *const *__restrict __tokens,
        char **__restrict __valuep)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2, 3))) ;
extern int getloadavg (double __loadavg[], int __nelem)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));

typedef int ptrdiff_t;


extern void *memcpy (void *__restrict __dest, const void *__restrict __src,
       size_t __n) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern void *memmove (void *__dest, const void *__src, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));

extern void *memccpy (void *__restrict __dest, const void *__restrict __src,
        int __c, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));

extern void *memset (void *__s, int __c, size_t __n) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern int memcmp (const void *__s1, const void *__s2, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern void *memchr (const void *__s, int __c, size_t __n)
      __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));


extern char *strcpy (char *__restrict __dest, const char *__restrict __src)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strncpy (char *__restrict __dest,
        const char *__restrict __src, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strcat (char *__restrict __dest, const char *__restrict __src)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strncat (char *__restrict __dest, const char *__restrict __src,
        size_t __n) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int strcmp (const char *__s1, const char *__s2)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern int strncmp (const char *__s1, const char *__s2, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern int strcoll (const char *__s1, const char *__s2)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern size_t strxfrm (char *__restrict __dest,
         const char *__restrict __src, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));

typedef struct __locale_struct
{
  struct __locale_data *__locales[13];
  const unsigned short int *__ctype_b;
  const int *__ctype_tolower;
  const int *__ctype_toupper;
  const char *__names[13];
} *__locale_t;
typedef __locale_t locale_t;
extern int strcoll_l (const char *__s1, const char *__s2, __locale_t __l)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2, 3)));
extern size_t strxfrm_l (char *__dest, const char *__src, size_t __n,
    __locale_t __l) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2, 4)));
extern char *strdup (const char *__s)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__malloc__)) __attribute__ ((__nonnull__ (1)));
extern char *strndup (const char *__string, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__malloc__)) __attribute__ ((__nonnull__ (1)));

extern char *strchr (const char *__s, int __c)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));
extern char *strrchr (const char *__s, int __c)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));


extern size_t strcspn (const char *__s, const char *__reject)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern size_t strspn (const char *__s, const char *__accept)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strpbrk (const char *__s, const char *__accept)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strstr (const char *__haystack, const char *__needle)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strtok (char *__restrict __s, const char *__restrict __delim)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));

extern char *__strtok_r (char *__restrict __s,
    const char *__restrict __delim,
    char **__restrict __save_ptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2, 3)));
extern char *strtok_r (char *__restrict __s, const char *__restrict __delim,
         char **__restrict __save_ptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2, 3)));

extern size_t strlen (const char *__s)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));

extern size_t strnlen (const char *__string, size_t __maxlen)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));

extern char *strerror (int __errnum) __attribute__ ((__nothrow__ , __leaf__));

extern int strerror_r (int __errnum, char *__buf, size_t __buflen) __asm__ ("" "__xpg_strerror_r") __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));
extern char *strerror_l (int __errnum, __locale_t __l) __attribute__ ((__nothrow__ , __leaf__));
extern void __bzero (void *__s, size_t __n) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern void bcopy (const void *__src, void *__dest, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern void bzero (void *__s, size_t __n) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern int bcmp (const void *__s1, const void *__s2, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *index (const char *__s, int __c)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));
extern char *rindex (const char *__s, int __c)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));
extern int ffs (int __i) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
extern int strcasecmp (const char *__s1, const char *__s2)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern int strncasecmp (const char *__s1, const char *__s2, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strsep (char **__restrict __stringp,
       const char *__restrict __delim)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strsignal (int __sig) __attribute__ ((__nothrow__ , __leaf__));
extern char *__stpcpy (char *__restrict __dest, const char *__restrict __src)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *stpcpy (char *__restrict __dest, const char *__restrict __src)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *__stpncpy (char *__restrict __dest,
   const char *__restrict __src, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *stpncpy (char *__restrict __dest,
        const char *__restrict __src, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));


struct flock
  {
    short int l_type;
    short int l_whence;
    __off_t l_start;
    __off_t l_len;
    __pid_t l_pid;
  };


extern int fcntl (int __fd, int __cmd, ...);
extern int open (const char *__file, int __oflag, ...) __attribute__ ((__nonnull__ (1)));
extern int openat (int __fd, const char *__file, int __oflag, ...)
     __attribute__ ((__nonnull__ (2)));
extern int creat (const char *__file, mode_t __mode) __attribute__ ((__nonnull__ (1)));
extern int lockf (int __fd, int __cmd, off_t __len);
extern int posix_fadvise (int __fd, off_t __offset, off_t __len,
     int __advise) __attribute__ ((__nothrow__ , __leaf__));
extern int posix_fallocate (int __fd, off_t __offset, off_t __len);

typedef long int s_reg_t;
typedef unsigned long int active_reg_t;
typedef unsigned long int reg_syntax_t;
extern reg_syntax_t re_syntax_options;
typedef enum
{
  REG_ENOSYS = -1,
  REG_NOERROR = 0,
  REG_NOMATCH,
  REG_BADPAT,
  REG_ECOLLATE,
  REG_ECTYPE,
  REG_EESCAPE,
  REG_ESUBREG,
  REG_EBRACK,
  REG_EPAREN,
  REG_EBRACE,
  REG_BADBR,
  REG_ERANGE,
  REG_ESPACE,
  REG_BADRPT,
  REG_EEND,
  REG_ESIZE,
  REG_ERPAREN
} reg_errcode_t;
struct re_pattern_buffer
{
  unsigned char *__buffer;
  unsigned long int __allocated;
  unsigned long int __used;
  reg_syntax_t __syntax;
  char *__fastmap;
  unsigned char * __translate;
  size_t re_nsub;
  unsigned __can_be_null : 1;
  unsigned __regs_allocated : 2;
  unsigned __fastmap_accurate : 1;
  unsigned __no_sub : 1;
  unsigned __not_bol : 1;
  unsigned __not_eol : 1;
  unsigned __newline_anchor : 1;
};
typedef struct re_pattern_buffer regex_t;
typedef int regoff_t;
typedef struct
{
  regoff_t rm_so;
  regoff_t rm_eo;
} regmatch_t;
extern int regcomp (regex_t *__restrict __preg,
      const char *__restrict __pattern,
      int __cflags);
extern int regexec (const regex_t *__restrict __preg,
      const char *__restrict __string, size_t __nmatch,
      regmatch_t __pmatch[__restrict],
      int __eflags);
extern size_t regerror (int __errcode, const regex_t *__restrict __preg,
   char *__restrict __errbuf, size_t __errbuf_size);
extern void regfree (regex_t *__preg);

typedef int BOOL ;
typedef signed char int8 ;
typedef signed char INT8 ;
typedef char CHAR ;
typedef unsigned char uint8 ;
typedef unsigned char u8 ;
typedef unsigned char UINT8 ;
typedef unsigned char UCHAR ;
typedef unsigned char BYTE ;
typedef short int16;
typedef short INT16;
typedef unsigned short uint16;
typedef unsigned short u16;
typedef unsigned short UINT16;
typedef unsigned short TWOBYTES;
typedef unsigned short WORD;
typedef int int32;
typedef unsigned int uint32;
typedef unsigned int u32;
typedef unsigned int FOURBYTES;
typedef unsigned long long uint64;
typedef bool BOOLEAN;
typedef int INT32;
typedef unsigned int UINT32;
typedef void * HANDLE;
typedef void * LPVOID;
typedef unsigned int DWORD;
typedef uint32 Core_Id;
typedef int SOCKET;

typedef unsigned char INT8U;
typedef unsigned short INT16U;
typedef unsigned int INT32U;
typedef char INT8S;
typedef short INT16S;
typedef long INT32S;
typedef unsigned int INTU;


struct iovec
  {
    void *iov_base;
    size_t iov_len;
  };
extern ssize_t readv (int __fd, const struct iovec *__iovec, int __count)
  ;
extern ssize_t writev (int __fd, const struct iovec *__iovec, int __count)
  ;
extern ssize_t preadv (int __fd, const struct iovec *__iovec, int __count,
         __off_t __offset) ;
extern ssize_t pwritev (int __fd, const struct iovec *__iovec, int __count,
   __off_t __offset) ;

typedef __socklen_t socklen_t;
enum __socket_type
{
  SOCK_STREAM = 1,
  SOCK_DGRAM = 2,
  SOCK_RAW = 3,
  SOCK_RDM = 4,
  SOCK_SEQPACKET = 5,
  SOCK_DCCP = 6,
  SOCK_PACKET = 10,
  SOCK_CLOEXEC = 02000000,
  SOCK_NONBLOCK = 00004000
};
typedef unsigned short int sa_family_t;

enum
  {
    MSG_OOB = 0x01,
    MSG_PEEK = 0x02,
    MSG_DONTROUTE = 0x04,
    MSG_CTRUNC = 0x08,
    MSG_PROXY = 0x10,
    MSG_TRUNC = 0x20,
    MSG_DONTWAIT = 0x40,
    MSG_EOR = 0x80,
    MSG_WAITALL = 0x100,
    MSG_FIN = 0x200,
    MSG_SYN = 0x400,
    MSG_CONFIRM = 0x800,
    MSG_RST = 0x1000,
    MSG_ERRQUEUE = 0x2000,
    MSG_NOSIGNAL = 0x4000,
    MSG_MORE = 0x8000,
    MSG_WAITFORONE = 0x10000,
    MSG_FASTOPEN = 0x20000000,
    MSG_CMSG_CLOEXEC = 0x40000000
  };
struct msghdr
  {
    void *msg_name;
    socklen_t msg_namelen;
    struct iovec *msg_iov;
    size_t msg_iovlen;
    void *msg_control;
    size_t msg_controllen;
    int msg_flags;
  };
struct cmsghdr
  {
    size_t cmsg_len;
    int cmsg_level;
    int cmsg_type;
    __extension__ unsigned char __cmsg_data [];
  };
extern struct cmsghdr *__cmsg_nxthdr (struct msghdr *__mhdr,
          struct cmsghdr *__cmsg) __attribute__ ((__nothrow__ , __leaf__));
enum
  {
    SCM_RIGHTS = 0x01
  };
struct linger
  {
    int l_onoff;
    int l_linger;
  };
struct osockaddr
  {
    unsigned short int sa_family;
    unsigned char sa_data[14];
  };
enum
{
  SHUT_RD = 0,
  SHUT_WR,
  SHUT_RDWR
};
extern int socket (int __domain, int __type, int __protocol) __attribute__ ((__nothrow__ , __leaf__));
extern int socketpair (int __domain, int __type, int __protocol,
         int __fds[2]) __attribute__ ((__nothrow__ , __leaf__));
extern int bind (int __fd, const struct sockaddr * __addr, socklen_t __len)
     __attribute__ ((__nothrow__ , __leaf__));
extern int getsockname (int __fd, struct sockaddr *__restrict __addr,
   socklen_t *__restrict __len) __attribute__ ((__nothrow__ , __leaf__));
extern int connect (int __fd, const struct sockaddr * __addr, socklen_t __len);
extern int getpeername (int __fd, struct sockaddr *__restrict __addr,
   socklen_t *__restrict __len) __attribute__ ((__nothrow__ , __leaf__));
extern ssize_t send (int __fd, const void *__buf, size_t __n, int __flags);
extern ssize_t recv (int __fd, void *__buf, size_t __n, int __flags);
extern ssize_t sendto (int __fd, const void *__buf, size_t __n,
         int __flags, const struct sockaddr * __addr,
         socklen_t __addr_len);
extern ssize_t recvfrom (int __fd, void *__restrict __buf, size_t __n,
    int __flags, struct sockaddr *__restrict __addr,
    socklen_t *__restrict __addr_len);
extern ssize_t sendmsg (int __fd, const struct msghdr *__message,
   int __flags);
extern ssize_t recvmsg (int __fd, struct msghdr *__message, int __flags);
extern int getsockopt (int __fd, int __level, int __optname,
         void *__restrict __optval,
         socklen_t *__restrict __optlen) __attribute__ ((__nothrow__ , __leaf__));
extern int setsockopt (int __fd, int __level, int __optname,
         const void *__optval, socklen_t __optlen) __attribute__ ((__nothrow__ , __leaf__));
extern int listen (int __fd, int __n) __attribute__ ((__nothrow__ , __leaf__));
extern int accept (int __fd, struct sockaddr *__restrict __addr,
     socklen_t *__restrict __addr_len);
extern int shutdown (int __fd, int __how) __attribute__ ((__nothrow__ , __leaf__));
extern int sockatmark (int __fd) __attribute__ ((__nothrow__ , __leaf__));
extern int isfdtype (int __fd, int __fdtype) __attribute__ ((__nothrow__ , __leaf__));

typedef uint32_t in_addr_t;

enum
  {
    IPPROTO_IP = 0,
    IPPROTO_ICMP = 1,
    IPPROTO_IGMP = 2,
    IPPROTO_IPIP = 4,
    IPPROTO_TCP = 6,
    IPPROTO_EGP = 8,
    IPPROTO_PUP = 12,
    IPPROTO_UDP = 17,
    IPPROTO_IDP = 22,
    IPPROTO_TP = 29,
    IPPROTO_DCCP = 33,
    IPPROTO_IPV6 = 41,
    IPPROTO_RSVP = 46,
    IPPROTO_GRE = 47,
    IPPROTO_ESP = 50,
    IPPROTO_AH = 51,
    IPPROTO_MTP = 92,
    IPPROTO_BEETPH = 94,
    IPPROTO_ENCAP = 98,
    IPPROTO_PIM = 103,
    IPPROTO_COMP = 108,
    IPPROTO_SCTP = 132,
    IPPROTO_UDPLITE = 136,
    IPPROTO_RAW = 255,
    IPPROTO_MAX
  };
enum
  {
    IPPROTO_HOPOPTS = 0,
    IPPROTO_ROUTING = 43,
    IPPROTO_FRAGMENT = 44,
    IPPROTO_ICMPV6 = 58,
    IPPROTO_NONE = 59,
    IPPROTO_DSTOPTS = 60,
    IPPROTO_MH = 135
  };
typedef uint16_t in_port_t;
enum
  {
    IPPORT_ECHO = 7,
    IPPORT_DISCARD = 9,
    IPPORT_SYSTAT = 11,
    IPPORT_DAYTIME = 13,
    IPPORT_NETSTAT = 15,
    IPPORT_FTP = 21,
    IPPORT_TELNET = 23,
    IPPORT_SMTP = 25,
    IPPORT_TIMESERVER = 37,
    IPPORT_NAMESERVER = 42,
    IPPORT_WHOIS = 43,
    IPPORT_MTP = 57,
    IPPORT_TFTP = 69,
    IPPORT_RJE = 77,
    IPPORT_FINGER = 79,
    IPPORT_TTYLINK = 87,
    IPPORT_SUPDUP = 95,
    IPPORT_EXECSERVER = 512,
    IPPORT_LOGINSERVER = 513,
    IPPORT_CMDSERVER = 514,
    IPPORT_EFSSERVER = 520,
    IPPORT_BIFFUDP = 512,
    IPPORT_WHOSERVER = 513,
    IPPORT_ROUTESERVER = 520,
    IPPORT_RESERVED = 1024,
    IPPORT_USERRESERVED = 5000
  };

extern uint32_t ntohl (uint32_t __netlong) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
extern uint16_t ntohs (uint16_t __netshort)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
extern uint32_t htonl (uint32_t __hostlong)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
extern uint16_t htons (uint16_t __hostshort)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
extern int bindresvport (int __sockfd, struct sockaddr_in *__sock_in) __attribute__ ((__nothrow__ , __leaf__));
extern int bindresvport6 (int __sockfd, struct sockaddr_in6 *__sock_in)
     __attribute__ ((__nothrow__ , __leaf__));


extern in_addr_t inet_addr (const char *__cp) __attribute__ ((__nothrow__ , __leaf__));
extern in_addr_t inet_lnaof (struct in_addr __in) __attribute__ ((__nothrow__ , __leaf__));
extern struct in_addr inet_makeaddr (in_addr_t __net, in_addr_t __host)
     __attribute__ ((__nothrow__ , __leaf__));
extern in_addr_t inet_netof (struct in_addr __in) __attribute__ ((__nothrow__ , __leaf__));
extern in_addr_t inet_network (const char *__cp) __attribute__ ((__nothrow__ , __leaf__));
extern char *inet_ntoa (struct in_addr __in) __attribute__ ((__nothrow__ , __leaf__));
extern int inet_pton (int __af, const char *__restrict __cp,
        void *__restrict __buf) __attribute__ ((__nothrow__ , __leaf__));
extern const char *inet_ntop (int __af, const void *__restrict __cp,
         char *__restrict __buf, socklen_t __len)
     __attribute__ ((__nothrow__ , __leaf__));
extern int inet_aton (const char *__cp, struct in_addr *__inp) __attribute__ ((__nothrow__ , __leaf__));
extern char *inet_neta (in_addr_t __net, char *__buf, size_t __len) __attribute__ ((__nothrow__ , __leaf__));
extern char *inet_net_ntop (int __af, const void *__cp, int __bits,
       char *__buf, size_t __len) __attribute__ ((__nothrow__ , __leaf__));
extern int inet_net_pton (int __af, const char *__cp,
     void *__buf, size_t __len) __attribute__ ((__nothrow__ , __leaf__));
extern unsigned int inet_nsap_addr (const char *__cp,
        unsigned char *__buf, int __len) __attribute__ ((__nothrow__ , __leaf__));
extern char *inet_nsap_ntoa (int __len, const unsigned char *__cp,
        char *__buf) __attribute__ ((__nothrow__ , __leaf__));

#pragma pack (1)
typedef struct
{
    INT8U AutoNegotiationEnable;
    INT16U Speed;
    INT8U Duplex;
    INT8U Interface;
    INT8U CapabilitiesSupported;
} __attribute__ ((packed)) PHYConfig_T;

typedef struct
{
    INT8U   Enable;                                                             /*Enable/Disable*/
    INT8U   BondIndex;                                                      /*Index value of Bond Interface*/
    INT8U   BondMode;                                                       /*Bond Mode*/
    INT16U   MiiInterval;                                                     /*MII Interval*/
    INT8U   Slaves;                                                           /*Each bit represents the interface Index value i.e 0-7*/
    INT8U   AutoConf;
}__attribute__ ((packed)) BondIface;
typedef struct{
    unsigned char CfgMethod; /* This field can either be NWCFGTYPE_DHCP or NWCFGTYPE_STATIC */
    unsigned char MAC[6];
    unsigned char Local_MAC[6];
    unsigned char IPAddr[4];
    unsigned char Broadcast[4];
    unsigned char Mask[4];
    unsigned char Gateway[4];
    unsigned char  BackupGateway[4];
      /* If interface is enabled, value is
     * NW_INTERFACE_ENABLE otherwise NW_INTERFACE_DISABLE
     */
    unsigned char enable;
    unsigned char IFName[10];
    unsigned short VLANID;
    unsigned char vlanpriority;
        unsigned char Master;
        unsigned char Slave;
        unsigned char BondIndex;
} __attribute__ ((packed)) NWCFG_STRUCT;
/*ipv6*/
typedef struct{
    unsigned char enable;
       unsigned char MAC[6];
    unsigned char CfgMethod; /* This field can either be NWCFGTYPE_DHCP or NWCFGTYPE_STATIC */
    unsigned char LinkIPAddr[16];
    unsigned char LinkPrefix;
    unsigned char SiteIPAddr[16];
    unsigned char SitePrefix;
    unsigned char GlobalIPAddr[16][16];   //anyCast Globel address    //UniCast Globel address
    unsigned char GlobalPrefix[16];
    unsigned char Gateway[16];
       unsigned char IFName[10];
} __attribute__ ((packed)) NWCFG6_STRUCT;

typedef struct {
        unsigned char Enable;
        unsigned short MiiInterval;
        unsigned char BondMode;
        unsigned char Slave;
}__attribute__ ((packed)) BondConf;

typedef struct {
    unsigned char Upslave;
}__attribute__ ((packed)) ActiveConf;

typedef struct
{
    INT8 Ifcname[16];
    INT8U Index;
    INT8U Enabled;
}__attribute__ ((packed)) IfcName_T;

typedef struct{
    unsigned short Family;
        NWCFG_STRUCT    IPv4;
        NWCFG6_STRUCT   IPv6;
} __attribute__ ((packed)) ALL_NWCFG_STRUCT;
#pragma pack ()

typedef struct{
    NWCFG_STRUCT NwInfo[10];
    int IFCount;
} __attribute__ ((packed)) NWCFGS;

typedef struct
{
    /* This field can either be NW_DUPLEX_FULL or NW_DUPLEX_HALF */
    long speed;

    /* This field can either be NW_DUPLEX_FULL or NW_DUPLEX_HALF */
    int duplex;

    /* This field can either be  NW_AUTO_NEG_ON or NW_AUTO_NEG_OFF,
     * Auto negotiation is applicable for both speed & duplex.
     */
    int autoneg;

    /* This field features the link modes that are supported by the interface */
    unsigned char supported; 

    /*Max transmission unit*/
    long maxtxpkt;

    unsigned long wolsupported;
    unsigned long wolopts;
 
} __attribute__ ((packed)) ETHCFG_STRUCT;

typedef struct{
        ETHCFG_STRUCT EthInfo[10];
} __attribute__ ((packed)) ETHCFGS;


typedef struct{

    /* Name of the interface, example: eth0, eth1, ethernet,...*/
    char IFName[10];

    /*
     * This field can either be NWCFGTYPE_DHCP or
     * NWCFGTYPE_STATIC or NWCFGTYPE_DHCPFIRST
     */
    unsigned char CfgMethod;

    /*
     *  If interface is enabled, value is NW_INTERFACE_ENABLE
     *  otherwise NW_INTERFACE_DISABLE
     */
    unsigned char Enable;

    /*
     * Current IP Origin NWCFGTYPE_DHCP or NWCFGTYPE_STATIC
     */
    unsigned char IPOrigin;

    /*
     * IP assigned: If IPOrgin is DHCP, then this is DHCP IP,
     * if the IPOrigin is Static, then this is Static IP address
     */
    unsigned char IPAddr[4];
    unsigned char Mask[4];
    unsigned char Gateway[4];

    /*
     *  Manually configured Fall back (FB) IP
     */
    unsigned char FB_IPAddr[4];
    unsigned char FB_Mask[4];
    unsigned char FB_Gateway[4];

} __attribute__ ((packed)) NWEXT_IPCFG;


typedef struct
{
    /*Burned-in MAC address*/
    unsigned char BurnedMAC[6];

    /* Locally admin-MAC: Setting Local MAC to other than 00:00:00:00:00:00
     * makes it as current MAC. If a platform does not support. If this is
     * non-zero then this is current MAC while getting
     */
    unsigned char Local_MAC[6];

}__attribute__ ((packed)) NWEXT_MACCFG;


typedef struct
{

    /* MAC Configuration */
    NWEXT_MACCFG mac_cfg;

    /* Ethernet Configuration */
    ETHCFG_STRUCT eth_cfg;

} __attribute__ ((packed)) NWEXT_ETHCFG;

typedef struct
{
    unsigned char DNSDhcpEnable;                             /*Specifies that the DNS server IP addresses should be assigned from the DHCP server*/
    unsigned char DNSServerEthIndex;                         /*Specifies that from which DHCP server the IP addresses should be assigned */
    unsigned char DNSServer1[4];                   /*Specifies the IP address for DNS server 1*/
    unsigned char DNSServer2[4];                   /*Specifies the IP address for DNS server 2*/
    unsigned char v4v6;
    unsigned char RegisterBMCFQDN[0x04];         /*Register the BMC host name using FQDN method */
    unsigned char DNSRegisterBMC[0x04];               /*Enable registering the BMC host name on the DNS server*/
    unsigned char DNSBMCHostSetting;                         /*Specifies host name is Automatic or Manual */
    unsigned char DNSBMCHostNameLen;
    unsigned char DNSBMCHostName[128];          /*Specifies the DNS BMC host name*/
    unsigned char DNSDomainNameDhcpEnable;                   /*Specifies that the DNS domain name should be assigned from the DHCP server*/
    unsigned char DNSDomainNameEthIndex;                     /*Specifies that from which DHCP server the DNS domain name should be assigned */    
    unsigned char DNSDomainNameLen;
    unsigned char DNSDomainName[256];/*The DNS domain name string*/

}  __attribute__ ((packed)) DNS_CONFIG;


/*********************************/
/* DNS Configuration structures */
/*********************************/

typedef struct
{
    INT8U HostSetting;                         /*Specifies host name is Automatic or Manual */
    INT8U HostNameLen;
    INT8U HostName[128];          /*Specifies the DNS BMC host name*/
    
}__attribute__ ((packed)) HOSTNAMECONF;

typedef struct
{
    INT8U    dhcpEnable;
    INT8U    EthIndex;
    INT8U    v4v6;
    INT8U    domainname[256];
    INT8U    domainnamelen;
}__attribute__ ((packed)) DOMAINCONF;

typedef struct
{
    INT8U   DNSIP1[16];
    INT8U   DNSIP2[16];
    INT8U   DNSIP3[16];
    INT8U   DNSEnable;
    INT8U   DNSDHCP;
    INT8U   DNSIndex;
    INT8U   IPPriority;
}__attribute__ ((packed)) DNSCONF;



/* Define the network interface */
typedef enum
{
    PENDING=1, // Interface having configured/pending settings
    ACTIVE     // Interface having current/active settings
}NW_INTERFACE;

typedef struct
{
    INT8U param;
    INT8U NwRestartNeeded;  
}__attribute__ ((packed)) MONSETLANPARAM_STRUCT;


typedef struct
{
    NWCFG_STRUCT cfgIPv4[5];
    NWCFG6_STRUCT cfgIPv6[5];
    BondIface BondConfig;
    PHYConfig_T   PHYConfig[5];
    unsigned short mtu_size[5];
    HOSTNAMECONF HostnameConfig;
    DOMAINCONF DomainConfig;
    INT8U regBMC_FQDN[0x04];
    INT8U TypeOfService[5];
    DNSCONF DnsIPConfig;
}__attribute__ ((packed)) DELAYEDLANRESTART_NWDATA;

typedef struct
{
    INT8U               IPv6_RA_Conf_Cntl_Enable;
    INT8U               IPv6_Router1_IPAddr[16];
    INT8U               IPv6_Router1_MACAddr[6];
    INT8U               IPv6_Router1_PrefixLen;
    INT8U               IPv6_Router1_PrefixValue[16];
    INT8U               IPv6_Router2_IPAddr[16];
    INT8U               IPv6_Router2_MACAddr[6];
    INT8U               IPv6_Router2_PrefixLen;
    INT8U               IPv6_Router2_PrefixValue[16];
    INT8U               IPv6_RA_Dynamic_InfoSetNum;
    INT8U               IPv6_RA_Dynamic_InfoIPAddr [16][16];
    INT8U               IPv6_RA_Dynamic_InfoMACAddr [16][6];
    INT8U               IPv6_RA_Dynamic_InfoPrefixLen[16];
    INT8U               IPv6_RA_Dynamic_InfoPrefixValue[16][16];
    INT8U               IPv6_RA_Dynamic_RecvHopLimit;

} __attribute__ ((packed)) RACFG_T;

//#pragma pack ()

/* Functions to read/write current network status */
int nwReadNWCfgs(NWCFGS *cfg, ETHCFGS *ethcfg);
int IsLinkModeSupported(ETHCFG_STRUCT *ethcfg,INT16U speed,INT8U duplex);
int nwGetEthInformation(ETHCFG_STRUCT *ethcfg, char * IFName);
int nwSetEthInformation(unsigned long speed, unsigned int duplex, char * IFName);
int nwWriteNWCfgNoUpDown(NWCFG_STRUCT *cfg);
int nwSetEthMTUSize(int mtu, char * IFName);

int nwSetBkupGWyAddr(unsigned char *ip,INT8U EthIndex);
int nwGetBkupGWyAddr(unsigned char *ip,INT8U EthIndex);
/* One should pass the buffer of size MAX_MAC_LEN to the following function */
int nwGetMACAddr(char *MAC);
int nwSetMACAddr(char *MAC, int Index);
int nwSetGateway(INT8U* GwIP,INT8U EthIndex);
int nwDelExistingGateway(INT8U EthIndex);

/* Functions to set/get MDIO PHY registers */
/* These can be used by OEMs to monitor/control the speed/duplex of the PHY */
int nwGetPHYRegister(char regNo, char *IfcName);
int nwSetPHYRegister(unsigned short regValue, char regNo, char *IfcName);

/* Function to generate an IPv6 address based on EUI-64 algo */
int nwFormIPv6Addr_EUI64(INT8U *IPv6Addr, INT8U EthIndex, int GlobalIPv6);

int nwGetNWInformations(NWCFG_STRUCT *cfg,char *IFName);
int nwGetNWInformation(NWCFG_STRUCT *cfg,INT8U EthIndex);

int nwMakeIFDown(INT8U EthIndex);
int nwMakeIFUp(INT8U  EthIndex);
extern void GetNwCfgInfo(void);
extern int GetNoofInterface(void);

/* Extended API for network*/
int GetHostEthbyIPAddr(char *IPAddr);
int GetHostEthByIPv6Addr(char *IPAddr);
int GetIfcNameByIndex(int Index, char * IfcName);
int nwGetSrcMacAddr(INT8U* IpAddr,INT8U EthIndex,INT8U *MacAddr);
int nwGetSrcCacheMacAddr(INT8U* IpAddr, INT8U EthIndex, INT8U *MacAddr);
int nwGetSrcMacAddr_IPV6(INT8U* IpAddr,INT8U *MacAddr);
int nwGetNWExtEthCfg(NWEXT_ETHCFG *cfg);
int nwGetNWInterfaceStatus(void);
int nwSetNWExtEthCfg(NWEXT_ETHCFG *cfg, int nwSetFlag);
int nwSetNWExtIPCfg (NWEXT_IPCFG *cfg, int nwSetFlag,int global_ipv6);
int GetNwLinkStatus(int fd,char *ifname);
int GetNwLinkType_mii(char *ifname);

/**
*@fn nwUpdateVLANInterfacesFile
*@brief This function is invoked to update vlan interfaces file
*/
int nwUpdateVLANInterfacesFile(void);

/**
*@fn ReadVLANFile
*@brief This function is invoked to read the vlan configuration files
*@param SettingStr - Pointer to setting name that we want to read from vlan configurations file
*@param desArr - pointer to an array where the reading has to be stored
*/
int ReadVLANFile(char *SettingStr, INT16U *desArr);

/**
*@fn ReadIfcVLANID
* Gets the VLANID based on the interface name.
*@param SettingStr - Pointer to setting name that we want to read from vlan configurations file
*@param IfcName- Interface name to which vlan id need to find.
*@param desArr - pointer to an array where the reading has to be stored
*@brief This function is invoked to read all the vlan configuration files
*@return Returns 0 on success and -1 on fails
*/
int ReadIfcVLANID (char *SettingStr, char *IfcName, INT16U  *desArr);

/**
*@fn WriteVLANFile
*@brief This function is invoked to write all the vlan configuration files
*@param SettingStr - Pointer to setting name that we want to write into vlan configurations file
*@param desArr - pointer to an array where the reading has to be stored
*@param EthIndex - char value to Ethernet index
*@param val - short int to the value that has to be written
*/
int WriteVLANFile(char *SettingStr, INT16U *desArr, INT8U EthIndex, INT16U val);

/*ipv6*/
void ConvertIP6numToStr(unsigned char *var, unsigned int len,unsigned char *string) ;
int nwReadNWCfg_IPv6(NWCFG6_STRUCT *cfg,INT8U EthIndex);
int GetDefaultGateway_ipv6(unsigned char *gw,INT8U *Interface);
int nwGetResolvConf_v4_v6(char* DNS1,char*DNS2,char *DNS3, INT8U DNSIPPriority,char* domain,unsigned char* domainnamelen);

/**
*@fn nwReadNWCfg_v4_v6
*@brief This function is invoked to Get the current network status of both IPv4 and IPv6 networks.
*@      If there is no need of IPv6 data means, then just pass NULL to IPv6 pointer.
*@param cfg - Pointer to Structure used to get IPv4 network configurations.
*@param cfg6 - Pointer to Structure used to get IPv6 network configurations.
*@param EthIndex - pointer to char used to store Interface Index value.
*@return Returns 0 on success and -1 on fails
*/
int nwReadNWCfg_v4_v6(NWCFG_STRUCT *cfg, NWCFG6_STRUCT *cfg6, INT8U EthIndex,int global_ipv6);

/**
*@fn nwWriteNWCfg_ipv4_v6
*@brief This function is invoked to set both IPv4 and IPv6 network configurations.
*@      If there is no need to write IPv6 data means, then just pass NULL to IPv6 pointer.
*@param cfg - Pointer to Structure used to set IPv4 network configurations
*@param cfg6 - Pointer to Structure used to set IPv6 network configurations
*@param EthIndex - pointer to char used to store Interface Index value.
*@return Returns 0 on success and -1 on fails
*/
int nwWriteNWCfg_ipv4_v6(NWCFG_STRUCT *cfg, NWCFG6_STRUCT *cfg6, INT8U EthIndex);

/*
 * @fn nwConfigureBonding
 * @brief This function will Enable/Disable the bonding support
 * @param BondCfg [in] Bonding configuration table
 * @param BondIndex [in] Index value of Bond interface to be configured
 * @return 0 on success, -1 on failure
 */
int nwConfigureBonding(BondIface *BondCfg,INT8U EthIndex,int timeoutd_sess_timeout,int global_ipv6);

/*
 * @fn nwGetBondConf
 * @brief This function will Get the bonding Configuration of Specified index
 * @param BondCfg [out] Bonding configuration table
 * @param BondIndex [in] Index value of Bond interface 
 * @return 0 on success, -1 on failure
 */
int nwGetBondConf(BondIface *BondCfg,INT8U BondIndex);

/*
 * @fn CheckIfcEntry
 * @brief This function will check the interface presence in ifcname table
 * @param Index [in] index value 
 * @param IfcType [in] interface type
 * @return 0 in success, -1 on failure
 */
int CheckIfcEntry(INT8U Index,INT8U IfcType);

/*
 * @fn CheckBondSlave
 * @brief This function will check the given interfaces slave status
 * @param EthIndex[in] interfaces Ethindex value
 * @returns 1 if the interface is a slave of any bond interface, otherwise 0
 */
int CheckBondSlave(INT8U EthIndex);

/*
 * @fn CheckIfcLinkStatus
 * @brief This function will check the interfaces Link health
 * @param Index [in] index value 
 * @return -1 on failure
 */
int CheckIfcLinkStatus(INT8U Index);

/*
 * @fn InitIfcNameTable
 * @brief This function is used to initialize the Ifcname table based on NIC count
 * @return -1 on failure
 */
int InitIfcNameTable();

/*
 * @fn GetIfcNameTable
 * @brief This function retrieves the Ifcnametable values.
 * @return 0 on success
 */
int GetIfcNameTable (IfcName_T *Ifctable);

/**
*@fn IsKernelIPv6Enabled
*@brief This function is used to check for IPv6 support in the kernel.
*@return Returns 1 on success and 0 on fails
*/
int IsKernelIPv6Enabled();

/*
 * @fn nwActiveSlave
 * @brief This function will active the single slave for the bonding interface
 * @param SlaveIndex to be activated
 * @return 0 on success, -1 on failure
*/
int nwActiveSlave(INT8U BondIndex,INT8U SlaveIndex);

/*
 * @fn nwGetActiveSlave
 * @brief This function will gets the active interface of specified bondindex
 * @param Bondindex [in] bonding index, Activeindex[out] active slaves
 * @return 0 on success, -1 on failure
 */
int nwGetActiveSlave(INT8U BondIndex,INT8U *ActiveIndex);

/**
*@fn Write_dhcp6c_conf
*@brief This function is used to write interface wise entries for dhcp6c.conf file.
*@return Returns 0 on success and -1 on fails
*/
int Write_dhcp6c_conf();

/**
*@fn IsValidGlobalIPv6Addr
*@brief This function will check the given IPv6 address as global IP address or not
*@return Return 0 on success and -1 on failure
*/
int IsValidGlobalIPv6Addr(struct in6_addr * IPv6Addr);

/* DNS */
int nwSetResolvConf_v4_v6(char* dns1,char* dns2,char* dnsv3,char* domain);

int ReadDNSConfFile ( DOMAINCONF *DomainConfig, DNSCONF *DnsIPConfig,INT8U *regBMC_FQDN);
int WriteDNSConfFile ( DOMAINCONF *DomainConfig, DNSCONF *DnsIPConfig, INT8U *regBMC_FQDN);
int nwGetAllDNSConf( HOSTNAMECONF *HostnameConfig, DOMAINCONF *DomainConfig, DNSCONF *DnsIPConfig,INT8U *regBMC_FQDN );
int nwSetAllDNSConf( HOSTNAMECONF *HostnameConfig, DOMAINCONF *DomainConfig, DNSCONF *DnsIPConfig,INT8U *regBMC_FQDN );
int nwGetBondCfg();

/* Library for AMI Extended DNS command  */
int nwSetHostName(char *name);
int nwGetDNSConf(unsigned char* UseDHCPForDNS,unsigned char* UseDHCPForDomain,unsigned char* DoDDNS);
int nwGetAllDNSCfg(DNS_CONFIG* dnscfg);
int nwSetDNSConf(unsigned char UseDHCPForDNS,unsigned char UseDHCPForDomain,unsigned char DoDDNS);
int nwSetAllDNSCfg_NotRestart(DNS_CONFIG* dnscfg);

int nwGetDHCPServerIP(char *dhcpServerIP);
/*!
* @brief Reading current/active network configuration using netman script
* #param[out] cfg - IP, Netmask, Gateway, Conf method(dhcp/statis)
* @returns 0 on succee , -1 on failure
*/
int nwGetNwActIPCfg( NWEXT_IPCFG *cfg );
int GetIPAdrressType(INT8U* IPAddr);

int nwSyncNWCfg_ipv4_v6(NWCFG_STRUCT *cfg,NWCFG6_STRUCT *cfg6, INT8U EthIndex);
int nwGetMACAddrInBondConf ( NWCFG_STRUCT *cfg, char *EthIndex );

/**
*@fn GetIPAddrstr
*@brief This function is used to get IP address string for given ip or hostname
*@param addr - pointer to string of IP address of hostname
*@param pResIPaddr - pointer to IP address string
*@return Returns address family (AF_INET or AF_INET6) on success and -1 on failure
*/

int GetIPAddrstr(unsigned char *addr, char *pResIPaddr);
int getFullyQualifiedDName(char *fqdname, INT8U EthIndex);
int nwGetExtMACAddr(unsigned char *MAC);


/*
 * @fn IsBMCNFSMode
 * @brief Check whether BMC is in BMC Mode.
 * @return 0 for FALSE,
 *         1 for TRUE.
 */
int IsBMCNFSMode();

int nwSyncBondCfg(BondIface *pBondCfg);
void GetNwStruct_v4_v6(NWCFG_STRUCT *pCFGIPv4,NWCFG6_STRUCT *pCFGIPv6);
int HandleDelayedNwRestart(DELAYEDLANRESTART_NWDATA *pDelyedLAN_NwCfgs, INT8U Flag_SetDNS, INT8U EthIndex);
int SetNWSpeed(PHYConfig_T *pPHYConfig, char * IFName);

int SetNWMTUSize(int mtu, char * IFName);
int SetVLANPriority(INT16U vlanID, INT8U VLANPriority, INT8U TypeOfService, char *IfcName);
int UpdateServiceStatus(INT8U ServiceBit,INT8U EthIndex,INT8U State);
int nwGetBondActiveSlave(INT8U BondIndex,INT8U *ActiveIndex);
int nwReadRACfg(RACFG_T *rcfg, INT8U EthIndex);
int nwWriteRACfg(RACFG_T * wcfg,INT8U EthIndex);
int getportenable(char* ifacename);
int CheckVLAN(char* Ifcname,int* VlanID);
int getpidnum(char* ifacename,int protocol);
int servSLPDReset ();
int ReadIPv6DUID(INT8U *DUID);
int ReadHopLimit(char* IfcName);
int updateARPGatewayip(unsigned char *ifcname);
]]

-- cdef to use if libipmi_ffi is NOT loaded
else
ffi.cdef[[

typedef unsigned int size_t;
typedef unsigned char __u_char;
typedef unsigned short int __u_short;
typedef unsigned int __u_int;
typedef unsigned long int __u_long;
typedef signed char __int8_t;
typedef unsigned char __uint8_t;
typedef signed short int __int16_t;
typedef unsigned short int __uint16_t;
typedef signed int __int32_t;
typedef unsigned int __uint32_t;
__extension__ typedef signed long long int __int64_t;
__extension__ typedef unsigned long long int __uint64_t;
__extension__ typedef long long int __quad_t;
__extension__ typedef unsigned long long int __u_quad_t;
__extension__ typedef __u_quad_t __dev_t;
__extension__ typedef unsigned int __uid_t;
__extension__ typedef unsigned int __gid_t;
__extension__ typedef unsigned long int __ino_t;
__extension__ typedef __u_quad_t __ino64_t;
__extension__ typedef unsigned int __mode_t;
__extension__ typedef unsigned int __nlink_t;
__extension__ typedef long int __off_t;
__extension__ typedef __quad_t __off64_t;
__extension__ typedef int __pid_t;
__extension__ typedef struct { int __val[2]; } __fsid_t;
__extension__ typedef long int __clock_t;
__extension__ typedef unsigned long int __rlim_t;
__extension__ typedef __u_quad_t __rlim64_t;
__extension__ typedef unsigned int __id_t;
__extension__ typedef long int __time_t;
__extension__ typedef unsigned int __useconds_t;
__extension__ typedef long int __suseconds_t;
__extension__ typedef int __daddr_t;
__extension__ typedef int __key_t;
__extension__ typedef int __clockid_t;
__extension__ typedef void * __timer_t;
__extension__ typedef long int __blksize_t;
__extension__ typedef long int __blkcnt_t;
__extension__ typedef __quad_t __blkcnt64_t;
__extension__ typedef unsigned long int __fsblkcnt_t;
__extension__ typedef __u_quad_t __fsblkcnt64_t;
__extension__ typedef unsigned long int __fsfilcnt_t;
__extension__ typedef __u_quad_t __fsfilcnt64_t;
__extension__ typedef int __fsword_t;
__extension__ typedef int __ssize_t;
__extension__ typedef long int __syscall_slong_t;
__extension__ typedef unsigned long int __syscall_ulong_t;
typedef __off64_t __loff_t;
typedef __quad_t *__qaddr_t;
typedef char *__caddr_t;
__extension__ typedef int __intptr_t;
__extension__ typedef unsigned int __socklen_t;
struct _IO_FILE;

typedef struct _IO_FILE FILE;


typedef struct _IO_FILE __FILE;
typedef struct
{
  int __count;
  union
  {
    unsigned int __wch;
    char __wchb[4];
  } __value;
} __mbstate_t;
typedef struct
{
  __off_t __pos;
  __mbstate_t __state;
} _G_fpos_t;
typedef struct
{
  __off64_t __pos;
  __mbstate_t __state;
} _G_fpos64_t;
typedef __builtin_va_list __gnuc_va_list;
struct _IO_jump_t; struct _IO_FILE;
typedef void _IO_lock_t;
struct _IO_marker {
  struct _IO_marker *_next;
  struct _IO_FILE *_sbuf;
  int _pos;
};
enum __codecvt_result
{
  __codecvt_ok,
  __codecvt_partial,
  __codecvt_error,
  __codecvt_noconv
};
struct _IO_FILE {
  int _flags;
  char* _IO_read_ptr;
  char* _IO_read_end;
  char* _IO_read_base;
  char* _IO_write_base;
  char* _IO_write_ptr;
  char* _IO_write_end;
  char* _IO_buf_base;
  char* _IO_buf_end;
  char *_IO_save_base;
  char *_IO_backup_base;
  char *_IO_save_end;
  struct _IO_marker *_markers;
  struct _IO_FILE *_chain;
  int _fileno;
  int _flags2;
  __off_t _old_offset;
  unsigned short _cur_column;
  signed char _vtable_offset;
  char _shortbuf[1];
  _IO_lock_t *_lock;
  __off64_t _offset;
  void *__pad1;
  void *__pad2;
  void *__pad3;
  void *__pad4;
  size_t __pad5;
  int _mode;
  char _unused2[15 * sizeof (int) - 4 * sizeof (void *) - sizeof (size_t)];
};
typedef struct _IO_FILE _IO_FILE;
struct _IO_FILE_plus;
extern struct _IO_FILE_plus _IO_2_1_stdin_;
extern struct _IO_FILE_plus _IO_2_1_stdout_;
extern struct _IO_FILE_plus _IO_2_1_stderr_;
typedef __ssize_t __io_read_fn (void *__cookie, char *__buf, size_t __nbytes);
typedef __ssize_t __io_write_fn (void *__cookie, const char *__buf,
     size_t __n);
typedef int __io_seek_fn (void *__cookie, __off64_t *__pos, int __w);
typedef int __io_close_fn (void *__cookie);
extern int __underflow (_IO_FILE *);
extern int __uflow (_IO_FILE *);
extern int __overflow (_IO_FILE *, int);
extern int _IO_getc (_IO_FILE *__fp);
extern int _IO_putc (int __c, _IO_FILE *__fp);
extern int _IO_feof (_IO_FILE *__fp) __attribute__ ((__nothrow__ , __leaf__));
extern int _IO_ferror (_IO_FILE *__fp) __attribute__ ((__nothrow__ , __leaf__));
extern int _IO_peekc_locked (_IO_FILE *__fp);
extern void _IO_flockfile (_IO_FILE *) __attribute__ ((__nothrow__ , __leaf__));
extern void _IO_funlockfile (_IO_FILE *) __attribute__ ((__nothrow__ , __leaf__));
extern int _IO_ftrylockfile (_IO_FILE *) __attribute__ ((__nothrow__ , __leaf__));
extern int _IO_vfscanf (_IO_FILE * __restrict, const char * __restrict,
   __gnuc_va_list, int *__restrict);
extern int _IO_vfprintf (_IO_FILE *__restrict, const char *__restrict,
    __gnuc_va_list);
extern __ssize_t _IO_padn (_IO_FILE *, int, __ssize_t);
extern size_t _IO_sgetn (_IO_FILE *, void *, size_t);
extern __off64_t _IO_seekoff (_IO_FILE *, __off64_t, int, int);
extern __off64_t _IO_seekpos (_IO_FILE *, __off64_t, int);
extern void _IO_free_backup_area (_IO_FILE *) __attribute__ ((__nothrow__ , __leaf__));
typedef __gnuc_va_list va_list;
typedef __off_t off_t;
typedef __ssize_t ssize_t;

typedef _G_fpos_t fpos_t;

extern struct _IO_FILE *stdin;
extern struct _IO_FILE *stdout;
extern struct _IO_FILE *stderr;

extern int remove (const char *__filename) __attribute__ ((__nothrow__ , __leaf__));
extern int rename (const char *__old, const char *__new) __attribute__ ((__nothrow__ , __leaf__));

extern int renameat (int __oldfd, const char *__old, int __newfd,
       const char *__new) __attribute__ ((__nothrow__ , __leaf__));

extern FILE *tmpfile (void) ;
extern char *tmpnam (char *__s) __attribute__ ((__nothrow__ , __leaf__)) ;

extern char *tmpnam_r (char *__s) __attribute__ ((__nothrow__ , __leaf__)) ;
extern char *tempnam (const char *__dir, const char *__pfx)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__malloc__)) ;

extern int fclose (FILE *__stream);
extern int fflush (FILE *__stream);

extern int fflush_unlocked (FILE *__stream);

extern FILE *fopen (const char *__restrict __filename,
      const char *__restrict __modes) ;
extern FILE *freopen (const char *__restrict __filename,
        const char *__restrict __modes,
        FILE *__restrict __stream) ;

extern FILE *fdopen (int __fd, const char *__modes) __attribute__ ((__nothrow__ , __leaf__)) ;
extern FILE *fmemopen (void *__s, size_t __len, const char *__modes)
  __attribute__ ((__nothrow__ , __leaf__)) ;
extern FILE *open_memstream (char **__bufloc, size_t *__sizeloc) __attribute__ ((__nothrow__ , __leaf__)) ;

extern void setbuf (FILE *__restrict __stream, char *__restrict __buf) __attribute__ ((__nothrow__ , __leaf__));
extern int setvbuf (FILE *__restrict __stream, char *__restrict __buf,
      int __modes, size_t __n) __attribute__ ((__nothrow__ , __leaf__));

extern void setbuffer (FILE *__restrict __stream, char *__restrict __buf,
         size_t __size) __attribute__ ((__nothrow__ , __leaf__));
extern void setlinebuf (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__));

extern int fprintf (FILE *__restrict __stream,
      const char *__restrict __format, ...);
extern int printf (const char *__restrict __format, ...);
extern int sprintf (char *__restrict __s,
      const char *__restrict __format, ...) __attribute__ ((__nothrow__));
extern int vfprintf (FILE *__restrict __s, const char *__restrict __format,
       __gnuc_va_list __arg);
extern int vprintf (const char *__restrict __format, __gnuc_va_list __arg);
extern int vsprintf (char *__restrict __s, const char *__restrict __format,
       __gnuc_va_list __arg) __attribute__ ((__nothrow__));


extern int snprintf (char *__restrict __s, size_t __maxlen,
       const char *__restrict __format, ...)
     __attribute__ ((__nothrow__)) __attribute__ ((__format__ (__printf__, 3, 4)));
extern int vsnprintf (char *__restrict __s, size_t __maxlen,
        const char *__restrict __format, __gnuc_va_list __arg)
     __attribute__ ((__nothrow__)) __attribute__ ((__format__ (__printf__, 3, 0)));

extern int vdprintf (int __fd, const char *__restrict __fmt,
       __gnuc_va_list __arg)
     __attribute__ ((__format__ (__printf__, 2, 0)));
extern int dprintf (int __fd, const char *__restrict __fmt, ...)
     __attribute__ ((__format__ (__printf__, 2, 3)));

extern int fscanf (FILE *__restrict __stream,
     const char *__restrict __format, ...) ;
extern int scanf (const char *__restrict __format, ...) ;
extern int sscanf (const char *__restrict __s,
     const char *__restrict __format, ...) __attribute__ ((__nothrow__ , __leaf__));
extern int fscanf (FILE *__restrict __stream, const char *__restrict __format, ...) __asm__ ("" "__isoc99_fscanf") ;
extern int scanf (const char *__restrict __format, ...) __asm__ ("" "__isoc99_scanf") ;
extern int sscanf (const char *__restrict __s, const char *__restrict __format, ...) __asm__ ("" "__isoc99_sscanf") __attribute__ ((__nothrow__ , __leaf__));


extern int vfscanf (FILE *__restrict __s, const char *__restrict __format,
      __gnuc_va_list __arg)
     __attribute__ ((__format__ (__scanf__, 2, 0))) ;
extern int vscanf (const char *__restrict __format, __gnuc_va_list __arg)
     __attribute__ ((__format__ (__scanf__, 1, 0))) ;
extern int vsscanf (const char *__restrict __s,
      const char *__restrict __format, __gnuc_va_list __arg)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__format__ (__scanf__, 2, 0)));
extern int vfscanf (FILE *__restrict __s, const char *__restrict __format, __gnuc_va_list __arg) __asm__ ("" "__isoc99_vfscanf")
     __attribute__ ((__format__ (__scanf__, 2, 0))) ;
extern int vscanf (const char *__restrict __format, __gnuc_va_list __arg) __asm__ ("" "__isoc99_vscanf")
     __attribute__ ((__format__ (__scanf__, 1, 0))) ;
extern int vsscanf (const char *__restrict __s, const char *__restrict __format, __gnuc_va_list __arg) __asm__ ("" "__isoc99_vsscanf") __attribute__ ((__nothrow__ , __leaf__))
     __attribute__ ((__format__ (__scanf__, 2, 0)));


extern int fgetc (FILE *__stream);
extern int getc (FILE *__stream);
extern int getchar (void);

extern int getc_unlocked (FILE *__stream);
extern int getchar_unlocked (void);
extern int fgetc_unlocked (FILE *__stream);

extern int fputc (int __c, FILE *__stream);
extern int putc (int __c, FILE *__stream);
extern int putchar (int __c);

extern int fputc_unlocked (int __c, FILE *__stream);
extern int putc_unlocked (int __c, FILE *__stream);
extern int putchar_unlocked (int __c);
extern int getw (FILE *__stream);
extern int putw (int __w, FILE *__stream);

extern char *fgets (char *__restrict __s, int __n, FILE *__restrict __stream)
     ;
extern char *gets (char *__s) __attribute__ ((__deprecated__));

extern __ssize_t __getdelim (char **__restrict __lineptr,
          size_t *__restrict __n, int __delimiter,
          FILE *__restrict __stream) ;
extern __ssize_t getdelim (char **__restrict __lineptr,
        size_t *__restrict __n, int __delimiter,
        FILE *__restrict __stream) ;
extern __ssize_t getline (char **__restrict __lineptr,
       size_t *__restrict __n,
       FILE *__restrict __stream) ;

extern int fputs (const char *__restrict __s, FILE *__restrict __stream);
extern int puts (const char *__s);
extern int ungetc (int __c, FILE *__stream);
extern size_t fread (void *__restrict __ptr, size_t __size,
       size_t __n, FILE *__restrict __stream) ;
extern size_t fwrite (const void *__restrict __ptr, size_t __size,
        size_t __n, FILE *__restrict __s);

extern size_t fread_unlocked (void *__restrict __ptr, size_t __size,
         size_t __n, FILE *__restrict __stream) ;
extern size_t fwrite_unlocked (const void *__restrict __ptr, size_t __size,
          size_t __n, FILE *__restrict __stream);

extern int fseek (FILE *__stream, long int __off, int __whence);
extern long int ftell (FILE *__stream) ;
extern void rewind (FILE *__stream);

extern int fseeko (FILE *__stream, __off_t __off, int __whence);
extern __off_t ftello (FILE *__stream) ;

extern int fgetpos (FILE *__restrict __stream, fpos_t *__restrict __pos);
extern int fsetpos (FILE *__stream, const fpos_t *__pos);


extern void clearerr (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__));
extern int feof (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;
extern int ferror (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;

extern void clearerr_unlocked (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__));
extern int feof_unlocked (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;
extern int ferror_unlocked (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;

extern void perror (const char *__s);

extern int sys_nerr;
extern const char *const sys_errlist[];
extern int fileno (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;
extern int fileno_unlocked (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;
extern FILE *popen (const char *__command, const char *__modes) ;
extern int pclose (FILE *__stream);
extern char *ctermid (char *__s) __attribute__ ((__nothrow__ , __leaf__));
extern void flockfile (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__));
extern int ftrylockfile (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__)) ;
extern void funlockfile (FILE *__stream) __attribute__ ((__nothrow__ , __leaf__));


typedef __u_char u_char;
typedef __u_short u_short;
typedef __u_int u_int;
typedef __u_long u_long;
typedef __quad_t quad_t;
typedef __u_quad_t u_quad_t;
typedef __fsid_t fsid_t;
typedef __loff_t loff_t;
typedef __ino_t ino_t;
typedef __dev_t dev_t;
typedef __gid_t gid_t;
typedef __mode_t mode_t;
typedef __nlink_t nlink_t;
typedef __uid_t uid_t;
typedef __pid_t pid_t;
typedef __id_t id_t;
typedef __daddr_t daddr_t;
typedef __caddr_t caddr_t;
typedef __key_t key_t;

typedef __clock_t clock_t;



typedef __time_t time_t;


typedef __clockid_t clockid_t;
typedef __timer_t timer_t;
typedef unsigned long int ulong;
typedef unsigned short int ushort;
typedef unsigned int uint;
typedef int int8_t __attribute__ ((__mode__ (__QI__)));
typedef int int16_t __attribute__ ((__mode__ (__HI__)));
typedef int int32_t __attribute__ ((__mode__ (__SI__)));
typedef int int64_t __attribute__ ((__mode__ (__DI__)));
typedef unsigned int u_int8_t __attribute__ ((__mode__ (__QI__)));
typedef unsigned int u_int16_t __attribute__ ((__mode__ (__HI__)));
typedef unsigned int u_int32_t __attribute__ ((__mode__ (__SI__)));
typedef unsigned int u_int64_t __attribute__ ((__mode__ (__DI__)));
typedef int register_t __attribute__ ((__mode__ (__word__)));
static __inline unsigned int
__bswap_32 (unsigned int __bsx)
{
  return __builtin_bswap32 (__bsx);
}
static __inline __uint64_t
__bswap_64 (__uint64_t __bsx)
{
  return __builtin_bswap64 (__bsx);
}
typedef int __sig_atomic_t;
typedef struct
  {
    unsigned long int __val[(1024 / (8 * sizeof (unsigned long int)))];
  } __sigset_t;
typedef __sigset_t sigset_t;
struct timespec
  {
    __time_t tv_sec;
    __syscall_slong_t tv_nsec;
  };
struct timeval
  {
    __time_t tv_sec;
    __suseconds_t tv_usec;
  };
typedef __suseconds_t suseconds_t;
typedef long int __fd_mask;
typedef struct
  {
    __fd_mask __fds_bits[1024 / (8 * (int) sizeof (__fd_mask))];
  } fd_set;
typedef __fd_mask fd_mask;

extern int select (int __nfds, fd_set *__restrict __readfds,
     fd_set *__restrict __writefds,
     fd_set *__restrict __exceptfds,
     struct timeval *__restrict __timeout);
extern int pselect (int __nfds, fd_set *__restrict __readfds,
      fd_set *__restrict __writefds,
      fd_set *__restrict __exceptfds,
      const struct timespec *__restrict __timeout,
      const __sigset_t *__restrict __sigmask);


__extension__
extern unsigned int gnu_dev_major (unsigned long long int __dev)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
__extension__
extern unsigned int gnu_dev_minor (unsigned long long int __dev)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
__extension__
extern unsigned long long int gnu_dev_makedev (unsigned int __major,
            unsigned int __minor)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));

typedef __blksize_t blksize_t;
typedef __blkcnt_t blkcnt_t;
typedef __fsblkcnt_t fsblkcnt_t;
typedef __fsfilcnt_t fsfilcnt_t;
typedef unsigned long int pthread_t;
union pthread_attr_t
{
  char __size[36];
  long int __align;
};
typedef union pthread_attr_t pthread_attr_t;
typedef struct __pthread_internal_slist
{
  struct __pthread_internal_slist *__next;
} __pthread_slist_t;
typedef union
{
  struct __pthread_mutex_s
  {
    int __lock;
    unsigned int __count;
    int __owner;
    int __kind;
    unsigned int __nusers;
    __extension__ union
    {
      struct
      {
 short __espins;
 short __elision;
      } d;
      __pthread_slist_t __list;
    };
  } __data;
  char __size[24];
  long int __align;
} pthread_mutex_t;
typedef union
{
  char __size[4];
  int __align;
} pthread_mutexattr_t;
typedef union
{
  struct
  {
    int __lock;
    unsigned int __futex;
    __extension__ unsigned long long int __total_seq;
    __extension__ unsigned long long int __wakeup_seq;
    __extension__ unsigned long long int __woken_seq;
    void *__mutex;
    unsigned int __nwaiters;
    unsigned int __broadcast_seq;
  } __data;
  char __size[48];
  __extension__ long long int __align;
} pthread_cond_t;
typedef union
{
  char __size[4];
  int __align;
} pthread_condattr_t;
typedef unsigned int pthread_key_t;
typedef int pthread_once_t;
typedef union
{
  struct
  {
    int __lock;
    unsigned int __nr_readers;
    unsigned int __readers_wakeup;
    unsigned int __writer_wakeup;
    unsigned int __nr_readers_queued;
    unsigned int __nr_writers_queued;
    unsigned char __flags;
    unsigned char __shared;
    unsigned char __pad1;
    unsigned char __pad2;
    int __writer;
  } __data;
  char __size[32];
  long int __align;
} pthread_rwlock_t;
typedef union
{
  char __size[8];
  long int __align;
} pthread_rwlockattr_t;
typedef volatile int pthread_spinlock_t;
typedef union
{
  char __size[20];
  long int __align;
} pthread_barrier_t;
typedef union
{
  char __size[4];
  int __align;
} pthread_barrierattr_t;

typedef struct FCGX_Stream {
    unsigned char *rdNext;
    unsigned char *wrNext;
    unsigned char *stop;
    unsigned char *stopUnget;
    int isReader;
    int isClosed;
    int wasFCloseCalled;
    int FCGI_errno;
    void (*fillBuffProc) (struct FCGX_Stream *stream);
    void (*emptyBuffProc) (struct FCGX_Stream *stream, int doClose);
    void *data;
} FCGX_Stream;
typedef char **FCGX_ParamArray;
typedef struct FCGX_Request {
    int requestId;
    int role;
    FCGX_Stream *in;
    FCGX_Stream *out;
    FCGX_Stream *err;
    char **envp;
    struct Params *paramsPtr;
    int ipcFd;
    int isBeginProcessed;
    int keepConnection;
    int appStatus;
    int nWriters;
    int flags;
    int listen_sock;
    int detached;
} FCGX_Request;
 int FCGX_IsCGI(void);
 int FCGX_Init(void);
 int FCGX_OpenSocket(const char *path, int backlog);
 int FCGX_InitRequest(FCGX_Request *request, int sock, int flags);
 int FCGX_Accept_r(FCGX_Request *request);
 void FCGX_Finish_r(FCGX_Request *request);
 void FCGX_Free(FCGX_Request * request, int close);
 int FCGX_Accept(
        FCGX_Stream **in,
        FCGX_Stream **out,
        FCGX_Stream **err,
        FCGX_ParamArray *envp);
 void FCGX_Finish(void);
 int FCGX_StartFilterData(FCGX_Stream *stream);
 void FCGX_SetExitStatus(int status, FCGX_Stream *stream);
 char *FCGX_GetParam(const char *name, FCGX_ParamArray envp);
 int FCGX_GetChar(FCGX_Stream *stream);
 int FCGX_UnGetChar(int c, FCGX_Stream *stream);
 int FCGX_GetStr(char *str, int n, FCGX_Stream *stream);
 char *FCGX_GetLine(char *str, int n, FCGX_Stream *stream);
 int FCGX_HasSeenEOF(FCGX_Stream *stream);
 int FCGX_PutChar(int c, FCGX_Stream *stream);
 int FCGX_PutStr(const char *str, int n, FCGX_Stream *stream);
 int FCGX_PutS(const char *str, FCGX_Stream *stream);
 int FCGX_FPrintF(FCGX_Stream *stream, const char *format, ...);
 int FCGX_VFPrintF(FCGX_Stream *stream, const char *format, va_list arg);
 int FCGX_FFlush(FCGX_Stream *stream);
 int FCGX_FClose(FCGX_Stream *stream);
 int FCGX_GetError(FCGX_Stream *stream);
 void FCGX_ClearError(FCGX_Stream *stream);
 FCGX_Stream *FCGX_CreateWriter(
        int socket,
        int requestId,
        int bufflen,
        int streamType);
 void FCGX_FreeStream(FCGX_Stream **stream);
 void FCGX_ShutdownPending(void);
 int FCGX_Attach(FCGX_Request * r);
 int FCGX_Detach(FCGX_Request * r);
typedef struct {
    FILE *stdio_stream;
    FCGX_Stream *fcgx_stream;
} FCGI_FILE;
 int FCGI_Accept(void);
 void FCGI_Finish(void);
 int FCGI_StartFilterData(void);
 void FCGI_SetExitStatus(int status);
 extern FCGI_FILE _fcgi_sF[];
 void FCGI_perror(const char *str);
 FCGI_FILE *FCGI_fopen(const char *path, const char *mode);
 int FCGI_fclose(FCGI_FILE *fp);
 int FCGI_fflush(FCGI_FILE *fp);
 FCGI_FILE *FCGI_freopen(const char *path, const char *mode, FCGI_FILE *fp);
 int FCGI_setvbuf(FCGI_FILE *fp, char *buf, int bufmode, size_t size);
 void FCGI_setbuf(FCGI_FILE *fp, char *buf);
 int FCGI_fseek(FCGI_FILE *fp, long offset, int whence);
 int FCGI_ftell(FCGI_FILE *fp);
 void FCGI_rewind(FCGI_FILE *fp);
 int FCGI_fgetc(FCGI_FILE *fp);
 int FCGI_getchar(void);
 int FCGI_ungetc(int c, FCGI_FILE *fp);
 char *FCGI_fgets(char *str, int size, FCGI_FILE *fp);
 char *FCGI_gets(char *str);
 int FCGI_fputc(int c, FCGI_FILE *fp);
 int FCGI_putchar(int c);
 int FCGI_fputs(const char *str, FCGI_FILE *fp);
 int FCGI_puts(const char *str);
 int FCGI_fprintf(FCGI_FILE *fp, const char *format, ...);
 int FCGI_printf(const char *format, ...);
 int FCGI_vfprintf(FCGI_FILE *fp, const char *format, va_list ap);
 int FCGI_vprintf(const char *format, va_list ap);
 size_t FCGI_fread(void *ptr, size_t size, size_t nmemb, FCGI_FILE *fp);
 size_t FCGI_fwrite(void *ptr, size_t size, size_t nmemb, FCGI_FILE *fp);
 int FCGI_feof(FCGI_FILE *fp);
 int FCGI_ferror(FCGI_FILE *fp);
 void FCGI_clearerr(FCGI_FILE *fp);
 FCGI_FILE *FCGI_tmpfile(void);
 int FCGI_fileno(FCGI_FILE *fp);
 FCGI_FILE *FCGI_fdopen(int fd, const char *mode);
 FCGI_FILE *FCGI_popen(const char *cmd, const char *type);
 int FCGI_pclose(FCGI_FILE *);
typedef long int wchar_t;

typedef enum
{
  P_ALL,
  P_PID,
  P_PGID
} idtype_t;
union wait
  {
    int w_status;
    struct
      {
 unsigned int __w_termsig:7;
 unsigned int __w_coredump:1;
 unsigned int __w_retcode:8;
 unsigned int:16;
      } __wait_terminated;
    struct
      {
 unsigned int __w_stopval:8;
 unsigned int __w_stopsig:8;
 unsigned int:16;
      } __wait_stopped;
  };
typedef union
  {
    union wait *__uptr;
    int *__iptr;
  } __WAIT_STATUS __attribute__ ((__transparent_union__));

typedef struct
  {
    int quot;
    int rem;
  } div_t;
typedef struct
  {
    long int quot;
    long int rem;
  } ldiv_t;


__extension__ typedef struct
  {
    long long int quot;
    long long int rem;
  } lldiv_t;

extern size_t __ctype_get_mb_cur_max (void) __attribute__ ((__nothrow__ , __leaf__)) ;

extern double atof (const char *__nptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1))) ;
extern int atoi (const char *__nptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1))) ;
extern long int atol (const char *__nptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1))) ;


__extension__ extern long long int atoll (const char *__nptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1))) ;


extern double strtod (const char *__restrict __nptr,
        char **__restrict __endptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));


extern float strtof (const char *__restrict __nptr,
       char **__restrict __endptr) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern long double strtold (const char *__restrict __nptr,
       char **__restrict __endptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));


extern long int strtol (const char *__restrict __nptr,
   char **__restrict __endptr, int __base)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern unsigned long int strtoul (const char *__restrict __nptr,
      char **__restrict __endptr, int __base)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));

__extension__
extern long long int strtoq (const char *__restrict __nptr,
        char **__restrict __endptr, int __base)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
__extension__
extern unsigned long long int strtouq (const char *__restrict __nptr,
           char **__restrict __endptr, int __base)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));

__extension__
extern long long int strtoll (const char *__restrict __nptr,
         char **__restrict __endptr, int __base)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
__extension__
extern unsigned long long int strtoull (const char *__restrict __nptr,
     char **__restrict __endptr, int __base)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));

extern char *l64a (long int __n) __attribute__ ((__nothrow__ , __leaf__)) ;
extern long int a64l (const char *__s)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1))) ;
extern long int random (void) __attribute__ ((__nothrow__ , __leaf__));
extern void srandom (unsigned int __seed) __attribute__ ((__nothrow__ , __leaf__));
extern char *initstate (unsigned int __seed, char *__statebuf,
   size_t __statelen) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));
extern char *setstate (char *__statebuf) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
struct random_data
  {
    int32_t *fptr;
    int32_t *rptr;
    int32_t *state;
    int rand_type;
    int rand_deg;
    int rand_sep;
    int32_t *end_ptr;
  };
extern int random_r (struct random_data *__restrict __buf,
       int32_t *__restrict __result) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int srandom_r (unsigned int __seed, struct random_data *__buf)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));
extern int initstate_r (unsigned int __seed, char *__restrict __statebuf,
   size_t __statelen,
   struct random_data *__restrict __buf)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2, 4)));
extern int setstate_r (char *__restrict __statebuf,
         struct random_data *__restrict __buf)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));

extern int rand (void) __attribute__ ((__nothrow__ , __leaf__));
extern void srand (unsigned int __seed) __attribute__ ((__nothrow__ , __leaf__));

extern int rand_r (unsigned int *__seed) __attribute__ ((__nothrow__ , __leaf__));
extern double drand48 (void) __attribute__ ((__nothrow__ , __leaf__));
extern double erand48 (unsigned short int __xsubi[3]) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern long int lrand48 (void) __attribute__ ((__nothrow__ , __leaf__));
extern long int nrand48 (unsigned short int __xsubi[3])
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern long int mrand48 (void) __attribute__ ((__nothrow__ , __leaf__));
extern long int jrand48 (unsigned short int __xsubi[3])
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern void srand48 (long int __seedval) __attribute__ ((__nothrow__ , __leaf__));
extern unsigned short int *seed48 (unsigned short int __seed16v[3])
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern void lcong48 (unsigned short int __param[7]) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
struct drand48_data
  {
    unsigned short int __x[3];
    unsigned short int __old_x[3];
    unsigned short int __c;
    unsigned short int __init;
    __extension__ unsigned long long int __a;
  };
extern int drand48_r (struct drand48_data *__restrict __buffer,
        double *__restrict __result) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int erand48_r (unsigned short int __xsubi[3],
        struct drand48_data *__restrict __buffer,
        double *__restrict __result) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int lrand48_r (struct drand48_data *__restrict __buffer,
        long int *__restrict __result)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int nrand48_r (unsigned short int __xsubi[3],
        struct drand48_data *__restrict __buffer,
        long int *__restrict __result)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int mrand48_r (struct drand48_data *__restrict __buffer,
        long int *__restrict __result)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int jrand48_r (unsigned short int __xsubi[3],
        struct drand48_data *__restrict __buffer,
        long int *__restrict __result)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int srand48_r (long int __seedval, struct drand48_data *__buffer)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));
extern int seed48_r (unsigned short int __seed16v[3],
       struct drand48_data *__buffer) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int lcong48_r (unsigned short int __param[7],
        struct drand48_data *__buffer)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));

extern void *malloc (size_t __size) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__malloc__)) ;
extern void *calloc (size_t __nmemb, size_t __size)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__malloc__)) ;


extern void *realloc (void *__ptr, size_t __size)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__warn_unused_result__));
extern void free (void *__ptr) __attribute__ ((__nothrow__ , __leaf__));

extern void cfree (void *__ptr) __attribute__ ((__nothrow__ , __leaf__));

extern void *alloca (size_t __size) __attribute__ ((__nothrow__ , __leaf__));

extern void *valloc (size_t __size) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__malloc__)) ;
extern int posix_memalign (void **__memptr, size_t __alignment, size_t __size)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1))) ;

extern void abort (void) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__noreturn__));
extern int atexit (void (*__func) (void)) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));

extern int on_exit (void (*__func) (int __status, void *__arg), void *__arg)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));

extern void exit (int __status) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__noreturn__));


extern void _Exit (int __status) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__noreturn__));


extern char *getenv (const char *__name) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1))) ;

extern int putenv (char *__string) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern int setenv (const char *__name, const char *__value, int __replace)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));
extern int unsetenv (const char *__name) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern int clearenv (void) __attribute__ ((__nothrow__ , __leaf__));
extern char *mktemp (char *__template) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern int mkstemp (char *__template) __attribute__ ((__nonnull__ (1))) ;
extern int mkstemps (char *__template, int __suffixlen) __attribute__ ((__nonnull__ (1))) ;
extern char *mkdtemp (char *__template) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1))) ;

extern int system (const char *__command) ;

extern char *realpath (const char *__restrict __name,
         char *__restrict __resolved) __attribute__ ((__nothrow__ , __leaf__)) ;
typedef int (*__compar_fn_t) (const void *, const void *);

extern void *bsearch (const void *__key, const void *__base,
        size_t __nmemb, size_t __size, __compar_fn_t __compar)
     __attribute__ ((__nonnull__ (1, 2, 5))) ;
extern void qsort (void *__base, size_t __nmemb, size_t __size,
     __compar_fn_t __compar) __attribute__ ((__nonnull__ (1, 4)));
extern int abs (int __x) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__)) ;
extern long int labs (long int __x) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__)) ;

__extension__ extern long long int llabs (long long int __x)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__)) ;

extern div_t div (int __numer, int __denom)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__)) ;
extern ldiv_t ldiv (long int __numer, long int __denom)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__)) ;


__extension__ extern lldiv_t lldiv (long long int __numer,
        long long int __denom)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__)) ;

extern char *ecvt (double __value, int __ndigit, int *__restrict __decpt,
     int *__restrict __sign) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4))) ;
extern char *fcvt (double __value, int __ndigit, int *__restrict __decpt,
     int *__restrict __sign) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4))) ;
extern char *gcvt (double __value, int __ndigit, char *__buf)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3))) ;
extern char *qecvt (long double __value, int __ndigit,
      int *__restrict __decpt, int *__restrict __sign)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4))) ;
extern char *qfcvt (long double __value, int __ndigit,
      int *__restrict __decpt, int *__restrict __sign)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4))) ;
extern char *qgcvt (long double __value, int __ndigit, char *__buf)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3))) ;
extern int ecvt_r (double __value, int __ndigit, int *__restrict __decpt,
     int *__restrict __sign, char *__restrict __buf,
     size_t __len) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4, 5)));
extern int fcvt_r (double __value, int __ndigit, int *__restrict __decpt,
     int *__restrict __sign, char *__restrict __buf,
     size_t __len) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4, 5)));
extern int qecvt_r (long double __value, int __ndigit,
      int *__restrict __decpt, int *__restrict __sign,
      char *__restrict __buf, size_t __len)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4, 5)));
extern int qfcvt_r (long double __value, int __ndigit,
      int *__restrict __decpt, int *__restrict __sign,
      char *__restrict __buf, size_t __len)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (3, 4, 5)));

extern int mblen (const char *__s, size_t __n) __attribute__ ((__nothrow__ , __leaf__));
extern int mbtowc (wchar_t *__restrict __pwc,
     const char *__restrict __s, size_t __n) __attribute__ ((__nothrow__ , __leaf__));
extern int wctomb (char *__s, wchar_t __wchar) __attribute__ ((__nothrow__ , __leaf__));
extern size_t mbstowcs (wchar_t *__restrict __pwcs,
   const char *__restrict __s, size_t __n) __attribute__ ((__nothrow__ , __leaf__));
extern size_t wcstombs (char *__restrict __s,
   const wchar_t *__restrict __pwcs, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__));

extern int rpmatch (const char *__response) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1))) ;
extern int getsubopt (char **__restrict __optionp,
        char *const *__restrict __tokens,
        char **__restrict __valuep)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2, 3))) ;
extern int getloadavg (double __loadavg[], int __nelem)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));

typedef int ptrdiff_t;


extern void *memcpy (void *__restrict __dest, const void *__restrict __src,
       size_t __n) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern void *memmove (void *__dest, const void *__src, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));

extern void *memccpy (void *__restrict __dest, const void *__restrict __src,
        int __c, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));

extern void *memset (void *__s, int __c, size_t __n) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern int memcmp (const void *__s1, const void *__s2, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern void *memchr (const void *__s, int __c, size_t __n)
      __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));


extern char *strcpy (char *__restrict __dest, const char *__restrict __src)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strncpy (char *__restrict __dest,
        const char *__restrict __src, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strcat (char *__restrict __dest, const char *__restrict __src)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strncat (char *__restrict __dest, const char *__restrict __src,
        size_t __n) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern int strcmp (const char *__s1, const char *__s2)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern int strncmp (const char *__s1, const char *__s2, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern int strcoll (const char *__s1, const char *__s2)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern size_t strxfrm (char *__restrict __dest,
         const char *__restrict __src, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));

typedef struct __locale_struct
{
  struct __locale_data *__locales[13];
  const unsigned short int *__ctype_b;
  const int *__ctype_tolower;
  const int *__ctype_toupper;
  const char *__names[13];
} *__locale_t;
typedef __locale_t locale_t;
extern int strcoll_l (const char *__s1, const char *__s2, __locale_t __l)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2, 3)));
extern size_t strxfrm_l (char *__dest, const char *__src, size_t __n,
    __locale_t __l) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2, 4)));
extern char *strdup (const char *__s)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__malloc__)) __attribute__ ((__nonnull__ (1)));
extern char *strndup (const char *__string, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__malloc__)) __attribute__ ((__nonnull__ (1)));

extern char *strchr (const char *__s, int __c)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));
extern char *strrchr (const char *__s, int __c)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));


extern size_t strcspn (const char *__s, const char *__reject)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern size_t strspn (const char *__s, const char *__accept)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strpbrk (const char *__s, const char *__accept)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strstr (const char *__haystack, const char *__needle)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strtok (char *__restrict __s, const char *__restrict __delim)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));

extern char *__strtok_r (char *__restrict __s,
    const char *__restrict __delim,
    char **__restrict __save_ptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2, 3)));
extern char *strtok_r (char *__restrict __s, const char *__restrict __delim,
         char **__restrict __save_ptr)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2, 3)));

extern size_t strlen (const char *__s)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));

extern size_t strnlen (const char *__string, size_t __maxlen)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));

extern char *strerror (int __errnum) __attribute__ ((__nothrow__ , __leaf__));

extern int strerror_r (int __errnum, char *__buf, size_t __buflen) __asm__ ("" "__xpg_strerror_r") __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (2)));
extern char *strerror_l (int __errnum, __locale_t __l) __attribute__ ((__nothrow__ , __leaf__));
extern void __bzero (void *__s, size_t __n) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern void bcopy (const void *__src, void *__dest, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern void bzero (void *__s, size_t __n) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1)));
extern int bcmp (const void *__s1, const void *__s2, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *index (const char *__s, int __c)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));
extern char *rindex (const char *__s, int __c)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1)));
extern int ffs (int __i) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
extern int strcasecmp (const char *__s1, const char *__s2)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern int strncasecmp (const char *__s1, const char *__s2, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__pure__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strsep (char **__restrict __stringp,
       const char *__restrict __delim)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *strsignal (int __sig) __attribute__ ((__nothrow__ , __leaf__));
extern char *__stpcpy (char *__restrict __dest, const char *__restrict __src)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *stpcpy (char *__restrict __dest, const char *__restrict __src)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *__stpncpy (char *__restrict __dest,
   const char *__restrict __src, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));
extern char *stpncpy (char *__restrict __dest,
        const char *__restrict __src, size_t __n)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__nonnull__ (1, 2)));


struct flock
  {
    short int l_type;
    short int l_whence;
    __off_t l_start;
    __off_t l_len;
    __pid_t l_pid;
  };


struct stat
  {
    __dev_t st_dev;
    unsigned short int __pad1;
    __ino_t st_ino;
    __mode_t st_mode;
    __nlink_t st_nlink;
    __uid_t st_uid;
    __gid_t st_gid;
    __dev_t st_rdev;
    unsigned short int __pad2;
    __off_t st_size;
    __blksize_t st_blksize;
    __blkcnt_t st_blocks;
    struct timespec st_atim;
    struct timespec st_mtim;
    struct timespec st_ctim;
    unsigned long int __glibc_reserved4;
    unsigned long int __glibc_reserved5;
  };
extern int fcntl (int __fd, int __cmd, ...);
extern int open (const char *__file, int __oflag, ...) __attribute__ ((__nonnull__ (1)));
extern int openat (int __fd, const char *__file, int __oflag, ...)
     __attribute__ ((__nonnull__ (2)));
extern int creat (const char *__file, mode_t __mode) __attribute__ ((__nonnull__ (1)));
extern int lockf (int __fd, int __cmd, off_t __len);
extern int posix_fadvise (int __fd, off_t __offset, off_t __len,
     int __advise) __attribute__ ((__nothrow__ , __leaf__));
extern int posix_fallocate (int __fd, off_t __offset, off_t __len);

typedef long int s_reg_t;
typedef unsigned long int active_reg_t;
typedef unsigned long int reg_syntax_t;
extern reg_syntax_t re_syntax_options;
typedef enum
{
  REG_ENOSYS = -1,
  REG_NOERROR = 0,
  REG_NOMATCH,
  REG_BADPAT,
  REG_ECOLLATE,
  REG_ECTYPE,
  REG_EESCAPE,
  REG_ESUBREG,
  REG_EBRACK,
  REG_EPAREN,
  REG_EBRACE,
  REG_BADBR,
  REG_ERANGE,
  REG_ESPACE,
  REG_BADRPT,
  REG_EEND,
  REG_ESIZE,
  REG_ERPAREN
} reg_errcode_t;
struct re_pattern_buffer
{
  unsigned char *__buffer;
  unsigned long int __allocated;
  unsigned long int __used;
  reg_syntax_t __syntax;
  char *__fastmap;
  unsigned char * __translate;
  size_t re_nsub;
  unsigned __can_be_null : 1;
  unsigned __regs_allocated : 2;
  unsigned __fastmap_accurate : 1;
  unsigned __no_sub : 1;
  unsigned __not_bol : 1;
  unsigned __not_eol : 1;
  unsigned __newline_anchor : 1;
};
typedef struct re_pattern_buffer regex_t;
typedef int regoff_t;
typedef struct
{
  regoff_t rm_so;
  regoff_t rm_eo;
} regmatch_t;
extern int regcomp (regex_t *__restrict __preg,
      const char *__restrict __pattern,
      int __cflags);
extern int regexec (const regex_t *__restrict __preg,
      const char *__restrict __string, size_t __nmatch,
      regmatch_t __pmatch[__restrict],
      int __eflags);
extern size_t regerror (int __errcode, const regex_t *__restrict __preg,
   char *__restrict __errbuf, size_t __errbuf_size);
extern void regfree (regex_t *__preg);

typedef int BOOL ;
typedef signed char int8 ;
typedef signed char INT8 ;
typedef char CHAR ;
typedef unsigned char uint8 ;
typedef unsigned char u8 ;
typedef unsigned char UINT8 ;
typedef unsigned char UCHAR ;
typedef unsigned char BYTE ;
typedef short int16;
typedef short INT16;
typedef unsigned short uint16;
typedef unsigned short u16;
typedef unsigned short UINT16;
typedef unsigned short TWOBYTES;
typedef unsigned short WORD;
typedef int int32;
typedef unsigned int uint32;
typedef unsigned int u32;
typedef unsigned int FOURBYTES;
typedef unsigned long long uint64;
typedef bool BOOLEAN;
typedef int INT32;
typedef unsigned int UINT32;
typedef void * HANDLE;
typedef void * LPVOID;
typedef unsigned int DWORD;
typedef uint32 Core_Id;
typedef int SOCKET;

typedef unsigned char INT8U;
typedef unsigned short INT16U;
typedef unsigned int INT32U;
typedef char INT8S;
typedef short INT16S;
typedef long INT32S;
typedef unsigned int INTU;


struct iovec
  {
    void *iov_base;
    size_t iov_len;
  };
extern ssize_t readv (int __fd, const struct iovec *__iovec, int __count)
  ;
extern ssize_t writev (int __fd, const struct iovec *__iovec, int __count)
  ;
extern ssize_t preadv (int __fd, const struct iovec *__iovec, int __count,
         __off_t __offset) ;
extern ssize_t pwritev (int __fd, const struct iovec *__iovec, int __count,
   __off_t __offset) ;

typedef __socklen_t socklen_t;
enum __socket_type
{
  SOCK_STREAM = 1,
  SOCK_DGRAM = 2,
  SOCK_RAW = 3,
  SOCK_RDM = 4,
  SOCK_SEQPACKET = 5,
  SOCK_DCCP = 6,
  SOCK_PACKET = 10,
  SOCK_CLOEXEC = 02000000,
  SOCK_NONBLOCK = 00004000
};
typedef unsigned short int sa_family_t;
struct sockaddr
  {
    sa_family_t sa_family;
    char sa_data[14];
  };
struct sockaddr_storage
  {
    sa_family_t ss_family;
    unsigned long int __ss_align;
    char __ss_padding[(128 - (2 * sizeof (unsigned long int)))];
  };
enum
  {
    MSG_OOB = 0x01,
    MSG_PEEK = 0x02,
    MSG_DONTROUTE = 0x04,
    MSG_CTRUNC = 0x08,
    MSG_PROXY = 0x10,
    MSG_TRUNC = 0x20,
    MSG_DONTWAIT = 0x40,
    MSG_EOR = 0x80,
    MSG_WAITALL = 0x100,
    MSG_FIN = 0x200,
    MSG_SYN = 0x400,
    MSG_CONFIRM = 0x800,
    MSG_RST = 0x1000,
    MSG_ERRQUEUE = 0x2000,
    MSG_NOSIGNAL = 0x4000,
    MSG_MORE = 0x8000,
    MSG_WAITFORONE = 0x10000,
    MSG_FASTOPEN = 0x20000000,
    MSG_CMSG_CLOEXEC = 0x40000000
  };
struct msghdr
  {
    void *msg_name;
    socklen_t msg_namelen;
    struct iovec *msg_iov;
    size_t msg_iovlen;
    void *msg_control;
    size_t msg_controllen;
    int msg_flags;
  };
struct cmsghdr
  {
    size_t cmsg_len;
    int cmsg_level;
    int cmsg_type;
    __extension__ unsigned char __cmsg_data [];
  };
extern struct cmsghdr *__cmsg_nxthdr (struct msghdr *__mhdr,
          struct cmsghdr *__cmsg) __attribute__ ((__nothrow__ , __leaf__));
enum
  {
    SCM_RIGHTS = 0x01
  };
struct linger
  {
    int l_onoff;
    int l_linger;
  };
struct osockaddr
  {
    unsigned short int sa_family;
    unsigned char sa_data[14];
  };
enum
{
  SHUT_RD = 0,
  SHUT_WR,
  SHUT_RDWR
};
extern int socket (int __domain, int __type, int __protocol) __attribute__ ((__nothrow__ , __leaf__));
extern int socketpair (int __domain, int __type, int __protocol,
         int __fds[2]) __attribute__ ((__nothrow__ , __leaf__));
extern int bind (int __fd, const struct sockaddr * __addr, socklen_t __len)
     __attribute__ ((__nothrow__ , __leaf__));
extern int getsockname (int __fd, struct sockaddr *__restrict __addr,
   socklen_t *__restrict __len) __attribute__ ((__nothrow__ , __leaf__));
extern int connect (int __fd, const struct sockaddr * __addr, socklen_t __len);
extern int getpeername (int __fd, struct sockaddr *__restrict __addr,
   socklen_t *__restrict __len) __attribute__ ((__nothrow__ , __leaf__));
extern ssize_t send (int __fd, const void *__buf, size_t __n, int __flags);
extern ssize_t recv (int __fd, void *__buf, size_t __n, int __flags);
extern ssize_t sendto (int __fd, const void *__buf, size_t __n,
         int __flags, const struct sockaddr * __addr,
         socklen_t __addr_len);
extern ssize_t recvfrom (int __fd, void *__restrict __buf, size_t __n,
    int __flags, struct sockaddr *__restrict __addr,
    socklen_t *__restrict __addr_len);
extern ssize_t sendmsg (int __fd, const struct msghdr *__message,
   int __flags);
extern ssize_t recvmsg (int __fd, struct msghdr *__message, int __flags);
extern int getsockopt (int __fd, int __level, int __optname,
         void *__restrict __optval,
         socklen_t *__restrict __optlen) __attribute__ ((__nothrow__ , __leaf__));
extern int setsockopt (int __fd, int __level, int __optname,
         const void *__optval, socklen_t __optlen) __attribute__ ((__nothrow__ , __leaf__));
extern int listen (int __fd, int __n) __attribute__ ((__nothrow__ , __leaf__));
extern int accept (int __fd, struct sockaddr *__restrict __addr,
     socklen_t *__restrict __addr_len);
extern int shutdown (int __fd, int __how) __attribute__ ((__nothrow__ , __leaf__));
extern int sockatmark (int __fd) __attribute__ ((__nothrow__ , __leaf__));
extern int isfdtype (int __fd, int __fdtype) __attribute__ ((__nothrow__ , __leaf__));


typedef uint32_t in_addr_t;

struct ip_mreqn
  {
    struct in_addr imr_multiaddr;
    struct in_addr imr_address;
    int imr_ifindex;
  };
struct in_pktinfo
  {
    int ipi_ifindex;
    struct in_addr ipi_spec_dst;
    struct in_addr ipi_addr;
  };
enum
  {
    IPPROTO_IP = 0,
    IPPROTO_ICMP = 1,
    IPPROTO_IGMP = 2,
    IPPROTO_IPIP = 4,
    IPPROTO_TCP = 6,
    IPPROTO_EGP = 8,
    IPPROTO_PUP = 12,
    IPPROTO_UDP = 17,
    IPPROTO_IDP = 22,
    IPPROTO_TP = 29,
    IPPROTO_DCCP = 33,
    IPPROTO_IPV6 = 41,
    IPPROTO_RSVP = 46,
    IPPROTO_GRE = 47,
    IPPROTO_ESP = 50,
    IPPROTO_AH = 51,
    IPPROTO_MTP = 92,
    IPPROTO_BEETPH = 94,
    IPPROTO_ENCAP = 98,
    IPPROTO_PIM = 103,
    IPPROTO_COMP = 108,
    IPPROTO_SCTP = 132,
    IPPROTO_UDPLITE = 136,
    IPPROTO_RAW = 255,
    IPPROTO_MAX
  };
enum
  {
    IPPROTO_HOPOPTS = 0,
    IPPROTO_ROUTING = 43,
    IPPROTO_FRAGMENT = 44,
    IPPROTO_ICMPV6 = 58,
    IPPROTO_NONE = 59,
    IPPROTO_DSTOPTS = 60,
    IPPROTO_MH = 135
  };
typedef uint16_t in_port_t;
enum
  {
    IPPORT_ECHO = 7,
    IPPORT_DISCARD = 9,
    IPPORT_SYSTAT = 11,
    IPPORT_DAYTIME = 13,
    IPPORT_NETSTAT = 15,
    IPPORT_FTP = 21,
    IPPORT_TELNET = 23,
    IPPORT_SMTP = 25,
    IPPORT_TIMESERVER = 37,
    IPPORT_NAMESERVER = 42,
    IPPORT_WHOIS = 43,
    IPPORT_MTP = 57,
    IPPORT_TFTP = 69,
    IPPORT_RJE = 77,
    IPPORT_FINGER = 79,
    IPPORT_TTYLINK = 87,
    IPPORT_SUPDUP = 95,
    IPPORT_EXECSERVER = 512,
    IPPORT_LOGINSERVER = 513,
    IPPORT_CMDSERVER = 514,
    IPPORT_EFSSERVER = 520,
    IPPORT_BIFFUDP = 512,
    IPPORT_WHOSERVER = 513,
    IPPORT_ROUTESERVER = 520,
    IPPORT_RESERVED = 1024,
    IPPORT_USERRESERVED = 5000
  };
struct in6_addr
  {
    union
      {
 uint8_t __u6_addr8[16];
 uint16_t __u6_addr16[8];
 uint32_t __u6_addr32[4];
      } __in6_u;
  };
extern const struct in6_addr in6addr_any;
extern const struct in6_addr in6addr_loopback;
struct sockaddr_in
  {
    sa_family_t sin_family;
    in_port_t sin_port;
    struct in_addr sin_addr;
    unsigned char sin_zero[sizeof (struct sockaddr) -
      (sizeof (unsigned short int)) -
      sizeof (in_port_t) -
      sizeof (struct in_addr)];
  };
struct sockaddr_in6
  {
    sa_family_t sin6_family;
    in_port_t sin6_port;
    uint32_t sin6_flowinfo;
    struct in6_addr sin6_addr;
    uint32_t sin6_scope_id;
  };
struct ip_mreq
  {
    struct in_addr imr_multiaddr;
    struct in_addr imr_interface;
  };
struct ip_mreq_source
  {
    struct in_addr imr_multiaddr;
    struct in_addr imr_interface;
    struct in_addr imr_sourceaddr;
  };
struct ipv6_mreq
  {
    struct in6_addr ipv6mr_multiaddr;
    unsigned int ipv6mr_interface;
  };
struct group_req
  {
    uint32_t gr_interface;
    struct sockaddr_storage gr_group;
  };
struct group_source_req
  {
    uint32_t gsr_interface;
    struct sockaddr_storage gsr_group;
    struct sockaddr_storage gsr_source;
  };
struct ip_msfilter
  {
    struct in_addr imsf_multiaddr;
    struct in_addr imsf_interface;
    uint32_t imsf_fmode;
    uint32_t imsf_numsrc;
    struct in_addr imsf_slist[1];
  };
struct group_filter
  {
    uint32_t gf_interface;
    struct sockaddr_storage gf_group;
    uint32_t gf_fmode;
    uint32_t gf_numsrc;
    struct sockaddr_storage gf_slist[1];
};
extern uint32_t ntohl (uint32_t __netlong) __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
extern uint16_t ntohs (uint16_t __netshort)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
extern uint32_t htonl (uint32_t __hostlong)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
extern uint16_t htons (uint16_t __hostshort)
     __attribute__ ((__nothrow__ , __leaf__)) __attribute__ ((__const__));
extern int bindresvport (int __sockfd, struct sockaddr_in *__sock_in) __attribute__ ((__nothrow__ , __leaf__));
extern int bindresvport6 (int __sockfd, struct sockaddr_in6 *__sock_in)
     __attribute__ ((__nothrow__ , __leaf__));


extern in_addr_t inet_addr (const char *__cp) __attribute__ ((__nothrow__ , __leaf__));
extern in_addr_t inet_lnaof (struct in_addr __in) __attribute__ ((__nothrow__ , __leaf__));
extern struct in_addr inet_makeaddr (in_addr_t __net, in_addr_t __host)
     __attribute__ ((__nothrow__ , __leaf__));
extern in_addr_t inet_netof (struct in_addr __in) __attribute__ ((__nothrow__ , __leaf__));
extern in_addr_t inet_network (const char *__cp) __attribute__ ((__nothrow__ , __leaf__));
extern char *inet_ntoa (struct in_addr __in) __attribute__ ((__nothrow__ , __leaf__));
extern int inet_pton (int __af, const char *__restrict __cp,
        void *__restrict __buf) __attribute__ ((__nothrow__ , __leaf__));
extern const char *inet_ntop (int __af, const void *__restrict __cp,
         char *__restrict __buf, socklen_t __len)
     __attribute__ ((__nothrow__ , __leaf__));
extern int inet_aton (const char *__cp, struct in_addr *__inp) __attribute__ ((__nothrow__ , __leaf__));
extern char *inet_neta (in_addr_t __net, char *__buf, size_t __len) __attribute__ ((__nothrow__ , __leaf__));
extern char *inet_net_ntop (int __af, const void *__cp, int __bits,
       char *__buf, size_t __len) __attribute__ ((__nothrow__ , __leaf__));
extern int inet_net_pton (int __af, const char *__cp,
     void *__buf, size_t __len) __attribute__ ((__nothrow__ , __leaf__));
extern unsigned int inet_nsap_addr (const char *__cp,
        unsigned char *__buf, int __len) __attribute__ ((__nothrow__ , __leaf__));
extern char *inet_nsap_ntoa (int __len, const unsigned char *__cp,
        char *__buf) __attribute__ ((__nothrow__ , __leaf__));

#pragma pack (1)
typedef struct
{
    INT8U AutoNegotiationEnable;
    INT16U Speed;
    INT8U Duplex;
    INT8U Interface;
    INT8U CapabilitiesSupported;
} __attribute__ ((packed)) PHYConfig_T;

typedef struct
{
    INT8U   Enable;                                                             /*Enable/Disable*/
    INT8U   BondIndex;                                                      /*Index value of Bond Interface*/
    INT8U   BondMode;                                                       /*Bond Mode*/
    INT16U   MiiInterval;                                                     /*MII Interval*/
    INT8U   Slaves;                                                           /*Each bit represents the interface Index value i.e 0-7*/
    INT8U   AutoConf;
}__attribute__ ((packed)) BondIface;
typedef struct{
    unsigned char CfgMethod; /* This field can either be NWCFGTYPE_DHCP or NWCFGTYPE_STATIC */
    unsigned char MAC[6];
    unsigned char Local_MAC[6];
    unsigned char IPAddr[4];
    unsigned char Broadcast[4];
    unsigned char Mask[4];
    unsigned char Gateway[4];
    unsigned char  BackupGateway[4];
      /* If interface is enabled, value is
     * NW_INTERFACE_ENABLE otherwise NW_INTERFACE_DISABLE
     */
    unsigned char enable;
    unsigned char IFName[10];
    unsigned short VLANID;
    unsigned char vlanpriority;
        unsigned char Master;
        unsigned char Slave;
        unsigned char BondIndex;
} __attribute__ ((packed)) NWCFG_STRUCT;
/*ipv6*/
typedef struct{
    unsigned char enable;
       unsigned char MAC[6];
    unsigned char CfgMethod; /* This field can either be NWCFGTYPE_DHCP or NWCFGTYPE_STATIC */
    unsigned char LinkIPAddr[16];
    unsigned char LinkPrefix;
    unsigned char SiteIPAddr[16];
    unsigned char SitePrefix;
    unsigned char GlobalIPAddr[16][16];   //anyCast Globel address    //UniCast Globel address
    unsigned char GlobalPrefix[16];
    unsigned char Gateway[16];
       unsigned char IFName[10];
} __attribute__ ((packed)) NWCFG6_STRUCT;

typedef struct {
        unsigned char Enable;
        unsigned short MiiInterval;
        unsigned char BondMode;
        unsigned char Slave;
}__attribute__ ((packed)) BondConf;

typedef struct {
    unsigned char Upslave;
}__attribute__ ((packed)) ActiveConf;

typedef struct
{
    INT8 Ifcname[16];
    INT8U Index;
    INT8U Enabled;
}__attribute__ ((packed)) IfcName_T;

typedef struct{
    unsigned short Family;
        NWCFG_STRUCT    IPv4;
        NWCFG6_STRUCT   IPv6;
} __attribute__ ((packed)) ALL_NWCFG_STRUCT;
#pragma pack ()

typedef struct{
    NWCFG_STRUCT NwInfo[10];
    int IFCount;
} __attribute__ ((packed)) NWCFGS;

typedef struct
{
    /* This field can either be NW_DUPLEX_FULL or NW_DUPLEX_HALF */
    long speed;

    /* This field can either be NW_DUPLEX_FULL or NW_DUPLEX_HALF */
    int duplex;

    /* This field can either be  NW_AUTO_NEG_ON or NW_AUTO_NEG_OFF,
     * Auto negotiation is applicable for both speed & duplex.
     */
    int autoneg;

    /* This field features the link modes that are supported by the interface */
    unsigned char supported; 

    /*Max transmission unit*/
    long maxtxpkt;

    unsigned long wolsupported;
    unsigned long wolopts;
 
} __attribute__ ((packed)) ETHCFG_STRUCT;

typedef struct{
        ETHCFG_STRUCT EthInfo[10];
} __attribute__ ((packed)) ETHCFGS;


typedef struct{

    /* Name of the interface, example: eth0, eth1, ethernet,...*/
    char IFName[10];

    /*
     * This field can either be NWCFGTYPE_DHCP or
     * NWCFGTYPE_STATIC or NWCFGTYPE_DHCPFIRST
     */
    unsigned char CfgMethod;

    /*
     *  If interface is enabled, value is NW_INTERFACE_ENABLE
     *  otherwise NW_INTERFACE_DISABLE
     */
    unsigned char Enable;

    /*
     * Current IP Origin NWCFGTYPE_DHCP or NWCFGTYPE_STATIC
     */
    unsigned char IPOrigin;

    /*
     * IP assigned: If IPOrgin is DHCP, then this is DHCP IP,
     * if the IPOrigin is Static, then this is Static IP address
     */
    unsigned char IPAddr[4];
    unsigned char Mask[4];
    unsigned char Gateway[4];

    /*
     *  Manually configured Fall back (FB) IP
     */
    unsigned char FB_IPAddr[4];
    unsigned char FB_Mask[4];
    unsigned char FB_Gateway[4];

} __attribute__ ((packed)) NWEXT_IPCFG;


typedef struct
{
    /*Burned-in MAC address*/
    unsigned char BurnedMAC[6];

    /* Locally admin-MAC: Setting Local MAC to other than 00:00:00:00:00:00
     * makes it as current MAC. If a platform does not support. If this is
     * non-zero then this is current MAC while getting
     */
    unsigned char Local_MAC[6];

}__attribute__ ((packed)) NWEXT_MACCFG;


typedef struct
{

    /* MAC Configuration */
    NWEXT_MACCFG mac_cfg;

    /* Ethernet Configuration */
    ETHCFG_STRUCT eth_cfg;

} __attribute__ ((packed)) NWEXT_ETHCFG;

typedef struct
{
    unsigned char DNSDhcpEnable;                             /*Specifies that the DNS server IP addresses should be assigned from the DHCP server*/
    unsigned char DNSServerEthIndex;                         /*Specifies that from which DHCP server the IP addresses should be assigned */
    unsigned char DNSServer1[4];                   /*Specifies the IP address for DNS server 1*/
    unsigned char DNSServer2[4];                   /*Specifies the IP address for DNS server 2*/
    unsigned char v4v6;
    unsigned char RegisterBMCFQDN[0x04];         /*Register the BMC host name using FQDN method */
    unsigned char DNSRegisterBMC[0x04];               /*Enable registering the BMC host name on the DNS server*/
    unsigned char DNSBMCHostSetting;                         /*Specifies host name is Automatic or Manual */
    unsigned char DNSBMCHostNameLen;
    unsigned char DNSBMCHostName[128];          /*Specifies the DNS BMC host name*/
    unsigned char DNSDomainNameDhcpEnable;                   /*Specifies that the DNS domain name should be assigned from the DHCP server*/
    unsigned char DNSDomainNameEthIndex;                     /*Specifies that from which DHCP server the DNS domain name should be assigned */    
    unsigned char DNSDomainNameLen;
    unsigned char DNSDomainName[256];/*The DNS domain name string*/

}  __attribute__ ((packed)) DNS_CONFIG;

typedef struct
{
    unsigned char dnsEnable;
    unsigned char manualDNSDomain1Length;
    char manualDNSDomainName1[256];
    unsigned char manualDNSDomain2Length;
    char manualDNSDomainName2[256];
    struct in_addr manualDNSServer1;
    struct in_addr manualDNSServer2;
    struct in_addr manualDNSServer3;

} __attribute__ ((packed)) MANUAL_DNS_CONFIG;


/*********************************/
/* DNS Configuration structures */
/*********************************/

typedef struct
{
    INT8U HostSetting;                         /*Specifies host name is Automatic or Manual */
    INT8U HostNameLen;
    INT8U HostName[128];          /*Specifies the DNS BMC host name*/
    
}__attribute__ ((packed)) HOSTNAMECONF;

typedef struct
{
    INT8U    dhcpEnable;
    INT8U    EthIndex;
    INT8U    v4v6;
    INT8U    domainname[256];
    INT8U    domainnamelen;
}__attribute__ ((packed)) DOMAINCONF;

typedef struct
{
    INT8U   DNSIP1[16];
    INT8U   DNSIP2[16];
    INT8U   DNSIP3[16];
    INT8U   DNSEnable;
    INT8U   DNSDHCP;
    INT8U   DNSIndex;
    INT8U   IPPriority;
}__attribute__ ((packed)) DNSCONF;



/* Define the network interface */
typedef enum
{
    PENDING=1, // Interface having configured/pending settings
    ACTIVE     // Interface having current/active settings
}NW_INTERFACE;

typedef struct
{
    INT8U param;
    INT8U NwRestartNeeded;  
}__attribute__ ((packed)) MONSETLANPARAM_STRUCT;


typedef struct
{
    NWCFG_STRUCT cfgIPv4[5];
    NWCFG6_STRUCT cfgIPv6[5];
    BondIface BondConfig;
    PHYConfig_T   PHYConfig[5];
    unsigned short mtu_size[5];
    HOSTNAMECONF HostnameConfig;
    DOMAINCONF DomainConfig;
    INT8U regBMC_FQDN[0x04];
    INT8U TypeOfService[5];
    DNSCONF DnsIPConfig;
}__attribute__ ((packed)) DELAYEDLANRESTART_NWDATA;

typedef struct
{
    INT8U               IPv6_RA_Conf_Cntl_Enable;
    INT8U               IPv6_Router1_IPAddr[16];
    INT8U               IPv6_Router1_MACAddr[6];
    INT8U               IPv6_Router1_PrefixLen;
    INT8U               IPv6_Router1_PrefixValue[16];
    INT8U               IPv6_Router2_IPAddr[16];
    INT8U               IPv6_Router2_MACAddr[6];
    INT8U               IPv6_Router2_PrefixLen;
    INT8U               IPv6_Router2_PrefixValue[16];
    INT8U               IPv6_RA_Dynamic_InfoSetNum;
    INT8U               IPv6_RA_Dynamic_InfoIPAddr [16][16];
    INT8U               IPv6_RA_Dynamic_InfoMACAddr [16][6];
    INT8U               IPv6_RA_Dynamic_InfoPrefixLen[16];
    INT8U               IPv6_RA_Dynamic_InfoPrefixValue[16][16];
    INT8U               IPv6_RA_Dynamic_RecvHopLimit;

} __attribute__ ((packed)) RACFG_T;

//#pragma pack ()

/* Functions to read/write current network status */
int nwReadNWCfgs(NWCFGS *cfg, ETHCFGS *ethcfg);
int IsLinkModeSupported(ETHCFG_STRUCT *ethcfg,INT16U speed,INT8U duplex);
int nwGetEthInformation(ETHCFG_STRUCT *ethcfg, char * IFName);
int nwSetEthInformation(unsigned long speed, unsigned int duplex, char * IFName);
int nwWriteNWCfgNoUpDown(NWCFG_STRUCT *cfg);
int nwSetEthMTUSize(int mtu, char * IFName);

int nwSetBkupGWyAddr(unsigned char *ip,INT8U EthIndex);
int nwGetBkupGWyAddr(unsigned char *ip,INT8U EthIndex);
/* One should pass the buffer of size MAX_MAC_LEN to the following function */
int nwGetMACAddr(char *MAC);
int nwSetMACAddr(char *MAC, int Index);
int nwSetGateway(INT8U* GwIP,INT8U EthIndex);
int nwDelExistingGateway(INT8U EthIndex);

/* Functions to set/get MDIO PHY registers */
/* These can be used by OEMs to monitor/control the speed/duplex of the PHY */
int nwGetPHYRegister(char regNo, char *IfcName);
int nwSetPHYRegister(unsigned short regValue, char regNo, char *IfcName);

/* Function to generate an IPv6 address based on EUI-64 algo */
int nwFormIPv6Addr_EUI64(INT8U *IPv6Addr, INT8U EthIndex, int GlobalIPv6);

int nwGetNWInformations(NWCFG_STRUCT *cfg,char *IFName);
int nwGetNWInformation(NWCFG_STRUCT *cfg,INT8U EthIndex);

int nwMakeIFDown(INT8U EthIndex);
int nwMakeIFUp(INT8U  EthIndex);
extern void GetNwCfgInfo(void);
extern int GetNoofInterface(void);

/* Extended API for network*/
int GetHostEthbyIPAddr(char *IPAddr);
int GetHostEthByIPv6Addr(char *IPAddr);
int GetIfcNameByIndex(int Index, char * IfcName);
int nwGetSrcMacAddr(INT8U* IpAddr,INT8U EthIndex,INT8U *MacAddr);
int nwGetSrcCacheMacAddr(INT8U* IpAddr, INT8U EthIndex, INT8U *MacAddr);
int nwGetSrcMacAddr_IPV6(INT8U* IpAddr,INT8U *MacAddr);
int nwGetNWExtEthCfg(NWEXT_ETHCFG *cfg);
int nwGetNWInterfaceStatus(void);
int nwSetNWExtEthCfg(NWEXT_ETHCFG *cfg, int nwSetFlag);
int nwSetNWExtIPCfg (NWEXT_IPCFG *cfg, int nwSetFlag,int global_ipv6);
int GetNwLinkStatus(int fd,char *ifname);
int GetNwLinkType_mii(char *ifname);

/**
*@fn nwUpdateVLANInterfacesFile
*@brief This function is invoked to update vlan interfaces file
*/
int nwUpdateVLANInterfacesFile(void);

/**
*@fn ReadVLANFile
*@brief This function is invoked to read the vlan configuration files
*@param SettingStr - Pointer to setting name that we want to read from vlan configurations file
*@param desArr - pointer to an array where the reading has to be stored
*/
int ReadVLANFile(char *SettingStr, INT16U *desArr);

/**
*@fn ReadIfcVLANID
* Gets the VLANID based on the interface name.
*@param SettingStr - Pointer to setting name that we want to read from vlan configurations file
*@param IfcName- Interface name to which vlan id need to find.
*@param desArr - pointer to an array where the reading has to be stored
*@brief This function is invoked to read all the vlan configuration files
*@return Returns 0 on success and -1 on fails
*/
int ReadIfcVLANID (char *SettingStr, char *IfcName, INT16U  *desArr);

/**
*@fn WriteVLANFile
*@brief This function is invoked to write all the vlan configuration files
*@param SettingStr - Pointer to setting name that we want to write into vlan configurations file
*@param desArr - pointer to an array where the reading has to be stored
*@param EthIndex - char value to Ethernet index
*@param val - short int to the value that has to be written
*/
int WriteVLANFile(char *SettingStr, INT16U *desArr, INT8U EthIndex, INT16U val);

/*ipv6*/
void ConvertIP6numToStr(unsigned char *var, unsigned int len,unsigned char *string) ;
int nwReadNWCfg_IPv6(NWCFG6_STRUCT *cfg,INT8U EthIndex);
int GetDefaultGateway_ipv6(unsigned char *gw,INT8U *Interface);
int nwGetResolvConf_v4_v6(char* DNS1,char*DNS2,char *DNS3, INT8U DNSIPPriority,char* domain,unsigned char* domainnamelen);

/**
*@fn nwReadNWCfg_v4_v6
*@brief This function is invoked to Get the current network status of both IPv4 and IPv6 networks.
*@      If there is no need of IPv6 data means, then just pass NULL to IPv6 pointer.
*@param cfg - Pointer to Structure used to get IPv4 network configurations.
*@param cfg6 - Pointer to Structure used to get IPv6 network configurations.
*@param EthIndex - pointer to char used to store Interface Index value.
*@return Returns 0 on success and -1 on fails
*/
int nwReadNWCfg_v4_v6(NWCFG_STRUCT *cfg, NWCFG6_STRUCT *cfg6, INT8U EthIndex,int global_ipv6);

/**
*@fn nwWriteNWCfg_ipv4_v6
*@brief This function is invoked to set both IPv4 and IPv6 network configurations.
*@      If there is no need to write IPv6 data means, then just pass NULL to IPv6 pointer.
*@param cfg - Pointer to Structure used to set IPv4 network configurations
*@param cfg6 - Pointer to Structure used to set IPv6 network configurations
*@param EthIndex - pointer to char used to store Interface Index value.
*@return Returns 0 on success and -1 on fails
*/
int nwWriteNWCfg_ipv4_v6(NWCFG_STRUCT *cfg, NWCFG6_STRUCT *cfg6, INT8U EthIndex);

/*
 * @fn nwConfigureBonding
 * @brief This function will Enable/Disable the bonding support
 * @param BondCfg [in] Bonding configuration table
 * @param BondIndex [in] Index value of Bond interface to be configured
 * @return 0 on success, -1 on failure
 */
int nwConfigureBonding(BondIface *BondCfg,INT8U EthIndex,int timeoutd_sess_timeout,int global_ipv6);

/*
 * @fn nwGetBondConf
 * @brief This function will Get the bonding Configuration of Specified index
 * @param BondCfg [out] Bonding configuration table
 * @param BondIndex [in] Index value of Bond interface 
 * @return 0 on success, -1 on failure
 */
int nwGetBondConf(BondIface *BondCfg,INT8U BondIndex);

/*
 * @fn CheckIfcEntry
 * @brief This function will check the interface presence in ifcname table
 * @param Index [in] index value 
 * @param IfcType [in] interface type
 * @return 0 in success, -1 on failure
 */
int CheckIfcEntry(INT8U Index,INT8U IfcType);

/*
 * @fn CheckBondSlave
 * @brief This function will check the given interfaces slave status
 * @param EthIndex[in] interfaces Ethindex value
 * @returns 1 if the interface is a slave of any bond interface, otherwise 0
 */
int CheckBondSlave(INT8U EthIndex);

/*
 * @fn CheckIfcLinkStatus
 * @brief This function will check the interfaces Link health
 * @param Index [in] index value 
 * @return -1 on failure
 */
int CheckIfcLinkStatus(INT8U Index);

/*
 * @fn InitIfcNameTable
 * @brief This function is used to initialize the Ifcname table based on NIC count
 * @return -1 on failure
 */
int InitIfcNameTable();

/*
 * @fn GetIfcNameTable
 * @brief This function retrieves the Ifcnametable values.
 * @return 0 on success
 */
int GetIfcNameTable (IfcName_T *Ifctable);

/**
*@fn IsKernelIPv6Enabled
*@brief This function is used to check for IPv6 support in the kernel.
*@return Returns 1 on success and 0 on fails
*/
int IsKernelIPv6Enabled();

/*
 * @fn nwActiveSlave
 * @brief This function will active the single slave for the bonding interface
 * @param SlaveIndex to be activated
 * @return 0 on success, -1 on failure
*/
int nwActiveSlave(INT8U BondIndex,INT8U SlaveIndex);

/*
 * @fn nwGetActiveSlave
 * @brief This function will gets the active interface of specified bondindex
 * @param Bondindex [in] bonding index, Activeindex[out] active slaves
 * @return 0 on success, -1 on failure
 */
int nwGetActiveSlave(INT8U BondIndex,INT8U *ActiveIndex);

/**
*@fn Write_dhcp6c_conf
*@brief This function is used to write interface wise entries for dhcp6c.conf file.
*@return Returns 0 on success and -1 on fails
*/
int Write_dhcp6c_conf();

/**
*@fn IsValidGlobalIPv6Addr
*@brief This function will check the given IPv6 address as global IP address or not
*@return Return 0 on success and -1 on failure
*/
int IsValidGlobalIPv6Addr(struct in6_addr * IPv6Addr);

/* DNS */
int nwSetResolvConf_v4_v6(char* dns1,char* dns2,char* dnsv3,char* domain);

int ReadDNSConfFile ( DOMAINCONF *DomainConfig, DNSCONF *DnsIPConfig,INT8U *regBMC_FQDN);
int WriteDNSConfFile ( DOMAINCONF *DomainConfig, DNSCONF *DnsIPConfig, INT8U *regBMC_FQDN);
int nwGetAllDNSConf( HOSTNAMECONF *HostnameConfig, DOMAINCONF *DomainConfig, DNSCONF *DnsIPConfig,INT8U *regBMC_FQDN );
int nwSetAllDNSConf( HOSTNAMECONF *HostnameConfig, DOMAINCONF *DomainConfig, DNSCONF *DnsIPConfig,INT8U *regBMC_FQDN );
int nwGetBondCfg();

/* Library for AMI Extended DNS command  */
int nwSetHostName(char *name);
int nwGetDNSConf(unsigned char* UseDHCPForDNS,unsigned char* UseDHCPForDomain,unsigned char* DoDDNS);
int nwGetAllDNSCfg(DNS_CONFIG* dnscfg);
int nwSetDNSConf(unsigned char UseDHCPForDNS,unsigned char UseDHCPForDomain,unsigned char DoDDNS);
int nwSetAllDNSCfg_NotRestart(DNS_CONFIG* dnscfg);

int nwGetDHCPServerIP(char *dhcpServerIP);
/*!
* @brief Reading current/active network configuration using netman script
* #param[out] cfg - IP, Netmask, Gateway, Conf method(dhcp/statis)
* @returns 0 on succee , -1 on failure
*/
int nwGetNwActIPCfg( NWEXT_IPCFG *cfg );
int GetIPAdrressType(INT8U* IPAddr);

int nwSyncNWCfg_ipv4_v6(NWCFG_STRUCT *cfg,NWCFG6_STRUCT *cfg6, INT8U EthIndex);
int nwGetMACAddrInBondConf ( NWCFG_STRUCT *cfg, char *EthIndex );

/**
*@fn GetIPAddrstr
*@brief This function is used to get IP address string for given ip or hostname
*@param addr - pointer to string of IP address of hostname
*@param pResIPaddr - pointer to IP address string
*@return Returns address family (AF_INET or AF_INET6) on success and -1 on failure
*/

int GetIPAddrstr(unsigned char *addr, char *pResIPaddr);
int getFullyQualifiedDName(char *fqdname, INT8U EthIndex);
int nwGetExtMACAddr(unsigned char *MAC);


/*
 * @fn IsBMCNFSMode
 * @brief Check whether BMC is in BMC Mode.
 * @return 0 for FALSE,
 *         1 for TRUE.
 */
int IsBMCNFSMode();

int nwSyncBondCfg(BondIface *pBondCfg);
void GetNwStruct_v4_v6(NWCFG_STRUCT *pCFGIPv4,NWCFG6_STRUCT *pCFGIPv6);
int HandleDelayedNwRestart(DELAYEDLANRESTART_NWDATA *pDelyedLAN_NwCfgs, INT8U Flag_SetDNS, INT8U EthIndex);
int SetNWSpeed(PHYConfig_T *pPHYConfig, char * IFName);

int SetNWMTUSize(int mtu, char * IFName);
int SetVLANPriority(INT16U vlanID, INT8U VLANPriority, INT8U TypeOfService, char *IfcName);
int UpdateServiceStatus(INT8U ServiceBit,INT8U EthIndex,INT8U State);
int nwGetBondActiveSlave(INT8U BondIndex,INT8U *ActiveIndex);
int nwReadRACfg(RACFG_T *rcfg, INT8U EthIndex);
int nwWriteRACfg(RACFG_T * wcfg,INT8U EthIndex);
int getportenable(char* ifacename);
int CheckVLAN(char* Ifcname,int* VlanID);
int getpidnum(char* ifacename,int protocol);
int servSLPDReset ();
int ReadIPv6DUID(INT8U *DUID);
int ReadHopLimit(char* IfcName);
int updateARPGatewayip(unsigned char *ifcname);
]]

end