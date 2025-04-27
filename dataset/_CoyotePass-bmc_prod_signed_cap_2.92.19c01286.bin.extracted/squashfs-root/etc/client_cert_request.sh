#!/bin/sh

CLIENTCERTDIR=/nv/client_certificate
CLIENTCADIR=$CLIENTCERTDIR/CA
CLIENTCACRLDIR=$CLIENTCADIR/crl

INTERMEDIATE_NAME=$CLIENTCERTDIR/intermediate

OPENSSL_CONFIG_FILE=$CLIENTCERTDIR/ssl.cnf
SERVER_PEM=$CLIENTCERTDIR/server.pem
CLIENT_SERVER_CRT=$CLIENTCERTDIR/server.crt
CLIENT_INTERMEDIATE_CRT=$CLIENTCERTDIR/intermediate.crt
#tmp file when create cert with -CAcreateserial
CLIENT_SERVER_SRL=$CLIENTCERTDIR/server.srl
CLIENT_INTERMEDIATE_SRL=$CLIENTCERTDIR/intermediate.srl

CLIENT_CA_INDEX_TXT=$CLIENTCADIR/index.txt
CLIENT_CA_REVOKE_CRL_FILE=$CLIENTCACRLDIR/ca.crl
CLIENT_CA_REVOKE_SERVER_CRL_FILE=$CLIENTCACRLDIR/server.crl
CLIENT_CA_REVOKE_INTERMEDIATE_CRL_FILE=$CLIENTCACRLDIR/intermediate.crl

#CLIENT_NAME_LIST=$CLIENTCERTDIR/name_list

#CA_FILE is Concatenated with CLIENT_SERVER_CRT and all client certificate
#Default CA_FILE is server.crt because CA_FILE can't be empty
CA_FILE=$CLIENTCERTDIR/ca.crt

CERTONLY_PATH=""
P12ONLY_PATH=""
CLIENT_FILE_NAME=client

FILE_IDX=0

LOG="/tmp/debug.log"

DEBUG_MSG()
{
	NOW=$(date +"%m-%d-%Y %T")
	echo "[$NOW] $@"
	#echo "[$NOW] $@"  >> $LOG
}

Check_folder_exist()
{
	local folder=$1

	if [ ! -d $folder ]; then
		mkdir $folder
		DEBUG_MSG "Create folder:$folder"
	fi
}

Get_file_idx()
{
	local folder_name=$1
	local limit=$2
	local FILE_NAME=""
	local ret=0
	# FILE_IDX=`ls -1 certonly/ | wc -l`
	# FILE_IDX=`expr $FILE_IDX + 1`
	# DEBUG_MSG "NEW FILE_IDX:$FILE_IDX"
	for i in $(seq 1 $limit);
	do
		FILE_NAME="${folder_name}/${CLIENT_FILE_NAME}_${i}.crt"
		#If idx file not exist, use this idx for new file name
		if [ ! -f $FILE_NAME ]; then
			FILE_IDX=$i
			ret=1
			break
		fi
	done

	return $ret
}

Change_CNF_distinguished_name_for_Intermediate()
{
	#Change distinguished_name for Intermediate setting
	sed -i "68s#distinguished_name = .*#distinguished_name = intermediate_dn#" $OPENSSL_CONFIG_FILE
}

Create_Intermediate_cert()
{
	local CERT_NEW_FILE_PATH="$1"
	local FORCE_CREATE="$2"

	if [ "$FORCE_CREATE" -eq 1 ]; then
		DEBUG_MSG "Create_Intermediate_cert"
		#Generate a RSA-2048 private key
		openssl genrsa -out $CERT_NEW_FILE_PATH.key 2048
		#Generate intermediate request
		openssl req -config $OPENSSL_CONFIG_FILE -new -key $CERT_NEW_FILE_PATH.key -out $CERT_NEW_FILE_PATH.csr
		#Sign the certificate using the server private key and server cert with v3_intermediate_ca extension
		#3652 is same as DAYS in crt.sh
		openssl x509 -req -days 3652 -extfile $OPENSSL_CONFIG_FILE -in $CERT_NEW_FILE_PATH.csr -CA $SERVER_PEM -CAkey $SERVER_PEM -out $CERT_NEW_FILE_PATH.crt -extensions v3_intermediate_ca -CAcreateserial
	else
		if [ ! -f $CERT_NEW_FILE_PATH.key ] || [ ! -f $CERT_NEW_FILE_PATH.csr ] || [ ! -f $CERT_NEW_FILE_PATH.crt ]; then
			DEBUG_MSG "Create_Intermediate_cert"
			#Generate a RSA-2048 private key
			openssl genrsa -out $CERT_NEW_FILE_PATH.key 2048
			#Generate intermediate request
			openssl req -config $OPENSSL_CONFIG_FILE -new -key $CERT_NEW_FILE_PATH.key -out $CERT_NEW_FILE_PATH.csr
			#Sign the certificate using the server private key and server cert with v3_intermediate_ca extension
			#3652 is same as DAYS in crt.sh
			openssl x509 -req -days 3652 -extfile $OPENSSL_CONFIG_FILE -in $CERT_NEW_FILE_PATH.csr -CA $SERVER_PEM -CAkey $SERVER_PEM -out $CERT_NEW_FILE_PATH.crt -extensions v3_intermediate_ca -CAcreateserial
		fi
	fi
}

