#!/bin/sh

#=============================

# /usr/bin/cpudiag.sh: zip up the CPU debug logs
LOGDIR="/tmp/sysdiag"
CONTAINERFILENAME="$LOGDIR/DebugLogs.zip"
CPUDUMP_LOCATION="/nv/crashdump/output"
CPUDUMP_JSON_NAME="sysdebug_"
CPUDUMP_JSON_TMP_NAME="sysdebug.json"
STAGING_LOCATION="$LOGDIR/staging"
TEMP_LOCATION="$LOGDIR/temp"

#
# Step 1: Garbage collection - only allow one diagnostic log tarball. Remove old versions.
#

rm -rf $LOGDIR
mkdir -p $LOGDIR
mkdir -p $STAGING_LOCATION
mkdir -p $TEMP_LOCATION

#
# Step 2: Gather CPU logs
#

# Unzip the JSON CPU dump files into the advanced and basic staging locations with the zip name
# for i in $CPUDUMP_LOCATION/$CPUDUMP_JSON_NAME*.zip
# do
#    if [ -e $i ]
#    then
#       unzip -o $i -d $TEMP_LOCATION
#       cp $TEMP_LOCATION/$CPUDUMP_JSON_TMP_NAME "$STAGING_LOCATION/`basename $i .zip`.json"
#    fi
# done

# Copy all the crashdump logs to staging locations
cp $CPUDUMP_LOCATION/*.json $STAGING_LOCATION/
if [ -e /tmp/crashdump.log ]
then
    cp /tmp/crashdump.log $STAGING_LOCATION/
else
    echo "/tmp/crashdump.log not exists."
fi

#
# Step 3: Wrap it all up in an unencrypted container.
#
echo "packaging final results..." >&2
zip -rj $CONTAINERFILENAME $STAGING_LOCATION >/dev/null

#
# Step 4: Clean up staging directory
#
rm -rf $STAGING_LOCATION $TEMP_LOCATION