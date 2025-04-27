#!/bin/sh

#=============================

# /usr/bin/sysdiag.sh: Run various system debug log scripts
LOGDIR="/tmp/sysdiag"
ZIPDIR="$LOGDIR/output"
RESULTSDIR="$LOGDIR/testResults"
OUTPUTFILE="$LOGDIR/SystemDebugLog.zip"
INTC_OUTPUT_ZIP="$LOGDIR/SystemBMCDebugLog.zip"
INTC_OUTPUT_ENC="$INTC_OUTPUT_ZIP.encrypted"
SCRIPTSDIR="/usr/lib/sysdiag"
OUTPUTHTMLBASE="SystemDebugLog.html"
OUTPUTCSSHEADER="$SCRIPTSDIR/NORUN_Output_Header"
ZIPPWD="L3@p.Ah3@d"
CONTAINERFILENAME="$LOGDIR/DebugLogs.zip"
LOGTYPES="basic advanced"

#
# Step 1: Garbage collection - only allow one diagnostic log tarball. Remove old versions.
#

rm -rf $LOGDIR
for logtype in $LOGTYPES;
do
    mkdir -p $RESULTSDIR/$logtype
    mkdir -p $ZIPDIR/$logtype
done

#
# Step 2: Collect various logs
#         Put any custom log collection script/code in base-rootfs/usr/lib/sysdiag
#

for i in $SCRIPTSDIR/*
do
    if [ -d $i ]
    then
        continue
    fi
    
    if ! [ -x $i ]
    then
        continue
    fi
    
    # blacklist here for misbehaving scripts
    case "$i" in
        *NORUN*) continue;;
    esac
    
    echo "Running $i..." >&2
    sh $i $RESULTSDIR $ZIPDIR
    if [ $? != 0 ]
    then
            echo "Failed to run $i."
            exit 1
    fi
done
    
for logtype in $LOGTYPES
do    
    echo "Formatting $logtype results..." >&2

    mkdir -p $ZIPDIR/$logtype
    #
    # Step 4a: Turn log output into HTML
    #       CSS, Index, and Results will be concatenated into a single HTML file.
    #
    
    OUTPUTHTMLFILE=$ZIPDIR/$logtype/$OUTPUTHTMLBASE
    # Grab the CSS header file, and start a new output HTML file.
    cat $OUTPUTCSSHEADER > $OUTPUTHTMLFILE
    
    echo "<h3>System Debug Log</h3>" >> $OUTPUTHTMLFILE
    echo "Generation Time: `date`<br />" >> $OUTPUTHTMLFILE
    echo "<a name='top'></a><br />" >> $OUTPUTHTMLFILE
    
    
    # Only include logs with data; if the body is empty, remove all files for that test
    for i in $RESULTSDIR/$logtype/*.body; do
        if [ ! -s $i ]
        then
            rm -f ${i%.*}.*
        fi
    done

    # Collect the test names and comments, and turn them into links for the Index.
    cat $RESULTSDIR/$logtype/*.hdr >> $OUTPUTHTMLFILE

    # Collect the test results and stick them onto the end of the file.
    for i in $RESULTSDIR/$logtype/*.body; do
        cat ${i%.*}.anc >> $OUTPUTHTMLFILE
        cat ${i%.*}.body >> $OUTPUTHTMLFILE
        cat ${i%.*}.ftr >> $OUTPUTHTMLFILE
    done
    
    echo "packaging $logtype results..." >&2
    #
    # Step 5: Zip the HTML file.
    #
    # Password protected
    if [ $logtype == "basic" ]
    then
        ( cd $ZIPDIR/$logtype; zip -P $ZIPPWD -r $OUTPUTFILE . ) >/dev/null
    elif [ $logtype == "advanced" ]
    then
        (
            cd $ZIPDIR/$logtype
            zip -r -n .gz $INTC_OUTPUT_ZIP .
            TMP_OUT=$(mktemp -p $PWD TMPZIP.XXXXXXXX)
            mv $INTC_OUTPUT_ZIP $TMP_OUT
            secure-payload.sh encrypt_rsa $TMP_OUT $INTC_OUTPUT_ENC /usr/bin/cert.pem
            rm $TMP_OUT
        ) >/dev/null
    fi
done

# Step 6: Clean up staging directories
rm -rf $ZIPDIR $RESULTSDIR

#
# Step 7: Wrap it all up in a larger, unencrypted container.
#
echo "packaging final results..." >&2
chmod 644 $OUTPUTFILE
chmod 644 $INTC_OUTPUT_ENC
zip -j -n .zip:.encrypted $CONTAINERFILENAME $OUTPUTFILE $INTC_OUTPUT_ENC  >/dev/null
# remove artifacts
rm -f $OUTPUTFILE $INTC_OUTPUT_ENC


