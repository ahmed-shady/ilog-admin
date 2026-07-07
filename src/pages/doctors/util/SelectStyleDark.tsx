export default (() => ({
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderColor: state.isFocused ? "#667eea" : "rgba(255,255,255,0.14)",
    borderRadius: "8px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(102,126,234,0.25)" : "none",
    "&:hover": {
      borderColor: "#667eea",
    },
    minHeight: "36px",
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "2px 8px",
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "rgba(102,126,234,0.3)",
    borderRadius: "6px",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#c7d2fe",
    fontSize: "0.8rem",
    padding: "1px 4px",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "#a5b4fc",
    "&:hover": {
      backgroundColor: "rgba(220,53,69,0.3)",
      color: "#ff6b6b",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#e9ecef",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#6c757d",
    fontSize: "0.875rem",
  }),
  input: (base: any) => ({
    ...base,
    color: "#e9ecef",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#2c3444",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    zIndex: 9999,
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 99999 }),
  option: (base: any, config: any) => ({
    ...base,
    color: config.isFocused || config.isSelected ? "#fff" : "#ced4da",
    backgroundColor: config.isSelected
      ? "#667eea"
      : config.isFocused
        ? "rgba(102,126,234,0.25)"
        : "transparent",
    fontSize: "0.875rem",
    "&:active": {
      backgroundColor: "#5568d3",
    },
  }),
  indicatorSeparator: (base: any) => ({ ...base, display: "none" }),
  clearIndicator: (base: any) => ({
    ...base,
    padding: "4px",
    color: "#6c757d",
    "&:hover": { color: "#ff6b6b" },
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    padding: "4px",
    color: "#6c757d",
    "&:hover": { color: "#667eea" },
  }),
}))();
