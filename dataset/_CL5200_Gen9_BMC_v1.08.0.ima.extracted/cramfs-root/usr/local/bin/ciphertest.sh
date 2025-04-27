#!/bin/sh
# 
# cipher test script - (C)Copyright 2006-2011, American Megatrends Inc.
#
# This script uses ciphertool to test cipher driver
#
# Usage:
#     ciphertest.sh [FILE]
#     FILE: test filename, if it doesn't exist or left blank, it will be generated automatically.
#
CIPHERTOOL=/usr/local/bin/ciphertool
TMPDIR=/var/tmp/cipher
TESTFILE=/var/tmp/cipher/cipher.txt

Usage()
{
    echo "------------------"
    echo "cipher test script"
    echo "------------------" 
    echo "Usage: ciphertest.sh [FILE]"
    echo "FILE: test filename"
}

#
# Create directory if the directory doesn't exist
#
CreateTestFolder()
{ 
    if [ ! -d "$TMPDIR" ]
    then
        mkdir $TMPDIR
    fi
}

#
# Auto generate test file if it doesn't exist
#
AutoGenTestFile()
{
    if [ ! -f "$TESTFILE" ]; then
        echo "Auto generate test file..."
        touch $TESTFILE
        echo "1st string for testing cipher function." > $TESTFILE
    fi   
}


VerifyCipherResult()
{
    diff -a $1 $2
    
    if [ $? != 0 ]; then
        echo "Result: Fail"
    else
        echo "Result: Success"   
    fi
}

#
# Get supported algorithm and keybit length  
#
GetCipherSupport()
{
    $CIPHERTOOL -g
}


TestAES()
{
    if [ "$1" == "aes-ecb" ];then
        $CIPHERTOOL -algo $1 -e -k 2b7e151628aed2a6abf7158809cf4f3c -kl $2 -in $TESTFILE -out $TMPDIR/$1.bin -hw 
        $CIPHERTOOL -algo $1 -d -k 2b7e151628aed2a6abf7158809cf4f3c -kl $2 -in $TMPDIR/$1.bin -out $TMPDIR/$1.txt -hw
        VerifyCipherResult $TESTFILE $TMPDIR/$1.txt 
    else
        $CIPHERTOOL -algo $1 -e -k 2b7e151628aed2a6abf7158809cf4f3c -iv 000102030405060708090A0B0C0D0E0F -kl $2 -in $TESTFILE -out $TMPDIR/$1.bin -hw 
        $CIPHERTOOL -algo $1 -d -k 2b7e151628aed2a6abf7158809cf4f3c -iv 000102030405060708090A0B0C0D0E0F -kl $2 -in $TMPDIR/$1.bin -out $TMPDIR/$1.txt -hw
        VerifyCipherResult $TESTFILE $TMPDIR/$1.txt
    fi 
}

TestDES()
{
    if [ "$1" == "des-ecb" ];then
        $CIPHERTOOL -algo $1 -e -k 0123456789abcdef -in $TESTFILE -out $TMPDIR/$1.bin -hw
        $CIPHERTOOL -algo $1 -d -k 0123456789abcdef -in $TMPDIR/$1.bin -out $TMPDIR/$1.txt -hw
        VerifyCipherResult $TESTFILE $TMPDIR/$1.txt
    else
        $CIPHERTOOL -algo $1 -e -k 0123456789abcdef -iv 1234567890abcdef -in $TESTFILE -out $TMPDIR/$1.bin -hw
        $CIPHERTOOL -algo $1 -d -k 0123456789abcdef -iv 1234567890abcdef -in $TMPDIR/$1.bin -out $TMPDIR/$1.txt -hw
        VerifyCipherResult $TESTFILE $TMPDIR/$1.txt
    fi              
}

