#
# spec file for package libiniparser (Version 2.17)
#
# Copyright (c) 2010 SUSE LINUX Products GmbH, Nuernberg, Germany.
#
# All modifications and additions to the file contributed by third parties
# remain the property of their copyright owners, unless otherwise agreed
# upon. The license for this file, and modifications and additions to the
# file, is the same license as for the pristine package itself (unless the
# license for the pristine package is not an Open Source License, in which
# case the license is the MIT License). An "Open Source License" is a
# license that conforms to the Open Source Definition (Version 1.9)
# published by the Open Source Initiative.

# Please submit bugfixes or comments via http://bugs.opensuse.org/
#

# norootforbuild


Name:           libiniparser
Version:        2.17
Release:        98.1.2
License:        MIT
Group:          System/Libraries
Url:            http://ndevilla.free.fr/iniparser/
AutoReqProv:    on
# bug437293
%ifarch ppc64
Obsoletes:      libiniparser-64bit
%endif
#
Summary:        Library to parse ini files
Source:         http://ndevilla.free.fr/iniparser/iniparser-%{version}.tar.bz2
Source2:        baselibs.conf
Patch00:        iniparser_remove_rpath.patch
BuildRoot:      %{_tmppath}/%{name}-%{version}-build

%description
Libiniparser offers parsing of ini files from the C level.



Authors:
--------
    Nicolas Devillard <ndevilla at free dot fr>

%if 0%{?suse_version} > 1100
%define debug_package_requires libiniparser0 = %{version}-%{release}

%package -n libiniparser0
License:        MIT
Group:          System/Libraries
Summary:        Library to parse ini files
# bug437293
%ifarch ppc64
Obsoletes:      libiniparser-64bit
%endif
#

%description -n libiniparser0
Libiniparser offers parsing of ini files from the C level.



Authors:
--------
    Nicolas Devillard <ndevilla at free dot fr>

%endif

%package devel
License:        MIT
Summary:        Libraries and Header Files to Develop Programs with libiniparser Support
Group:          Development/Libraries/C and C++
AutoReqProv:    on
# bug437293
%ifarch ppc64
Obsoletes:      libiniparser-devel-64bit
%endif
#
%if 0%{?suse_version} > 1100
Requires:       libiniparser0 = %{version}
%else
Requires:       libiniparser = %{version}
%endif

%description devel
This package contains the static libraries and header files needed to
develop programs which make use of the libiniparser programming
interface.

The libiniparser offers parsing of ini files from the C level.	See a
complete documentation in HTML format, from the
/usr/share/doc/packages/libiniparser-devel directory open the file
html/index.html with any HTML-capable browser.



Authors:
--------
    Nicolas Devillard <ndevilla at free dot fr>

%prep
%setup -q -n iniparser-%{version}
%patch00 -p1

%build
%{__make} %{?jobs:-j%jobs} CFLAGS="%{optflags} -fPIC" libiniparser.so

%install
%__install -d -m 0755 %{buildroot}%{_includedir}
%__install -d -m 0755 %{buildroot}%{_libdir}
%__install -m 0755 libiniparser.so.0 %{buildroot}%{_libdir}
%__install -m 0644 src/{dictionary,iniparser}.h %{buildroot}%{_includedir}
%__ln_s -f libiniparser.so.0 %{buildroot}%{_libdir}/libiniparser.so

%check
%__ln_s libiniparser.so.0 libiniparser.so
%{__make} check

%clean
%__rm -rf %{buildroot}
%if 0%{?suse_version} > 1100

%post -n libiniparser0 -p /sbin/ldconfig

%postun -n libiniparser0 -p /sbin/ldconfig
%else

%post -p /sbin/ldconfig

%postun -p /sbin/ldconfig
%endif
%if 0%{?suse_version} > 1100

%files -n libiniparser0
%defattr(-,root,root)
%else

%files
%defattr(-,root,root)
%endif
%{_libdir}/libiniparser.so.*

%files devel
%defattr(-,root,root)
%{_includedir}/*.h
%{_libdir}/libiniparser.so
%doc html

%changelog
* Thu Dec 17 2009 jengelh@medozas.de
- add baselibs.conf as a source
- enable parallel building
* Wed Jan  7 2009 olh@suse.de
- obsolete old -XXbit packages (bnc#437293)
* Thu Nov 27 2008 ro@suse.de
- update baselibs.conf
* Thu Aug 28 2008 anschneider@suse.de
- create packages following the shlib policy
- build only the shared library
* Wed Aug 20 2008 meissner@suse.de
- use RPM_OPT_FLAGS, libiniparser.a can be 644
* Mon May  5 2008 anschneider@suse.de
- build without rpath
* Thu Apr 10 2008 ro@suse.de
- added baselibs.conf file to build xxbit packages
  for multilib support
* Thu Dec 27 2007 crrodriguez@suse.de
- fix library-without-ldconfig* errors
* Sun May 27 2007 lmuelle@suse.de
- Update to version 2.17.
  + Apply some const and fix c++ warnings.
  + Merge revision 19928 from samba.org subversion.
  + Applied patches to the Makefile to build a shared library.
* Sun May 20 2007 lmuelle@suse.de
- Remove requires on release from devel packages.
* Tue Sep 26 2006 gd@suse.de
- Update to version 2.15
  - documentation fixes
* Tue Apr 11 2006 lmuelle@suse.de
- Inital SuSE RPM.
