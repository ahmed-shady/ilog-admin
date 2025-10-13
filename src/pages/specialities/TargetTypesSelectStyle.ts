export default (error: boolean) => ({
    control: (base: any, state: any) => ({
      ...base,
      boxShadow: "none",
      width: "100%",
      borderRadius: 0,
      //height: "58px",
      borderColor: error? "#dc3545": (state.isFocused ? "#44B9CB" : base.borderColor),
      "&:hover": {
        borderColor: error? "#dc3545": (state.isFocused ? "#44B9CB" : base.borderColor)
      },
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 99999 }),
    option: (base: any, config: any) => ({
      ...base,
      color: config.isFocused || config.isSelected ? "white" : "black",
      backgroundColor: config.isFocused || config.isSelected ? "#44B9CB" : null,
      "&:active": {
        backgroundColor: "#44B9CB"
      }
    }),
    indicatorSeparator: (base: any) => ({...base, display:'none'}),
    clearIndicator: (base: any) => ({...base, padding: '4px', display: 'none'}),
    dropdownIndicator: (base: any) => ({...base, padding: '4px'})
  });