Test3DES()
{
    if [ "$1" == "des3-ecb" ];then
        $CIPHERTOOL -algo $1 -e -k 0123456789ABCDEF23456789ABCDEF01456789ABCDEF0123 -in $TESTFILE -out $TMPDIR/$1.bin -hw 
        $CIPHERTOOL -algo $1 -d -k 0123456789ABCDEF23456789ABCDEF01456789ABCDEF0123 -in $TMPDIR/$1.bin -out $TMPDIR/$1.txt -hw 
        VerifyCipherResult $TESTFILE $TMPDIR/$1.txt
    else
        $CIPHERTOOL -algo $1 -e -k 0123456789ABCDEF23456789ABCDEF01456789ABCDEF0123 -iv 1234567890abcdef -in $TESTFILE -out $TMPDIR/$1.bin -hw 
        $CIPHERTOOL -algo $1 -d -k 0123456789ABCDEF23456789ABCDEF01456789ABCDEF0123 -iv 1234567890abcdef -in $TMPDIR/$1.bin -out $TMPDIR/$1.txt -hw 
        VerifyCipherResult $TESTFILE $TMPDIR/$1.txt
    fi    
            
}

TestRC4()
{
    $CIPHERTOOL -algo $1 -e -k 0123456789abcdef -iv 0123456789abcdef -in $TESTFILE -out $TMPDIR/$1.bin -hw 
    $CIPHERTOOL -algo $1 -d -k 0123456789abcdef -iv 0123456789abcdef -in $TMPDIR/$1.bin -out $TMPDIR/$1.txt -hw
    VerifyCipherResult $TESTFILE $TMPDIR/$1.txt
}

