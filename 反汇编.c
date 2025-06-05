int login_handler_func()
{
  int *v0; // r0
  int v1; // r4
  int v2; // r11
  void *v3; // r6
  int v4; // r5
  char *v5; // r7
  char *v6; // r8
  int v7; // r0
  bool v8; // zf
  unsigned __int8 *v9; // r0
  unsigned __int8 *v10; // r8
  char *v11; // r10
  char *v12; // r9
  int v13; // r7
  int v14; // r0
  int v15; // r3
  int v16; // r0
  char *v17; // r6
  char *v18; // r0
  int v19; // r6
  int v20; // r0
  int v21; // r0
  const char *v22; // r0
  char *v23; // r6
  char *v24; // r7
  char *v26; // r6
  char *v27; // r0
  int v28; // r6
  int v29; // r0
  int v30; // r0
  const char *v31; // r0
  char *v32; // r6
  char *v33; // r7
  char *v34; // r6
  char *v35; // r0
  int v36; // r6
  int v37; // r0
  int v38; // r0
  const char *v39; // r0
  char *v40; // r6
  char *v41; // r7
  char *v42; // r6
  char *v43; // r0
  int v44; // r6
  int v45; // r0
  int v46; // r0
  const char *v47; // r0
  char *v48; // r6
  char *v49; // r7
  unsigned int v50; // r0
  char *v51; // r6
  char *v52; // r0
  int v53; // r6
  int v54; // r0
  int v55; // r0
  const char *v56; // r0
  char *v57; // r6
  char *v58; // r7
  size_t v59; // r0
  size_t v60; // r0
  char *v61; // r6
  char *v62; // r0
  int v63; // r6
  int v64; // r0
  int v65; // r0
  const char *v66; // r0
  char *v67; // r6
  char *v68; // r7
  int v69; // r0
  unsigned __int8 v70; // r10
  int v71; // r0
  unsigned __int8 v72; // r9
  char *v73; // r6
  char *v74; // r0
  int v75; // r6
  int v76; // r0
  int v77; // r0
  const char *v78; // r0
  char *v79; // r6
  char *v80; // r7
  char *v81; // r6
  char *v82; // r0
  int v83; // r6
  int v84; // r0
  int v85; // r0
  const char *v86; // r0
  char *v87; // r6
  char *v88; // r7
  const char *v89; // r3
  char *v90; // r6
  char *v91; // r0
  int v92; // r6
  int v93; // r0
  int v94; // r0
  const char *v95; // r0
  char *v96; // r6
  char *v97; // r7
  unsigned int v98; // r0
  int v99; // r0
  char *v100; // r0
  char *v101; // r7
  int v102; // r0
  int v103; // r0
  int v104; // r0
  int v105; // r0
  int v106; // r0
  int v107; // r0
  size_t v108; // r0
  int v109; // r0
  size_t v110; // r0
  int v111; // r0
  size_t v112; // r0
  int v113; // r0
  int v114; // r0
  size_t v115; // r0
  int v116; // r0
  int v117; // r0
  unsigned __int8 v118; // r1
  size_t v119; // r0
  int v120; // r0
  int v121; // r0
  unsigned int v122; // r0
  const char *v123; // r0
  char *v124; // r6
  char *v125; // r7
  char *v126; // r6
  char *v127; // r0
  int v128; // r6
  int v129; // r0
  int v130; // r0
  const char *v131; // r0
  char *v132; // r6
  char *v133; // r7
  char *v134; // r6
  char *v135; // r0
  int v136; // r6
  int v137; // r0
  int v138; // r0
  const char *v139; // r0
  char *v140; // r6
  char *v141; // r7
  int v142; // r0
  int v143; // r7
  int v144; // r1
  int v145; // r3
  char *v146; // r6
  char *v147; // r0
  int v148; // r6
  int v149; // r0
  int v150; // r0
  const char *v151; // r0
  char *v152; // r6
  char *v153; // r7
  size_t v154; // r0
  _BOOL4 v155; // r0
  int v156; // r0
  int v157; // r0
  int v158; // r0
  int v159; // r0
  int v160; // r0
  int v161; // r0
  size_t v162; // r0
  int v163; // r0
  size_t v164; // r0
  int v165; // r0
  size_t v166; // r0
  int v167; // r0
  int v168; // r0
  size_t v169; // r0
  int v170; // r0
  unsigned __int8 v171; // r1
  size_t v172; // r0
  int v173; // r0
  int v174; // r0
  int v175; // r0
  char *v176; // r6
  char *v177; // r0
  int v178; // r6
  int v179; // r0
  int v180; // r0
  const char *v181; // r0
  char *v182; // r6
  char *v183; // r7
  char *v184; // r6
  char *v185; // r0
  int v186; // r6
  int v187; // r0
  int v188; // r0
  const char *v189; // r0
  char *v190; // r6
  char *v191; // r7
  char *v192; // r6
  char *v193; // r0
  int v194; // r6
  int v195; // r0
  int v196; // r0
  const char *v197; // r0
  char *v198; // r6
  char *v199; // r7
  char *v200; // r6
  char *v201; // r0
  int v202; // r6
  int v203; // r0
  int v204; // r0
  const char *v205; // r0
  char *v206; // r6
  char *v207; // r7
  char *v208; // r6
  char *v209; // r0
  int v210; // r6
  int v211; // r0
  int v212; // r0
  const char *v213; // r0
  char *v214; // r6
  char *v215; // r7
  char *v216; // r6
  char *v217; // r0
  int v218; // r6
  int v219; // r0
  int v220; // r0
  const char *v221; // r0
  char *v222; // r6
  char *v223; // r7
  unsigned __int8 v224; // [sp+28h] [bp-2470h]
  int v225; // [sp+2Ch] [bp-246Ch]
  const char *v226; // [sp+2Ch] [bp-246Ch]
  int v227; // [sp+30h] [bp-2468h]
  int v228; // [sp+30h] [bp-2468h]
  const char *v229; // [sp+34h] [bp-2464h]
  const char *v230; // [sp+38h] [bp-2460h]
  int v231; // [sp+3Ch] [bp-245Ch]
  int v232; // [sp+40h] [bp-2458h]
  _BOOL4 v233; // [sp+44h] [bp-2454h]
  const char *v234; // [sp+48h] [bp-2450h]
  const char *v235; // [sp+4Ch] [bp-244Ch]
  size_t v236; // [sp+4Ch] [bp-244Ch]
  int v237; // [sp+50h] [bp-2448h]
  char s[4096]; // [sp+5Ch] [bp-243Ch] BYREF
  char v239[4096]; // [sp+105Ch] [bp-143Ch] BYREF
  char v240[256]; // [sp+205Ch] [bp-43Ch] BYREF
  char v241[256]; // [sp+215Ch] [bp-33Ch] BYREF
  char v242[128]; // [sp+225Ch] [bp-23Ch] BYREF
  char v243[128]; // [sp+22DCh] [bp-1BCh] BYREF
  _QWORD v244[7]; // [sp+235Ch] [bp-13Ch] BYREF
  _DWORD v245[11]; // [sp+2398h] [bp-100h] BYREF
  __int16 v246; // [sp+23C4h] [bp-D4h]
  _DWORD v247[11]; // [sp+23C8h] [bp-D0h] BYREF
  __int16 v248; // [sp+23F4h] [bp-A4h]
  _DWORD v249[5]; // [sp+23F8h] [bp-A0h] BYREF
  char v250[16]; // [sp+240Ch] [bp-8Ch] BYREF
  int v251; // [sp+241Ch] [bp-7Ch] BYREF
  int v252; // [sp+2420h] [bp-78h]
  int v253; // [sp+2424h] [bp-74h]
  int v254; // [sp+2428h] [bp-70h]
  _DWORD v255[4]; // [sp+242Ch] [bp-6Ch] BYREF
  _DWORD v256[4]; // [sp+243Ch] [bp-5Ch] BYREF
  _BYTE v257[8]; // [sp+244Ch] [bp-4Ch] BYREF
  int v258; // [sp+2454h] [bp-44h]
  char v259[8]; // [sp+2458h] [bp-40h] BYREF
  int v260; // [sp+2460h] [bp-38h] BYREF
  int v261; // [sp+2464h] [bp-34h] BYREF
  int v262; // [sp+2468h] [bp-30h] BYREF
  char v263; // [sp+246Fh] [bp-29h] BYREF

  v0 = (int *)qcgireq_parse(0, 0);
  v1 = (int)v0;
  if ( pre_call_hook )
    v0 = pre_call_hook();
  v2 = json_object_new_object(v0);
  v3 = (void *)qcgireq_getquery(2);
  v4 = json_object_new_object(v3);
  v5 = getenv("REQUEST_METHOD");
  v6 = getenv("CONTENT_TYPE");
  if ( v5 )
  {
    v7 = strcasecmp(v5, "GET");
    v8 = v7 == 0;
    if ( v7 )
      v8 = v3 == 0;
    if ( !v8 && v6 )
    {
      strcasecmp(v5, "PUT");
      json_object_put(v4);
      v4 = json_tokener_parse((int)v3);
    }
  }
  v260 = 0;
  v261 = 0;
  v245[0] = 0;
  v245[1] = 0;
  v245[2] = 0;
  v245[3] = 0;
  v245[4] = 0;
  v245[5] = 0;
  v245[6] = 0;
  v245[7] = 0;
  v245[8] = 0;
  v245[9] = 0;
  v245[10] = 0;
  v246 = 0;
  v247[0] = 0;
  v247[1] = 0;
  v247[2] = 0;
  v247[3] = 0;
  v247[4] = 0;
  v247[5] = 0;
  v247[6] = 0;
  v247[7] = 0;
  v247[8] = 0;
  v247[9] = 0;
  v247[10] = 0;
  v248 = 0;
  v262 = 0;
  memset(v240, 0, sizeof(v240));
  memset(v241, 0, sizeof(v241));
  memset(s, 0, sizeof(s));
  memset(v239, 0, sizeof(v239));
  v249[0] = 0;
  v249[1] = 0;
  v249[2] = 0;
  v249[3] = 0;
  v249[4] = 0;
  v263 = 1;
  v9 = (unsigned __int8 *)malloc(9u);
  v10 = v9;
  if ( !v9 )
  {
    if ( v2 )
      json_object_put(v2);
    if ( v3 )
      free(v3);
    v34 = getenv("REQUEST_METHOD");
    v35 = getenv("CONTENT_TYPE");
    if ( v34 )
    {
      v35 = (char *)strcasecmp(v34, "GET");
      if ( v35 )
        v35 = getenv("CONTENT_TYPE");
      if ( v4 )
        v35 = (char *)json_object_put(v4);
    }
    v36 = json_object_new_object(v35);
    v37 = json_object_new_string_len("Error in memory allocation", 26);
    json_object_object_add(v36, "error", v37);
    v38 = json_object_new_int(11273);
    json_object_object_add(v36, "code", v38);
    FCGI_printf("Status: %s \n", "401 Unauthorized");
    qcgires_setcontenttype(v1, "application/json");
    v39 = (const char *)json_object_to_json_string(v36);
    FCGI_printf("%s", v39);
    if ( v36 )
      json_object_put(v36);
    v40 = getenv("REQUEST_METHOD");
    v41 = getenv("CONTENT_TYPE");
    if ( !v40 )
      goto LABEL_29;
    if ( !strcasecmp(v40, "GET") || !getenv("CONTENT_TYPE") )
    {
      if ( !v4 )
        goto LABEL_29;
    }
    else if ( !strcasecmp(v40, "PUT") && !strncasecmp(v41, "application/json", 0x10u) )
    {
      if ( !v4 )
        goto LABEL_29;
    }
    else if ( !v4 )
    {
      goto LABEL_29;
    }
    goto LABEL_28;
  }
  *(_DWORD *)v9 = 0;
  *((_DWORD *)v9 + 1) = 0;
  v9[8] = 0;
  memset(v240, 0, sizeof(v240));
  memset(v241, 0, sizeof(v241));
  v11 = (char *)(*(int (__fastcall **)(int, const char *, _DWORD))(v1 + 24))(v1, "username", 0);
  v12 = (char *)(*(int (__fastcall **)(int, const char *, _DWORD))(v1 + 24))(v1, "password", 0);
  v13 = (*(int (__fastcall **)(int, const char *))(v1 + 36))(v1, "encrypt_flag");
  v14 = (*(int (__fastcall **)(int, const char *))(v1 + 36))(v1, "login_tag");
  v15 = v14;
  if ( v13 != 2 )
  {
    v225 = v14;
    v16 = GetRandomBlowfishEnable(v14);
    v15 = v225;
    if ( v16 == 1 )
    {
      free(v10);
      if ( v2 )
        json_object_put(v2);
      if ( v3 )
        free(v3);
      v42 = getenv("REQUEST_METHOD");
      v43 = getenv("CONTENT_TYPE");
      if ( v42 )
      {
        v43 = (char *)strcasecmp(v42, "GET");
        if ( v43 )
          v43 = getenv("CONTENT_TYPE");
        if ( v4 )
          v43 = (char *)json_object_put(v4);
      }
      v44 = json_object_new_object(v43);
      v45 = json_object_new_string_len("Invalid Encrypt Method, Should Be 2", 35);
      json_object_object_add(v44, "error", v45);
      v46 = json_object_new_int(v13);
      json_object_object_add(v44, "code", v46);
      FCGI_printf("Status: %s \n", "401 Unauthorized");
      qcgires_setcontenttype(v1, "application/json");
      v47 = (const char *)json_object_to_json_string(v44);
      FCGI_printf("%s", v47);
      if ( v44 )
        json_object_put(v44);
      v48 = getenv("REQUEST_METHOD");
      v49 = getenv("CONTENT_TYPE");
      if ( !v48 )
        goto LABEL_29;
      if ( !strcasecmp(v48, "GET") || !getenv("CONTENT_TYPE") )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else if ( !strcasecmp(v48, "PUT") && !strncasecmp(v49, "application/json", 0x10u) )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else if ( !v4 )
      {
        goto LABEL_29;
      }
      goto LABEL_28;
    }
  }
  if ( !v11 || !*v11 || !v12 || !*v12 )
  {
    free(v10);
    if ( v2 )
      json_object_put(v2);
    if ( v3 )
      free(v3);
    v17 = getenv("REQUEST_METHOD");
    v18 = getenv("CONTENT_TYPE");
    if ( v17 )
    {
      v18 = (char *)strcasecmp(v17, "GET");
      if ( v18 )
        v18 = getenv("CONTENT_TYPE");
      if ( v4 )
        v18 = (char *)json_object_put(v4);
    }
    v19 = json_object_new_object(v18);
    v20 = json_object_new_string_len("NULL UserName or Password", 25);
    json_object_object_add(v19, "error", v20);
    v21 = json_object_new_int(v13);
    json_object_object_add(v19, "code", v21);
    FCGI_printf("Status: %s \n", "401 Unauthorized");
    qcgires_setcontenttype(v1, "application/json");
    v22 = (const char *)json_object_to_json_string(v19);
    FCGI_printf("%s", v22);
    if ( v19 )
      json_object_put(v19);
    v23 = getenv("REQUEST_METHOD");
    v24 = getenv("CONTENT_TYPE");
    if ( !v23 )
      goto LABEL_29;
    if ( !strcasecmp(v23, "GET") || !getenv("CONTENT_TYPE") )
    {
      if ( !v4 )
        goto LABEL_29;
      goto LABEL_28;
    }
    if ( !strcasecmp(v23, "PUT") && !strncasecmp(v24, "application/json", 0x10u) )
    {
      if ( !v4 )
        goto LABEL_29;
    }
    else if ( !v4 )
    {
      goto LABEL_29;
    }
    goto LABEL_28;
  }
  if ( v13 == 1 )
  {
    v59 = strlen(v11);
    DecryUserPasswdStr(v11, v59, v240, 256);
    v60 = strlen(v12);
    DecryUserPasswdStr(v12, v60, v241, 256);
    v12 = v241;
    v11 = v240;
  }
  else if ( v13 == 2 )
  {
    if ( v15 != globalTag )
    {
      v50 = time(0);
      srand(v50);
      globalTag = rand();
      free(v10);
      if ( v2 )
        json_object_put(v2);
      if ( v3 )
        free(v3);
      v51 = getenv("REQUEST_METHOD");
      v52 = getenv("CONTENT_TYPE");
      if ( v51 )
      {
        v52 = (char *)strcasecmp(v51, "GET");
        if ( v52 )
          v52 = getenv("CONTENT_TYPE");
        if ( v4 )
          v52 = (char *)json_object_put(v4);
      }
      v53 = json_object_new_object(v52);
      v54 = json_object_new_string_len("Error Login Tag", 15);
      json_object_object_add(v53, "error", v54);
      v55 = json_object_new_int(1009);
      json_object_object_add(v53, "code", v55);
      FCGI_printf("Status: %s \n", "401 Unauthorized");
      qcgires_setcontenttype(v1, "application/json");
      v56 = (const char *)json_object_to_json_string(v53);
      FCGI_printf("%s", v56);
      if ( v53 )
        json_object_put(v53);
      v57 = getenv("REQUEST_METHOD");
      v58 = getenv("CONTENT_TYPE");
      if ( !v57 )
        goto LABEL_29;
      if ( !strcasecmp(v57, "GET") || !getenv("CONTENT_TYPE") )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else if ( !strcasecmp(v57, "PUT") && !strncasecmp(v58, "application/json", 0x10u) )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else if ( !v4 )
      {
        goto LABEL_29;
      }
      goto LABEL_28;
    }
    strcpy(v259, "secret");
    memset(v242, 0, sizeof(v242));
    memset(v243, 0, sizeof(v243));
    v69 = strnlen_safe(v11, 256);
    v70 = Decode64_Safe(v242, 128, v11, v69);
    v71 = strnlen_safe(v12, 256);
    v72 = Decode64_Safe(v243, 128, v12, v71);
    if ( DecryptPassword(v242, v70, v240, v70, v259) )
    {
      IDBG_LINUXAPP_DbgOut(130, "[%s:%d]Error in decrypt username\n", "rest_default.c", 808);
      free(v10);
      if ( v2 )
        json_object_put(v2);
      if ( v3 )
        free(v3);
      v73 = getenv("REQUEST_METHOD");
      v74 = getenv("CONTENT_TYPE");
      if ( v73 )
      {
        v74 = (char *)strcasecmp(v73, "GET");
        if ( v74 )
          v74 = getenv("CONTENT_TYPE");
        if ( v4 )
          v74 = (char *)json_object_put(v4);
      }
      v75 = json_object_new_object(v74);
      v76 = json_object_new_string_len("Error in decrypt username", 25);
      json_object_object_add(v75, "error", v76);
      v77 = json_object_new_int(1009);
      json_object_object_add(v75, "code", v77);
      FCGI_printf("Status: %s \n", "500 Internal Server Error");
      qcgires_setcontenttype(v1, "application/json");
      v78 = (const char *)json_object_to_json_string(v75);
      FCGI_printf("%s", v78);
      if ( v75 )
        json_object_put(v75);
      v79 = getenv("REQUEST_METHOD");
      v80 = getenv("CONTENT_TYPE");
      if ( !v79 )
        goto LABEL_29;
      if ( !strcasecmp(v79, "GET") || !getenv("CONTENT_TYPE") )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else if ( !strcasecmp(v79, "PUT") && !strncasecmp(v80, "application/json", 0x10u) )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else if ( !v4 )
      {
        goto LABEL_29;
      }
      goto LABEL_28;
    }
    if ( DecryptPassword(v243, v72, v241, v72, v259) )
    {
      IDBG_LINUXAPP_DbgOut(130, "[%s:%d]Error in decrypt password\n", "rest_default.c", 815);
      free(v10);
      if ( v2 )
        json_object_put(v2);
      if ( v3 )
        free(v3);
      v81 = getenv("REQUEST_METHOD");
      v82 = getenv("CONTENT_TYPE");
      if ( v81 )
      {
        v82 = (char *)strcasecmp(v81, "GET");
        if ( v82 )
          v82 = getenv("CONTENT_TYPE");
        if ( v4 )
          v82 = (char *)json_object_put(v4);
      }
      v83 = json_object_new_object(v82);
      v84 = json_object_new_string_len("Error in decrypt password", 25);
      json_object_object_add(v83, "error", v84);
      v85 = json_object_new_int(1009);
      json_object_object_add(v83, "code", v85);
      FCGI_printf("Status: %s \n", "500 Internal Server Error");
      qcgires_setcontenttype(v1, "application/json");
      v86 = (const char *)json_object_to_json_string(v83);
      FCGI_printf("%s", v86);
      if ( v83 )
        json_object_put(v83);
      v87 = getenv("REQUEST_METHOD");
      v88 = getenv("CONTENT_TYPE");
      if ( !v87 )
        goto LABEL_29;
      if ( !strcasecmp(v87, "GET") || !getenv("CONTENT_TYPE") )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else if ( !strcasecmp(v87, "PUT") && !strncasecmp(v88, "application/json", 0x10u) )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else if ( !v4 )
      {
        goto LABEL_29;
      }
      goto LABEL_28;
    }
    v12 = v241;
    v11 = v240;
  }
  if ( strchr(v11, 42) || strchr(v11, 40) || strchr(v11, 41) || strchr(v11, 38) || strchr(v11, 61) || strchr(v11, 124) )
  {
    free(v10);
    if ( v2 )
      json_object_put(v2);
    if ( v3 )
      free(v3);
    v26 = getenv("REQUEST_METHOD");
    v27 = getenv("CONTENT_TYPE");
    if ( v26 )
    {
      v27 = (char *)strcasecmp(v26, "GET");
      if ( v27 )
        v27 = getenv("CONTENT_TYPE");
      if ( v4 )
        v27 = (char *)json_object_put(v4);
    }
    v28 = json_object_new_object(v27);
    v29 = json_object_new_string_len("User name invalid", 17);
    json_object_object_add(v28, "error", v29);
    v30 = json_object_new_int(1009);
    json_object_object_add(v28, "code", v30);
    FCGI_printf("Status: %s \n", "500 Internal Server Error");
    qcgires_setcontenttype(v1, "application/json");
    v31 = (const char *)json_object_to_json_string(v28);
    FCGI_printf("%s", v31);
    if ( v28 )
      json_object_put(v28);
    v32 = getenv("REQUEST_METHOD");
    v33 = getenv("CONTENT_TYPE");
    if ( !v32 )
      goto LABEL_29;
    if ( !strcasecmp(v32, "GET") || !getenv("CONTENT_TYPE") )
    {
      if ( !v4 )
        goto LABEL_29;
    }
    else if ( !strcasecmp(v32, "PUT") && !strncasecmp(v33, "application/json", 0x10u) )
    {
      if ( !v4 )
        goto LABEL_29;
    }
    else if ( !v4 )
    {
      goto LABEL_29;
    }
    goto LABEL_28;
  }
  if ( *v11 && *v12 )
  {
    v233 = getHTTPSEnable();
    if ( v233 )
      v89 = "HTTPS";
    else
      v89 = "HTTP";
    if ( (unsigned int)snprintf(v250, 0x10u, "%s", v89) > 0xF )
    {
      free(v10);
      if ( v2 )
        json_object_put(v2);
      if ( v3 )
        free(v3);
      v90 = getenv("REQUEST_METHOD");
      v91 = getenv("CONTENT_TYPE");
      if ( v90 )
      {
        v91 = (char *)strcasecmp(v90, "GET");
        if ( v91 )
          v91 = getenv("CONTENT_TYPE");
        if ( v4 )
          v91 = (char *)json_object_put(v4);
      }
      v92 = json_object_new_object(v91);
      v93 = json_object_new_string_len("Buffer overflow", 15);
      json_object_object_add(v92, "error", v93);
      v94 = json_object_new_int(11276);
      json_object_object_add(v92, "code", v94);
      FCGI_printf("Status: %s \n", "401 Unauthorized");
      qcgires_setcontenttype(v1, "application/json");
      v95 = (const char *)json_object_to_json_string(v92);
      FCGI_printf("%s", v95);
      if ( v92 )
        json_object_put(v92);
      v96 = getenv("REQUEST_METHOD");
      v97 = getenv("CONTENT_TYPE");
      if ( !v96 )
        goto LABEL_29;
      if ( strcasecmp(v96, "GET") && getenv("CONTENT_TYPE") )
      {
        if ( !strcasecmp(v96, "PUT") && !strncasecmp(v97, "application/json", 0x10u) )
        {
          if ( v4 )
            goto LABEL_28;
        }
        else if ( v4 )
        {
          goto LABEL_28;
        }
        goto LABEL_29;
      }
      if ( !v4 )
        goto LABEL_29;
LABEL_28:
      json_object_put(v4);
      goto LABEL_29;
    }
    v229 = getenv("REMOTE_ADDR");
    if ( !v229 || (v234 = getenv("SERVER_NAME")) == 0 || (v230 = getenv("SERVER_ADDR")) == 0 )
    {
      free(v10);
      if ( v2 )
        json_object_put(v2);
      if ( v3 )
        free(v3);
      v216 = getenv("REQUEST_METHOD");
      v217 = getenv("CONTENT_TYPE");
      if ( v216 )
      {
        v217 = (char *)strcasecmp(v216, "GET");
        if ( v217 )
          v217 = getenv("CONTENT_TYPE");
        if ( v4 )
          v217 = (char *)json_object_put(v4);
      }
      v218 = json_object_new_object(v217);
      v219 = json_object_new_string_len("Error in returns a pointer", 26);
      json_object_object_add(v218, "error", v219);
      v220 = json_object_new_int(11275);
      json_object_object_add(v218, "code", v220);
      FCGI_printf("Status: %s \n", "401 Unauthorized");
      qcgires_setcontenttype(v1, "application/json");
      v221 = (const char *)json_object_to_json_string(v218);
      FCGI_printf("%s", v221);
      if ( v218 )
        json_object_put(v218);
      v222 = getenv("REQUEST_METHOD");
      v223 = getenv("CONTENT_TYPE");
      if ( v222 )
      {
        if ( !strcasecmp(v222, "GET") || !getenv("CONTENT_TYPE") )
        {
          if ( v4 )
            goto LABEL_28;
        }
        else if ( !strcasecmp(v222, "PUT") && !strncasecmp(v223, "application/json", 0x10u) )
        {
          if ( v4 )
            goto LABEL_28;
        }
        else if ( v4 )
        {
          goto LABEL_28;
        }
      }
      goto LABEL_29;
    }
    snprintf((char *)v245, 0x2Eu, "%s", v229);
    snprintf((char *)v247, 0x2Eu, "%s", v230);
    memset(v256, 0, sizeof(v256));
    if ( inet_pton(10, (const char *)v245, v255) && !v255[0] && !v255[1] && v255[2] == -65536 )
      v229 += 7;
    if ( inet_pton(10, (const char *)v247, &v251) )
    {
      if ( v251 || v252 || v253 != -65536 )
      {
        v256[0] = v251;
        v256[1] = v252;
        v256[2] = v253;
        v256[3] = v254;
      }
      else
      {
        v230 += 7;
        inet_pton(2, v230, v256);
      }
    }
    v227 = DoPAMAuthentication(&v260, v11, v12, v257, v250, v229, v230);
    if ( v227 )
    {
      free(v10);
      if ( CheckPasswordLockedForFailedTimes(v11) == 1 )
      {
        IDBG_LINUXAPP_DbgOut(
          130,
          "[%s:%d]Current Password locked for many failed times, should wait some time\n",
          "rest_default.c",
          1103);
        if ( v2 )
          json_object_put(v2);
        if ( v3 )
          free(v3);
        v126 = getenv("REQUEST_METHOD");
        v127 = getenv("CONTENT_TYPE");
        if ( v126 )
        {
          v127 = (char *)strcasecmp(v126, "GET");
          if ( v127 )
            v127 = getenv("CONTENT_TYPE");
          if ( v4 )
            v127 = (char *)json_object_put(v4);
        }
        v128 = json_object_new_object(v127);
        v129 = json_object_new_string_len("Password Locked Failed Times", 28);
        json_object_object_add(v128, "error", v129);
        v130 = json_object_new_int(15026);
        json_object_object_add(v128, "code", v130);
        FCGI_printf("Status: %s \n", "401 Unauthorized");
        qcgires_setcontenttype(v1, "application/json");
        v131 = (const char *)json_object_to_json_string(v128);
        FCGI_printf("%s", v131);
        if ( v128 )
          json_object_put(v128);
        v132 = getenv("REQUEST_METHOD");
        v133 = getenv("CONTENT_TYPE");
        if ( !v132 )
          goto LABEL_29;
        if ( !strcasecmp(v132, "GET") || !getenv("CONTENT_TYPE") )
        {
          if ( !v4 )
            goto LABEL_29;
        }
        else if ( !strcasecmp(v132, "PUT") && !strncasecmp(v133, "application/json", 0x10u) )
        {
          if ( !v4 )
            goto LABEL_29;
        }
        else if ( !v4 )
        {
          goto LABEL_29;
        }
        goto LABEL_28;
      }
      UpdatePasswordFailedTimes(v11);
      v98 = time(0);
      srand(v98);
      globalTag = rand();
      v99 = qcgisess_init(v1, 0);
      if ( v99 )
      {
        (*(void (**)(void))(v99 + 88))();
        v100 = (char *)malloc(9u);
        v101 = v100;
        if ( !v100 )
        {
          if ( v2 )
            json_object_put(v2);
          if ( v3 )
            free(v3);
          v208 = getenv("REQUEST_METHOD");
          v209 = getenv("CONTENT_TYPE");
          if ( v208 )
          {
            v209 = (char *)strcasecmp(v208, "GET");
            if ( v209 )
              v209 = getenv("CONTENT_TYPE");
            if ( v4 )
              v209 = (char *)json_object_put(v4);
          }
          v210 = json_object_new_object(v209);
          v211 = json_object_new_string_len("Error in memory allocation", 26);
          json_object_object_add(v210, "error", v211);
          v212 = json_object_new_int(11273);
          json_object_object_add(v210, "code", v212);
          FCGI_printf("Status: %s \n", "401 Unauthorized");
          qcgires_setcontenttype(v1, "application/json");
          v213 = (const char *)json_object_to_json_string(v210);
          FCGI_printf("%s", v213);
          if ( v210 )
            json_object_put(v210);
          v214 = getenv("REQUEST_METHOD");
          v215 = getenv("CONTENT_TYPE");
          if ( v214 )
          {
            if ( !strcasecmp(v214, "GET") || !getenv("CONTENT_TYPE") )
            {
              if ( v4 )
                goto LABEL_28;
            }
            else if ( !strcasecmp(v214, "PUT") && !strncasecmp(v215, "application/json", 0x10u) )
            {
              if ( v4 )
                goto LABEL_28;
            }
            else if ( v4 )
            {
              goto LABEL_28;
            }
          }
          goto LABEL_29;
        }
        memset(v100, 0, 9u);
        gen_random((int)v101, 8);
        v102 = json_object_new_int(0);
        json_object_object_add(v2, "default_passwd", v102);
        v103 = json_object_new_int(255);
        json_object_object_add(v2, "ResidueDay", v103);
        v104 = json_object_new_int(1);
        json_object_object_add(v2, "ok", v104);
        v105 = json_object_new_int(0);
        json_object_object_add(v2, "privilege", v105);
        v106 = json_object_new_int(256);
        json_object_object_add(v2, "extendedpriv", v106);
        v107 = json_object_new_int(v261);
        json_object_object_add(v2, "racsession_id", v107);
        v108 = strlen(v229);
        v109 = json_object_new_string_len(v229, v108);
        json_object_object_add(v2, "remote_addr", v109);
        v110 = strlen(v234);
        v111 = json_object_new_string_len(v234, v110);
        json_object_object_add(v2, "server_name", v111);
        v112 = strlen(v230);
        v113 = json_object_new_string_len(v230, v112);
        json_object_object_add(v2, "server_addr", v113);
        v114 = json_object_new_int(v233);
        json_object_object_add(v2, "HTTPSEnabled", v114);
        v115 = strlen(v101);
        v116 = json_object_new_string_len(v101, v115);
        json_object_object_add(v2, "CSRFToken", v116);
        v117 = json_object_new_int(1009);
        json_object_object_add(v2, "error_code", v117);
        memset(v249, 0, sizeof(v249));
        sub_2697D0((unsigned __int8)*v101, 20);
        gen_random((int)v249, v118);
        v119 = strlen((const char *)v249);
        v120 = json_object_new_string_len(v249, v119);
        json_object_object_add(v2, "HaHaID", v120);
        v121 = json_object_new_int(v227 == 16);
        json_object_object_add(v2, "passwordStatus", v121);
        free(v101);
      }
LABEL_240:
      v122 = time(0);
      srand(v122);
      globalTag = rand();
      qcgires_setcontenttype(v1, "application/json");
      v123 = (const char *)json_object_to_json_string(v2);
      FCGI_printf("%s", v123);
      if ( v2 )
        json_object_put(v2);
      if ( v3 )
        free(v3);
      v124 = getenv("REQUEST_METHOD");
      v125 = getenv("CONTENT_TYPE");
      if ( !v124 )
        goto LABEL_29;
      if ( !strcasecmp(v124, "GET") || !getenv("CONTENT_TYPE") )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else if ( !strcasecmp(v124, "PUT") && !strncasecmp(v125, "application/json", 0x10u) )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else if ( !v4 )
      {
        goto LABEL_29;
      }
      goto LABEL_28;
    }
    if ( CheckPasswordExpired(v11, &v262) == 1 )
    {
      free(v10);
      IDBG_LINUXAPP_DbgOut(130, "[%s:%d]Current password expired, should change a password\n", "rest_default.c", 913);
      if ( v2 )
        json_object_put(v2);
      if ( v3 )
        free(v3);
      v134 = getenv("REQUEST_METHOD");
      v135 = getenv("CONTENT_TYPE");
      if ( v134 )
      {
        v135 = (char *)strcasecmp(v134, "GET");
        if ( v135 )
          v135 = getenv("CONTENT_TYPE");
        if ( v4 )
          v135 = (char *)json_object_put(v4);
      }
      v136 = json_object_new_object(v135);
      v137 = json_object_new_string_len("Password Expired", 16);
      json_object_object_add(v136, "error", v137);
      v138 = json_object_new_int(15025);
      json_object_object_add(v136, "code", v138);
      FCGI_printf("Status: %s \n", "401 Unauthorized");
      qcgires_setcontenttype(v1, "application/json");
      v139 = (const char *)json_object_to_json_string(v136);
      FCGI_printf("%s", v139);
      if ( v136 )
        json_object_put(v136);
      v140 = getenv("REQUEST_METHOD");
      v141 = getenv("CONTENT_TYPE");
      if ( !v140 )
        goto LABEL_29;
      if ( strcasecmp(v140, "GET") && getenv("CONTENT_TYPE") )
      {
        if ( !strcasecmp(v140, "PUT") && !strncasecmp(v141, "application/json", 0x10u) )
        {
          if ( v4 )
            goto LABEL_28;
        }
        else if ( v4 )
        {
          goto LABEL_28;
        }
        goto LABEL_29;
      }
      if ( !v4 )
        goto LABEL_29;
      goto LABEL_28;
    }
    if ( CheckPasswordLockedForFailedTimes(v11) == 1 )
    {
      free(v10);
      IDBG_LINUXAPP_DbgOut(
        130,
        "[%s:%d]Current Password locked for many failed times, should wait some time\n",
        "rest_default.c",
        921);
      if ( v2 )
        json_object_put(v2);
      if ( v3 )
        free(v3);
      v200 = getenv("REQUEST_METHOD");
      v201 = getenv("CONTENT_TYPE");
      if ( v200 )
      {
        v201 = (char *)strcasecmp(v200, "GET");
        if ( v201 )
          v201 = getenv("CONTENT_TYPE");
        if ( v4 )
          v201 = (char *)json_object_put(v4);
      }
      v202 = json_object_new_object(v201);
      v203 = json_object_new_string_len("Password Locked Failed Times", 28);
      json_object_object_add(v202, "error", v203);
      v204 = json_object_new_int(15026);
      json_object_object_add(v202, "code", v204);
      FCGI_printf("Status: %s \n", "401 Unauthorized");
      qcgires_setcontenttype(v1, "application/json");
      v205 = (const char *)json_object_to_json_string(v202);
      FCGI_printf("%s", v205);
      if ( v202 )
        json_object_put(v202);
      v206 = getenv("REQUEST_METHOD");
      v207 = getenv("CONTENT_TYPE");
      if ( !v206 )
        goto LABEL_29;
      if ( strcasecmp(v206, "GET") && getenv("CONTENT_TYPE") )
      {
        if ( !strcasecmp(v206, "PUT") && !strncasecmp(v207, "application/json", 0x10u) )
        {
          if ( v4 )
            goto LABEL_28;
        }
        else if ( v4 )
        {
          goto LABEL_28;
        }
        goto LABEL_29;
      }
      if ( !v4 )
        goto LABEL_29;
      goto LABEL_28;
    }
    if ( dword_2AB4B8 == 1 && CheckMaxAllowSessionLimit("web") == -1 )
    {
      free(v10);
      IDBG_LINUXAPP_DbgOut(
        130,
        "[%s:%d]Active session is greater than Max allow session limit\n",
        "rest_default.c",
        931);
      if ( v2 )
        json_object_put(v2);
      if ( v3 )
        free(v3);
      v192 = getenv("REQUEST_METHOD");
      v193 = getenv("CONTENT_TYPE");
      if ( v192 )
      {
        v193 = (char *)strcasecmp(v192, "GET");
        if ( v193 )
          v193 = getenv("CONTENT_TYPE");
        if ( v4 )
          v193 = (char *)json_object_put(v4);
      }
      v194 = json_object_new_object(v193);
      v195 = json_object_new_string_len("Active session is greater than Max allow session limit", 54);
      json_object_object_add(v194, "error", v195);
      v196 = json_object_new_int(16005);
      json_object_object_add(v194, "code", v196);
      FCGI_printf("Status: %s \n", "401 Unauthorized");
      qcgires_setcontenttype(v1, "application/json");
      v197 = (const char *)json_object_to_json_string(v194);
      FCGI_printf("%s", v197);
      if ( v194 )
        json_object_put(v194);
      v198 = getenv("REQUEST_METHOD");
      v199 = getenv("CONTENT_TYPE");
      if ( !v198 )
        goto LABEL_29;
      if ( !strcasecmp(v198, "GET") || !getenv("CONTENT_TYPE") )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else
      {
        if ( strcasecmp(v198, "PUT") || strncasecmp(v199, "application/json", 0x10u) )
        {
          if ( v4 )
            goto LABEL_28;
          goto LABEL_29;
        }
        if ( !v4 )
          goto LABEL_29;
      }
      goto LABEL_28;
    }
    v142 = qcgisess_init(v1, 0);
    v143 = v142;
    if ( !v142 )
    {
LABEL_328:
      free(v10);
      goto LABEL_240;
    }
    (*(void (__fastcall **)(int, const char *, int, int))(v1 + 12))(v142, "authorized", 1, 1);
    gen_random((int)v10, 8);
    v231 = GetUsrLANChPriv(v257, v256);
    if ( (unsigned int)(v231 - 1) > 4 )
    {
      (*(void (__fastcall **)(int))(v143 + 88))(v143);
      free(v10);
      if ( v2 )
        json_object_put(v2);
      if ( v3 )
        free(v3);
      v176 = getenv("REQUEST_METHOD");
      v177 = getenv("CONTENT_TYPE");
      if ( v176 )
      {
        v177 = (char *)strcasecmp(v176, "GET");
        if ( v177 )
          v177 = getenv("CONTENT_TYPE");
        if ( v4 )
          v177 = (char *)json_object_put(v4);
      }
      v178 = json_object_new_object(v177);
      v179 = json_object_new_string_len("No Privilege User", 17);
      json_object_object_add(v178, "error", v179);
      v180 = json_object_new_int(8001);
      json_object_object_add(v178, "code", v180);
      FCGI_printf("Status: %s \n", "401 Unauthorized");
      qcgires_setcontenttype(v1, "application/json");
      v181 = (const char *)json_object_to_json_string(v178);
      FCGI_printf("%s", v181);
      if ( v178 )
        json_object_put(v178);
      v182 = getenv("REQUEST_METHOD");
      v183 = getenv("CONTENT_TYPE");
      if ( !v182 )
        goto LABEL_29;
      if ( !strcasecmp(v182, "GET") || !getenv("CONTENT_TYPE") )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else if ( !strcasecmp(v182, "PUT") && !strncasecmp(v183, "application/json", 0x10u) )
      {
        if ( !v4 )
          goto LABEL_29;
      }
      else if ( !v4 )
      {
        goto LABEL_29;
      }
      goto LABEL_28;
    }
    if ( dword_2AB4B8 == 1 )
    {
      if ( get_service_configurations("web", v244) == -1 )
      {
        (*(void (__fastcall **)(int))(v143 + 88))(v143);
        free(v10);
        if ( v2 )
          json_object_put(v2);
        if ( v3 )
          free(v3);
        v184 = getenv("REQUEST_METHOD");
        v185 = getenv("CONTENT_TYPE");
        if ( v184 )
        {
          v185 = (char *)strcasecmp(v184, "GET");
          if ( v185 )
            v185 = getenv("CONTENT_TYPE");
          if ( v4 )
            v185 = (char *)json_object_put(v4);
        }
        v186 = json_object_new_object(v185);
        v187 = json_object_new_string_len("Unable to get service configuration", 35);
        json_object_object_add(v186, "error", v187);
        v188 = json_object_new_int(12003);
        json_object_object_add(v186, "code", v188);
        FCGI_printf("Status: %s \n", "401 Unauthorized");
        qcgires_setcontenttype(v1, "application/json");
        v189 = (const char *)json_object_to_json_string(v186);
        FCGI_printf("%s", v189);
        if ( v186 )
          json_object_put(v186);
        v190 = getenv("REQUEST_METHOD");
        v191 = getenv("CONTENT_TYPE");
        if ( !v190 )
          goto LABEL_29;
        if ( !strcasecmp(v190, "GET") || !getenv("CONTENT_TYPE") )
        {
          if ( !v4 )
            goto LABEL_29;
        }
        else if ( !strcasecmp(v190, "PUT") && !strncasecmp(v191, "application/json", 0x10u) )
        {
          if ( !v4 )
            goto LABEL_29;
        }
        else if ( !v4 )
        {
          goto LABEL_29;
        }
        goto LABEL_28;
      }
      v144 = v244[5] >> 24;
    }
    else
    {
      v144 = 1800;
    }
    qcgisess_settimeout(v143, v144);
    (*(void (__fastcall **)(int, const char *, int, int))(v143 + 12))(v143, "role", v231, 1);
    if ( dword_2AB5A0 == 1 )
    {
      v232 = v258;
      if ( v231 > 2 )
        v232 = v258 | 0x100;
      goto LABEL_307;
    }
    if ( v231 <= 3 )
    {
      if ( v231 != 3 )
      {
        v232 = 0;
LABEL_307:
        v228 = LIBIPMI_HL_AMIGetUDSInfo(v256, 0, &v263, 0, 10);
        IDBG_LINUXAPP_DbgOut(130, "[%s:%d]channel no wRet %d\n", "rest_default.c", 988, v228);
        if ( v228 )
        {
          IDBG_LINUXAPP_DbgOut(130, "[%s:%d]Error In Getting the Channel Info ::%x\n", "rest_default.c", 991, v228);
          if ( v2 )
            json_object_put(v2);
          if ( v3 )
            free(v3);
          v146 = getenv("REQUEST_METHOD");
          v147 = getenv("CONTENT_TYPE");
          if ( v146 )
          {
            v147 = (char *)strcasecmp(v146, "GET");
            if ( v147 )
              v147 = getenv("CONTENT_TYPE");
            if ( v4 )
              v147 = (char *)json_object_put(v4);
          }
          v148 = json_object_new_object(v147);
          v149 = json_object_new_string_len("Error In Getting the Channel Info", 33);
          json_object_object_add(v148, "error", v149);
          v150 = json_object_new_int(19001);
          json_object_object_add(v148, "code", v150);
          FCGI_printf("Status: %s \n", "401 Unauthorized");
          qcgires_setcontenttype(v1, "application/json");
          v151 = (const char *)json_object_to_json_string(v148);
          FCGI_printf("%s", v151);
          if ( v148 )
            json_object_put(v148);
          v152 = getenv("REQUEST_METHOD");
          v153 = getenv("CONTENT_TYPE");
          if ( !v152 )
            goto LABEL_29;
          if ( !strcasecmp(v152, "GET") || !getenv("CONTENT_TYPE") )
          {
            if ( !v4 )
              goto LABEL_29;
          }
          else if ( !strcasecmp(v152, "PUT") && !strncasecmp(v153, "application/json", 0x10u) )
          {
            if ( !v4 )
              goto LABEL_29;
          }
          else if ( !v4 )
          {
            goto LABEL_29;
          }
          goto LABEL_28;
        }
        v237 = MapUid_to_SELUid(v11, 0);
        v235 = (const char *)(*(int (__fastcall **)(int, const char *, _DWORD))(v143 + 24))(v143, "_Q_SESSIONID", 0);
        v226 = (const char *)(*(int (__fastcall **)(int, const char *, _DWORD))(v143 + 24))(v143, "_Q_REPOSITORY", 0);
        snprintf(s, 0x1000u, "%s/%s%s%s", v226, "qsession-", v235, ".properties");
        snprintf(v239, 0x1000u, "%s/%s%s%s", v226, "qsession-", v235, ".expire");
        v224 = strlen(v229);
        LOBYTE(v226) = strlen(v11);
        v236 = strlen(s);
        v154 = strlen(v239);
        racsessinfo_register_session(
          v233,
          v229,
          v224,
          4,
          v11,
          (unsigned __int8)v226,
          (unsigned __int8)v231,
          v237,
          &v261,
          s,
          v236,
          v239,
          v154);
        (*(void (__fastcall **)(int, const char *, int, int))(v143 + 12))(v143, "extendedpriv", v258, 1);
        (*(void (__fastcall **)(int, const char *, char *, int))(v143 + 4))(v143, "username", v11, 1);
        (*(void (__fastcall **)(int, const char *, unsigned __int8 *, int))(v143 + 4))(v143, "CSRFTOKEN", v10, 1);
        (*(void (__fastcall **)(int, const char *, int, int))(v143 + 12))(v143, "racsession_id", v261, 1);
        (*(void (__fastcall **)(int, const char *, const char *, int))(v143 + 4))(v143, "remote_addr", v229, 1);
        (*(void (__fastcall **)(int, const char *, const char *, int))(v143 + 4))(v143, "server_name", v234, 1);
        (*(void (__fastcall **)(int, const char *, const char *, int))(v143 + 4))(v143, "server_addr", v230, 1);
        (*(void (__fastcall **)(int, const char *, _BOOL4, int))(v143 + 12))(v143, "HTTPSEnabled", v233, 1);
        (*(void (__fastcall **)(int, const char *, int, int))(v143 + 12))(v143, "pamh", v260, 1);
        (*(void (__fastcall **)(int, const char *, _DWORD, int))(v143 + 12))(v143, "passwordStatus", 0, 1);
        qcgisess_save(v143);
        (*(void (__fastcall **)(int))(v143 + 88))(v143);
        v155 = strlen(v11) == 5 && !strncmp(v11, "admin", 5u) && strlen(v12) == 5 && !strncmp(v12, "admin", 5u);
        v156 = json_object_new_int(v155);
        json_object_object_add(v2, "default_passwd", v156);
        v157 = json_object_new_int(v262);
        json_object_object_add(v2, "ResidueDay", v157);
        v158 = json_object_new_int(0);
        json_object_object_add(v2, "ok", v158);
        v159 = json_object_new_int(v231);
        json_object_object_add(v2, "privilege", v159);
        v160 = json_object_new_int(v232);
        json_object_object_add(v2, "extendedpriv", v160);
        v161 = json_object_new_int(v261);
        json_object_object_add(v2, "racsession_id", v161);
        v162 = strlen(v229);
        v163 = json_object_new_string_len(v229, v162);
        json_object_object_add(v2, "remote_addr", v163);
        v164 = strlen(v234);
        v165 = json_object_new_string_len(v234, v164);
        json_object_object_add(v2, "server_name", v165);
        v166 = strlen(v230);
        v167 = json_object_new_string_len(v230, v166);
        json_object_object_add(v2, "server_addr", v167);
        v168 = json_object_new_int(v233);
        json_object_object_add(v2, "HTTPSEnabled", v168);
        v169 = strlen((const char *)v10);
        v170 = json_object_new_string_len(v10, v169);
        json_object_object_add(v2, "CSRFToken", v170);
        memset(v249, 0, sizeof(v249));
        sub_2697D0(*v10, 20);
        gen_random((int)v249, v171);
        v172 = strlen((const char *)v249);
        v173 = json_object_new_string_len(v249, v172);
        json_object_object_add(v2, "HaHaID", v173);
        v174 = json_object_new_int(200);
        json_object_object_add(v2, "error_code", v174);
        v175 = json_object_new_int(0);
        json_object_object_add(v2, "passwordStatus", v175);
        goto LABEL_328;
      }
      v145 = 0;
    }
    else
    {
      v145 = 3;
    }
    v232 = v145 | 0x100;
    goto LABEL_307;
  }
  free(v10);
  if ( v2 )
    json_object_put(v2);
  if ( v3 )
    free(v3);
  v61 = getenv("REQUEST_METHOD");
  v62 = getenv("CONTENT_TYPE");
  if ( v61 )
  {
    v62 = (char *)strcasecmp(v61, "GET");
    if ( v62 )
      v62 = getenv("CONTENT_TYPE");
    if ( v4 )
      v62 = (char *)json_object_put(v4);
  }
  v63 = json_object_new_object(v62);
  v64 = json_object_new_string_len("Invalid UserName or Password", 28);
  json_object_object_add(v63, "error", v64);
  v65 = json_object_new_int(v13);
  json_object_object_add(v63, "code", v65);
  FCGI_printf("Status: %s \n", "401 Unauthorized");
  qcgires_setcontenttype(v1, "application/json");
  v66 = (const char *)json_object_to_json_string(v63);
  FCGI_printf("%s", v66);
  if ( v63 )
    json_object_put(v63);
  v67 = getenv("REQUEST_METHOD");
  v68 = getenv("CONTENT_TYPE");
  if ( !v67 )
    goto LABEL_29;
  if ( !strcasecmp(v67, "GET") || !getenv("CONTENT_TYPE") )
  {
    if ( !v4 )
      goto LABEL_29;
    goto LABEL_28;
  }
  if ( !strcasecmp(v67, "PUT") && !strncasecmp(v68, "application/json", 0x10u) )
  {
    if ( v4 )
      goto LABEL_28;
  }
  else if ( v4 )
  {
    goto LABEL_28;
  }
LABEL_29:
  if ( post_call_hook )
    post_call_hook();
  return (*(int (__fastcall **)(int))(v1 + 88))(v1);
}