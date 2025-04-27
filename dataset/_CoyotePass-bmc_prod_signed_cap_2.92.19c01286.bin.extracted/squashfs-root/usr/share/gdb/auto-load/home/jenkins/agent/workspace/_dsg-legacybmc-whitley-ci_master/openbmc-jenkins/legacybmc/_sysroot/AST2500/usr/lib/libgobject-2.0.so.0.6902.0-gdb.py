import sys
import gdb

# Update module path.
dir_ = '/home/jenkins/agent/workspace/_dsg-legacybmc-whitley-ci_master/openbmc-jenkins/legacybmc/_sysroot/AST2500/usr/share/glib-2.0/gdb'
if not dir_ in sys.path:
    sys.path.insert(0, dir_)

from gobject_gdb import register
register (gdb.current_objfile ())