TestRSA()
{
    echo abc > $TMPDIR/RSA32.txt
    $CIPHERTOOL -algo $1 -e -k 00010001 -iv c8fbcf21 -in $TMPDIR/RSA32.txt -out $TMPDIR/$1_32.bin -hw 
    $CIPHERTOOL -algo $1 -d -k 97b55d7d -iv c8fbcf21 -in $TMPDIR/$1_32.bin -out $TMPDIR/$1_32.txt -hw
    VerifyCipherResult $TMPDIR/RSA32.txt $TMPDIR/$1_32.txt
    
    echo abcdefg > $TMPDIR/RSA64.txt
    $CIPHERTOOL -algo $1 -e -k 00010001 -iv c000a86abda0c539 -in $TMPDIR/RSA64.txt -out $TMPDIR/$1_64.bin -hw 
    $CIPHERTOOL -algo $1 -d -k 92422e07c5de6a6d -iv c000a86abda0c539 -in $TMPDIR/$1_64.bin -out $TMPDIR/$1_64.txt -hw
    VerifyCipherResult $TMPDIR/RSA64.txt $TMPDIR/$1_64.txt
    
    echo abcdefghijklmnopqrstuvwxyz~!@#$ > $TMPDIR/RSA256.txt
    $CIPHERTOOL -algo $1 -e -k 00010001 -iv 776CDAC274CE25DD0A26045455764893DFFF8D88628C5EA674D0C34879A97091 -in $TMPDIR/RSA256.txt -out $TMPDIR/$1_256.bin -hw 
    $CIPHERTOOL -algo $1 -d -k 728F4E4E6923F378552AE0CE5168F4F6EAA569EDAEBD634DFBE64B2F491F93DD -iv 776CDAC274CE25DD0A26045455764893DFFF8D88628C5EA674D0C34879A97091 -in $TMPDIR/$1_256.bin -out $TMPDIR/$1_256.txt -hw
    VerifyCipherResult $TMPDIR/RSA256.txt $TMPDIR/$1_256.txt
    
    echo abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$ > $TMPDIR/RSA1024.txt
    $CIPHERTOOL -algo $1 -e -k 00010001 -iv c6228a13ed5cb0edf86b7a381e6d8a52d5f5e11d0556ec3e2b5339a41777c1ff4ff6fbcbb0c5303c11892cfe59c4c53e648bc92694b26810fc1cc6468cd6bb34564332a134ffa5ec50a6238ff05eebab7f49e261f4ebcd2b10eb4df300b799d4ac1920339413f4b3811af4575ebfb2aad6bef3cddc564fe8a36063f2d1979221 -in $TMPDIR/RSA1024.txt -out $TMPDIR/$1_1024.bin -hw 
    $CIPHERTOOL -algo $1 -d -k a68b81e51e303bc8cc780b5400bfb2f5ce43cfe5c5073bad465dbea5dfd41a8db179ba4d8d5933224adb33a6d96e3d1e25061b1f02feb3db13105cda10a8aed1e20467d7a6f15c3226e6c252c58895314221bb6808733afabf4f3da1b10a8c96ea69295bb3a5463aa723a1a401eda64f3456c5ec922c103d6005f1694a0097c1 -iv c6228a13ed5cb0edf86b7a381e6d8a52d5f5e11d0556ec3e2b5339a41777c1ff4ff6fbcbb0c5303c11892cfe59c4c53e648bc92694b26810fc1cc6468cd6bb34564332a134ffa5ec50a6238ff05eebab7f49e261f4ebcd2b10eb4df300b799d4ac1920339413f4b3811af4575ebfb2aad6bef3cddc564fe8a36063f2d1979221 -in $TMPDIR/$1_1024.bin -out $TMPDIR/$1_1024.txt -hw
    VerifyCipherResult $TMPDIR/RSA1024.txt $TMPDIR/$1_1024.txt
    
    echo abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$ > $TMPDIR/RSA2048.txt
    $CIPHERTOOL -algo $1 -e -k 00010001 -iv dbce88c340167ed0e65043b530675f28ddfad46246ea2c8f7aa5b90a05ed546e6d6a5ad86383b726efec92a587656145bd1b7f8e97e5effbcf6ee47fa3768f4d6d094fcfa2d206bfedb60fd41510716dc5aaa654bc55edaa59ff25c9dab71ecb63f7ab0e6a58572254169be77df715840dbb7a0fba51955acec91339a62f2eaaeff040fcf47645358e85f41ec935f94f8ff973b0f47dbc28071614c63974836b1e8e7962cd3301c48f0d42949732466398a870f3b8bb7605b174b77eed0740dab5e1f64a473f97a7768bcba4b6549d051d586401fac13d90ca6a4e46793441fea4274582d26c287466243e6b9d360a343bfa9c296b54cea5a29e44d2d320d389 -in $TMPDIR/RSA2048.txt -out $TMPDIR/$1_2048.bin -hw 
    $CIPHERTOOL -algo $1 -d -k 371f3536d9b48a7af2b70033c8feb363793f74d16c7d3f4d7ff15d550125823deb1c77c9ba3306d431e8bee1d9f17792589933c4db9ce330dfd52c6241e8f288f52617a8b7693a1e198bc5ae66d5e7cc227ce81769df96a958c65e809f63baca40b894621a132b4ec58da1ed4cae90ebbbd1df0b60ab22ec51dd25001907ce08c2b445eaefe5d34adca806d264f6053967cbb69dbcf87b3eab17faf0d8c0dcc66c3a359678cdbe2b9605433086b8eb937b6c3a772063cb0a21cddd96970579925b843f68d9504d5a0d4f13cd2f3a96255e97be2126e72e4d005f69c3d809fdabd2b0c45be54072f6fa70ec3644e250705b2ce00d6c7e3a7521da805a630f2d8d -iv dbce88c340167ed0e65043b530675f28ddfad46246ea2c8f7aa5b90a05ed546e6d6a5ad86383b726efec92a587656145bd1b7f8e97e5effbcf6ee47fa3768f4d6d094fcfa2d206bfedb60fd41510716dc5aaa654bc55edaa59ff25c9dab71ecb63f7ab0e6a58572254169be77df715840dbb7a0fba51955acec91339a62f2eaaeff040fcf47645358e85f41ec935f94f8ff973b0f47dbc28071614c63974836b1e8e7962cd3301c48f0d42949732466398a870f3b8bb7605b174b77eed0740dab5e1f64a473f97a7768bcba4b6549d051d586401fac13d90ca6a4e46793441fea4274582d26c287466243e6b9d360a343bfa9c296b54cea5a29e44d2d320d389 -in $TMPDIR/$1_2048.bin -out $TMPDIR/$1_2048.txt -hw
    VerifyCipherResult $TMPDIR/RSA2048.txt $TMPDIR/$1_2048.txt
    
    ###Only for AST2400/1250/1070 with 4064-bit modulus test
    #echo abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~!@#$%abcdefghijklmnopqrstuvwxyz~ > $TMPDIR/RSA4064.txt
    #$CIPHERTOOL -algo $1 -e -k 00010001 -iv a5ead1509f4d717898355d2e0d714eee7da4913ed7db4d5f59c38e76b87dee4e1e108093f6a1430c550283145f866f48d9b735a5d044c95a534c4634c39ecff1ec2ace777433adfc2adba1bea9e24acb2626e7e2c8e9ab92e08f4ab7b2c3c07956402422959fa57befbc33aa7745111434d82774779fce4db8b29f5d84c731ae3cd59bbf6e276c21977cb379637251f050c530165e390f7d37c3139a4a74609ab95bd08c16c6e48183e030a374dc4cc3106a7682e76b86f3311aeb16f86483ca7083d6ea7cebb619bf779f8d571fda1c56d85ceca4cf32316a2aae839731d80646f4655449d98765d0f8fb0cf9bf0cfcbba03b2d898000e696cc02c89a85762495793585d725fc1caa301202b0117d6e502ef4410011e780526707be15d59b5fb86a45331457b940204fc0f19426ba16209ca0d4234dabc4e119245210c1bb015c86530ce21bc7cd76286dd2d19c20565bd159a52a3d20e706a8f465e536a4364e39bdb78849ca8d02687515211115d2110f2cd8ce3ed6126c4d7fb635a2e070cef9167cfb3b4a47952d47484a28713d5ba8fba6c9b7b8e471851d39b632cf4c9d07ece043754b95edd0f15a37f31b053a5d13988817e1f7e3703320c0c5a9e3781e90ab377135d97370ef2084ab8ade41212e84c7d000bf6be29b7cd4d2d8328b41308f14a5c734be5e99fb43eaee82803b7bb90f55a305e438b971 -in $TMPDIR/RSA4064.txt -out $TMPDIR/$1_4064.bin -hw 
    #$CIPHERTOOL -algo $1 -d -k 4788d6764c38b793a70c5b00600b5a5cb90f1b105d40d03b2c188473eb5760478deecf80fbf4cb53a5d34f70993efcfc0be251df0bcc9c83b5264d9eb238e6af0783ed40d378f4aaa44fcd8cc6f22a0d2c85d9b48dab31ae41e385f36dbfb85c98334f6119e19b17b46510618ecad8723dd6742c62e723ab9ed6649f8d7fd48baaeeee17bb0684387777ec6989d6e03d1c95e805bcda1d337fb73bdc69fd83293281c388a2c95dfbf93fcfb8a9c9d1cec8651e7392136a3bb0104b0bbc4c9a05ce3d098c500fd0938959aa10e65f754a82a706698125541eba076cf68f598e2a26ad7882bed46aec1b0d3e3079fd453c3229035abecdd19599ae9c04a199f6c943244e0c151d59e4ae6093454aab71240de51df71fc213e85f03bc41e2634053081af230f02d184c51da57cf16f867a547b9fed51128b2ac1fc698555d321fc8fa96620f41f66112297ff234da50a0dc096beea72a6d319a106ca489e0d81f5a936f124e34704b4fdff1b9fe713deb5eff859109eb0417db59166837cfcef58de366e1be7b70786a95c5ba0ba4d00ed84f45269cdc18dc55ceb6d9008c923c0f2c614e3426b817e8f67dcf679fba8cf32ed7fb98636792770c248ddb97f98008129bed94b98dd166d9217429afba8cedbb17552af42130211141f4bf0fdab948ab61393a27b2ec37cea24222cf092aac41e8fea54750223c418dc381 -iv a5ead1509f4d717898355d2e0d714eee7da4913ed7db4d5f59c38e76b87dee4e1e108093f6a1430c550283145f866f48d9b735a5d044c95a534c4634c39ecff1ec2ace777433adfc2adba1bea9e24acb2626e7e2c8e9ab92e08f4ab7b2c3c07956402422959fa57befbc33aa7745111434d82774779fce4db8b29f5d84c731ae3cd59bbf6e276c21977cb379637251f050c530165e390f7d37c3139a4a74609ab95bd08c16c6e48183e030a374dc4cc3106a7682e76b86f3311aeb16f86483ca7083d6ea7cebb619bf779f8d571fda1c56d85ceca4cf32316a2aae839731d80646f4655449d98765d0f8fb0cf9bf0cfcbba03b2d898000e696cc02c89a85762495793585d725fc1caa301202b0117d6e502ef4410011e780526707be15d59b5fb86a45331457b940204fc0f19426ba16209ca0d4234dabc4e119245210c1bb015c86530ce21bc7cd76286dd2d19c20565bd159a52a3d20e706a8f465e536a4364e39bdb78849ca8d02687515211115d2110f2cd8ce3ed6126c4d7fb635a2e070cef9167cfb3b4a47952d47484a28713d5ba8fba6c9b7b8e471851d39b632cf4c9d07ece043754b95edd0f15a37f31b053a5d13988817e1f7e3703320c0c5a9e3781e90ab377135d97370ef2084ab8ade41212e84c7d000bf6be29b7cd4d2d8328b41308f14a5c734be5e99fb43eaee82803b7bb90f55a305e438b971 -in $TMPDIR/$1_4064.bin -out $TMPDIR/$1_4064.txt -hw
    #VerifyCipherResult $TMPDIR/RSA4064.txt $TMPDIR/$1_4064.txt
}

