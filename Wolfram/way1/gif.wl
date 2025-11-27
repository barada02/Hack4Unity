dynamicGifAPI = APIFunction[
  {
    "expr" -> "String"
  },
  Module[{expr, result},

    expr = ToExpression[#expr, InputForm, HoldForm];
    result = ReleaseHold[expr];

    ExportForm[result, "GIF"]
  ] &,
  "GIF"
];

CloudDeploy[dynamicGifAPI, Permissions -> "Public"]