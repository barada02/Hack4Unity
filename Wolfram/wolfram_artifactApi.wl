generateArtifactRaw[code_String] := Module[
  {
    exprHeld, expr, graphic, img, pngBytes, pngB64
  },

  (* 1. Parse code safely (without execution) *)
  exprHeld = Quiet @ Check[
    ToExpression[code, InputForm, HoldComplete],
    HoldComplete[$Failed]
  ];

  (* 2. Evaluate inside a restricted sandbox *)
  expr = Quiet @ Check[
    Block[
      {
        CloudPut = (Message[CloudPut::blocked]; $Failed)&,
        CloudGet = (Message[CloudGet::blocked]; $Failed)&,
        CloudImport = (Message[CloudImport::blocked]; $Failed)&,
        Run = (Message[Run::blocked]; $Failed)&,
        ExternalEvaluate = (Message[ExternalEvaluate::blocked]; $Failed)&,
        Import = (Message[Import::blocked]; $Failed)&,
        Export = (Message[Export::blocked]; $Failed)&,
        DeleteFile = (Message[DeleteFile::blocked]; $Failed)&,
        CreateFile = (Message[CreateFile::blocked]; $Failed)&,
        Put = (Message[Put::blocked]; $Failed)&,
        Get = (Message[Get::blocked]; $Failed)&
      },
      ReleaseHold[exprHeld]
    ],
    $Failed
  ];

  (* 3. Normalize to a graphics object *)
  graphic = Which[
    Head[expr] === Graphics || Head[expr] === Graphics3D,
      expr,

    True,
      Graphics[
        Text[
          Style[
            ToString[expr, StandardForm],
            14,
            Black
          ]
        ],
        ImageSize -> 400
      ]
  ];

  (* 4. Export to PNG bytes + Base64 *)
  pngBytes = Quiet @ Check[ExportByteArray[graphic, "PNG"], {}];
  pngB64   = Quiet @ Check[ExportString[graphic, {"Base64", "PNG"}], ""];

  (* 5. Return pure Wolfram data (NOT JSON) *)
  <|
    "input"        -> code,
    "outputExpr"   -> expr,
    "graphic"      -> graphic,
    "imageBase64"  -> pngB64,
    "imagePNG"     -> pngBytes,
    "success"      -> (expr =!= $Failed),
    "timestamp"    -> Now
  |>

]

CloudDeploy[
  APIFunction[
    {"code" -> "String"},
    generateArtifactRaw[#code] &
  ],
  "api/wl-raw-artifact",
  Permissions -> "Public"
]
