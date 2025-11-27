(* simple image API: returns a PNG plot for parameter "a" (real) *)
plotAPI = APIFunction[
  {"a" -> "Real"},
  Module[{a = #a},
    Plot[Sin[a x], {x, 0, 2 Pi}, ImageSize -> 600]
  ] &,
  "PNG"      (* make the API respond with image/png *)
];

(* deploy public *)
cloudObj = CloudDeploy[plotAPI, Permissions -> "Public"];
cloudObj
