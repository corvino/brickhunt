exports.normalizeColor = (color) => {
  if (color.startsWith("Tr.")) {
    return color.replace("Tr.", "Transparent");
  } else if (color.startsWith("Dk.")) {
    return color.replace("Dk.", "Dark");
  } else if ("New Dark Red" === color) {
    return "Dark Red";
  } else if ("Medium Lavendel" === color) {
    return "Medium Lavender";
  }

  return color;
}