Change_CNF_Common_name_AND_User_Id()
{
	local commonName=$1
	local userid=$2
	#Change distinguished_name for Client setting
	sed -i "68s#distinguished_name = .*#distinguished_name = ca_dn#" $OPENSSL_CONFIG_FILE
	#Change commonName of CNF file
	sed -i "81s#commonName             = .*#commonName             = $commonName#" $OPENSSL_CONFIG_FILE
	#Change userId of CNF file
	sed -i "83s#userId                 = .*#userId                 = $userid#" $OPENSSL_CONFIG_FILE
}

Create_client_cert()
{
	local CERT_NEW_FILE_PATH="$1"
	local DAY="$2"
	local INTERMEDIATE_FILE_PATH="$3"

	DEBUG_MSG "CERT_NEW_FILE_PATH:$CERT_NEW_FILE_PATH"
	#Generate a RSA-2048 private key
	openssl genrsa -out $CERT_NEW_FILE_PATH.key 2048
	#Generate certificate request
	openssl req -config $OPENSSL_CONFIG_FILE -new -key $CERT_NEW_FILE_PATH.key -out $CERT_NEW_FILE_PATH.csr
	#Sign the certificate using the server private key
	openssl x509 -req -days $DAY -extfile $OPENSSL_CONFIG_FILE -in $CERT_NEW_FILE_PATH.csr -CA $INTERMEDIATE_FILE_PATH.crt -CAkey $INTERMEDIATE_FILE_PATH.key -out $CERT_NEW_FILE_PATH.crt -extensions usr_cert -CAcreateserial
}

Create_p12()
{
	local CERT_NEW_FILE_PATH="$1"
	local P12_NEW_FILE_PATH="$2"
	local PASSWORD="$3"
	DEBUG_MSG "P12_NEW_FILE_PATH:$P12_NEW_FILE_PATH"
	# Convert the certificate to PKCS#12 for browser support
	openssl pkcs12 -export -in $CERT_NEW_FILE_PATH.crt -inkey $CERT_NEW_FILE_PATH.key -certfile $CERT_NEW_FILE_PATH.crt -out $P12_NEW_FILE_PATH.p12 -passout pass:$PASSWORD
}

Remove_client_csr_and_key()
{
	local CERT_NEW_FILE_PATH="$1"
	#Only keep p12 and certificate in CLIENT_CERT_PATH
	rm $CERT_NEW_FILE_PATH.csr $CERT_NEW_FILE_PATH.key
}

Remove_srl_file()
{
	if [ -f $CLIENT_SERVER_SRL ]; then
		rm $CLIENT_SERVER_SRL
	fi

	if [ -f $CLIENT_INTERMEDIATE_SRL ]; then
		rm $CLIENT_INTERMEDIATE_SRL
	fi
}

Add_username_in_list()
{
	local USERNAME="$1"
	echo "$USERNAME" >> $CLIENT_NAME_LIST
}

Remove_all_username_in_list()
{
	if [ -f $CLIENT_NAME_LIST ]; then
		rm $CLIENT_NAME_LIST
		DEBUG_MSG "Remove $CLIENT_NAME_LIST"
	fi
	DEBUG_MSG "Remove_all_username_in_list"
}

