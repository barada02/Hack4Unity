(* Unity Visual Sandbox - Wolfram Cloud API *)
(* Deployed: 24/11/2025 1:04 pm GMT-6 *)
(* URL Example: https://www.wolframcloud.com/obj/YOUR-USERNAME/unity-visual-sandbox *)

CloudDeploy[
  APIFunction[
    {
      "code" -> "String",
      "format" -> "String" -> "auto",
      "timeout" -> "Integer" -> 15
    },
    Function[{code, format, timeout},
      Module[{result, success, error, formattedResult, resultType},
        
        (* Execute with timeout - 15s good for complex visualizations *)
        {success, result} = Quiet[
          TimeConstrained[
            Check[
              {True, ToExpression[code]},
              {False, "Syntax or execution error"}
            ],
            timeout,
            {False, "Execution timeout"}
          ]
        ];
        
        (* Smart formatting for visual content *)
        If[success,
          {formattedResult, resultType} = Which[
            (* Images - convert to base64 *)
            ImageQ[result], 
            {ExportString[result, "Base64"], "image"},
            
            (* 2D/3D Graphics - convert to SVG or PNG *)
            GraphicsQ[result] || Graphics3DQ[result], 
            {ExportString[result, "SVG"], "graphics"},
            
            (* Plots, charts - convert to PNG base64 for better quality *)
            MatchQ[result, _Plot | _ListPlot | _BarChart | _PieChart],
            {ExportString[result, {"Base64", "PNG"}], "chart"},
            
            (* Animations - convert to GIF *)
            MatchQ[result, _Animate | _ListAnimate],
            {ExportString[result, {"Base64", "GIF"}], "animation"},
            
            (* Data visualizations *)
            ListQ[result] && Length[result] > 0,
            {ExportString[result, "JSON"], "data"},
            
            (* Text/String results *)
            StringQ[result],
            {result, "text"},
            
            (* Everything else as string *)
            True,
            {ToString[result, InputForm], "expression"}
          ],
          (* Error case *)
          {formattedResult, resultType} = {result, "error"}
        ];
        
        (* Return structured response *)
        <|
          "status" -> If[success, "success", "error"],
          "result" -> formattedResult,
          "resultType" -> resultType,
          "executionTime" -> AbsoluteTime[],
          "timestamp" -> DateString[],
          "codeLength" -> StringLength[code]
        |>
      ]
    ]
  ],
  "unity-visual-sandbox",
  Permissions -> "Public"
]

(* 
DEPLOYMENT RESULT:
UUID: 48b879cf-46b3-4261-8d3f-d96081aeb6b8
URL: https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox
Status: Active
Permissions: Public Execute
*)