TestHash()
{
    $CIPHERTOOL -algo $1 -e -in $TESTFILE -out $TMPDIR/$1_hw.txt -hw 
    $CIPHERTOOL -algo $1 -e -in $TESTFILE -out $TMPDIR/$1_sw.txt -sw
    VerifyCipherResult $TMPDIR/$1_hw.txt $TMPDIR/$1_sw.txt
}

TestHmacHash()
{
    $CIPHERTOOL -algo $1 -e -k 4a656665 -in $TESTFILE -out $TMPDIR/$1_hw.txt -hw 
    $CIPHERTOOL -algo $1 -e -k 4a656665 -in $TESTFILE -out $TMPDIR/$1_sw.txt -sw
    VerifyCipherResult $TMPDIR/$1_hw.txt $TMPDIR/$1_sw.txt
}


#
# Test cipher major function
#
TestCipher()
{
     
    GetCipherSupport |
    while IFS=: read ALGO KEYBITLEN
    do
        if [ ! -n "$ALGO" ];then
            break
        fi
                              
        echo "$ALGO $KEYBITLEN"    
        
        case $ALGO in           
            "aes-ecb" | "aes-cbc" | "aes-cfb" | "aes-ofb" | "aes-ctr" )
                TestAES $ALGO $KEYBITLEN
            ;;

            "des-ecb" | "des-cbc" | "des-cfb" | "des-ofb" | "des-ctr" )
                TestDES $ALGO
            ;;
            
            "des3-ecb" | "des3-cbc" | "des3-cfb" | "des3-ofb" | "des3-ctr" )
                Test3DES $ALGO
            ;;
            
            "rc4" )
                TestRC4 $ALGO
            ;;
            
            "rsa" )
                TestRSA $ALGO
            ;;
            
            "sha1" | "sha224" | "sha256" | "md5" )
                TestHash $ALGO
            ;;
            
            "hmac-sha1" | "hmac-sha224" | "hmac-sha256" | "hmac-md5" )
                TestHmacHash $ALGO
            ;;
            
            * )
                echo "Result: Untested"
            ;;
        esac
        
        echo ""
        sleep 1
    done
 
    echo "Test done."
}


TestMain()
{
    CreateTestFolder
    
    if [ ! -n "$1" ] || [ ! -f "$1" ] 
    then
        if [ "$1" == "h" ] || [ "$1" == "-h" ] || [ "$1" == "help" ] || [ "$1" == "-help" ]
        then
            Usage
            exit 0
        else    
            AutoGenTestFile
        fi    
    else
        TESTFILE=$1
    fi         
    
    echo " Test file: $TESTFILE"
    echo "-----------------------------------------"
    echo " Test HW Encryption and Decryption"
    echo "-----------------------------------------"
    TestCipher       
}


TestMain $*

exit 0



