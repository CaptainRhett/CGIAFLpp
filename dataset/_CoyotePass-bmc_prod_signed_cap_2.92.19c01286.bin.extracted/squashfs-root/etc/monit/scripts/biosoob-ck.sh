#!/bin/sh

TS_FILE=/tmp/biosoob-ck-ok
OOB_CONF=/nv/XMLTyp0.7z
TMP_OOB_CONF=/tmp/XMLTyp0.7z
OOB_XML=/tmp/bios.xml

if [ ! -e $OOB_XML ]; then
  if [ -e $OOB_CONF ]; then
    cp -a $OOB_CONF $TMP_OOB_CONF && lzcat -d $TMP_OOB_CONF > $OOB_XML && rm $TMP_OOB_CONF
    exit $?
  fi
fi

exit 0
