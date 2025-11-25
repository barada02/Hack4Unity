(* ======================================= *)
(*  ARTIFACT GENERATOR API (Production)    *)
(* ======================================= *)

generateArtifact[code_String] := Module[
  {exprHeld, expr, graphic, img, png, b64},

  (* 1: Parse WL code safely *)
  exprHeld = ToExpression[code, InputForm, Hold];

  (* 2: Evaluate inside safe environment *)
  expr = Check[
    Block[
      {
        CloudPut = $Failed &, 
        CloudGet = $Failed &, 
        CloudImport = $Failed &, 
        Run = $Failed &, 
        ExternalEvaluate = $Failed &, 
        Import = $Failed &, 
        Export = $Failed &
      },
      ReleaseHold[exprHeld]
    ],
    $Failed
  ];

  (* 3: Convert to image if possible *)
  graphic = Quiet@Check[expr, $Failed];
  img = If[Head[graphic] === Graphics || Head[graphic] === Graphics3D,
    graphic,
    Graphics[
      Text[Style[ToString[expr, StandardForm], 14]], 
      ImageSize -> 400
    ]
  ];

  (* 4: Export PNG *)
  png = ExportString[img, "PNG"];
  b64 = ExportString[img, "Base64"];

  (* 5: JSON response *)
  <|
    "input"        -> code,
    "outputExpr"   -> ToString[expr, InputForm],
    "imageBase64"  -> b64,
    "imagePNG"     -> png,
    "success"      -> (expr =!= $Failed),
    "timestamp"    -> DateString[Now, "ISODateTime"]
  |>
]

(* ======================================= *)
(*  DEPLOY API                             *)
(* ======================================= *)

CloudDeploy[
  APIFunction[
    {"code" -> "String"},
    ExportString[ generateArtifact[#code], "JSON" ] &
  ],
  "api/artifact-generator",
  Permissions -> "Public"
]