Remove_all_client_crt_and_p12()
{
	local CERTONLY_PATH=$1
	local P12ONLY_PATH=$2

	DEBUG_MSG "Cur input: $CERTONLY_PATH, $P12ONLY_PATH"
	if [ -d $CERTONLY_PATH ]; then
		number_of_files=$(ls -A $CERTONLY_PATH | wc -l)
		if [ "$number_of_files" != "0" ]; then
			rm -f ${CERTONLY_PATH}/*
			DEBUG_MSG "Remove $CERTONLY_PATH"
		fi
	fi

	if [ -d $P12ONLY_PATH ]; then
		number_of_files=$(ls -A $P12ONLY_PATH | wc -l)
		if [ "$number_of_files" != "0" ]; then
			rm -f ${P12ONLY_PATH}/*
			DEBUG_MSG "Remove $P12ONLY_PATH"
		fi
	fi
	DEBUG_MSG "Remove_all_client_crt_and_p12"
}

Reset_revoke_list_related_file()
{
	local INTERMEDIATE_FILE_PATH="$1"

	if [ -f $CLIENT_CA_INDEX_TXT ]; then
		#Delete all related file
		rm $CLIENT_CA_INDEX_TXT*
		#Clear index.txt
		touch $CLIENT_CA_INDEX_TXT
	else
		touch $CLIENT_CA_INDEX_TXT
	fi

	if [ -d $CLIENTCACRLDIR ]; then
		#Use empty index.txt to create empty revoke list
		openssl ca -gencrl -config $OPENSSL_CONFIG_FILE -crldays 3652 -keyfile $SERVER_PEM -cert $SERVER_PEM -out $CLIENT_CA_REVOKE_SERVER_CRL_FILE
		openssl ca -gencrl -config $OPENSSL_CONFIG_FILE -crldays 3652 -keyfile $INTERMEDIATE_FILE_PATH.key -cert $INTERMEDIATE_FILE_PATH.crt -out $CLIENT_CA_REVOKE_INTERMEDIATE_CRL_FILE
		cat $CLIENT_CA_REVOKE_SERVER_CRL_FILE $CLIENT_CA_REVOKE_INTERMEDIATE_CRL_FILE > $CLIENT_CA_REVOKE_CRL_FILE
	fi
}

Create_ca_file()
{
	local CLIENT_INTERMEDIATE_CRT=$1
	local CERTONLY_PATH=$2
	#Use symbol link pem file to parse certificate
	openssl x509 -in ${SERVER_PEM} -out ${CLIENT_SERVER_CRT}

	if [ -d $CERTONLY_PATH ]; then
		cat $CLIENT_SERVER_CRT $CLIENT_INTERMEDIATE_CRT > $CA_FILE
	fi
}

Revoke_crt_and_Set_crl_with_assigned_idx()
{
	local CERT_NEW_FILE_NAME=${1}.crt
	local INTERMEDIATE_FILE_PATH=${2}

	DEBUG_MSG "Revoke_crt_and_Set_crl_with_assigned_idx with $CERT_NEW_FILE_NAME"
	#Set revoke in index.txt
	if [ -f $CLIENT_CA_INDEX_TXT ] && [ -f $INTERMEDIATE_FILE_PATH.key ] && [ -f $INTERMEDIATE_FILE_PATH.crt ]; then
		openssl ca -config $OPENSSL_CONFIG_FILE -revoke $CERT_NEW_FILE_NAME -keyfile $INTERMEDIATE_FILE_PATH.key -cert $INTERMEDIATE_FILE_PATH.crt
	else
		DEBUG_MSG "$CLIENT_CA_INDEX_TXT isn't existed"
	fi
	#Create crl file accroding to current index.txt
	if [ -d $CLIENTCACRLDIR ] && [ -f $INTERMEDIATE_FILE_PATH.key ] && [ -f $INTERMEDIATE_FILE_PATH.crt ]; then
		openssl ca -gencrl -config $OPENSSL_CONFIG_FILE -crldays 3652 -keyfile $SERVER_PEM -cert $SERVER_PEM -out $CLIENT_CA_REVOKE_SERVER_CRL_FILE
		openssl ca -gencrl -config $OPENSSL_CONFIG_FILE -crldays 3652 -keyfile $INTERMEDIATE_FILE_PATH.key -cert $INTERMEDIATE_FILE_PATH.crt -out $CLIENT_CA_REVOKE_INTERMEDIATE_CRL_FILE
		cat $CLIENT_CA_REVOKE_SERVER_CRL_FILE $CLIENT_CA_REVOKE_INTERMEDIATE_CRL_FILE > $CLIENT_CA_REVOKE_CRL_FILE
	else
		DEBUG_MSG "$CLIENTCACRLDIR isn't existed"
	fi
}

Remove_crt_with_assigned_idx()
{
	local CERT_NEW_FILE_NAME=${1}.crt
	echo "CERT_NEW_FILE_NAME:$CERT_NEW_FILE_NAME"

	if [ -f $CERT_NEW_FILE_NAME ]; then
		rm $CERT_NEW_FILE_NAME
		DEBUG_MSG "Remove $CERT_NEW_FILE_NAME"
	fi
}

Remove_CN_in_name_list()
{
	local CERT_NEW_FILE_NAME=${1}.crt
	echo "CERT_NEW_FILE_NAME:$CERT_NEW_FILE_NAME"

	if [ -f $CERT_NEW_FILE_NAME ]; then
		UID=`openssl x509 -noout -subject -in $CERT_NEW_FILE_NAME | sed -n 's/^.*UID *= //p'`
		if [ ! -z UID ]; then
			if [ -f $CLIENT_NAME_LIST ]; then
				#Remove common name in name list and remove empty line
				sed -i "s/^$UID$//g" $CLIENT_NAME_LIST
				sed -i '/^[[:space:]]*$/d' $CLIENT_NAME_LIST
			fi
		fi
	fi
}

if [ "$#" -lt 1 ]; then
	echo "Usage ${0} {add|del|restore}"
	exit 1
fi

CMD=$1
case $CMD in
	"add")
		if [ "$#" -ne 9 ]; then
			echo "Usage ${0} {add} {certpath p12path commonname userid password expiredays limit uuid} "
			exit 1
		else
			CERTONLY_PATH=$2
			P12ONLY_PATH=$3
			COMMONNAME=$4
			USERID=$5
			PASSWORD=$6
			EXPIREDAYS=$7
			LIMIT=$8
			UUID=$9
		fi
		#Check path exit in Redfish code, but still check path exist in script
		#Also need to check amount in CERTONLY_PATH, return error_500 if up to limit
		Get_file_idx $CERTONLY_PATH $LIMIT
		ret=$?
		if [ $ret == 0 ]; then
			DEBUG_MSG "Can't get FILE_IDX"
			exit 1
		fi
		CERT_NEW_FILE_PATH="${CERTONLY_PATH}/${CLIENT_FILE_NAME}_${FILE_IDX}"
		P12_NEW_FILE_PATH="${P12ONLY_PATH}/${UUID}_${CLIENT_FILE_NAME}_${FILE_IDX}"

		Remove_srl_file

		Change_CNF_distinguished_name_for_Intermediate
		Create_Intermediate_cert $INTERMEDIATE_NAME 0

		Remove_srl_file

		Change_CNF_Common_name_AND_User_Id $COMMONNAME $USERID

		Create_client_cert $CERT_NEW_FILE_PATH $EXPIREDAYS $INTERMEDIATE_NAME
		Create_p12 $CERT_NEW_FILE_PATH $P12_NEW_FILE_PATH $PASSWORD
		Remove_client_csr_and_key $CERT_NEW_FILE_PATH
		Create_ca_file $CLIENT_INTERMEDIATE_CRT $CERTONLY_PATH
		;;
	"del")
		if [ "$#" -ne 3 ]; then
			echo "Usage ${0} {del} {certpath idx} "
			exit 1
		else
			CERTONLY_PATH=$2
			FILE_IDX=$3
		fi
		#Check file exist in Redfish code, but still check file exist in script
		CERT_NEW_FILE_PATH="${CERTONLY_PATH}/${CLIENT_FILE_NAME}_${FILE_IDX}"
		#Remove_CN_in_name_list $CERT_NEW_FILE_PATH
		Revoke_crt_and_Set_crl_with_assigned_idx $CERT_NEW_FILE_PATH $INTERMEDIATE_NAME
		Remove_crt_with_assigned_idx $CERT_NEW_FILE_PATH
		Create_ca_file $CLIENT_INTERMEDIATE_CRT $CERTONLY_PATH
		;;
	"restore")
		if [ "$#" -ne 3 ]; then
			echo "Usage ${0} {restore} {certpath p12path}"
			exit 1
		else
			CERTONLY_PATH=$2
			P12ONLY_PATH=$3
		fi
		#Remove_all_username_in_list
		Remove_all_client_crt_and_p12 $CERTONLY_PATH $P12ONLY_PATH
		Create_Intermediate_cert $INTERMEDIATE_NAME 1
		Reset_revoke_list_related_file $INTERMEDIATE_NAME
		Create_ca_file $CLIENT_INTERMEDIATE_CRT $CERTONLY_PATH
		;;
	*)
		echo "Usage ${0} {add|del|restore} {certpath p12path commonname userid password expiredays limit uuid | certpath idx | certpath p12path} "
		;;
esac

