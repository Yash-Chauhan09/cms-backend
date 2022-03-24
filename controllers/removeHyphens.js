export function removeHyphens(str) {
  let modifiedStr = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] == "-") modifiedStr += "_";
    else modifiedStr += str[i];
  }
  return modifiedStr;
}
