#!/bin/sh
# process_SDR.sh
# capture the SDR and FRU data

source /usr/lib/sysdiag/NORUN_common

# This is the user-visible name and comment. This will show up in the final product.
TEST_NAME="SDR Report"
TEST_COMMENT="Captured SDR data"

MakeHtmlHeaders
# Starting here, all stdout is copied to basic AND advanced log files
exec > $OUTPUT_BASIC
# PUT YOUR BASIC LOGGING HERE
MakeHtmlAnchors

val=$(cat /proc/cmdline | sed 's/.*fwproductid=\([0-9a-f]*\).*/\1/')

case "$val" in 
    0002) # AST2500 EVB
        device="ast2500evb"
        ;;

    007b) # WolfPass
        device="WolfPass"
        ;;

    007c) # BuchananPass
        device="BuchananPass"
        ;;

    007d) # SawtoothPass
        device="SawtoothPass"
        ;;

    0080) # YubaCity
        device="YubaCity"
        ;;

    0081) # WhiteRiverGlacier
        device="WhiteRiverGlacier"
        ;;

    0083) # MossBeach-Mehlow
        device="MossBeach"
        ;;

    0086) # BlueMountainPass
        device="BlueMountainPass"
        ;;

    0087) # Sky Meadow
        device="SkyMeadow"
        ;;

    0089) # BuchananPass SFP+
        device="BuchananPassSFPPlus"
        ;;

    008c) # NobRock
        device="NobRock"
        ;;

    008F) #WhiteRiverGlacierJBOF 
        device="WhiteRiverGlacierJBOF"
        ;;

    0090) #WolfPassFeatureRich 
        device="WolfPassFeatureRich"
        ;;

    0091) # WilsonCity
        device="WilsonCity"
        ;;

    0094) #DragonRock
        device="DragonRock"
        ;;

    0095) # WalkerPass
        device="WalkerPass"
        ;;

    0096) #WhiteRiverGlacierJBOFR
        device="WhiteRiverGlacierJBOFR"
        ;;

    0097) #AcadiaPass
        device="AcadiaPass"
        ;;

    0098) #CoyotePass
        device="CoyotePass"
        ;;

    0099) #TennesseePass
        device="TennesseePass"
        ;;

    00aa) #AmericanPass
        device="AmericanPass"
        ;;

    *) # Not on list
        device=""
        ;;
esac

PLAT_DIR="usr/share/ipmid/platform/$device"

if [ -d $PLAT_DIR ]; then
    cp -a /usr/share/ipmid/platform/$device "$ZIPDIR_BASIC"
    cp -a /usr/share/ipmid/platform/$device "$ZIPDIR_ADVANCED"
fi

# Add some HTML comments to indicate the test's public name. 
# These will be removed in post-processing.
echo "<!-- TEST_NAME=$TEST_NAME -->"
echo "<!-- TEST_COMMENT=$TEST_COMMENT -->"

echo "SDR Data sector"
cat /nv/sdr/sdr.vers
echo
echo

echo "FRU Data sector"
dd if=/dev/mtd0 bs=64k count=1 skip=457 2>/dev/null | safehexdump

# starting here, all stdout is logged only to the advanced log file
cat $OUTPUT_BASIC > $OUTPUT_ADVANCED
exec >> $OUTPUT_ADVANCED
# PUT YOUR ADVANCED LOGGING HERE

EndHtmlSections
